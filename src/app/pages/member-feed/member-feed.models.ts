export interface FeedAuthor {
  id: string;
  name: string;
  username: string | null;
  image: string | null;
  avatarUrl?: string | null
}

export interface FeedComment {
  id: string;
  author: FeedAuthor;
  content: string;
  createdAt: string;
  mine: boolean;
  likes: number;
  liked: boolean;
  replies: FeedComment[]
}

export interface FeedPost {
  id: string;
  author: FeedAuthor;
  content: string | null;
  images: string[];
  imageUrls?: string[];
  likes: number;
  liked: boolean;
  comments: FeedComment[];
  hidden: boolean;
  mine: boolean;
  createdAt: string;
  updatedAt: string
}
