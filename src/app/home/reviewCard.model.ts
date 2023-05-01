export interface Author {
  name: string;
  image: string;
}

export interface ReviewCard {
  id: number;
  productGroup: string;
  productName: string;
  reviewTitle: string;
  reviewContent: string;
  tags: string[];
  image: string;
  createdAt: string;
  author?: Author;
}
