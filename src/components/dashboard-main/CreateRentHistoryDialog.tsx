import { useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { toast } from 'sonner';
import { Plus, Trash2, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format-currency';

const GET_RECIPIENTS = gql`
  query GetMyTenantsForRentHistory {
    getMyTenants {
      id
      firstName
      lastName
      role
    }
  }
`;

export const GENERATE_RENT_HISTORY_PDF = gql`
  mutation GenerateRentHistoryPDF($input: RentHistoryPDFInput!) {
    generateRentHistoryPDF(input: $input) {
      _id
      docLink
    }
  }
`;

const METHODS = ['Cash', 'Check', 'ACH', 'Card', 'Zelle', 'Other'] as const;
const STATUSES = ['paid', 'pending', 'late', 'partial'] as const;

const entrySchema = z.object({
  date: z.string().min(1, 'Required'),
  amount: z.coerce.number().positive('Must be > 0'),
  method: z.string().min(1, 'Required'),
  status: z.string().min(1, 'Required'),
  note: z.string().optional(),
});

const schema = z.object({
  recipientID: z.string().min(1, 'Select a tenant or landlord'),
  propertyAddress: z.string().min(3, 'Property address is required'),
  periodStart: z.string().min(1, 'Required'),
  periodEnd: z.string().min(1, 'Required'),
  entries: z.array(entrySchema).min(1, 'Add at least one payment'),
  managementFee: z.coerce.number().min(0, 'Cannot be negative').default(0),
  miscellaneousFees: z.coerce.number().min(0, 'Cannot be negative').default(0),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

const emptyEntry = { date: '', amount: '' as unknown as number, method: 'ACH', status: 'paid', note: '' };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
};

export function CreateRentHistoryDialog({ open, onOpenChange, onCreated }: Props) {
  const { data } = useQuery<any>(GET_RECIPIENTS, { skip: !open });
  const recipients: any[] = data?.getMyTenants || [];

  const [generate, { loading }] = useMutation<any>(GENERATE_RENT_HISTORY_PDF);

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      recipientID: '',
      propertyAddress: '',
      periodStart: '',
      periodEnd: '',
      entries: [emptyEntry],
      managementFee: 0,
      miscellaneousFees: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'entries' });
  const watchedEntries = form.watch('entries');
  const total = useMemo(
    () => (watchedEntries || []).reduce((sum, e) => sum + (Number(e?.amount) || 0), 0),
    [watchedEntries],
  );
  const selectedRecipient = recipients.find((r) => r.id === form.watch('recipientID'));
  const selectedRoles = Array.isArray(selectedRecipient?.role)
    ? selectedRecipient.role
    : [selectedRecipient?.role];
  const isTenant = !!selectedRecipient && !selectedRoles.includes('landlord');
  const managementFee = isTenant ? 0 : Number(form.watch('managementFee')) || 0;
  const miscFees = Number(form.watch('miscellaneousFees')) || 0;
  const totalPayout = total - managementFee - miscFees;

  const onSubmit = async (values: FormOutput) => {
    const recipient = recipients.find((r) => r.id === values.recipientID);
    const roles = Array.isArray(recipient?.role) ? recipient.role : [recipient?.role];
    const recipientRole = roles.includes('landlord') ? 'landlord' : 'tenant';

    try {
      const res = await generate({
        variables: {
          input: {
            recipientID: values.recipientID,
            recipientRole,
            propertyAddress: values.propertyAddress,
            periodStart: values.periodStart,
            periodEnd: values.periodEnd,
            entries: values.entries.map((e) => ({ ...e, note: e.note || '' })),
            managementFee: recipientRole === 'tenant' ? 0 : values.managementFee,
            miscellaneousFees: values.miscellaneousFees,
          },
        },
      });
      const link = res.data?.generateRentHistoryPDF?.docLink;
      toast.success('Rent payment history PDF created');
      if (link) window.open(link, '_blank', 'noopener');
      form.reset();
      onOpenChange(false);
      onCreated?.();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to generate rent payment history');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-3xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5' /> Monthly Landlord Payment Statement
          </DialogTitle>
          <DialogDescription>
            The details below fill the PDF template, which is stored on Cloudinary and shared with
            the recipient.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='recipientID'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant / Landlord</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select recipient' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {recipients.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.firstName} {r.lastName} (
                          {Array.isArray(r.role) ? r.role[0] : r.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='propertyAddress'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property address</FormLabel>
                  <FormControl>
                    <Input placeholder='123 Main St, City, ST 00000' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='periodStart'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period start</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='periodEnd'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period end</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold'>Payments</p>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={() => append(emptyEntry)}
                >
                  <Plus className='mr-1 h-4 w-4' /> Add row
                </Button>
              </div>

              {fields.map((f, i) => (
                <div
                  key={f.id}
                  className='grid grid-cols-2 gap-2 rounded-lg border p-3 md:grid-cols-12'
                >
                  <FormField
                    control={form.control}
                    name={`entries.${i}.date`}
                    render={({ field }) => (
                      <FormItem className='md:col-span-3'>
                        <FormLabel className='text-xs'>Date</FormLabel>
                        <FormControl>
                          <Input type='date' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`entries.${i}.amount`}
                    render={({ field }) => (
                      <FormItem className='md:col-span-2'>
                        <FormLabel className='text-xs'>Rent Received</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            step='0.01'
                            min='0'
                            {...field}
                            value={(field.value as any) ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`entries.${i}.method`}
                    render={({ field }) => (
                      <FormItem className='md:col-span-2'>
                        <FormLabel className='text-xs'>Method</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {METHODS.map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`entries.${i}.status`}
                    render={({ field }) => (
                      <FormItem className='md:col-span-2'>
                        <FormLabel className='text-xs'>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s} className='capitalize'>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`entries.${i}.note`}
                    render={({ field }) => (
                      <FormItem className='col-span-2 md:col-span-2'>
                        <FormLabel className='text-xs'>Note</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ''} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className='flex items-end justify-end md:col-span-1'>
                    <Button
                      type='button'
                      size='icon'
                      variant='ghost'
                      disabled={fields.length === 1}
                      onClick={() => remove(i)}
                      aria-label='Remove row'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))}
              {form.formState.errors.entries?.message && (
                <p className='text-xs text-destructive'>{form.formState.errors.entries.message}</p>
              )}
              <div className={`grid gap-4 pt-2 ${isTenant ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {!isTenant && (
                  <FormField
                    control={form.control}
                    name='managementFee'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Management Fee</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            step='0.01'
                            min='0'
                            {...field}
                            value={(field.value as any) ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name='miscellaneousFees'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Miscellaneous Fees</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.01'
                          min='0'
                          {...field}
                          value={(field.value as any) ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='space-y-1 text-right text-sm'>
                <p>Total Rent Received: {formatCurrency(total)}</p>
                {!isTenant && <p>Management Fee: - {formatCurrency(managementFee)}</p>}
                <p>Miscellaneous Fees: - {formatCurrency(miscFees)}</p>
                <p
                  className={`font-semibold ${totalPayout < 0 ? 'text-destructive' : ''}`}
                >
                  Total Payout: {formatCurrency(totalPayout)}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={loading}>
                {loading ? 'Generating PDF...' : 'Generate & Upload PDF'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
