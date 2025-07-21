'use client';

import { useState, useEffect } from 'react';
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
import { VacationRequest } from '@/types';

interface EditRequestModalProps {
  request: VacationRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditRequestModal: React.FC<EditRequestModalProps> = ({
  request,
  open,
  onOpenChange,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState<'full' | 'reason'>('full');
  const { updateRequest, updateRequestReason, isLoading } = useVacation();

  useEffect(() => {
    if (request) {
      setStartDate(request.startDate);
      setEndDate(request.endDate);
      setReason(request.reason);
      setError('');
    }
  }, [request]);

  const resetForm = () => {
    setError('');
    setEditMode('full');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!request) return;

    if (editMode === 'reason') {
      if (reason.length < 10) {
        setError('Reason must be at least 10 characters long');
        return;
      }

      try {
        await updateRequestReason(request.id, reason);
        handleClose();
      } catch (_err) {
        setError('Failed to update reason. Please try again.');
      }
      return;
    }

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
      await updateRequest(request.id, {
        startDate,
        endDate,
        reason,
      });
      handleClose();
    } catch (_err) {
      setError('Failed to update request. Please try again.');
    }
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Vacation Request</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={editMode === 'full' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setEditMode('full')}
            >
              Full Edit
            </Button>
            <Button
              type="button"
              variant={editMode === 'reason' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setEditMode('reason')}
            >
              Edit Reason Only
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {editMode === 'full' && (
              <>
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
              </>
            )}

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
                    Updating...
                  </div>
                ) : (
                  'Update Request'
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};