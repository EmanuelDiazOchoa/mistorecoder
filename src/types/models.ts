export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  image?: string; // Para compatibilidad
  title?: string; // Para compatibilidad
  stock?: number;
  createdAt?: Date;
}

export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Redux State Types
export interface AuthState {
  user: User | null;
}

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export interface CartState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Root State
export interface RootState {
  auth: AuthState;
  products: ProductsState;
  cart: CartState;
}

// Navigation Types
export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Main: undefined;
  Details: { product: Product };
  CategoryProducts: { category: string };
};