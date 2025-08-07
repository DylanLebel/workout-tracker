// src/components/AnalysisModal.js
import React from 'react'
import { Loader, X, Sparkles } from 'lucide-react'

export default function AnalysisModal({ isLoading, result, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-purple-400" /> AI Routine Analysis
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader className="animate-spin text-purple-400" size={48} />
              <p className="mt-4 text-gray-300">Analyzing your routine...</p>
            </div>
          ) : (
            <div
              className="prose prose-invert prose-sm sm:prose-base max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  (result || '')
                    .replace(/\n/g, '<br />')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
