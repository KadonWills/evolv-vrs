'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useVacation } from '@/contexts/VacationContext';

interface RequestVacationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RequestVacationModal: React.FC<RequestVacationModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const { createRequest, isLoading } = useVacation();

  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setReason('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate || !reason) {
      setError('Please fill in all fields');
      return;
    }

    if (reason.length < 10) {
      setError('Reason must be at least 10 characters long');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (startDate < today) {
      setError('Start date must be today or in the future');
      return;
    }

    if (endDate <= startDate) {
      setError('End date must be after start date');
      return;
    }

    try {
      await createRequest({
        startDate,
        endDate,
        reason,
      });
      handleClose();
    } catch (err) {
      setError('Failed to create request. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Vacation Time</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason (minimum 10 characters)
            </label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for your vacation request..."
              rows={4}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {reason.length}/10 characters minimum
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Submitting...
                </div>
              ) : (
                'Submit Request'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};