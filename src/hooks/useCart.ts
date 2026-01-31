import { useState } from 'react';
import type { Product } from '../types/models';

export const useCart = () => {
  const [items, setItems] = useState<Product[]>([]);

  const add = (product: Product) => setItems((s) => [...s, product]);
  const remove = (id: string) => setItems((s) => s.filter((p) => p.id !== id));

  return { items, add, remove };
};

export default useCart;
