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
    <main className="min-h-screen bg-gray-50 py-16">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <svg 
            className="w-5 h-5 mr-2" 
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

      {/* Header */}
      <header className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center animate-fade-in">Share Your Story</h1>
          <p className="text-gray-300 text-center mt-4">
            Inspire others with your unique experience
          </p>
        </div>
      </header>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        {success ? (
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Story Submitted!</h2>
            <p className="text-gray-900">Redirecting you back to home...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-scale-in">
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