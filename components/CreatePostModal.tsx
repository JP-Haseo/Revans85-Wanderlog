
import React, { useState } from 'react';
import { Post } from '../types';
import * as geminiService from '../services/geminiService';
import { SparklesIcon, XMarkIcon } from './Icons';
import LoadingSpinner from './LoadingSpinner';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPost: (postData: Omit<Post, 'id' | 'timestamp' | 'author' | 'comments'> & { generateImage?: boolean }) => Promise<void>;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onAddPost }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [generateImage, setGenerateImage] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);

  const handleGenerateIdea = async () => {
    if (!title && !location) {
      alert("Please enter a title or location to generate an idea.");
      return;
    }
    setIsGeneratingIdea(true);
    const idea = await geminiService.generatePostIdea(`${title} in ${location}`);
    setContent(idea);
    setIsGeneratingIdea(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !content) {
      alert("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    await onAddPost({ title, location, content, generateImage });
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Share Your Adventure</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., A Day in the Alps" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 shadow-sm focus:border-sky-500 focus:ring-sky-500" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
              <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Interlaken, Switzerland" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 shadow-sm focus:border-sky-500 focus:ring-sky-500" />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Your Story</label>
                <button type="button" onClick={handleGenerateIdea} disabled={isGeneratingIdea} className="flex items-center text-sm font-semibold text-sky-500 hover:text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isGeneratingIdea ? (
                    <>
                      <LoadingSpinner className="h-4 w-4 mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-4 w-4 mr-1" />
                      Generate Idea
                    </>
                  )}
                </button>
              </div>
              <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={8} placeholder="Tell us about your trip..." className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 shadow-sm focus:border-sky-500 focus:ring-sky-500"></textarea>
            </div>
            <div className="flex items-center">
                <input id="generate-image" type="checkbox" checked={generateImage} onChange={e => setGenerateImage(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                <label htmlFor="generate-image" className="ml-2 block text-sm text-slate-800 dark:text-slate-200">
                    Generate header image with AI <span className="text-xs text-slate-500">(may take a moment)</span>
                </label>
            </div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-4 rounded-b-xl">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600 disabled:bg-sky-300 disabled:cursor-not-allowed flex items-center">
              {isSubmitting && <LoadingSpinner className="h-4 w-4 mr-2" />}
              {isSubmitting ? 'Posting...' : 'Post Adventure'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
