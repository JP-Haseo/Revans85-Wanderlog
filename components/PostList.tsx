/*
 * NOTE: This file is not currently used.
 *
 * This project is running in an environment that uses Babel Standalone
 * to transpile a single script file (index.tsx) in the browser. It does not
 * have a bundler (like Vite or Webpack) to resolve imports between files.
 *
 * To make the application work, all component, hook, and service logic has
 * been consolidated into the main `index.tsx` file. This file is a duplicate
 * of that logic and its content has been commented out to avoid confusion.
 */

/*
import React from 'react';
import { Post } from '../types';
import PostCard from './PostCard';

interface PostListProps {
  posts: Post[];
  onSelectPost: (postId: string) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onSelectPost }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-400">No posts yet.</h2>
        <p className="mt-2 text-slate-500">Why not share your own adventure?</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onSelectPost={onSelectPost} />
      ))}
    </div>
  );
};

export default PostList;
*/
