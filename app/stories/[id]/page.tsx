'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Story {
  id: number;
  title: string;
  content: string;
  summary?: string;
  theme: string;
  votes: number;
  createdat: string;
}

interface Comment {
  id: number;
  content: string;
  author: string;
  createdat: string;
  storyid: number;
  parentid: number | null;
  replies?: Comment[];
}

export default function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/stories/${id}`);
        if (!response.ok) throw new Error('Failed to fetch story');
        const data = await response.json();
        setStory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch story');
      }
    };

    const fetchComments = async () => {
      try {
        const { id } = await params;
        console.log('Fetching comments for story:', id);
        const response = await fetch(`/api/stories/${id}/comments`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch comments');
        }
        const data = await response.json();
        console.log('Comments fetched successfully:', data);
        setComments(data);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
        // Don't set error state for comments failure, just log it
      }
    };

    fetchStory();
    fetchComments();
  }, [params]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { id } = await params;
      const response = await fetch(`/api/stories/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error('Failed to submit comment');
      
      const comment = await response.json();
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId: number) => {
    setReplyingTo(parentId);
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      const { id } = await params;
      const response = await fetch(`/api/stories/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: replyContent,
          parentId: replyingTo 
        }),
      });

      if (!response.ok) throw new Error('Failed to submit reply');
      
      const reply = await response.json();
      setComments(prevComments => {
        const updateComments = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment.id === replyingTo) {
              return {
                ...comment,
                replies: [...(comment.replies || []), reply]
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateComments(comment.replies)
              };
            }
            return comment;
          });
        };
        return updateComments(prevComments);
      });
      setReplyContent('');
      setReplyingTo(null);
    } catch (err) {
      console.error('Failed to submit reply:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCommentThread = (commentId: number) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const renderComments = (comments: Comment[], level = 0) => {
    return comments.map((comment) => (
      <div key={comment.id} className={`${level > 0 ? 'ml-8 mt-4' : ''}`}>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {new Date(comment.createdat).toLocaleDateString()}
              </span>
            </div>
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => toggleCommentThread(comment.id)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                {expandedComments.has(comment.id) ? (
                  <>
                    <span>Hide Replies</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Show {comment.replies.length} {comment.replies.length === 1 ? 'Reply' : 'Replies'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          <button
            onClick={() => handleReply(comment.id)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Reply
          </button>
          {replyingTo === comment.id && (
            <form onSubmit={handleSubmitReply} className="mt-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black"
                placeholder="Write your reply..."
                required
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Posting...' : 'Post Reply'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && expandedComments.has(comment.id) && (
          <div className="mt-4">
            {renderComments(comment.replies, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center text-red-600">{error}</div>
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <article className="prose lg:prose-xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{story.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-8">
            <span>Theme: {story.theme}</span>
            <span>•</span>
            <span>{new Date(story.createdat).toLocaleDateString()}</span>
            <span>•</span>
            <span>{story.votes} votes</span>
          </div>
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-mono">
            {story.content}
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Comments</h2>
          
          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-12 bg-gray-50 p-6 rounded-xl shadow-sm">
            <div className="space-y-4">
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Share Your Thoughts
                </label>
                <textarea
                  id="content"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black"
                  placeholder="Write your comment here..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {renderComments(comments)}
            {comments.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No comments yet. Be the first to share your thoughts!
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 