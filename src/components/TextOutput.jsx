import React from 'react';

function TextOutput({ text }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-700">Extracted Text</h2>
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition duration-300"
        >
          Copy to clipboard
        </button>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 min-h-[100px] max-h-[400px] overflow-y-auto">
        <pre className="whitespace-pre-wrap font-mono text-sm">
          {text || 'No text extracted yet'}
        </pre>
      </div>
    </div>
  );
}

export default TextOutput;