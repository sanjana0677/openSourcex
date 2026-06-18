import { createContext, useContext, useEffect, useState } from 'react';
import { useGetMe, getGetMeQueryKey, useLogout } from '../hooks/useApi.js';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext({
  user: null,
  isLoading: true,
  logoutUser: () => {},
});

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [hasToken, setHasToken] = useState(() => !!localStorage.getItem('osx_access_token'));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (accessToken && refreshToken) {
      localStorage.setItem('osx_access_token', accessToken);
      localStorage.setItem('osx_refresh_token', refreshToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      setHasToken(true);
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    }
  }, [queryClient]);

  const { data: user, isLoading, isError } = useGetMe({ enabled: hasToken });

  const logoutMutation = useLogout();

  const logoutUser = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        localStorage.removeItem('osx_access_token');
        localStorage.removeItem('osx_refresh_token');
        setHasToken(false);
        queryClient.clear();
        navigate('/');
      },
    });
  };

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
