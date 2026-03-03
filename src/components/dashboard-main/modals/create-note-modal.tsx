import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  content: z.string().min(1, { message: 'Note content is required' }),
  isPrivate: z.boolean(),
  propertyID: z.string().min(1, { message: 'Property ID is required' }),
  tenantID: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optionally pre-fill propertyID and tenantID from context */
  // propertyID: string;
  // tenantID: string;
}

const GET_PROPERTIES = gql`
  query GetMyProperties {
    getMyProperties {
      id
      name
      amount
      description
      images
      propertyType
      createdAt
      address {
        street
        city
        state
        zip
      }
    }
  }
`;

const CREATE_NOTE_MUTATION = gql`
  mutation CreateNote(
    $content: String!
    $isPrivate: Boolean!
    $propertyID: String!
    $tenantID: String
  ) {
    addNote(
      content: $content
      isPrivate: $isPrivate
      propertyID: $propertyID
      tenantID: $tenantID
    ) {
      success
      message
    }
  }
`;

export default function CreateNoteModal({ open, onOpenChange }: CreateNoteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [createNoteMutation] = useMutation<any>(CREATE_NOTE_MUTATION);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      isPrivate: false,
      propertyID: '',
      tenantID: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const { data: result } = await createNoteMutation({
        variables: {
          content: data.content,
          isPrivate: data.isPrivate,
          propertyID: data.propertyID,
          tenantID: data.tenantID,
        },
      });

      if (result?.addNote?.success) {
        toast.success(result.addNote.message || 'Note created successfully!');
        setTimeout(() => {
          form.reset();
          onOpenChange(false);
        }, 1500);
      } else {
        toast.error(result?.addNote?.message || 'Failed to create note. Please try again.');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create note. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    form.reset();
  };

  const { data, loading } = useQuery<any>(GET_PROPERTIES, {
    fetchPolicy: 'cache-and-network',
  });

  const propertyData = data?.getMyProperties || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold flex items-center gap-2'>
            <StickyNote className='h-6 w-6' />
            Create Note
          </DialogTitle>
          <DialogDescription>Add a note to a property or tenant record</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className='space-y-6'>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Content *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='e.g., I checked the doorbell'
                      className='min-h-[120px] resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Write the details of your note here</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isPrivate'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Private Note</FormLabel>
                    <FormDescription>
                      Private notes are only visible to you and other managers
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name='propertyID'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property ID *</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter property ID' {...field} />
                  </FormControl>
                  <FormDescription>The ID of the property this note is linked to</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name='propertyID'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property ID *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select property' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loading && <SelectItem value='na'>Loading...</SelectItem>}
                      {!loading &&
                        propertyData.map((property: any) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.name}
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
              name='tenantID'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant ID (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter tenant ID' {...field} />
                  </FormControl>
                  <FormDescription>Link this note to a specific tenant (optional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className='gap-2 sm:gap-0'>
              <Button type='button' variant='outline' onClick={handleClear} disabled={isLoading}>
                Clear
              </Button>
              <Button type='button' onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
                {isLoading ? (
                  <span className='flex items-center'>
                    <span className='animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full'></span>
                    Creating Note...
                  </span>
                ) : (
                  <>
                    <StickyNote className='mr-2 h-4 w-4' />
                    Create Note
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
