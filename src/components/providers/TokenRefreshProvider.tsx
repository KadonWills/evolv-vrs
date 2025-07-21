'use client';

import { useTokenRefresh } from '@/hooks/useTokenRefresh';

interface TokenRefreshProviderProps {
  children: React.ReactNode;
}

export const TokenRefreshProvider: React.FC<TokenRefreshProviderProps> = ({ children }) => {
  // This component just initializes the token refresh hook
  useTokenRefresh();
  
  return <>{children}</>;
};