'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { PlusIcon, CalendarIcon, EditIcon, TrashIcon } from '@/components/ui/icons';
import { RequestVacationModal } from './RequestVacationModal';
import { EditRequestModal } from './EditRequestModal';
import { useVacation } from '@/contexts/VacationContext';
import { VacationRequest } from '@/types';

export const VacationRequestList: React.FC = () => {
  const { requests, isLoading, deleteRequest } = useVacation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState<VacationRequest | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await deleteRequest(id);
      } catch (error) {
        console.error('Failed to delete request:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
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
            My Vacation Requests
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your time off requests and track their status
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          size="lg"
          className="gap-2 shadow-elevated"
        >
          <PlusIcon size={18} />
          Request Vacation
        </Button>
      </div>

      {/* Empty State */}
      {requests.length === 0 ? (
        <Card className="text-center py-16 animate-scale-in" hover>
          <CardContent>
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-elevated">
              <CalendarIcon size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No vacation requests yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start planning your time off by creating your first vacation request. 
              It&apos;s quick and easy!
            </p>
            <Button 
              onClick={() => setShowCreateModal(true)}
              size="lg"
              className="gap-2"
            >
              <PlusIcon size={18} />
              Create Your First Request
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Requests Grid */
        <div className="grid gap-6">
          {requests.map((request, index) => (
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
                      <CalendarIcon size={20} className="text-primary" />
                      <CardTitle className="text-xl">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
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
                      <p className="font-medium text-sm text-muted-foreground mb-2">Manager Comment:</p>
                      <p className="text-foreground leading-relaxed">{request.managerComment}</p>
                    </div>
                  )}

                  {request.status === 'pending' && (
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-border/50">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingRequest(request)}
                        className="gap-2"
                      >
                        <EditIcon size={16} />
                        Edit Request
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(request.id)}
                        className="gap-2"
                      >
                        <TrashIcon size={16} />
                        Cancel Request
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <RequestVacationModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      <EditRequestModal
        request={editingRequest}
        open={!!editingRequest}
        onOpenChange={(open) => !open && setEditingRequest(null)}
      />
    </div>
  );
};