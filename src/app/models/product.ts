// src/app/models/product.ts

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  taxes: number;
  imageUrl?: string;
  stock: number;
  visible?: boolean;
}
