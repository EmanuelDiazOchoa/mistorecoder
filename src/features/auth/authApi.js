import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../service/firebase';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }), // no se usa en funciones async personalizadas
  endpoints: (builder) => ({
    signup: builder.mutation({
      async queryFn({ email, password }) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          return { data: { email: userCredential.user.email, uid: userCredential.user.uid } };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
    }),
    login: builder.mutation({
      async queryFn({ email, password }) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          return { data: { email: userCredential.user.email, uid: userCredential.user.uid } };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
    }),
  }),
});

export const { useSignupMutation, useLoginMutation } = authApi;



