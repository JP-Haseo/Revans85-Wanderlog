
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import PostList from './components/PostList';
import PostView from './components/PostView';
import { usePosts } from './hooks/usePosts';
import { Post } from './types';
import CreatePostModal from './components/CreatePostModal';

const App: React.FC = () => {
  const { posts, addPost, addComment, isLoadingPosts } = usePosts();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const selectedPost = useMemo(() => {
    return posts.find(p => p.id === selectedPostId) || null;
  }, [posts, selectedPostId]);

  const handleSelectPost = (postId: string) => {
    setSelectedPostId(postId);
  };

  const handleBackToList = () => {
    setSelectedPostId(null);
  };

  const handleAddPost = async (postData: Omit<Post, 'id' | 'timestamp' | 'author' | 'comments'>) => {
    await addPost(postData);
    setCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <Header onNewPostClick={() => setCreateModalOpen(true)} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoadingPosts ? (
           <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-500"></div>
           </div>
        ) : selectedPost ? (
          <PostView 
            post={selectedPost} 
            onBack={handleBackToList}
            onAddComment={(postId, content) => addComment(postId, { content })}
          />
        ) : (
          <PostList posts={posts} onSelectPost={handleSelectPost} />
        )}
      </main>
      
      {isCreateModalOpen && (
        <CreatePostModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setCreateModalOpen(false)}
          onAddPost={handleAddPost}
        />
      )}
    </div>
  );
};

export default App;
