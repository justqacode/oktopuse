import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wrench, Image, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

const formSchema = z.object({
  category: z.string().min(1, { message: 'Please select a category' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  preferredDate: z.string().min(1, { message: 'Please select a preferred date' }),
  preferredTime: z.string().min(1, { message: 'Please select a preferred time' }),
  allowEntry: z.enum(['yes', 'no'], {
    required_error: 'Please select an option',
  }),
  photo: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file || file.length === 0) return true;
        return file[0]?.size <= MAX_FILE_SIZE;
      },
      { message: 'File size must be less than 5MB' }
    )
    .refine(
      (file) => {
        if (!file || file.length === 0) return true;
        return ACCEPTED_FILE_TYPES.includes(file[0]?.type);
      },
      { message: 'Only .jpg, .png, and .pdf files are accepted' }
    ),
});

type FormValues = z.infer<typeof formSchema>;

// Mock data - replace with actual data from your auth/property store
const mockApartmentData = {
  apartmentName: 'Sunset View Apartments - Unit 204',
  unitId: 'unit-204',
  propertyId: 'property-001',
  tenantId: 'tenant-123',
  tenantEmail: 'tenant@example.com',
  managerEmail: 'manager@example.com',
};

interface MaintenanceRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MaintenanceRequestModal({
  open,
  onOpenChange,
}: MaintenanceRequestModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      description: '',
      preferredDate: '',
      preferredTime: '',
      allowEntry: 'yes',
      photo: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      // Prepare form data including file if present
      const formData = new FormData();
      formData.append('category', data.category);
      formData.append('description', data.description);
      formData.append('preferredDate', data.preferredDate);
      formData.append('preferredTime', data.preferredTime);
      formData.append('allowEntry', data.allowEntry);
      formData.append('unitId', mockApartmentData.unitId);
      formData.append('propertyId', mockApartmentData.propertyId);
      formData.append('tenantId', mockApartmentData.tenantId);
      formData.append('tenantEmail', mockApartmentData.tenantEmail);
      formData.append('managerEmail', mockApartmentData.managerEmail);

      if (data.photo && data.photo.length > 0) {
        formData.append('photo', data.photo[0]);
      }

      // Simulate API call
      //   await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would make your actual API call:
      // const response = await fetch('/api/maintenance-requests', {
      //   method: 'POST',
      //   body: formData,
      // });

      console.log('Maintenance Request Data:', {
        ...data,
        apartmentName: mockApartmentData.apartmentName,
        unitId: mockApartmentData.unitId,
        propertyId: mockApartmentData.propertyId,
        photo: data.photo?.[0]?.name || 'No file attached',
      });

      // Show success message
      setShowSuccess(true);

      // Reset form and close modal after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        form.reset();
        setSelectedFileName('');
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    form.reset();
    setSelectedFileName('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    } else {
      setSelectedFileName('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold flex items-center gap-2'>
            Maintenance Request
          </DialogTitle>
          <DialogDescription className='text-base font-medium text-foreground pt-2'>
            {mockApartmentData.apartmentName}
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <Alert className='bg-green-50 border-green-200'>
            <CheckCircle2 className='h-5 w-5 text-green-600' />
            <AlertDescription className='text-green-800 font-medium'>
              Maintenance request submitted successfully! You will receive a confirmation email
              shortly.
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <div className='space-y-6'>
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='general'>General</SelectItem>
                        <SelectItem value='plumbing'>Plumbing</SelectItem>
                        <SelectItem value='electrical'>Electrical</SelectItem>
                        <SelectItem value='heating'>Heating</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Please describe the issue in detail...'
                        className='min-h-[100px] resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide as much detail as possible to help us resolve the issue quickly
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='preferredDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Date *</FormLabel>
                      <FormControl>
                        <Input
                          type='date'
                          {...field}
                          min={new Date().toISOString().split('T')[0]}
                          className='w-full block'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='preferredTime'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Time *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select time' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='morning'>Morning (8AM - 12PM)</SelectItem>
                          <SelectItem value='afternoon'>Afternoon (12PM - 4PM)</SelectItem>
                          <SelectItem value='evening'>Evening (4PM - 8PM)</SelectItem>
                          <SelectItem value='anytime'>Anytime</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='allowEntry'
                render={({ field }) => (
                  <FormItem className='space-y-3'>
                    <FormLabel>Allow management to enter my unit when I'm out? *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className='flex gap-4'
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='yes' id='yes' />
                          <label htmlFor='yes' className='text-sm font-medium cursor-pointer'>
                            Yes
                          </label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='no' id='no' />
                          <label htmlFor='no' className='text-sm font-medium cursor-pointer'>
                            No
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='photo'
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Attach Photo (Optional)</FormLabel>
                    <FormControl>
                      <div className='flex items-center gap-2'>
                        <Input
                          type='file'
                          accept='.jpg,.jpeg,.png,.pdf'
                          className='hidden'
                          id='photo-upload'
                          onChange={(e) => {
                            onChange(e.target.files);
                            handleFileChange(e);
                          }}
                          {...field}
                        />
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => document.getElementById('photo-upload')?.click()}
                          className='w-full'
                        >
                          <Image className='mr-2 h-4 w-4' />
                          {selectedFileName || 'Choose file'}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>Accepted formats: JPG, PNG, PDF (Max 5MB)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className='gap-2 sm:gap-0'>
                {/* <Button type='button' variant='outline' onClick={handleClear} disabled={isLoading}>
                  Clear
                </Button> */}
                <Button type='button' onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
                  {isLoading ? (
                    <span className='flex items-center'>
                      <span className='animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full'></span>
                      Submitting...
                    </span>
                  ) : (
                    <>
                      {/* <Wrench className='mr-2 h-4 w-4' /> */}
                      Submit Request
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
