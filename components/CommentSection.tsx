
import React, { useState } from 'react';
import { Comment } from '../types';
import { PaperAirplaneIcon, UserCircleIcon } from './Icons';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, content: { content:string }) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(postId, { content: newComment });
      setNewComment('');
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Comments ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            placeholder="Share your thoughts..."
            className="w-full p-4 pr-12 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          />
          <button type="submit" className="absolute top-3 right-3 p-2 text-slate-400 hover:text-sky-500 rounded-full transition-colors" aria-label="Submit comment">
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="flex space-x-4">
            <UserCircleIcon className="h-10 w-10 text-slate-400 dark:text-slate-500 flex-shrink-0 mt-1" />
            <div className="flex-1 bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
              <div className="flex items-baseline justify-between">
                <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">{comment.author}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(comment.timestamp).toLocaleString()}
                </p>
              </div>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{comment.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-slate-500 text-center py-4">Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
