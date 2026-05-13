import { DataTable } from '@/components/data-table';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { usersTableColumnLandlord } from '@/components/dashboard-main/columns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DollarSign } from 'lucide-react';

// ================== QUERIES & MUTATIONS ==================
const GET_ALL_TENANTS_MANAGER = gql`
  query GetMyTenants {
    getMyTenants {
      firstName
      lastName
      email
      phone
      status
      verificationStatus
      role
      notificationPreferences
      oktoID
      createdAt
      updatedAt
      id
    }
  }
`;

interface PayStakeHolderResponse {
  payStakeHolder: {
    id: string;
    date: string;
    receiverID: string;
    note: string;
    purpose: string;
    status: string;
    paymentInitiatedBy: string;
    merchantPayRef: string;
    paymentMethod: string;
  };
}

const PAY_STAKEHOLDER_MUTATION = gql`
  mutation PayStakeHolder(
    $amountReceived: Float!
    $receiverID: ID!
    $note: String!
    $paymentMethod: String!
  ) {
    payStakeHolder(
      amountReceived: $amountReceived
      receiverID: $receiverID
      note: $note
      paymentMethod: $paymentMethod
    ) {
      id
      date
      receiverID
      note
      purpose
      status
      paymentInitiatedBy
      merchantPayRef
      paymentMethod
    }
  }
`;

// ================== SCHEMA ==================
const paySchema = z.object({
  amountReceived: z
    .string()
    .min(1, { message: 'Amount is required' })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be a positive number',
    }),
  paymentMethod: z.string().min(1, { message: 'Please select a payment method' }),
  note: z.string().min(1, { message: 'Please add a note' }),
});

type PayFormValues = z.infer<typeof paySchema>;

// ================== PAY LANDLORD MODAL ==================
interface PayLandlordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  landlord: { id: string; firstName: string; lastName: string; email: string } | null;
}

function PayLandlordModal({ open, onOpenChange, landlord }: PayLandlordModalProps) {
  const [payStakeHolder, { loading }] = useMutation(PAY_STAKEHOLDER_MUTATION);

  const form = useForm<PayFormValues>({
    resolver: zodResolver(paySchema),
    defaultValues: {
      amountReceived: '',
      paymentMethod: '',
      note: '',
    },
  });

  const onSubmit = async (data: PayFormValues) => {
    if (!landlord) return;

    try {
      const { data: result } = (await payStakeHolder({
        variables: {
          amountReceived: parseFloat(data.amountReceived),
          receiverID: landlord.id,
          paymentMethod: data.paymentMethod,
          note: data.note,
        },
      })) as { data: PayStakeHolderResponse };

      if (result?.payStakeHolder) {
        toast.success(
          `Payment to ${landlord.firstName} ${landlord.lastName} initiated successfully`,
        );
        form.reset();
        onOpenChange(false);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Payment failed. Please try again.');
    }
  };

  const handleClose = (val: boolean) => {
    if (!val) form.reset();
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-xl font-bold'>
            <DollarSign className='h-5 w-5' />
            Pay Landlord
          </DialogTitle>
          {landlord && (
            <DialogDescription className='text-base font-medium text-foreground pt-1'>
              {landlord.firstName} {landlord.lastName}
              <span className='block text-sm text-muted-foreground font-normal'>
                {landlord.email}
              </span>
            </DialogDescription>
          )}
        </DialogHeader>

        <Form {...form}>
          <div className='space-y-5'>
            {/* Amount */}
            <FormField
              control={form.control}
              name='amountReceived'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount *</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm'>
                        $
                      </span>
                      <Input
                        type='number'
                        step='0.01'
                        min='0'
                        placeholder='0.00'
                        className='pl-7'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Method */}
            <FormField
              control={form.control}
              name='paymentMethod'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select payment method' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='ACH'>ACH</SelectItem>
                      <SelectItem value='Wire'>Wire Transfer</SelectItem>
                      <SelectItem value='Check'>Check</SelectItem>
                      <SelectItem value='Credit Card'>Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Note */}
            <FormField
              control={form.control}
              name='note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='e.g. All good, rent for April...'
                      className='min-h-[80px] resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleClose(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type='button' onClick={form.handleSubmit(onSubmit)} disabled={loading}>
                {loading ? (
                  <span className='flex items-center gap-2'>
                    <span className='animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full' />
                    Processing...
                  </span>
                ) : (
                  <>
                    <DollarSign className='h-4 w-4 mr-1' />
                    Confirm Payment
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ================== PAGE ==================
export default function LandlordPage() {
  const [selectedLandlord, setSelectedLandlord] = useState<any | null>(null);
  const [payModalOpen, setPayModalOpen] = useState(false);

  const { data, loading } = useQuery<any>(GET_ALL_TENANTS_MANAGER, {
    fetchPolicy: 'cache-and-network',
  });

  const usersx = data?.getMyTenants || [];
  const users =
    usersx
      ?.filter((usr: any) => usr.role.includes('landlord'))
      ?.map((usr: any) => ({ ...usr, role: usr.role?.[0] || '' })) || [];

  const payLandlord = (request: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    setSelectedLandlord(request);
    setPayModalOpen(true);
  };

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <div className='py-4 lg:py-6 px-8'>
            <div className='flex justify-between text-lg font-semibold mb-2'>
              <p>Registered Landlords</p>
            </div>
            <DataTable
              columns={usersTableColumnLandlord(payLandlord as any)}
              data={users}
              enablePagination
              enableColumnVisibility
              enableSorting
              enableFiltering
              pageSize={10}
              loading={loading}
              emptyState='No registered users found.'
            />
          </div>
        </div>
      </div>

      <PayLandlordModal
        open={payModalOpen}
        onOpenChange={setPayModalOpen}
        landlord={selectedLandlord}
      />
    </div>
  );
}
