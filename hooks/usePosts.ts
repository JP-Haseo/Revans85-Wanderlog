
import { useState, useEffect, useCallback } from 'react';
import { Post, Comment } from '../types';
import * as storageService from '../services/storageService';
import * as geminiService from '../services/geminiService';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);

  useEffect(() => {
    const loadedPosts = storageService.getPosts();
    setPosts(loadedPosts.sort((a, b) => b.timestamp - a.timestamp));
    setIsLoadingPosts(false);
  }, []);

  const addPost = useCallback(async (postData: Omit<Post, 'id' | 'timestamp' | 'author' | 'comments' | 'imageUrl'> & { generateImage?: boolean }) => {
    let imageUrl = `https://picsum.photos/seed/${postData.title.replace(/\s/g, '')}/1200/675`;

    if (postData.generateImage) {
        imageUrl = await geminiService.generatePostImage(`${postData.title}, ${postData.location}`);
    }

    const newPost: Post = {
      id: crypto.randomUUID(),
      ...postData,
      imageUrl,
      author: 'Anonymous',
      timestamp: Date.now(),
      comments: [],
    };

    setPosts(prevPosts => {
      const updatedPosts = [newPost, ...prevPosts];
      storageService.savePosts(updatedPosts);
      return updatedPosts;
    });
  }, []);

  const addComment = useCallback((postId: string, commentData: Omit<Comment, 'id' | 'timestamp' | 'author'>) => {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      author: 'Anonymous',
      timestamp: Date.now(),
      ...commentData,
    };

    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment].sort((a,b) => b.timestamp - a.timestamp),
          };
        }
        return post;
      });
      storageService.savePosts(updatedPosts);
      return updatedPosts;
    });
  }, []);

  return { posts, isLoadingPosts, addPost, addComment };
};
