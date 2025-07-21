'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { VacationRequest, VacationContextType } from '@/types';
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
  const [isLoading, setIsLoading] = useState(false);

  const refreshRequests = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const fetchedRequests = await mockApi.getRequests(
        user.role === 'employee' ? user.id : undefined
      );
      setRequests(fetchedRequests);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshRequests();
  }, [user]);

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

  const value: VacationContextType = {
    requests,
    isLoading,
    createRequest,
    updateRequest,
    updateRequestReason,
    deleteRequest,
    approveRequest,
    rejectRequest,
    refreshRequests,
  };

  return <VacationContext.Provider value={value}>{children}</VacationContext.Provider>;
};