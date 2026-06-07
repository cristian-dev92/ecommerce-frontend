// src/app/models/product.ts

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  technicalDescription: string;
  price: number;
  discount: number;
  finalPrice: number;
  taxes: number;
  imageUrl?: string;
  gallery: string[];
  stock: number;
  visible?: boolean;
  manufacturer: string; 
  warranty: string;
}
