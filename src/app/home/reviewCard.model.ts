import { Tag } from "../services/review.model";

export interface Author {
  authorId:number,
  name: string;
  image: string | null;
}

interface Product {
  id:number,
  name:string
}
export interface ReviewCard {
  id:number,
  title: string;
  description: string;
  author: Author;
  group: string;
  product: Product;
  tags: Tag[];
  images: string[];
  createdAt: string;
}

export interface ReviewCardResponse{
  message:string,
  reviews:any
}