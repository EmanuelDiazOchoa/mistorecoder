import { useEffect, useState } from 'react';
import type { Product } from '../types/models';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // TODO: fetch products
    setProducts([]);
  }, []);

  return { products };
};

export default useProducts;
