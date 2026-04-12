export interface User {
  id: string;
  display_name: string;
  created_at: string;
}

export interface Thought {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface ThoughtWithMeta {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author_name: string;
  comment_count: number;
}

export interface Comment {
  id: string;
  thought_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface CommentWithAuthor {
  id: string;
  thought_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author_name: string;
}
