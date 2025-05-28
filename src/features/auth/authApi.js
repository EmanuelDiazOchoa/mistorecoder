// src/services/authApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../service/firebase';


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: async () => ({ data: {} }), 
  endpoints: (builder) => ({
    signup: builder.mutation({
      async queryFn({ email, password }) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          return { data: userCredential.user };
        } catch (error) {
          return { error: { message: error.message, code: error.code } };
        }
      }
    }),
    login: builder.mutation({
      async queryFn({ email, password }) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          return { data: userCredential.user };
        } catch (error) {
          return { error: { message: error.message, code: error.code } };
        }
      }
    }),
  }),
});

export const { useSignupMutation, useLoginMutation } = authApi;


