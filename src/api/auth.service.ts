// auth.service.ts — placeholder API service
export const login = async (email: string, password: string) => {
  // TODO: replace with real API call
  return Promise.resolve({ token: 'stub-token', user: { email } });
};

export const register = async (email: string, password: string) => {
  // TODO
  return Promise.resolve({ success: true });
};
