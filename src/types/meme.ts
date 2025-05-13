export interface User {
  id: string;
  is_verified: boolean;
  profile_pic_url: string;
  username: string;
}

export interface Comment {
  text: string;
  owner: User;
  likes: number;
  thread_comments?: Comment[];
}

export interface Meme {
  date: string;
  likes: number;
  caption: string | null;
  total_comments: number;
  comments: Comment[];
}