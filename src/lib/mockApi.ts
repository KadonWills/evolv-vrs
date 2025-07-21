import { User, VacationRequest } from '@/types';
import { jwt } from './jwt';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'vrs_auth_token',
  REQUESTS: 'vrs_requests',
  USERS: 'vrs_users',
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@izsoftwares.com', role: 'employee' },
  { id: '2', name: 'Jane Smith', email: 'jane@izsoftwares.com', role: 'manager' },
  { id: '3', name: 'Bob Johnson', email: 'bob@izsoftwares.com', role: 'employee' },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

const generateToken = async (user: User): Promise<string> => {
  console.log('Generating token for user:', user);
  try {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    console.log('JWT payload:', payload);
    
    const token = await jwt.sign(payload, '24h');
    console.log('JWT sign successful, token length:', token.length);
    return token;
  } catch (error) {
    console.error('JWT sign failed:', error);
    throw error;
  }
};

const getStoredRequests = (): VacationRequest[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.REQUESTS);
  return stored ? JSON.parse(stored) : [];
};

const storeRequests = (requests: VacationRequest[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
};

const getStoredUsers = (): User[] => {
  if (typeof window === 'undefined') return mockUsers;
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!stored) {
    // Initialize localStorage with mock users
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
    return mockUsers;
  }
  return JSON.parse(stored);
};

const storeUsers = (users: User[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

const initializeMockData = () => {
  const existing = getStoredRequests();
  if (existing.length === 0) {
    const mockRequests: VacationRequest[] = [
      {
        id: '1',
        employeeId: '1',
        employeeName: 'John Doe',
        startDate: '2025-08-15',
        endDate: '2025-08-20',
        reason: 'Family vacation to the beach',
        status: 'pending',
        createdAt: '2025-07-20T10:00:00Z',
        updatedAt: '2025-07-20T10:00:00Z',
      },
      {
        id: '2',
        employeeId: '3',
        employeeName: 'Kapol Brondon',
        startDate: '2025-09-01',
        endDate: '2025-09-05',
        reason: 'Wedding anniversary celebration',
        status: 'approved',
        managerComment: 'Approved. Enjoy your celebration!',
        createdAt: '2025-07-18T14:30:00Z',
        updatedAt: '2025-07-19T09:15:00Z',
      },
    ];
    storeRequests(mockRequests);
  }
};

export const mockApi = {
  // Debug function to reset users
  resetUsers: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
      console.log('Users reset to:', mockUsers);
    }
  },

  async login(email: string, password: string, role: 'employee' | 'manager'): Promise<{ user: User; token: string }> {
    await delay(800);
    
    const users = getStoredUsers();
    console.log('Available users:', users);
    console.log('Looking for:', { email, role });
    
    const user = users.find(u => u.email === email && u.role === role);
    console.log('Found user:', user);
    
    if (!user) {
      console.error('User not found! Available emails:', users.map(u => `${u.email} (${u.role})`));
      throw new Error('Invalid credentials');
    }
    
    try {
      const token = await generateToken(user);
      console.log('Generated token:', token);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      }
      
      console.log('Login successful for user:', user.email);
      return { user, token };
    } catch (tokenError) {
      console.error('Token generation failed:', tokenError);
      throw new Error('Authentication failed - token generation error');
    }
  },

  async logout(): Promise<void> {
    await delay(300);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  },

  async getRequests(userId?: string): Promise<VacationRequest[]> {
    await delay(600);
    initializeMockData();
    
    const requests = getStoredRequests();
    return userId ? requests.filter(r => r.employeeId === userId) : requests;
  },

  async createRequest(request: Omit<VacationRequest, 'id' | 'employeeId' | 'employeeName' | 'status' | 'createdAt' | 'updatedAt'>, user: User): Promise<VacationRequest> {
    await delay(700);
    
    const newRequest: VacationRequest = {
      ...request,
      id: generateId(),
      employeeId: user.id,
      employeeName: user.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const requests = getStoredRequests();
    requests.push(newRequest);
    storeRequests(requests);
    
    return newRequest;
  },

  async updateRequest(id: string, updates: Partial<VacationRequest>): Promise<VacationRequest> {
    await delay(600);
    
    const requests = getStoredRequests();
    const index = requests.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Request not found');
    }
    
    requests[index] = {
      ...requests[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    storeRequests(requests);
    return requests[index];
  },

  async deleteRequest(id: string): Promise<void> {
    await delay(500);
    
    const requests = getStoredRequests();
    const filteredRequests = requests.filter(r => r.id !== id);
    storeRequests(filteredRequests);
  },

  async approveRequest(id: string, comment?: string): Promise<VacationRequest> {
    return this.updateRequest(id, {
      status: 'approved',
      managerComment: comment,
    });
  },

  async rejectRequest(id: string, comment: string): Promise<VacationRequest> {
    return this.updateRequest(id, {
      status: 'rejected',
      managerComment: comment,
    });
  },

  async register(name: string, email: string, password: string, role: 'employee' | 'manager'): Promise<{ user: User; token: string }> {
    await delay(900);
    
    const users = getStoredUsers();
    
    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }
    
    const newUser: User = {
      id: generateId(),
      name,
      email,
      role,
    };
    
    users.push(newUser);
    storeUsers(users);
    
    const token = await generateToken(newUser);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }
    
    return { user: newUser, token };
  },

  async getStoredAuth(): Promise<{ user: User | null; token: string | null }> {
    if (typeof window === 'undefined') {
      return { user: null, token: null };
    }
    
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      return { user: null, token: null };
    }

    // Verify and decode JWT token
    const payload = await jwt.verify(token);
    if (!payload) {
      // Token is invalid or expired, remove it
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      return { user: null, token: null };
    }

    // Reconstruct user from JWT payload
    const user: User = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.email.split('@')[0] // Fallback name from email
    };

    // Get actual user data from stored users to get full name
    const users = getStoredUsers();
    const fullUser = users.find(u => u.id === payload.userId);
    if (fullUser) {
      user.name = fullUser.name;
    }
    
    return { user, token };
  },

  async validateToken(token: string): Promise<boolean> {
    const result = await jwt.verify(token);
    return result !== null;
  },

  async refreshToken(token: string): Promise<string | null> {
    const payload = await jwt.verify(token);
    if (!payload) return null;

    // Generate new token with same payload
    return await jwt.sign({
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    }, '24h');
  },
};

// Expose debug functions to window for browser console debugging
if (typeof window !== 'undefined') {
  (window as any).mockApi = mockApi;
  (window as any).resetUsers = mockApi.resetUsers;
}