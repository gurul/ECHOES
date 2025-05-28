'use client';

import { useState } from 'react';
import { Theme, themeGradients } from '../utils/themes';
import { useRouter } from 'next/navigation';

export default function SharePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState<Theme>('resilience');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, theme }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit story');
      }

      // Reset form
      setTitle('');
      setContent('');
      setTheme('resilience');
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error submitting story:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2348B1] to-[#1a3a8f] text-white py-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in relative">
            <span className="relative inline-block">
              Share Your Story
              <span className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-xl animate-pulse-slow"></span>
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-4 relative">
            <span className="relative inline-block">
              Let your voice be heard
              <span className="absolute -inset-1 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 blur-lg animate-pulse-slow"></span>
            </span>
          </p>
          <div className="flex justify-center mb-8">
            <button 
              onClick={() => router.back()}
              className="group relative inline-flex items-center px-6 py-2 text-white hover:text-white transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 backdrop-blur-sm rounded-lg transform transition-all duration-500 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-blue-400/30 group-hover:to-indigo-400/30 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
              <svg 
                className="w-5 h-5 mr-2 transform transition-all duration-500 group-hover:-translate-x-2 group-hover:scale-110" 
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
              <span className="relative transform transition-all duration-500 group-hover:translate-x-1">Back to Stories</span>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 transform-gpu transition-all duration-300 hover:shadow-2xl">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2348B1] focus:border-[#2348B1] transition-all duration-200 bg-white/50 backdrop-blur-sm text-black placeholder-gray-500"
                  placeholder="Give your story a title"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-black mb-2">
                  Your Story
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2348B1] focus:border-[#2348B1] transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none text-black placeholder-gray-500"
                  placeholder="Share your story here..."
                  required
                />
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

          <div className="flex justify-end">
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