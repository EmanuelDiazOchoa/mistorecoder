// src/services/authApi.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      async queryFn({ email, password }) {
        try {
          const { createUserWithEmailAndPassword } = await import('firebase/auth');
          const { getFirebaseAuth } = await import('../../firebase/config');

          const auth = getFirebaseAuth();
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          return { data: userCredential.user };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
    }),
    login: builder.mutation({
      async queryFn({ email, password }) {
        try {
          const { signInWithEmailAndPassword } = await import('firebase/auth');
          const { getFirebaseAuth } = await import('../../firebase/config');

          const auth = getFirebaseAuth();
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          return { data: userCredential.user };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
    }),
  }),
});

export const { useSignupMutation, useLoginMutation } = authApi;
