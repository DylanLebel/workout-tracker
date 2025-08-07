// src/components/AnalysisModal.js
import React from 'react';
import { Loader, X, Sparkles } from 'lucide-react';

export default function AnalysisModal({ isLoading, result, onClose }) {
  if (!isLoading && !result) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-purple-400" size={24} />
              AI Routine Analysis
            </h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              <X size={24} />
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader className="animate-spin text-purple-400" size={48} />
              <p className="mt-4 text-gray-300">Analyzing your routine...</p>
              <p className="mt-2 text-gray-500 text-sm">This may take a few moments</p>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
              {/* Enhanced HTML rendering with better formatting */}
              <div
                dangerouslySetInnerHTML={{
                  __html: (result || 'No analysis result available.')
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/\n/g, '<br />')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/^/, '<p>')
                    .replace(/$/, '</p>')
                }}
              />
            </div>
          )}
          
          {!isLoading && (
            <div className="mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Close Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}