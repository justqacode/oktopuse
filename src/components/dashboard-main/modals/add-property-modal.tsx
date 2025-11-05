import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Home, Image, CheckCircle2, X } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per image
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_IMAGES = 15;

const formSchema = z.object({
  propertyName: z.string().min(1, { message: 'Property name is required' }),
  propertyType: z.string().min(1, { message: 'Please select a property type' }),
  address: z.string().min(10, { message: 'Address must be at least 10 characters' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State is required' }),
  zipCode: z.string().min(5, { message: 'Zip code must be at least 5 digits' }),
  description: z.string().optional(),
  rentAmount: z
    .string()
    .min(1, { message: 'Rent amount is required' })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Rent amount must be a valid positive number',
    }),
  occupancyStatus: z.string().min(1, { message: 'Please select occupancy status' }),
  managementId: z.string().optional(),
  images: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return files.length <= MAX_IMAGES;
      },
      { message: `You can upload up to ${MAX_IMAGES} images` }
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return Array.from(files).every((file: any) => file.size <= MAX_FILE_SIZE);
      },
      { message: 'Each image must be less than 5MB' }
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return Array.from(files).every((file: any) => ACCEPTED_IMAGE_TYPES.includes(file.type));
      },
      { message: 'Only .jpg and .png files are accepted' }
    ),
});

type FormValues = z.infer<typeof formSchema>;

interface AddPropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ADD_PROPERTY_MUTATION = gql`
  mutation AddProperty(
    $name: String!
    $propertyType: String!
    $address: AddressInput!
    $amount: Float!
    $description: String
    $images: [String!]
    $managerID: ID
  ) {
    addProperty(
      name: $name
      propertyType: $propertyType
      address: $address
      amount: $amount
      description: $description
      images: $images
      managerID: $managerID
    ) {
      id
      name
      address {
        street
        city
        state
        zip
      }
      amount
      description
      images
      occupancy
      ownerID
      createdAt
    }
  }
`;

export default function AddPropertyModal({ open, onOpenChange }: AddPropertyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [addPropertyMutation] = useMutation(ADD_PROPERTY_MUTATION);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyName: '',
      propertyType: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      description: '',
      rentAmount: '',
      occupancyStatus: '',
      managementId: '',
      images: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      // Prepare form data including images
      // const formData = new FormData();
      // formData.append('propertyName', data.propertyName);
      // formData.append('propertyType', data.propertyType);
      // formData.append('address', data.address);
      // formData.append('city', data.city);
      // formData.append('state', data.state);
      // formData.append('zipCode', data.zipCode);
      // formData.append('description', data.description || '');
      // formData.append('rentAmount', data.rentAmount);
      // formData.append('occupancyStatus', data.occupancyStatus);
      // formData.append('managementId', data.managementId || '');

      // // Append all images
      // selectedImages.forEach((image, index) => {
      //   formData.append(`images[${index}]`, image);
      // });

      // // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1500));

      // // Here you would make your actual API call:
      // // const response = await fetch('/api/properties', {
      // //   method: 'POST',
      // //   body: formData,
      // // });

      // console.log('Property Data:', {
      //   ...data,
      //   imagesCount: selectedImages.length,
      //   imageNames: selectedImages.map((img) => img.name),
      // });

      // // Show success message
      // setShowSuccess(true);

      // // Reset form and close modal after 2 seconds
      // setTimeout(() => {
      //   setShowSuccess(false);
      //   form.reset();
      //   setSelectedImages([]);
      //   onOpenChange(false);
      // }, 2000);

      const formData = new FormData();
      formData.append('name', data.propertyName);
      formData.append('propertyType', data.propertyType);
      formData.append('address[street]', data.address);
      formData.append('address[city]', data.city);
      formData.append('address[state]', data.state);
      formData.append('address[zip]', data.zipCode);
      formData.append('amount', data.rentAmount);
      formData.append('occupancy', data.occupancyStatus);
      formData.append('description', data.description || '');

      if (data.managementId) {
        formData.append('managerID', data.managementId);
      }

      // Append all images
      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would make your actual API call:
      // const response = await fetch('/api/properties', {
      //   method: 'POST',
      //   body: formData,
      // });

      // console.log('Property Data (API Format):', {
      //   name: data.propertyName,
      //   propertyType: data.propertyType,
      //   address: {
      //     street: data.address,
      //     city: data.city,
      //     state: data.state,
      //     zip: data.zipCode,
      //   },
      //   amount: parseFloat(data.rentAmount),
      //   occupancy: data.occupancyStatus,
      //   description: data.description || '',
      //   managerID: data.managementId || undefined,
      //   // imagesCount: selectedImages.length,
      //   imageNames: selectedImages.map((img) => img.name),
      // });
      const { data: result } = await addPropertyMutation({
        variables: {
          name: data.propertyName,
          propertyType: data.propertyType,
          address: {
            street: data.address,
            city: data.city,
            state: data.state,
            zip: data.zipCode,
          },
          amount: parseFloat(data.rentAmount),
          occupancy: data.occupancyStatus,
          description: data.description || '',
          managerID: data.managementId || undefined || '68dfbacf320e9616e949fcdf',
          // imagesCount: selectedImages.length,
          imageNames: selectedImages.map((img) => img.name),
        },
      });

      console.log('Mutation result:', result);

      // Show success message
      setShowSuccess(true);
      toast.success('Property added successfully!');

      // Reset form and close modal after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        form.reset();
        setSelectedImages([]);
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      // console.error('Error adding property:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to add property. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    form.reset();
    setSelectedImages([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      setSelectedImages(filesArray);
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);

    // Update form value
    const dataTransfer = new DataTransfer();
    newImages.forEach((file) => dataTransfer.items.add(file));
    form.setValue('images', dataTransfer.files);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold flex items-center gap-2'>
            <Home className='h-6 w-6' />
            Add New Property
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new property to your portfolio
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <Alert className='bg-green-50 border-green-200'>
            <CheckCircle2 className='h-5 w-5 text-green-600' />
            <AlertDescription className='text-green-800 font-medium'>
              Property added successfully!
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <div className='space-y-6'>
              <FormField
                control={form.control}
                name='propertyName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., Sunset View Apartments' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='propertyType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select property type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='apartment'>Apartment</SelectItem>
                        <SelectItem value='duplex'>Duplex</SelectItem>
                        <SelectItem value='studio'>Studio</SelectItem>
                        <SelectItem value='office'>Office</SelectItem>
                        <SelectItem value='house'>House</SelectItem>
                        <SelectItem value='condo'>Condo</SelectItem>
                        <SelectItem value='townhouse'>Townhouse</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter full street address'
                        className='min-h-[80px] resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder='City' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='state'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <FormControl>
                        <Input placeholder='State' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='zipCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code *</FormLabel>
                      <FormControl>
                        <Input placeholder='Zip Code' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='rentAmount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rent Amount *</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
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

              <FormField
                control={form.control}
                name='occupancyStatus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupancy Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select occupancy status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='vacant'>Vacant</SelectItem>
                        <SelectItem value='occupied'>Occupied</SelectItem>
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
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe the property, amenities, features, etc.'
                        className='min-h-[100px] resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Provide additional details about the property</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='managementId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Management ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter management ID' {...field} />
                    </FormControl>
                    <FormDescription>This will be autocomplete in future versions</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='images'
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Property Images (Optional)</FormLabel>
                    <FormControl>
                      <div className='space-y-4'>
                        <div className='flex items-center gap-2'>
                          <Input
                            type='file'
                            accept='.jpg,.jpeg,.png'
                            multiple
                            className='hidden'
                            id='image-upload'
                            onChange={(e) => {
                              onChange(e.target.files);
                              handleImageChange(e);
                            }}
                            {...field}
                          />
                          <Button
                            type='button'
                            variant='outline'
                            onClick={() => document.getElementById('image-upload')?.click()}
                            className='w-full'
                          >
                            <Image className='mr-2 h-4 w-4' />
                            Choose Images
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
                      Upload up to {MAX_IMAGES} images (JPG, PNG, max 5MB each)
                    </FormDescription>
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
                      Adding Property...
                    </span>
                  ) : (
                    <>
                      <Home className='mr-2 h-4 w-4' />
                      Add Property
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

// Demo component to show the modal in action
// export default function AddPropertyDemo() {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="text-center space-y-4">
//         <h1 className="text-3xl font-bold">Property Management System</h1>
//         <p className="text-gray-600">Click the button below to add a new property</p>
//         <Button onClick={() => setOpen(true)} size="lg">
//           <Home className="mr-2 h-5 w-5" />
//           Add New Property
//         </Button>
//       </div>

//       <AddPropertyModal open={open} onOpenChange={setOpen} />
//     </div>
//   );
// }
