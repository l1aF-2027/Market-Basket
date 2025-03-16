// Shared product type for both admin and user interfaces
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  purchases?: number;
}
