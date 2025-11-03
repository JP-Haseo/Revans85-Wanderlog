
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
