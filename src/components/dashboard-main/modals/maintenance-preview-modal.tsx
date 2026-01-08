import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, Tag, Image as ImageIcon } from 'lucide-react';
import { IconCircleCheckFilled, IconCircleXFilled, IconLoader } from '@tabler/icons-react';
import formatDate from '@/utils/format-date';

// Types
interface MaintenanceRequestPreview {
  id: string;
  date: string;
  createdAt: string;
  propertyDetails: {
    name: string;
    propertyType: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  category: string;
  status: string;
  description?: string;
  preferredDate?: string;
  preferredTime?: string;
  images?: string[];
  allowEntry?: boolean;
}

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requests: {
    id: string;
    date: string;
    property: MaintenanceRequestPreview | null;
  };
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function MaintenanceRequestPreviewModal({
  open,
  onOpenChange,
  requests,
}: PreviewModalProps) {
  const request = requests?.property;
  if (!request) return null;

  const getStatusIcon = () => {
    if (request.status === 'completed') {
      return <IconCircleCheckFilled className='fill-green-500 dark:fill-green-400 h-5 w-5' />;
    } else if (request.status === 'rejected') {
      return <IconCircleXFilled className='fill-red-500 dark:fill-red-400 h-5 w-5' />;
    } else {
      return <IconLoader className='h-5 w-5' />;
    }
  };

  const getStatusColor = () => {
    switch (request.status) {
      case 'completed':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
      case 'rejected':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
      case 'in-progress':
        return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold flex items-center justify-between'>
            <span>Maintenance Request Details</span>
            <Badge
              variant='outline'
              className={`${getStatusColor()} px-3 py-1 flex items-center gap-2`}
            >
              {getStatusIcon()}
              {capitalizeFirstLetter(request.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6 mt-4'>
          {/* Request ID */}
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span className='font-medium'>Request ID:</span>
            <code className='bg-muted px-2 py-1 rounded'>{requests.id}</code>
          </div>

          {/* Grid Info */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Date Submitted */}
            <div className='flex items-start gap-3 p-4 border rounded-lg bg-muted/30'>
              <Calendar className='h-5 w-5 text-muted-foreground mt-0.5' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Date Submitted</p>
                <p className='text-base font-semibold'>{formatDate(request.createdAt)}</p>
              </div>
            </div>

            {/* Category */}
            <div className='flex items-start gap-3 p-4 border rounded-lg bg-muted/30'>
              <Tag className='h-5 w-5 text-muted-foreground mt-0.5' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Category</p>
                <p className='text-base font-semibold'>{request.category}</p>
              </div>
            </div>

            {/* Property */}
            <div className='flex items-start gap-3 p-4 border rounded-lg bg-muted/30'>
              <MapPin className='h-5 w-5 text-muted-foreground mt-0.5' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Property</p>
                <p className='text-base font-semibold'>{request.propertyDetails?.name || 'N/A'}</p>
              </div>
            </div>

            {/* Tenant */}
            <div className='flex items-start gap-3 p-4 border rounded-lg bg-muted/30'>
              <User className='h-5 w-5 text-muted-foreground mt-0.5' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Address</p>
                <p className='text-base font-semibold'>{`${
                  request?.propertyDetails?.address?.street || 'N/A'
                }, ${request?.propertyDetails?.address?.city || 'N/A'}, ${
                  request?.propertyDetails?.address?.state || 'N/A'
                }`}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {request.description && (
            <div className='space-y-2'>
              <h3 className='text-sm font-semibold text-foreground'>Description</h3>
              <div className='p-4 border rounded-lg bg-muted/30'>
                <p className='text-sm leading-relaxed'>{request.description}</p>
              </div>
            </div>
          )}

          {/* Preferred Date & Time */}
          {(request.preferredDate || request.preferredTime) && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {request.preferredDate && (
                <div className='flex items-start gap-3 p-4 border rounded-lg'>
                  <Calendar className='h-5 w-5 text-muted-foreground mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>Preferred Date</p>
                    <p className='text-base font-semibold'>{request.preferredDate}</p>
                  </div>
                </div>
              )}

              {request.preferredTime && (
                <div className='flex items-start gap-3 p-4 border rounded-lg'>
                  <Clock className='h-5 w-5 text-muted-foreground mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>Preferred Time</p>
                    <p className='text-base font-semibold'>
                      {request.preferredTime.charAt(0).toUpperCase() +
                        request.preferredTime.slice(1)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Allow Entry */}
          {request.allowEntry !== undefined && (
            <div className='flex items-center gap-3 p-4 border rounded-lg'>
              <div className='flex-1'>
                <p className='text-sm font-medium'>Management Access Permission</p>
                <p className='text-sm text-muted-foreground mt-1'>
                  Allow management to enter unit when tenant is out
                </p>
              </div>
              <Badge variant={request.allowEntry ? 'default' : 'secondary'} className='px-3 py-1'>
                {request.allowEntry ? 'Yes' : 'No'}
              </Badge>
            </div>
          )}

          {/* Images */}
          {request.images && request.images.length > 0 && (
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <ImageIcon className='h-5 w-5 text-muted-foreground' />
                <h3 className='text-sm font-semibold'>Attached Images ({request.images.length})</h3>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                {request.images.map((image, index) => (
                  <div
                    key={index}
                    className='aspect-video bg-muted rounded-lg overflow-hidden border'
                  >
                    <img
                      src={image}
                      alt={`Maintenance image ${index + 1}`}
                      className='w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer'
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {/* <div className='flex justify-end gap-2 pt-4 border-t'>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {request.status === 'pending' && (
              <>
                <Button variant='destructive'>Reject</Button>
                <Button>Approve</Button>
              </>
            )}
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MaintenanceRequestPreviewModal;
