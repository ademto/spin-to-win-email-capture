'use client';

import { useState } from 'react';
import EntryForm from './components/EntryForm';
import SpinWheel from './components/SpinWheel';
import { Prize } from '@/lib/prizes';

type AppState = 'form' | 'wheel' | 'result';

export default function Home() {
  const [state, setState] = useState<AppState>('form');
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (name: string, email: string) => {
    setIsLoading(true);
    setError('');

    try {
      // First, subscribe to MailerLite
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      // Success - move to wheel
      setUserData({ name, email });
      setState('wheel');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpinComplete = async (prize: Prize) => {
    // Update MailerLite with prize information
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          prize: prize.label,
        }),
      });
    } catch (err) {
      console.error('Failed to update prize:', err);
    }

    setWonPrize(prize);
    setState('result');
  };

  const handleClose = () => {
    // Reset to form for new user
    setState('form');
    setUserData({ name: '', email: '' });
    setWonPrize(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            🎡 Spin to Win
          </h1>
          <p className="text-gray-600 text-lg">
            Try your luck and win amazing prizes!
          </p>
        </div>

        {/* Main Content - Side by Side Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 min-h-[600px]">
          {/* Wheel - Left Side */}
          <div className="w-full max-w-lg shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <SpinWheel 
                onSpinComplete={handleSpinComplete} 
                canSpin={state === 'wheel'} 
              />
            </div>
          </div>

          {/* Form / Result - Right Side */}
          <div className="w-full max-w-md">
            {state === 'form' && (
              <>
                <EntryForm onSubmit={handleFormSubmit} isLoading={isLoading} />
                {error && (
                  <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                    {error}
                  </div>
                )}
              </>
            )}

            {state === 'wheel' && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Good luck, {userData.name}! 🍀
                  </h2>
                  <p className="text-gray-600 mb-6">
                    The wheel is spinning...
                  </p>
                  <div className="bg-linear-to-r from-purple-100 to-pink-100 rounded-lg p-6">
                    <p className="text-lg text-gray-700 font-medium mb-2">
                      🎉 Get ready for your prize!
                    </p>
                    <p className="text-sm text-gray-600">
                      The wheel will stop on your winning prize
                    </p>
                  </div>
                </div>
              </div>
            )}

            {state === 'result' && wonPrize && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                {/* Confetti Effect */}
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Congratulations, {userData.name}!
                  </h2>
                  <p className="text-gray-600">You won:</p>
                </div>

                {/* Prize Display */}
                <div
                  className="py-8 px-6 rounded-xl mb-6 text-center"
                  style={{ backgroundColor: wonPrize.color }}
                >
                  <p
                    className="text-4xl font-bold"
                    style={{ color: wonPrize.textColor || '#FFFFFF' }}
                  >
                    {wonPrize.label}
                  </p>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800 text-center">
                    📧 Check your email for details on how to claim your prize!
                  </p>
                </div>

                {/* Reset Button */}
                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 text-sm">
        <p>© 2025 Spin to Win. All rights reserved.</p>
      </footer>
    </div>
  );
}
