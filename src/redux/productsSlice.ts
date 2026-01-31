import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '@service/firebase'; 
import { ref, onValue } from 'firebase/database';
import { Product, ProductsState } from '../types/models'; 


export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetchProducts', 
  async () => {
    return new Promise<Product[]>((resolve) => {
      const productsRef = ref(db, 'products/');
      onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        const loaded = data 
          ? Object.entries(data).map(([id, value]: [string, any]) => ({ 
              id, 
              ...value 
            })) 
          : [];
        resolve(loaded);
      });
    });
  }
);

const initialState: ProductsState = { 
  products: [], 
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  }
});

export default productsSlice.reducer;