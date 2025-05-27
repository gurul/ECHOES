'use client';

import { FormEvent } from 'react';

interface StoryFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export default function StoryForm({ onSubmit, isSubmitting, error }: StoryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-xl">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-900">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2348B1] focus:border-transparent text-gray-900 bg-white transition-all duration-200 placeholder:text-gray-400"
          placeholder="Give your story a title"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="theme" className="block text-sm font-medium text-gray-900">
          Theme
        </label>
        <select
          id="theme"
          name="theme"
          required
          className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2348B1] focus:border-transparent text-gray-900 bg-white transition-all duration-200"
        >
          <option value="">Select a theme</option>
          <option value="resilience">Resilience</option>
          <option value="love">Love</option>
          <option value="adventure">Adventure</option>
          <option value="wisdom">Wisdom</option>
          <option value="family">Family</option>
          <option value="courage">Courage</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-gray-900">
          Your Story
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={8}
          className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2348B1] focus:border-transparent text-gray-900 bg-white transition-all duration-200 resize-none placeholder:text-gray-400"
          placeholder="Share your story..."
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-fade-in">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#2348B1] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#1a3a8f] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Submitting...
          </span>
        ) : (
          'Share Story'
        )}
      </button>
    </form>
  );
} 