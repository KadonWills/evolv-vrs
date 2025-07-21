'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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

interface ApprovalModalProps {
  request: VacationRequest | null;
  action: 'approve' | 'reject' | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  request,
  action,
  open,
  onOpenChange,
}) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const { approveRequest, rejectRequest, isLoading } = useVacation();

  const resetForm = () => {
    setComment('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!request || !action) return;

    if (action === 'reject' && !comment.trim()) {
      setError('A comment is required when rejecting a request');
      return;
    }

    try {
      if (action === 'approve') {
        await approveRequest(request.id, comment.trim() || undefined);
      } else {
        await rejectRequest(request.id, comment.trim());
      }
      handleClose();
    } catch (err) {
      setError(`Failed to ${action} request. Please try again.`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!request || !action) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === 'approve' ? 'Approve' : 'Reject'} Vacation Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Request Details:</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Employee:</strong> {request.employeeName}</p>
              <p><strong>Dates:</strong> {formatDate(request.startDate)} - {formatDate(request.endDate)}</p>
              <p><strong>Reason:</strong> {request.reason}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                {action === 'reject' ? 'Rejection Reason (Required)' : 'Comment (Optional)'}
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  action === 'reject'
                    ? 'Please provide a reason for rejection...'
                    : 'Add any comments for the employee...'
                }
                rows={4}
                required={action === 'reject'}
              />
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
              <Button
                type="submit"
                variant={action === 'approve' ? 'default' : 'destructive'}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    {action === 'approve' ? 'Approving...' : 'Rejecting...'}
                  </div>
                ) : (
                  action === 'approve' ? 'Approve Request' : 'Reject Request'
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};