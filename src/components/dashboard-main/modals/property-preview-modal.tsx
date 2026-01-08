import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, Tag, Image as ImageIcon, Currency } from 'lucide-react';
import formatDate from '@/utils/format-date';
import { formatCurrency } from '@/utils/format-currency';
import { IconCurrency, IconCurrencyDollar } from '@tabler/icons-react';

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

export function PropertyPreviewModal({ open, onOpenChange, requests }: any) {
  const request = requests;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold flex items-center justify-between'>
            <span>Property Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6 mt-4'>
          {/* Request ID */}
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span className='font-medium'>Property name:</span>
            <code className='bg-muted px-2 py-1 rounded'>{requests.name}</code>
          </div>

          {/* Grid Info */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Date Submitted */}
            <div className='flex items-start gap-3 p-4 border rounded-lg bg-muted/30'>
              <Calendar className='h-5 w-5 text-muted-foreground mt-0.5' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Date Submitted</p>
                <p className='text-base font-semibold'>{formatDate(request?.createdAt)}</p>
              </div>
            </div>

            {/* Category */}
            <div className='flex items-start gap-3 p-4 border rounded-lg bg-muted/30'>
              <Tag className='h-5 w-5 text-muted-foreground mt-0.5' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Property Type</p>
                <p className='text-base font-semibold'>{request?.propertyType}</p>
              </div>
            </div>

            {/* Property */}
            <div className='flex items-start gap-3 p-4 border rounded-lg bg-muted/30'>
              <IconCurrencyDollar className='h-5 w-5 text-muted-foreground mt-0.5' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Amount</p>
                <p className='text-base font-semibold'>
                  {formatCurrency(request?.amount) || 'N/A'}
                </p>
              </div>
            </div>

            {/* Tenant */}
            <div className='flex items-start gap-3 p-4 border rounded-lg bg-muted/30'>
              <MapPin className='h-5 w-5 text-muted-foreground mt-0.5' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Address</p>
                <p className='text-base font-semibold'>{`${request?.address?.street || 'N/A'}, ${
                  request?.address?.city || 'N/A'
                }, ${request?.address?.state || 'N/A'}`}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {request?.description && (
            <div className='space-y-2'>
              <h3 className='text-sm font-semibold text-foreground'>Description</h3>
              <div className='p-4 border rounded-lg bg-muted/30'>
                <p className='text-sm leading-relaxed'>{request?.description}</p>
              </div>
            </div>
          )}

          {/* Preferred Date & Time */}
          {(request?.preferredDate || request?.preferredTime) && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {request?.preferredDate && (
                <div className='flex items-start gap-3 p-4 border rounded-lg'>
                  <Calendar className='h-5 w-5 text-muted-foreground mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>Preferred Date</p>
                    <p className='text-base font-semibold'>{request?.preferredDate}</p>
                  </div>
                </div>
              )}

              {request?.preferredTime && (
                <div className='flex items-start gap-3 p-4 border rounded-lg'>
                  <Clock className='h-5 w-5 text-muted-foreground mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>Preferred Time</p>
                    <p className='text-base font-semibold'>
                      {request?.preferredTime.charAt(0).toUpperCase() +
                        request?.preferredTime.slice(1)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Allow Entry */}
          {request?.allowEntry !== undefined && (
            <div className='flex items-center gap-3 p-4 border rounded-lg'>
              <div className='flex-1'>
                <p className='text-sm font-medium'>Management Access Permission</p>
                <p className='text-sm text-muted-foreground mt-1'>
                  Allow management to enter unit when tenant is out
                </p>
              </div>
              <Badge variant={request?.allowEntry ? 'default' : 'secondary'} className='px-3 py-1'>
                {request?.allowEntry ? 'Yes' : 'No'}
              </Badge>
            </div>
          )}

          {/* Images */}
          {/* {request?.images && request?.images.length > 0 && (
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <ImageIcon className='h-5 w-5 text-muted-foreground' />
                <h3 className='text-sm font-semibold'>
                  Attached Images ({request?.images.length})
                </h3>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                {request?.images.map((image, index) => (
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
          )} */}

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

export default PropertyPreviewModal;
