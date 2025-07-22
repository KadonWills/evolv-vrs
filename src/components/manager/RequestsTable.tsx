'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { CheckIcon, XIcon, CalendarIcon, UserIcon, FilterIcon } from '@/components/ui/icons';
import { Pagination } from '@/components/ui/pagination';
import { FilterControls } from './FilterControls';
import { ApprovalModal } from './ApprovalModal';
import { useVacation } from '@/contexts/VacationContext';
import { VacationRequest, SickLeaveRequest, FilterState, PaginationState } from '@/types';

export const RequestsTable: React.FC = () => {
  const { requests, sickLeaveRequests, isLoading } = useVacation();
  const [filters, setFilters] = useState<FilterState>({ status: 'all' });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [modalState, setModalState] = useState<{
    request: VacationRequest | SickLeaveRequest | null;
    requestType: 'vacation' | 'sickLeave' | null;
    action: 'approve' | 'reject' | null;
    open: boolean;
  }>({
    request: null,
    requestType: null,
    action: null,
    open: false,
  });

  const filteredRequests = useMemo(() => {
    // Combine vacation and sick leave requests with type information
    const allRequests = [
      ...requests.map(req => ({ ...req, requestType: 'vacation' as const })),
      ...sickLeaveRequests.map(req => ({ ...req, requestType: 'sickLeave' as const }))
    ];

    let filtered = allRequests;

    if (filters.status !== 'all') {
      filtered = filtered.filter(request => request.status === filters.status);
    }

    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [requests, sickLeaveRequests, filters]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return filteredRequests.slice(startIndex, endIndex);
  }, [filteredRequests, pagination]);

  const totalPages = Math.ceil(filteredRequests.length / pagination.limit);

  const handleApprovalAction = (request: VacationRequest | SickLeaveRequest, requestType: 'vacation' | 'sickLeave', action: 'approve' | 'reject') => {
    setModalState({
      request,
      requestType,
      action,
      open: true,
    });
  };

  const closeModal = () => {
    setModalState({
      request: null,
      requestType: null,
      action: null,
      open: false,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const changePage = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const changeItemsPerPage = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Team Time-Off Requests
          </h2>
          <p className="text-muted-foreground mt-1">
            Review and manage vacation and sick leave requests from your team
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <FilterIcon size={16} className="text-muted-foreground" />
          <span className="text-muted-foreground">
            Showing {paginatedRequests.length} of {filteredRequests.length} requests
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <Card className="p-6" hover>
        <FilterControls filters={filters} onFiltersChange={setFilters} />
      </Card>

      {/* Empty State */}
      {filteredRequests.length === 0 ? (
        <Card className="text-center py-16 animate-scale-in" hover>
          <CardContent>
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-elevated">
              <CalendarIcon size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {filters.status === 'all' 
                ? 'No time-off requests found' 
                : `No ${filters.status} requests found`
              }
            </h3>
            <p className="text-muted-foreground">
              {filters.status === 'all' 
                ? 'Team members haven\'t submitted any vacation or sick leave requests yet.'
                : `Try adjusting your filters to see more requests.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Requests Grid */}
          <div className="grid gap-6">
            {paginatedRequests.map((request, index) => (
              <Card 
                key={request.id}
                className="animate-slide-in shadow-elevated" 
                style={{animationDelay: `${index * 100}ms`}}
                hover
              >
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <UserIcon size={20} className="text-primary" />
                        <CardTitle className="text-xl">
                          {request.employeeName}
                        </CardTitle>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.requestType === 'vacation' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400' 
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400'
                        }`}>
                          {request.requestType === 'vacation' ? 'Vacation' : `Sick Leave (${(request as SickLeaveRequest).type})`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <CalendarIcon size={16} />
                        <span className="text-sm">
                          {request.requestType === 'vacation' ? (
                            `${formatDate((request as VacationRequest).startDate)} - ${formatDate((request as VacationRequest).endDate)}`
                          ) : (
                            `${(request as SickLeaveRequest).numberOfDays} day${(request as SickLeaveRequest).numberOfDays !== 1 ? 's' : ''}`
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Requested on {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={request.status} size="lg" />
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <p className="font-medium text-sm text-muted-foreground mb-2">Reason:</p>
                      <p className="text-foreground leading-relaxed">{request.reason}</p>
                    </div>

                    {request.managerComment && (
                      <div className="p-4 bg-accent/50 rounded-xl border border-accent">
                        <p className="font-medium text-sm text-muted-foreground mb-2">Your Comment:</p>
                        <p className="text-foreground leading-relaxed">{request.managerComment}</p>
                      </div>
                    )}

                    {request.status === 'pending' && (
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-border/50">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApprovalAction(request, request.requestType, 'approve')}
                          className="gap-2"
                        >
                          <CheckIcon size={16} />
                          Approve Request
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleApprovalAction(request, request.requestType, 'reject')}
                          className="gap-2"
                        >
                          <XIcon size={16} />
                          Reject Request
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {filteredRequests.length > 0 && (
            <Card className="p-6" hover>
              <Pagination
                currentPage={pagination.page}
                totalPages={totalPages}
                totalItems={filteredRequests.length}
                itemsPerPage={pagination.limit}
                onPageChange={changePage}
                onItemsPerPageChange={changeItemsPerPage}
                showItemsPerPage={true}
              />
            </Card>
          )}
        </>
      )}

      <ApprovalModal
        request={modalState.request}
        requestType={modalState.requestType}
        action={modalState.action}
        open={modalState.open}
        onOpenChange={closeModal}
      />
    </div>
  );
};