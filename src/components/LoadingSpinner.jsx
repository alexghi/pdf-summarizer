import React from 'react';

function LoadingSpinner({ progress }) {
  return (
    <div className="flex justify-center items-center mt-6">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2 text-gray-600">
        {progress || 'Processing file...'}
      </span>
    </div>
  );
}

export default LoadingSpinner;