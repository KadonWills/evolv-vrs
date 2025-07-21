export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager';
}

export interface VacationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  managerComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, role: 'employee' | 'manager') => Promise<void>;
  register: (name: string, email: string, password: string, role: 'employee' | 'manager') => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  isLoading: boolean;
}

export interface VacationContextType {
  requests: VacationRequest[];
  isLoading: boolean;
  createRequest: (request: Omit<VacationRequest, 'id' | 'employeeId' | 'employeeName' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRequest: (id: string, request: Partial<VacationRequest>) => Promise<void>;
  updateRequestReason: (id: string, reason: string) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  approveRequest: (id: string, comment?: string) => Promise<void>;
  rejectRequest: (id: string, comment: string) => Promise<void>;
  refreshRequests: () => Promise<void>;
}

export interface FilterState {
  status: 'all' | 'pending' | 'approved' | 'rejected';
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}