import * as PDFJS from 'pdfjs-dist';

// Configure PDF.js worker source globally
PDFJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;

/**
 * Safely load a PDF document
 * @param {File|ArrayBuffer} file - PDF file to load
 * @returns {Promise<PDFJS.PDFDocumentProxy>} Loaded PDF document
 */
async function loadPDFDocument(file) {
  try {
    const arrayBuffer = file instanceof File ? await file.arrayBuffer() : file;
    return await PDFJS.getDocument({ data: arrayBuffer }).promise;
  } catch (error) {
    console.error('Error loading PDF document:', error);
    throw new Error('Unable to load PDF document');
  }
}

/**
 * Render a PDF page to a canvas
 * @param {PDFJS.PDFPageProxy} page - PDF page to render
 * @param {Object} options - Rendering options
 * @returns {Promise<string>} Base64 encoded image
 */
async function renderPageToImage(page, options = {}) {
  const {
    scale = 1.0,
    imageFormat = 'image/png',
    imageQuality = 0.92
  } = options;

  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Ensure context is not null
  if (!context) {
    throw new Error('Unable to create canvas rendering context');
  }

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({
    canvasContext: context,
    viewport: viewport
  }).promise;

  return canvas.toDataURL(imageFormat, imageQuality);
}

/**
 * Extract images from a PDF file
 * @param {File} file - PDF file to extract images from
 * @param {Object} options - Extraction options
 * @returns {Promise<string[]>} Array of base64 encoded images
 */
export async function extractImagesFromPDF(file, options = {}) {
  const {
    maxPages = Infinity,
    scale = 1.0,
    imageFormat = 'image/png',
    imageQuality = 0.92
  } = options;

  try {
    const pdf = await loadPDFDocument(file);
    const images = [];

    const pagesToRender = Math.min(pdf.numPages, maxPages);
    
    for (let pageNum = 1; pageNum <= pagesToRender; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const image = await renderPageToImage(page, { 
        scale, 
        imageFormat, 
        imageQuality 
      });
      images.push(image);
    }

    if (images.length === 0) {
      console.warn('No images extracted from PDF');
    }

    return images;
  } catch (error) {
    console.error('Error extracting images from PDF:', error);
    throw error;
  }
}
