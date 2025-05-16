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

export type Multimedia = {
  id: number;
  type: 'image' | 'video';
  url: string;
  width: number | null;
  height: number | null;
  duration: number | null;
  display_order: number;
};

export type Meme = {
  date: string;
  likes: number;
  caption: string;
  total_comments: number;
  comments: Comment[];
  multimedia: Multimedia[];
};