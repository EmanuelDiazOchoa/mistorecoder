import { useState } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    // TODO: call auth service
    setUser({ email });
    return { success: true };
  };

  const logout = () => setUser(null);

  return { user, login, logout };
};

export default useAuth;
