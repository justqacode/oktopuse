import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader,
  IconReportMoney,
} from '@tabler/icons-react';
import formatDate from '@/utils/format-date';

// Types
interface PaymentPreview {
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
  amount: string;
  paymentMethod: string;
  purpose: string;
}

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requests: PaymentPreview | null;
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function RentHistoryPreviewModal({ open, onOpenChange, requests }: PreviewModalProps) {
  if (!requests) {
    return null;
  }

  const getStatusIcon = () => {
    if (requests.status === 'completed') {
      return <IconCircleCheckFilled className='fill-green-500 dark:fill-green-400 h-5 w-5' />;
    } else if (requests.status === 'rejected') {
      return <IconCircleXFilled className='fill-red-500 dark:fill-red-400 h-5 w-5' />;
    } else {
      return <IconLoader className='h-5 w-5' />;
    }
  };

  const getStatusColor = () => {
    switch (requests.status) {
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
            <span>Payment Details</span>
            <Badge
              variant='outline'
              className={`${getStatusColor()} px-3 py-1 flex items-center gap-2`}
            >
              {getStatusIcon()}
              {capitalizeFirstLetter(requests.status)}
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
              {/* <Calendar className='h-5 w-5 text-muted-foreground mt-0.5' /> */}
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Date </p>
                <p className='text-base font-semibold'>{formatDate(requests.date)}</p>
              </div>
            </div>

            {/* Category */}
            <div className='flex items-start gap-3 p-4 border rounded-lg bg-muted/30'>
              {/* <IconReportMoney className='h-5 w-5 text-muted-foreground mt-0.5' /> */}
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Amount</p>
                <p className='text-base font-semibold'>{requests.amount}</p>
              </div>
            </div>

            {/* Payment method */}
            <div className='flex items-start gap-3 p-4 border rounded-lg bg-muted/30'>
              {/* <Payment className='h-5 w-5 text-muted-foreground mt-0.5' /> */}
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Payment Method</p>
                <p className='text-base font-semibold'>{requests.paymentMethod}</p>
              </div>
            </div>

            {/* Purpose */}
            <div className='flex items-start gap-3 p-4 border rounded-lg bg-muted/30'>
              {/* <Payment className='h-5 w-5 text-muted-foreground mt-0.5' /> */}
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Purpose</p>
                <p className='text-base font-semibold'>{requests.purpose}</p>
              </div>
            </div>

            {/* Tenant */}
            {/* <div className='flex items-start gap-3 p-4 border rounded-lg bg-muted/30'>
              <User className='h-5 w-5 text-muted-foreground mt-0.5' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Address</p>
                <p className='text-base font-semibold'>{`${
                  requests?.propertyDetails?.address?.street || 'N/A'
                }, ${requests?.propertyDetails?.address?.city || 'N/A'}, ${
                  requests?.propertyDetails?.address?.state || 'N/A'
                }`}</p>
              </div>
            </div> */}
          </div>

          {/* Description */}
          {requests.description && (
            <div className='space-y-2'>
              <h3 className='text-sm font-semibold text-foreground'>Description</h3>
              <div className='p-4 border rounded-lg bg-muted/30'>
                <p className='text-sm leading-relaxed'>{requests.description}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RentHistoryPreviewModal;
