'use client';

import React, { useState, FormEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Theme, themeGradients } from '../utils/themes';
import Link from 'next/link';

// Add type declarations for the Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: (event: Event) => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export default function SharePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState<Theme>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isListeningTitle, setIsListeningTitle] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [titleRecognition, setTitleRecognition] = useState<SpeechRecognition | null>(null);

  const startListening = (isTitle: boolean = false) => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    const recognitionInstance = new window.webkitSpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;

    recognitionInstance.onstart = () => {
      if (isTitle) {
        setIsListeningTitle(true);
        setTitleRecognition(recognitionInstance);
      } else {
        setIsListening(true);
        setRecognition(recognitionInstance);
      }
    };

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result: SpeechRecognitionResult) => result[0])
        .map((result: SpeechRecognitionAlternative) => result.transcript)
        .join('');

      if (isTitle) {
        setTitle(transcript);
      } else {
        setContent(transcript);
      }
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (isTitle) {
        setIsListeningTitle(false);
        setTitleRecognition(null);
      } else {
        setIsListening(false);
        setRecognition(null);
      }
      if (event.error === 'no-speech') {
        setError('No speech was detected. Please try again.');
      } else {
        setError('An error occurred with speech recognition. Please try again.');
      }
    };

    recognitionInstance.onend = () => {
      if (isTitle) {
        setIsListeningTitle(false);
        setTitleRecognition(null);
      } else {
        setIsListening(false);
        setRecognition(null);
      }
    };

    recognitionInstance.start();
  };

  const stopListening = (isTitle: boolean = false) => {
    if (isTitle) {
      if (titleRecognition) {
        titleRecognition.stop();
        setTitleRecognition(null);
      }
      setIsListeningTitle(false);
    } else {
      if (recognition) {
        recognition.stop();
        setRecognition(null);
      }
      setIsListening(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, theme }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit story');
      }

      // Reset form
      setTitle('');
      setContent('');
      setTheme('');
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error submitting story:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit story');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Share Your Story</h1>
          <p className="text-lg text-gray-600">
            Inspire others with your experiences and wisdom
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error === 'Speech recognition is not supported in your browser.' ? (
              <p>{error}</p>
            ) : (
              <>
                <p className="font-medium">Error submitting story:</p>
                <p>{error}</p>
              </>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 transform-gpu transition-all duration-300 hover:shadow-2xl">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
                  Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2348B1] focus:border-[#2348B1] transition-all duration-200 bg-white/50 backdrop-blur-sm text-black placeholder-gray-500"
                    placeholder="Give your story a title"
                    required
                  />
                  <button
                    type="button"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      if (isListeningTitle) {
                        stopListening(true);
                      } else {
                        startListening(true);
                      }
                    }}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full ${
                      isListeningTitle 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-[#2348B1] hover:bg-[#1a3a8f]'
                    } text-white transition-colors duration-200`}
                    title={isListeningTitle ? 'Stop Recording' : 'Start Recording'}
                  >
                    {isListeningTitle ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    )}
                  </button>
                </div>
                {isListeningTitle && (
                  <div className="mt-2 text-sm text-[#2348B1] flex items-center gap-2">
                    <div className="animate-pulse w-2 h-2 bg-[#2348B1] rounded-full"></div>
                    Listening...
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-black mb-2">
                  Your Story
                </label>
                <div className="relative">
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2348B1] focus:border-[#2348B1] transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none text-black placeholder-gray-500"
                    placeholder="Share your story here..."
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (isListening) {
                        stopListening();
                      } else {
                        startListening();
                      }
                    }}
                    className={`absolute bottom-4 right-4 p-2 rounded-full ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-[#2348B1] hover:bg-[#1a3a8f]'
                    } text-white transition-colors duration-200`}
                    title={isListening ? 'Stop Recording' : 'Start Recording'}
                  >
                    {isListening ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    )}
                  </button>
                </div>
                {isListening && (
                  <div className="mt-2 text-sm text-[#2348B1] flex items-center gap-2">
                    <div className="animate-pulse w-2 h-2 bg-[#2348B1] rounded-full"></div>
                    Listening...
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-black mb-2">
                  Theme
                </label>
                <select
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as Theme)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2348B1] focus:border-[#2348B1] transition-all duration-200 bg-white/50 backdrop-blur-sm text-black"
                  required
                >
                  <option value="">Select a theme</option>
                  {Object.keys(themeGradients).map((theme) => (
                    <option key={theme} value={theme}>
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 rounded-xl font-medium text-[#2348B1] hover:text-[#1a3a8f] transition-all duration-200 transform hover:scale-105 active:scale-95"
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-8 py-3 rounded-xl font-medium text-white bg-[#2348B1] hover:bg-[#1a3a8f] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Share Story'
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 