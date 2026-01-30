export interface Post {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  authorId: number;
  author?: User;
}

export interface User {
  id: number;
  email: string;
  name: string | null;
  posts?: Post[];
}
