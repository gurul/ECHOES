'use client';

import { FormEvent } from 'react';

interface StoryFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export default function StoryForm({ onSubmit, isSubmitting, error }: StoryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2348B1] focus:border-transparent text-gray-900"
          placeholder="Give your story a title"
        />
      </div>

      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-gray-900 mb-1">
          Theme
        </label>
        <select
          id="theme"
          name="theme"
          required
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2348B1] focus:border-transparent text-gray-900"
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

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-900 mb-1">
          Your Story
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={8}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2348B1] focus:border-transparent text-gray-900"
          placeholder="Share your story..."
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#2348B1] text-white px-6 py-3 rounded-lg hover:bg-[#1a3a8f] transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Share Story'}
      </button>
    </form>
  );
} 