export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  image: string;
  role: UserRole;
  provider?: AuthProvider;
  providerId?: string;
  reviews: Review[];
  comments: Comment[];
}

enum UserRole {
  USER,
  ADMIN,
}

enum AuthProvider {
  EMAIL,
  GOOGLE,
  FACEBOOK,
}

export interface Review {
  id: number;
  title: string;
  descripton: string;
  productGrade: number;
  author: User;
  product: Product;
  group: string;
  tags: Tag[];
  content: string;
  images: string[];
  rating: Rating[];
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  likes: Like[];
}

export interface Product {
  id: number;
  name: string;
  reviews: Review[];
}

export interface Rating {
  id: number;
  value: number;
  user: User;
  review: Review;
}

export interface Like {
  id: number;
  user: User;
  review: Review;
}
export interface Comment {
  id: number;
  content: string;
  author: User;
  review: Review;
  createdAt: Date;
}
export interface Tag {
  id: number;
  name: string;
  reviews: Review[];
}
