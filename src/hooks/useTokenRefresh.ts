import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { jwt } from '@/lib/jwt';

export const useTokenRefresh = () => {
  const { token, refreshToken, logout } = useAuth();

  const checkAndRefreshToken = useCallback(async () => {
    if (!token) return;

    // Check if token is close to expiration (within 1 hour)
    const payload = jwt.decode(token);
    if (!payload || !payload.exp) {
      logout();
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - now;
    const oneHour = 60 * 60;

    // If token expires within 1 hour, refresh it
    if (timeUntilExpiry < oneHour) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        logout();
      }
    }
  }, [token, refreshToken, logout]);

  useEffect(() => {
    if (!token) return;

    // Check token immediately
    checkAndRefreshToken();

    // Set up interval to check every 30 minutes
    const interval = setInterval(checkAndRefreshToken, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, checkAndRefreshToken]);

  return { checkAndRefreshToken };
};