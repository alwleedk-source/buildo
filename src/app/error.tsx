'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console
    console.error('Application Error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Error message:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {error.message}
          </pre>
        </div>
        {error.stack && (
          <details className="mb-4">
            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
              Show error stack
            </summary>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto mt-2">
              {error.stack}
            </pre>
          </details>
        )}
        <button
          onClick={() => reset()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
