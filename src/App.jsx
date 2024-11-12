import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import FileUpload from './components/FileUpload';
import TextOutput from './components/TextOutput';
import LoadingSpinner from './components/LoadingSpinner';
import { extractImagesFromPDF } from './utils/pdfUtils';

function App() {
  const [ocrText, setOcrText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState({ page: 0, total: 0 });

  const processImage = async (imageData) => {
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(imageData);
    await worker.terminate();
    return text;
  };

  const handleFile = async (file) => {
    try {
      setIsProcessing(true);
      setError('');
      setOcrText('');
      let texts = [];

      if (file.type === 'application/pdf') {
        const images = await extractImagesFromPDF(file);
        setProgress({ page: 0, total: images.length });
        
        for (let i = 0; i < images.length; i++) {
          setProgress({ page: i + 1, total: images.length });
          const pageText = await processImage(images[i]);
          texts.push(`Page ${i + 1}:\n${pageText}\n`);
        }
      } else {
        setProgress({ page: 1, total: 1 });
        const text = await processImage(file);
        texts.push(text);
      }

      setOcrText(texts.join('\n'));
    } catch (err) {
      setError('Error processing file. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
      setProgress({ page: 0, total: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          OCR Text Extractor
        </h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <FileUpload onFileSelect={handleFile} />
          
          {isProcessing && (
            <LoadingSpinner 
              progress={progress.total > 0 ? 
                `Processing page ${progress.page} of ${progress.total}...` : 
                undefined
              }
            />
          )}
          
          {error && (
            <div className="mt-4 text-red-600 text-center">
              {error}
            </div>
          )}
          
          {ocrText && <TextOutput text={ocrText} />}
        </div>
      </div>
    </div>
  );
}

export default App;