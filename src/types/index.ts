export type Product = {
  id: string;
  name: string;
  category: string;
  image?: string;
  price: number;
  description?: string;
  [key: string]: any;
};

export type CartItem = Product & {
  quantity: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'completed' | 'pending' | string;
};

export type User = {
  email: string;
  uid: string;
};

export type AuthState = {
  user: User | null;
};

export type CartState = {
  items: CartItem[];
  loaded: boolean;
};

export type FavoritesState = {
  items: Product[];
};

export type OrdersState = {
  orders: Order[];
};

export type ProductsState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

export type UIState = {
  isDark: boolean;
  accentColor: string;
};

export type RootState = {
  auth: AuthState;
  cart: CartState;
  favorites: FavoritesState;
  orders: OrdersState;
  products: ProductsState;
  ui: UIState;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Details: { product: Product };
  CategoryProducts: { category: string };
};

export type BottomTabParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};
