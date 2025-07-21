import * as jose from 'jose';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'employee' | 'manager';
  iat?: number;
  exp?: number;
}

// JWT secret key (loaded from environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-development-only';

// Convert string secret to Uint8Array for jose
const secretKey = new TextEncoder().encode(JWT_SECRET);

// Parse expiration time string to seconds
const parseExpiresIn = (expiresIn: string): number => {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 24 * 60 * 60; // Default 24 hours
  
  const [, num, unit] = match;
  const value = parseInt(num);
  
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 24 * 60 * 60;
    default: return 24 * 60 * 60;
  }
};

export const jwt = {
  sign: async (payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresIn: string = '24h'): Promise<string> => {
    const exp = Math.floor(Date.now() / 1000) + parseExpiresIn(expiresIn);
    const iat = Math.floor(Date.now() / 1000);
    
    const jwtPayload = {
      ...payload,
      iat,
      exp
    };

    return await new jose.SignJWT(jwtPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(secretKey);
  },

  verify: async (token: string): Promise<JWTPayload | null> => {
    try {
      const { payload } = await jose.jwtVerify(token, secretKey);
      return payload as unknown as JWTPayload;
    } catch {
      return null;
    }
  },

  decode: (token: string): JWTPayload | null => {
    try {
      const decoded = jose.decodeJwt(token) as unknown as JWTPayload;
      return decoded;
    } catch {
      return null;
    }
  },

  isExpired: (token: string): boolean => {
    const payload = jwt.decode(token);
    if (!payload || !payload.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  },

  getExpirationTime: (token: string): Date | null => {
    const payload = jwt.decode(token);
    if (!payload || !payload.exp) return null;

    return new Date(payload.exp * 1000);
  }
};