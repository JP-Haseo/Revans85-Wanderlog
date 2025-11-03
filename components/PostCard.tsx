
import React from 'react';
import { Post } from '../types';
import { MapPinIcon, ChatBubbleBottomCenterTextIcon } from './Icons';

interface PostCardProps {
  post: Post;
  onSelectPost: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onSelectPost }) => {
  const contentSnippet = post.content.substring(0, 100) + '...';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
      <img 
        src={post.imageUrl} 
        alt={post.title} 
        className="w-full h-48 object-cover" 
        loading="lazy"
      />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-2">
          <MapPinIcon className="h-4 w-4 mr-1.5" />
          <span>{post.location}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{post.title}</h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm flex-grow">{contentSnippet}</p>
        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <ChatBubbleBottomCenterTextIcon className="h-4 w-4 mr-1.5" />
            <span>{post.comments.length} comments</span>
          </div>
          <button 
            onClick={() => onSelectPost(post.id)}
            className="text-sm font-semibold text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            Read More &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
