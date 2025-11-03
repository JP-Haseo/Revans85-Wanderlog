
import { Post } from '../types';

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
