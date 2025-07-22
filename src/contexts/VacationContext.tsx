'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { VacationRequest, SickLeaveRequest, VacationContextType } from '@/types';
import { mockApi } from '@/lib/mockApi';
import { useAuth } from './AuthContext';
import { useToastContext } from './ToastContext';

const VacationContext = createContext<VacationContextType | undefined>(undefined);

export const useVacation = () => {
  const context = useContext(VacationContext);
  if (context === undefined) {
    throw new Error('useVacation must be used within a VacationProvider');
  }
  return context;
};

export const VacationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const toast = useToastContext();
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [sickLeaveRequests, setSickLeaveRequests] = useState<SickLeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshRequests = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [fetchedRequests, fetchedSickLeaveRequests] = await Promise.all([
        mockApi.getRequests(user.role === 'employee' ? user.id : undefined),
        mockApi.getSickLeaveRequests(user.role === 'employee' ? user.id : undefined)
      ]);
      setRequests(fetchedRequests);
      setSickLeaveRequests(fetchedSickLeaveRequests);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshRequests();
  }, [user, refreshRequests]);

  const createRequest = async (requestData: Omit<VacationRequest, 'id' | 'employeeId' | 'employeeName' | 'status' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      const newRequest = await mockApi.createRequest(requestData, user);
      setRequests(prev => [...prev, newRequest]);
      toast.success('Request Created', 'Your vacation request has been submitted successfully.');
    } catch (error) {
      toast.error('Creation Failed', 'Unable to create vacation request. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequest = async (id: string, updates: Partial<VacationRequest>) => {
    setIsLoading(true);
    try {
      const updatedRequest = await mockApi.updateRequest(id, updates);
      setRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
      toast.success('Request Updated', 'Your vacation request has been updated successfully.');
    } catch (error) {
      toast.error('Update Failed', 'Unable to update vacation request. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequestReason = async (id: string, reason: string) => {
    await updateRequest(id, { reason });
  };

  const deleteRequest = async (id: string) => {
    setIsLoading(true);
    try {
      await mockApi.deleteRequest(id);
      setRequests(prev => prev.filter(req => req.id !== id));
      toast.success('Request Cancelled', 'Your vacation request has been cancelled successfully.');
    } catch (error) {
      toast.error('Cancellation Failed', 'Unable to cancel vacation request. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const approveRequest = async (id: string, comment?: string) => {
    setIsLoading(true);
    try {
      const updatedRequest = await mockApi.approveRequest(id, comment);
      setRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
      toast.success('Request Approved', `Vacation request for ${updatedRequest.employeeName} has been approved.`);
    } catch (error) {
      toast.error('Approval Failed', 'Unable to approve vacation request. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectRequest = async (id: string, comment: string) => {
    setIsLoading(true);
    try {
      const updatedRequest = await mockApi.rejectRequest(id, comment);
      setRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
      toast.success('Request Rejected', `Vacation request for ${updatedRequest.employeeName} has been rejected.`);
    } catch (error) {
      toast.error('Rejection Failed', 'Unable to reject vacation request. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createSickLeaveRequest = async (requestData: Omit<SickLeaveRequest, 'id' | 'employeeId' | 'employeeName' | 'status' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      const newRequest = await mockApi.createSickLeaveRequest(requestData, user);
      setSickLeaveRequests(prev => [...prev, newRequest]);
      toast.success('Request Created', 'Your sick leave request has been submitted successfully.');
    } catch (error) {
      toast.error('Creation Failed', 'Unable to create sick leave request. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSickLeaveRequest = async (id: string) => {
    setIsLoading(true);
    try {
      await mockApi.deleteSickLeaveRequest(id);
      setSickLeaveRequests(prev => prev.filter(req => req.id !== id));
      toast.success('Request Cancelled', 'Your sick leave request has been cancelled successfully.');
    } catch (error) {
      toast.error('Cancellation Failed', 'Unable to cancel sick leave request. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const approveSickLeaveRequest = async (id: string, comment?: string) => {
    setIsLoading(true);
    try {
      const updatedRequest = await mockApi.approveSickLeaveRequest(id, comment);
      setSickLeaveRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
      toast.success('Request Approved', `Sick leave request for ${updatedRequest.employeeName} has been approved.`);
    } catch (error) {
      toast.error('Approval Failed', 'Unable to approve sick leave request. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectSickLeaveRequest = async (id: string, comment: string) => {
    setIsLoading(true);
    try {
      const updatedRequest = await mockApi.rejectSickLeaveRequest(id, comment);
      setSickLeaveRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
      toast.success('Request Rejected', `Sick leave request for ${updatedRequest.employeeName} has been rejected.`);
    } catch (error) {
      toast.error('Rejection Failed', 'Unable to reject sick leave request. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: VacationContextType = {
    requests,
    sickLeaveRequests,
    isLoading,
    createRequest,
    createSickLeaveRequest,
    updateRequest,
    updateRequestReason,
    deleteRequest,
    deleteSickLeaveRequest,
    approveRequest,
    rejectRequest,
    approveSickLeaveRequest,
    rejectSickLeaveRequest,
    refreshRequests,
  };

  return <VacationContext.Provider value={value}>{children}</VacationContext.Provider>;
};