'use client';

import { useRouter } from 'next/navigation';
import StoryForm from '../components/StoryForm';
import Link from 'next/link';
import { useState } from 'react';
import { Theme } from '../utils/themes';

export default function ShareStory() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      theme: formData.get('theme') as Theme,
    };

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create story');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create story');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#2348B1] to-[#1a3a8f] py-8">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#2348B1] to-[#1a3a8f] text-white py-8">
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="mb-4">
            <Link 
              href="/" 
              className="inline-flex items-center text-white hover:text-gray-200 transition-colors duration-200 group"
            >
              <svg 
                className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center animate-fade-in mb-2">Share Your Story</h1>
          <p className="text-gray-200 text-center text-lg max-w-2xl mx-auto animate-fade-in delay-100">
            Inspire others with your unique experience. Your story matters.
          </p>
        </div>
      </header>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {success ? (
          <div className="text-center bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
            <div className="text-green-500 text-6xl mb-4 animate-scale-in">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Story Submitted!</h2>
            <p className="text-gray-600">Redirecting you back to home...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-scale-in">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            <div className="animate-slide-up">
              <StoryForm 
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                error={error}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
} 