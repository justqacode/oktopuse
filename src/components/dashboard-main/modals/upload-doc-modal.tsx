import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileUp, X, File } from 'lucide-react';
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
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { toast } from 'sonner';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { useAuthStore } from '@/auth/authStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ================== CONSTANTS ==================
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
const ACCEPTED_FILE_EXTENSIONS = '.jpg,.jpeg,.png,.pdf';

// ================== ZOD SCHEMA ==================
const formSchema = z.object({
  docName: z.string().min(1, { message: 'Please enter a document name' }),
  docType: z.string().min(1, { message: 'Please select a document type' }),
  propertyID: z.string().min(1, { message: 'Please select the property this document belongs to' }),
  docOwnerClass: z.string().min(1, { message: 'Please select who should see this document' }),
  docDescription: z.string().optional(),
  // docFolder: z.string().min(1, { message: 'Please enter a folder ID' }),
  file: z
    .any()
    .refine((files) => files && files.length > 0, { message: 'Please select a file' })
    .refine((files) => !files || files[0]?.size <= MAX_FILE_SIZE, {
      message: 'File must be less than 10MB',
    })
    .refine((files) => !files || ACCEPTED_FILE_TYPES.includes(files[0]?.type), {
      message: 'Only JPG, PNG, and PDF files are accepted',
    }),
});

type FormValues = z.infer<typeof formSchema>;

// ================== GRAPHQL MUTATION ==================
const UPLOAD_DOCUMENT_MUTATION = gql`
  mutation UploadDocument(
    $docDescription: String
    $docName: String!
    $docType: String!
    $propertyID: ID!
    $docFolder: String!
    $docURL: String
    $docOwnerClass: Int
  ) {
    uploadDocument(
      docDescription: $docDescription
      docName: $docName
      docType: $docType
      propertyID: $propertyID
      docFolder: $docFolder
      docURL: $docURL
      docOwnerClass: $docOwnerClass
    ) {
      success
      message
    }
  }
`;

const GET_MY_PROPERTIES = gql`
  query GetMyProperties {
    getMyProperties {
      id
      name
    }
  }
`;

// ================== COMPONENT ==================
interface UploadDocModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // folderId: string;
  // docOwnerClass?: number;
}

export default function UploadDocModal({ open, onOpenChange }: UploadDocModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useAuthStore();
  const address = user?.tenantInfo?.rentalAddress;

  const [uploadDocument] = useMutation(UPLOAD_DOCUMENT_MUTATION);
  const { uploadImages, isUploading, progress } = useCloudinaryUpload();

  const { data: propertiesData } = useQuery<any>(GET_MY_PROPERTIES, {
    skip: !open,
  });

  const properties = propertiesData?.getMyProperties || [];

  // For tenants who may not have owned properties, fallback to their rented property
  const tenantPropertyId = user?.tenantInfo?.propertyId;
  const tenantAddress = user?.tenantInfo?.rentalAddress;

  const displayProperties = properties.length > 0
    ? properties
    : (tenantPropertyId && tenantAddress
      ? [{ id: tenantPropertyId, name: tenantAddress }]
      : []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      docName: '',
      docType: '',
      docDescription: '',
      docOwnerClass: '',
      propertyID: '',
      // docFolder: folderId,
      file: undefined,
    },
  });

  // ================== FILE HANDLER ==================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error('Only JPG, PNG, and PDF files are allowed');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    form.setValue('file', files, { shouldValidate: true });

    // Auto-fill docName from filename if empty
    if (!form.getValues('docName')) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      form.setValue('docName', nameWithoutExt);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    form.setValue('file', undefined, { shouldValidate: true });
    const input = document.getElementById('doc-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const isImage = (file: File) => file.type.startsWith('image/');

  // ================== SUBMIT HANDLER ==================
  const onSubmit = async (data: FormValues) => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setIsLoading(true);

    try {
      // Upload to Cloudinary first
      const [docURL] = await uploadImages([selectedFile]);

      const { data: result } = (await uploadDocument({
        variables: {
          docName: data.docName,
          docType: data.docType,
          propertyID: data.propertyID,
          docDescription: data.docDescription || '',
          docFolder: user?.id || '',
          docURL,
          docOwnerClass: parseInt(data.docOwnerClass, 10),
        },
      })) as { data: { uploadDocument: { success: boolean; message: string } } };

      if (result?.uploadDocument?.success) {
        toast.success(result.uploadDocument.message || 'Document uploaded successfully');
        form.reset();
        setSelectedFile(null);
        onOpenChange(false);
      } else {
        toast.error(result?.uploadDocument?.message || 'Upload failed');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Error uploading document');
    } finally {
      setIsLoading(false);
    }
  };

  // ================== RENDER ==================
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold flex items-center gap-2'>
            <FileUp className='h-5 w-5' />
            Upload Document
          </DialogTitle>
          {address && (
            <DialogDescription className='text-base font-medium text-foreground pt-2'>
              {address}
            </DialogDescription>
          )}
        </DialogHeader>

        <Form {...form}>
          <div className='space-y-5'>
            {/* File Upload */}
            <FormField
              control={form.control}
              name='file'
              render={() => (
                <FormItem>
                  <FormLabel>File *</FormLabel>
                  <FormControl>
                    <div className='space-y-3'>
                      <Input
                        type='file'
                        accept={ACCEPTED_FILE_EXTENSIONS}
                        className='hidden'
                        id='doc-upload'
                        onChange={handleFileChange}
                      />

                      {!selectedFile ? (
                        <button
                          type='button'
                          onClick={() => document.getElementById('doc-upload')?.click()}
                          className='w-full border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-muted/40 transition-colors cursor-pointer'
                        >
                          <FileUp className='h-8 w-8 text-muted-foreground' />
                          <p className='text-sm font-medium'>Click to choose a file</p>
                          <p className='text-xs text-muted-foreground'>
                            JPG, PNG or PDF · Max 10MB
                          </p>
                        </button>
                      ) : (
                        <div className='border rounded-lg p-3 flex items-start gap-3'>
                          {isImage(selectedFile) ? (
                            <div className='w-16 h-16 rounded overflow-hidden border shrink-0'>
                              <img
                                src={URL.createObjectURL(selectedFile)}
                                alt='Preview'
                                className='w-full h-full object-cover'
                              />
                            </div>
                          ) : (
                            <div className='w-16 h-16 rounded border bg-muted flex items-center justify-center shrink-0'>
                              <File className='h-7 w-7 text-muted-foreground' />
                            </div>
                          )}
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm font-medium truncate'>{selectedFile.name}</p>
                            <p className='text-xs text-muted-foreground mt-0.5'>
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <button
                              type='button'
                              onClick={() => document.getElementById('doc-upload')?.click()}
                              className='text-xs text-primary underline mt-1'
                            >
                              Change file
                            </button>
                          </div>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-7 w-7 shrink-0'
                            onClick={removeFile}
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Document Name */}
            <FormField
              control={form.control}
              name='docName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name *</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. Lease Agreement 2024' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Document Type */}
            <FormField
              control={form.control}
              name='docType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select document type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='lease-agreement'>Lease Agreement</SelectItem>
                      <SelectItem value='payment-receipt'>Payment Receipt</SelectItem>
                      <SelectItem value='move-in-checklist'>Move-in Checklist</SelectItem>
                      <SelectItem value='notice-of-entry'>Notice of Entry</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Document Class */}
            <FormField
              control={form.control}
              name='docOwnerClass'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who should see this document? *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select who should see this document' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='1'>Landlord Only</SelectItem>
                      <SelectItem value='2'>Tenant Only</SelectItem>
                      <SelectItem value='3'>Both</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Properties */}
            <FormField
              control={form.control}
              name='propertyID'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a property' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {displayProperties.map((property: any) => (
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

            {/* Description */}
            <FormField
              control={form.control}
              name='docDescription'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Optional: add a note about this document...'
                      className='min-h-[80px] resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type='button' onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
                {isLoading ? (
                  <span className='flex items-center gap-2'>
                    <span className='animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full' />
                    Uploading {progress > 0 ? `(${Math.round(progress)}%)` : '...'}
                  </span>
                ) : (
                  <>
                    <FileUp className='h-4 w-4 mr-2' />
                    Upload Document
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
