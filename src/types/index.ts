export type ProductCategory = 
  | 'all'
  | 't-shirts'
  | 'hoodies'
  | 'pants'
  | 'jackets'
  | 'accessories';

export interface Product {
  id: string;
  name: string;
  category: 't-shirts' | 'hoodies' | 'pants' | 'jackets' | 'accessories';
  categoryLabel: string;
  price: number;
  oldPrice?: number;
  badge?: 'Yangi' | 'Trend' | 'Bestseller' | 'Chegirma';
  image: string;
  modelFit?: string;
  rating: number;
  reviewsCount: number;
  sizes: string[];
  colors: string[];
  description: string;
  material: string;
  inStock: boolean;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  purchasedItem: string;
  avatar: string;
}

export interface ContactFormState {
  fullName: string;
  phone: string;
  selectedProduct?: string;
  preferredSize?: string;
  message: string;
}
