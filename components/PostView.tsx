
import React from 'react';
import { Post } from '../types';
import CommentSection from './CommentSection';
import { ArrowLeftIcon, CalendarIcon, MapPinIcon } from './Icons';

interface PostViewProps {
  post: Post;
  onBack: () => void;
  onAddComment: (postId: string, content: { content: string }) => void;
}

const PostView: React.FC<PostViewProps> = ({ post, onBack, onAddComment }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-sm font-semibold text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <span>All Posts</span>
      </button>

      <article className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
        )}
        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1.5" />
              <span>{post.location}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1.5" />
              <span>{new Date(post.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">{post.title}</h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>

      <CommentSection 
        postId={post.id}
        comments={post.comments}
        onAddComment={onAddComment}
      />
    </div>
  );
};

export default PostView;
