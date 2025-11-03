import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Type Definitions ---
interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: number;
  location: string;
  imageUrl?: string;
  comments: Comment[];
}

// --- Icon Components ---
const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
  </svg>
);

const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);

const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const GlobeAltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0 0 12 13.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 0 3 12c0 .778.099 1.533.284 2.253m18.148-4.506A11.953 11.953 0 0 1 12 10.5" />
  </svg>
);

const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

const ChatBubbleBottomCenterTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.006 3 11.5c0 2.252.605 4.37 1.67 6.132l-.54 2.723 2.723-.54A8.96 8.96 0 0 0 12 20.25ZM12 7.5h.008v.008H12V7.5Zm-2.25 3h4.5M12 12.75h.008v.008H12v-.008Z" />
    </svg>
);

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />
    </svg>
);

const PaperAirplaneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
  </svg>
);

const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

// --- Loading Spinner Component ---
interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = 'h-5 w-5' }) => {
  return (
    <div 
      className={`animate-spin rounded-full border-t-2 border-b-2 border-current ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// --- Services (namespaced to avoid conflicts) ---
namespace storageService {
  const POSTS_KEY = 'wanderlog_posts';

  const getInitialPosts = (): Post[] => {
    return [
      {
        id: '1',
        title: 'Sunrise over Mount Fuji',
        location: 'Fujinomiya, Japan',
        author: 'Anonymous',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
        content: `Waking up at 2 AM was a struggle, but the view was worth every second of lost sleep. The climb was challenging, with the air getting thinner with every step. Reaching the summit just as the sun began to peek over the horizon was a truly spiritual experience. The sky transformed into a canvas of fiery oranges, pinks, and purples. It's a memory I'll cherish forever. \n\nFor anyone planning the trip, make sure to bring warm layers, even in summer. The wind at the top is no joke! Also, pack plenty of water and snacks. The mountain huts offer some respite, but it's best to be self-sufficient.`,
        imageUrl: 'https://picsum.photos/seed/fuji/1200/800',
        comments: [
          { id: 'c1', author: 'Anonymous', content: 'This is breathtaking! It\'s on my bucket list.', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4 },
          { id: 'c2', author: 'Anonymous', content: 'Great advice about the warm layers. Thanks!', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2 },
        ],
      },
      {
        id: '2',
        title: 'Exploring the Souks of Marrakech',
        location: 'Marrakech, Morocco',
        author: 'Anonymous',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10,
        content: `Getting lost in the labyrinthine alleys of the Marrakech souks is an adventure in itself. The vibrant colors of the spices, the intricate patterns of the carpets, and the smell of leather and mint tea create an unforgettable sensory overload. I spent hours haggling for lanterns and leather goods, sipping on sweet mint tea offered by friendly shopkeepers. \n\nJemaa el-Fnaa square comes alive at night with storytellers, musicians, and food stalls. Trying the tagine and freshly squeezed orange juice is a must. It's chaotic, magical, and utterly captivating.`,
        imageUrl: 'https://picsum.photos/seed/marrakech/1200/800',
        comments: [],
      },
    ];
  };

  export const getPosts = (): Post[] => {
    try {
      const postsJson = localStorage.getItem(POSTS_KEY);
      if (!postsJson) {
        const initialPosts = getInitialPosts();
        localStorage.setItem(POSTS_KEY, JSON.stringify(initialPosts));
        return initialPosts;
      }
      return JSON.parse(postsJson);
    } catch (error) {
      console.error("Failed to parse posts from localStorage", error);
      return getInitialPosts();
    }
  };

  export const savePosts = (posts: Post[]): void => {
    try {
      const postsJson = JSON.stringify(posts);
      localStorage.setItem(POSTS_KEY, postsJson);
    } catch (error) {
      console.error("Failed to save posts to localStorage", error);
    }
  };
}

namespace geminiService {
    let ai: GoogleGenAI | null = null;

    function getAiClient(): GoogleGenAI | null {
        if (ai) return ai;
        
        const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

        if (API_KEY) {
            ai = new GoogleGenAI({ apiKey: API_KEY });
            return ai;
        } else {
            console.warn("API_KEY is not available. Gemini features will be disabled.");
            return null;
        }
    }

    export const generatePostIdea = async (topic: string): Promise<string> => {
      const aiClient = getAiClient();
      if (!aiClient) return "API Key not configured. Please set up your API_KEY.";
      
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Generate a short, engaging travel blog post idea about "${topic}". Make it sound like a personal anecdote or a helpful tip. Focus on a single paragraph.`,
        });
        return response.text;
      } catch (error) {
        console.error("Error generating post idea:", error);
        return "Could not generate an idea at this time. Please try again later.";
      }
    };

    export const generatePostImage = async (prompt: string): Promise<string> => {
      const aiClient = getAiClient();
      const fallbackImageUrl = `https://picsum.photos/seed/${prompt.replace(/\s/g, '')}/1200/675`;

      if (!aiClient) return fallbackImageUrl;
      
      try {
        const response = await aiClient.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A beautiful, vibrant, high-quality photograph of ${prompt}. Travel photography style, cinematic lighting.`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
          const base64ImageBytes = response.generatedImages[0].image.imageBytes;
          return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("No image generated");
      } catch (error) {
        console.error("Error generating image:", error);
        return fallbackImageUrl;
      }
    };
}

// --- Custom Hook ---
const usePosts = () => {
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

// --- UI Components ---
interface HeaderProps {
  onNewPostClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewPostClick }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    setIsDarkMode(theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    if (newIsDarkMode) {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <GlobeAltIcon className="h-8 w-8 text-sky-500" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Wanderlog</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
            <button
              onClick={onNewPostClick}
              className="flex items-center space-x-2 bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900 transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>New Post</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

interface PostCardProps {
  post: Post;
  onSelectPost: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onSelectPost }) => {
  const contentSnippet = post.content.substring(0, 100) + '...';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
      <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" loading="lazy" />
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
          <button onClick={() => onSelectPost(post.id)} className="text-sm font-semibold text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
            Read More &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

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
        {comments.length === 0 && <p className="text-slate-500 text-center py-4">Be the first to comment!</p>}
      </div>
    </div>
  );
};

interface PostViewProps {
  post: Post;
  onBack: () => void;
  onAddComment: (postId: string, content: { content: string }) => void;
}

const PostView: React.FC<PostViewProps> = ({ post, onBack, onAddComment }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center space-x-2 text-sm font-semibold text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 mb-6">
        <ArrowLeftIcon className="h-4 w-4" />
        <span>All Posts</span>
      </button>
      <article className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="w-full h-64 md:h-96 object-cover" />}
        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <div className="flex items-center"><MapPinIcon className="h-4 w-4 mr-1.5" /><span>{post.location}</span></div>
            <div className="flex items-center"><CalendarIcon className="h-4 w-4 mr-1.5" /><span>{new Date(post.timestamp).toLocaleDateString()}</span></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">{post.title}</h1>
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
            {post.content.split('\n').map((paragraph, index) => (<p key={index}>{paragraph}</p>))}
          </div>
        </div>
      </article>
      <CommentSection postId={post.id} comments={post.comments} onAddComment={onAddComment} />
    </div>
  );
};

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
    // Note: onClose is handled by the parent component after submission is complete
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Share Your Adventure</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><XMarkIcon className="h-6 w-6" /></button>
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
                  {isGeneratingIdea ? (<><LoadingSpinner className="h-4 w-4 mr-2" />Generating...</>) : (<><SparklesIcon className="h-4 w-4 mr-1" />Generate Idea</>)}
                </button>
              </div>
              <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={8} placeholder="Tell us about your trip..." className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 shadow-sm focus:border-sky-500 focus:ring-sky-500"></textarea>
            </div>
            <div className="flex items-center">
                <input id="generate-image" type="checkbox" checked={generateImage} onChange={e => setGenerateImage(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                <label htmlFor="generate-image" className="ml-2 block text-sm text-slate-800 dark:text-slate-200">Generate header image with AI <span className="text-xs text-slate-500">(may take a moment)</span></label>
            </div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-4 rounded-b-xl">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600 disabled:bg-sky-300 disabled:cursor-not-allowed flex items-center">
              {isSubmitting && <LoadingSpinner className="h-4 w-4 mr-2" />}{isSubmitting ? 'Posting...' : 'Post Adventure'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main App Component ---
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

  const handleAddPost = async (postData: Omit<Post, 'id' | 'timestamp' | 'author' | 'comments' | 'imageUrl'> & { generateImage?: boolean }) => {
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
            onAddComment={(postId, content) => addComment(postId, content)}
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

// --- Mount the App ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
