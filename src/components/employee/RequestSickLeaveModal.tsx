'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectItem } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useVacation } from '@/contexts/VacationContext';

interface RequestSickLeaveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RequestSickLeaveModal: React.FC<RequestSickLeaveModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [reason, setReason] = useState('');
  const [type, setType] = useState<'resting' | 'hospital'>('resting');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [error, setError] = useState('');
  const { createSickLeaveRequest, isLoading } = useVacation();

  const resetForm = () => {
    setReason('');
    setType('resting');
    setNumberOfDays('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!reason || !type || !numberOfDays) {
      setError('Please fill in all fields');
      return;
    }

    if (reason.length < 10) {
      setError('Reason must be at least 10 characters long');
      return;
    }

    const days = parseInt(numberOfDays);
    if (isNaN(days) || days < 1) {
      setError('Please select a valid number of days');
      return;
    }

    try {
      await createSickLeaveRequest({
        reason,
        type,
        numberOfDays: days,
      });
      handleClose();
    } catch {
      setError('Failed to create sick leave request. Please try again.');
    }
  };

  const getDayOptions = () => {
    if (type === 'resting') {
      return ['1', '3'];
    } else {
      return ['1', '3', '7'];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Sick Leave</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Reason (minimum 10 characters)
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for your sick leave request..."
              rows={4}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {reason.length}/10 characters minimum
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Type
            </label>
            <RadioGroup 
              value={type} 
              onValueChange={(value) => {
                setType(value as 'resting' | 'hospital');
                setNumberOfDays(''); // Reset days when type changes
              }}
            >
              <RadioGroupItem value="resting">
                Resting at home
              </RadioGroupItem>
              <RadioGroupItem value="hospital">
                Hospital treatment
              </RadioGroupItem>
            </RadioGroup>
          </div>

          <div>
            <label htmlFor="numberOfDays" className="block text-sm font-medium text-foreground mb-1">
              Number of Days
            </label>
            <Select
              value={numberOfDays}
              onValueChange={setNumberOfDays}
              placeholder="Select number of days"
            >
              {getDayOptions().map((day) => (
                <SelectItem key={day} value={day}>
                  {day} day{day !== '1' ? 's' : ''}
                </SelectItem>
              ))}
            </Select>
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