// models.ts
export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  image?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}
