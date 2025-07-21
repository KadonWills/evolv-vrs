'use client';

import { Badge } from '@/components/ui/badge';
import { ClockIcon, CheckIcon, XIcon } from '@/components/ui/icons';
import { VacationRequest } from '@/types';

interface StatusBadgeProps {
  status: VacationRequest['status'];
  size?: 'default' | 'sm' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'default' }) => {
  const getVariantAndIcon = () => {
    switch (status) {
      case 'pending':
        return {
          variant: 'pending' as const,
          icon: <ClockIcon size={12} />,
          label: 'Pending'
        };
      case 'approved':
        return {
          variant: 'approved' as const,
          icon: <CheckIcon size={12} />,
          label: 'Approved'
        };
      case 'rejected':
        return {
          variant: 'rejected' as const,
          icon: <XIcon size={12} />,
          label: 'Rejected'
        };
      default:
        return {
          variant: 'default' as const,
          icon: null,
          label: 'Unknown'
        };
    }
  };

  const { variant, icon, label } = getVariantAndIcon();

  return (
    <Badge variant={variant} size={size} icon={icon}>
      {label}
    </Badge>
  );
};