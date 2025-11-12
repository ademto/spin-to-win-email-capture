'use client';

import { Prize } from '@/lib/prizes';

interface ResultModalProps {
  prize: Prize;
  onClose: () => void;
}

export default function ResultModal({ prize, onClose }: ResultModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-bounce-in">
        {/* Success Message */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Congratulations!
          </h2>
          <p className="text-gray-600">You won:</p>
        </div>

        {/* Prize Display */}
        <div
          className="py-8 px-6 rounded-xl mb-6 text-center"
          style={{ backgroundColor: prize.color }}
        >
          <p
            className="text-4xl font-bold"
            style={{ color: prize.textColor || '#FFFFFF' }}
          >
            {prize.label}
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 text-center">
            Check your email for details on how to claim your prize!
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:scale-105 transition-transform"
        >
          Close
        </button>
      </div>
    </div>
  );
}
