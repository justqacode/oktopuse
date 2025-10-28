import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Image, X } from 'lucide-react';
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
import { gql } from '@apollo/client';
import { toast } from 'sonner';
import { useMutation } from '@apollo/client/react';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';

// ================== CONSTANTS ==================
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_IMAGES = 5;

// ================== ZOD SCHEMA ==================
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
      (files) =>
        !files ||
        files.length === 0 ||
        Array.from(files).every((f) => (f as File).size <= MAX_FILE_SIZE),
      { message: 'Each file must be less than 5MB' }
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        Array.from(files).every((f) => ACCEPTED_FILE_TYPES.includes((f as File).type)),
      { message: 'Only JPG and PNG images are accepted' }
    ),
});

type FormValues = z.infer<typeof formSchema>;

// ================== GRAPHQL MUTATION ==================
const MAINTENANCE_MUTATION = gql`
  mutation CreateRequest(
    $category: String!
    $preferedDateOfResolution: String!
    $preferedTimeOfResolution: String!
    $description: String!
    $canManagementAccess: Boolean!
    $images: [String!]!
  ) {
    createMaintenanceRequest(
      category: $category
      preferedDateOfResolution: $preferedDateOfResolution
      preferedTimeOfResolution: $preferedTimeOfResolution
      description: $description
      images: $images
      canManagementAccess: $canManagementAccess
    ) {
      _id
      status
      createdAt
    }
  }
`;

// Mock property/tenant info
const mockApartmentData = {
  apartmentName: 'Sunset View Apartments - Unit 204',
  unitId: 'unit-204',
  propertyId: 'property-001',
  tenantId: 'tenant-123',
  tenantEmail: 'tenant@example.com',
  managerEmail: 'manager@example.com',
};

// ================== COMPONENT ==================
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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const [maintenanceRequest] = useMutation(MAINTENANCE_MUTATION);
  const { uploadImages, isUploading, progress } = useCloudinaryUpload();

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

  // ================== FILE HANDLERS ==================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles = Array.from(files).filter((file) => ACCEPTED_FILE_TYPES.includes(file.type));

    if (validFiles.length === 0) {
      toast.error('Only JPG and PNG images are allowed');
      return;
    }

    const newImages = [...selectedImages, ...validFiles].slice(0, MAX_IMAGES);
    setSelectedImages(newImages);

    // Update form value for validation
    const dataTransfer = new DataTransfer();
    newImages.forEach((file) => dataTransfer.items.add(file));
    form.setValue('photo', dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);

    const dataTransfer = new DataTransfer();
    newImages.forEach((file) => dataTransfer.items.add(file));
    form.setValue('photo', dataTransfer.files);
  };

  // ================== SUBMIT HANDLER ==================
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const imageUrls = await uploadImages(selectedImages);

      const { data: result } = await maintenanceRequest({
        variables: {
          description: data.description,
          category: data.category,
          preferedDateOfResolution: data.preferredDate,
          preferedTimeOfResolution: data.preferredTime,
          canManagementAccess: data.allowEntry === 'yes',
          images: selectedImages.map((img) => img.name),
        },
      });

      if (result) {
        setShowSuccess(true);
        form.reset();
        setSelectedImages([]);
        onOpenChange(false);
      }

      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error: any) {
      toast.error('Error submitting maintenance request');
    } finally {
      setIsLoading(false);
    }
  };

  // ================== RENDER ==================
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
              Maintenance request submitted successfully!
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <div className='space-y-6'>
              {/* Category */}
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
                        <SelectItem value='Plumbing'>Plumbing</SelectItem>
                        <SelectItem value='Electrical'>Electrical</SelectItem>
                        <SelectItem value='HVAC'>HVAC</SelectItem>
                        <SelectItem value='Appliances'>Appliances</SelectItem>
                        <SelectItem value='Pest Control'>Pest Control</SelectItem>
                        <SelectItem value='Landscaping / Exterior'>
                          Landscaping / Exterior
                        </SelectItem>
                        <SelectItem value='General Requests / Other'>
                          General Requests / Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
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
                      Provide as much detail as possible to help us resolve the issue quickly.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date + Time */}
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

              {/* Allow Entry */}
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

              {/* Upload + Preview */}
              <FormField
                control={form.control}
                name='photo'
                render={() => (
                  <FormItem>
                    <FormLabel>Attach Photo (Optional)</FormLabel>
                    <FormControl>
                      <div className='space-y-4'>
                        <div className='flex items-center gap-2'>
                          <Input
                            type='file'
                            accept='image/jpeg,image/jpg,image/png'
                            multiple
                            className='hidden'
                            id='photo-upload'
                            onChange={handleFileChange}
                          />
                          <Button
                            type='button'
                            variant='outline'
                            onClick={() => document.getElementById('photo-upload')?.click()}
                            className='w-full'
                          >
                            <Image className='mr-2 h-4 w-4' />
                            {selectedImages.length > 0
                              ? `${selectedImages.length} image(s) selected`
                              : 'Choose file(s)'}
                          </Button>
                        </div>

                        {selectedImages.length > 0 && (
                          <div className='space-y-2'>
                            <p className='text-sm text-muted-foreground'>
                              {selectedImages.length} of {MAX_IMAGES} images selected
                            </p>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                              {selectedImages.map((image, index) => (
                                <div key={index} className='relative group'>
                                  <div className='aspect-video bg-muted rounded-lg overflow-hidden border'>
                                    <img
                                      src={URL.createObjectURL(image)}
                                      alt={`Preview ${index + 1}`}
                                      className='w-full h-full object-cover'
                                    />
                                  </div>
                                  <Button
                                    type='button'
                                    variant='destructive'
                                    size='icon'
                                    className='absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
                                    onClick={() => removeImage(index)}
                                  >
                                    <X className='h-3 w-3' />
                                  </Button>
                                  <p className='text-xs text-muted-foreground mt-1 truncate'>
                                    {image.name}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Accepted formats: JPG, PNG (Max 5MB each, up to {MAX_IMAGES} images)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <DialogFooter className='gap-2 sm:gap-0'>
                <Button type='button' onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
                  {isLoading ? (
                    <span className='flex items-center'>
                      <span className='animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full'></span>
                      Uploading ({Math.round(progress)}%)
                    </span>
                  ) : (
                    <>Submit Request</>
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
