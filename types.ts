
export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: number;
  location: string;
  imageUrl?: string;
  comments: Comment[];
}
