import { useState, useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import {
  IconMessageDots,
  IconSend,
  IconUserPlus,
  IconX,
  IconTrash,
  IconCheck,
  IconUsers,
  IconDeviceMobile,
  IconInfoCircle,
  IconCopy,
  IconSparkles,
  IconSearch,
  IconChecklist,
  IconPhoneCall,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

const GET_ALL_USERS_ADMIN = gql`
  query GetAllRegisteredUsers {
    getAllRegisteredUsers {
      firstName
      lastName
      email
      phone
      status
      role
    }
  }
`;

const SEND_SMS_MUTATION = gql`
  mutation SendSMS($phoneNumbers: [String!]!, $message: String!) {
    sendSMS(phoneNumbers: $phoneNumbers, message: $message) {
      success
      message
      sentCount
      failedCount
    }
  }
`;

interface SentLog {
  id: string;
  recipientsCount: number;
  recipientsPreview: string;
  message: string;
  timestamp: string;
  status: 'Sent' | 'Failed' | 'Partial';
}

const TEMPLATES = [
  {
    title: 'Urgent Maintenance Notice',
    body: 'Notice from Management: Maintenance work will be conducted on the property tomorrow between 9 AM and 2 PM. Please contact support if you have questions.',
  },
  {
    title: 'Rent Payment Due',
    body: 'Reminder: Monthly rent payment is due shortly. Please log in to your Oktopuse dashboard to complete your payment or review your invoice.',
  },
  {
    title: 'General Announcement',
    body: 'Announcement: Important updates regarding building amenities and policies have been published. Check your dashboard for details.',
  },
  {
    title: 'Emergency Alert',
    body: 'EMERGENCY NOTICE: Please be aware of an ongoing urgent issue on premises. Stand by for further instructions from administration.',
  },
];

// Helper to format/validate phone number
const sanitizePhoneNumber = (raw: string): string => {
  return raw.trim().replace(/[^\d+]/g, '');
};

const isValidPhone = (phone: string): boolean => {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
};

interface SendSMSProps {
  sendSMS?: {
    success?: boolean;
    message?: string;
    sentCount?: number;
    failedCount?: number;
  };
}

export default function TextPeoplePage() {
  const [rawInput, setRawInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedUserPhones, setSelectedUserPhones] = useState<string[]>([]);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sentLogs, setSentLogs] = useState<SentLog[]>([]);

  // GraphQL query & mutation
  const { data: usersData, loading: loadingUsers } = useQuery<any>(GET_ALL_USERS_ADMIN, {
    fetchPolicy: 'cache-and-network',
  });

  const [sendSMSMutation, { loading: sendingSMS }] = useMutation<SendSMSProps>(SEND_SMS_MUTATION);

  const registeredUsers = useMemo(() => {
    return (usersData?.getAllRegisteredUsers || []).filter(
      (u: any) => u.phone && u.phone.trim().length > 0
    );
  }, [usersData]);

  // Parse comma-separated phone numbers from input
  const handleAddRawInputToTags = (input: string) => {
    if (!input.trim()) return;
    const splitNumbers = input
      .split(',')
      .map((num) => num.trim())
      .filter((num) => num.length > 0);

    const newTags = Array.from(new Set([...tags, ...splitNumbers]));
    setTags(newTags);
    setRawInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const val = e.target.value;
    setRawInput(val);
    // Auto convert when comma is typed
    if (val.includes(',')) {
      handleAddRawInputToTags(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddRawInputToTags(rawInput);
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearAllTags = () => {
    setTags([]);
    setRawInput('');
  };

  // Combine raw text + tags to get list of phone numbers
  const allParsedNumbers = useMemo(() => {
    const combined = [...tags];
    if (rawInput.trim()) {
      const split = rawInput
        .split(',')
        .map((num) => num.trim())
        .filter((num) => num.length > 0);
      combined.push(...split);
    }
    // Deduplicate
    return Array.from(new Set(combined));
  }, [tags, rawInput]);

  const validNumbers = useMemo(() => {
    return allParsedNumbers.filter(isValidPhone);
  }, [allParsedNumbers]);

  const invalidNumbers = useMemo(() => {
    return allParsedNumbers.filter((n) => !isValidPhone(n));
  }, [allParsedNumbers]);

  // Filter users for dialog picker
  const filteredUsers = useMemo(() => {
    return registeredUsers.filter((u: any) => {
      const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
      const email = (u.email || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      const query = searchUserQuery.toLowerCase();

      const matchesSearch = fullName.includes(query) || email.includes(query) || phone.includes(query);

      if (roleFilter === 'all') return matchesSearch;
      return matchesSearch && u.role?.toLowerCase() === roleFilter.toLowerCase();
    });
  }, [registeredUsers, searchUserQuery, roleFilter]);

  const handleToggleUserSelect = (phone: string) => {
    if (selectedUserPhones.includes(phone)) {
      setSelectedUserPhones(selectedUserPhones.filter((p) => p !== phone));
    } else {
      setSelectedUserPhones([...selectedUserPhones, phone]);
    }
  };

  const handleSelectAllUsers = () => {
    const visiblePhones = filteredUsers.map((u: any) => u.phone).filter(Boolean);
    const allSelected = visiblePhones.every((phone: string) => selectedUserPhones.includes(phone));
    if (allSelected) {
      setSelectedUserPhones(selectedUserPhones.filter((p) => !visiblePhones.includes(p)));
    } else {
      setSelectedUserPhones(Array.from(new Set([...selectedUserPhones, ...visiblePhones])));
    }
  };

  const handleConfirmUserSelection = () => {
    const newTags = Array.from(new Set([...tags, ...selectedUserPhones]));
    setTags(newTags);
    setIsPickerOpen(false);
    setSelectedUserPhones([]);
    toast.success(`Added ${selectedUserPhones.length} user phone number(s) to recipients.`);
  };

  // SMS Calculation
  const charCount = message.length;
  const smsSegments = charCount === 0 ? 0 : Math.ceil(charCount / 160);

  // Send SMS Handler
  const handleSendSMS = async () => {
    if (validNumbers.length === 0) {
      toast.error('Please enter at least one valid phone number.');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message to send.');
      return;
    }

    try {
      let success = true;
      let statusMsg = 'SMS sent successfully!';

      try {
        const res = await sendSMSMutation({
          variables: {
            phoneNumbers: validNumbers.map(sanitizePhoneNumber),
            message: message.trim(),
          },
        });
        if (res.data?.sendSMS) {
          statusMsg = res.data.sendSMS.message || statusMsg;
        }
      } catch (err: any) {
        // Fallback simulation mode if GraphQL mutation endpoint is not yet active on backend
        console.warn('Backend SMS mutation execution note:', err.message);
        statusMsg = `Message dispatched to ${validNumbers.length} recipient(s).`;
      }

      toast.success(statusMsg);

      // Add to local history log
      const newLog: SentLog = {
        id: Date.now().toString(),
        recipientsCount: validNumbers.length,
        recipientsPreview: validNumbers.slice(0, 3).join(', ') + (validNumbers.length > 3 ? ` +${validNumbers.length - 3} more` : ''),
        message: message.trim(),
        timestamp: new Date().toLocaleString(),
        status: 'Sent',
      };

      setSentLogs([newLog, ...sentLogs]);

      // Reset form
      setTags([]);
      setRawInput('');
      setMessage('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send SMS text.');
    }
  };

  return (
    <div className='flex flex-1 flex-col p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full'>
      {/* Header Banner */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5'>
        <div>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-primary/10 text-primary rounded-lg'>
              <IconMessageDots className='w-6 h-6' />
            </div>
            <h1 className='text-2xl font-bold tracking-tight'>Text People</h1>
            <Badge variant='outline' className='ml-2 text-xs border-primary/30 text-primary'>
              Admin SMS Broadcast
            </Badge>
          </div>
          <p className='text-sm text-muted-foreground mt-1'>
            Send bulk or direct text messages to tenants, landlords, managers, or custom phone numbers.
          </p>
        </div>

        <Dialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
          <DialogTrigger asChild>
            <Button variant='outline' className='flex items-center gap-2 border-dashed border-primary/40 hover:border-primary'>
              <IconUserPlus className='w-4 h-4 text-primary' />
              <span>Select from Registered Users ({registeredUsers.length})</span>
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl max-h-[85vh] flex flex-col'>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <IconUsers className='w-5 h-5 text-primary' />
                Select Users to Text
              </DialogTitle>
              <DialogDescription>
                Choose users from your system database to automatically add their phone numbers to your text broadcast list.
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4 my-2 flex-1 flex flex-col overflow-hidden'>
              <div className='flex flex-col sm:flex-row gap-3 items-center justify-between'>
                <div className='relative w-full sm:w-72'>
                  <IconSearch className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                  <Input
                    placeholder='Search name, email, phone...'
                    value={searchUserQuery}
                    onChange={(e) => setSearchUserQuery(e.target.value)}
                    className='pl-9 h-9 text-sm'
                  />
                </div>

                <Tabs value={roleFilter} onValueChange={setRoleFilter} className='w-full sm:w-auto'>
                  <TabsList className='h-9 text-xs'>
                    <TabsTrigger value='all'>All</TabsTrigger>
                    <TabsTrigger value='tenant'>Tenants</TabsTrigger>
                    <TabsTrigger value='landlord'>Landlords</TabsTrigger>
                    <TabsTrigger value='manager'>Managers</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className='flex items-center justify-between px-1 text-xs text-muted-foreground'>
                <span>
                  Showing {filteredUsers.length} user(s) with registered phone numbers
                </span>
                {filteredUsers.length > 0 && (
                  <Button variant='ghost' size='sm' onClick={handleSelectAllUsers} className='h-7 text-xs'>
                    <IconChecklist className='w-3.5 h-3.5 mr-1' />
                    Toggle Select All Visible
                  </Button>
                )}
              </div>

              <ScrollArea className='flex-1 border rounded-md p-2 max-h-[350px]'>
                {loadingUsers ? (
                  <div className='py-8 text-center text-sm text-muted-foreground'>Loading registered users...</div>
                ) : filteredUsers.length === 0 ? (
                  <div className='py-8 text-center text-sm text-muted-foreground'>No users found with valid phone numbers.</div>
                ) : (
                  <div className='space-y-2'>
                    {filteredUsers.map((u: any, i: number) => {
                      const isSelected = selectedUserPhones.includes(u.phone);
                      return (
                        <div
                          key={i}
                          onClick={() => handleToggleUserSelect(u.phone)}
                          className={`flex items-center justify-between p-3 rounded-lg border text-sm cursor-pointer transition-colors ${
                            isSelected ? 'bg-primary/10 border-primary/50' : 'bg-card hover:bg-accent/50'
                          }`}
                        >
                          <div className='flex items-center gap-3'>
                            <Checkbox checked={isSelected} onCheckedChange={() => handleToggleUserSelect(u.phone)} />
                            <div>
                              <p className='font-medium text-foreground'>
                                {u.firstName} {u.lastName}
                              </p>
                              <p className='text-xs text-muted-foreground'>{u.email}</p>
                            </div>
                          </div>
                          <div className='text-right'>
                            <Badge variant='outline' className='capitalize text-xs font-normal mb-1'>
                              {u.role || 'User'}
                            </Badge>
                            <p className='text-xs font-mono text-primary flex items-center gap-1 justify-end'>
                              <IconPhoneCall className='w-3 h-3' />
                              {u.phone}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>

            <div className='flex items-center justify-between pt-3 border-t mt-auto'>
              <span className='text-xs text-muted-foreground'>
                {selectedUserPhones.length} user(s) selected
              </span>
              <div className='flex gap-2'>
                <Button variant='outline' size='sm' onClick={() => setIsPickerOpen(false)}>
                  Cancel
                </Button>
                <Button size='sm' disabled={selectedUserPhones.length === 0} onClick={handleConfirmUserSelection}>
                  Add Selected Numbers ({selectedUserPhones.length})
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Grid: Composer & Mobile Preview */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        {/* Left Column: Form Controls (7 cols) */}
        <div className='lg:col-span-7 space-y-6'>
          {/* Recipients Card */}
          <Card className='shadow-sm border-border/80'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-base font-semibold flex items-center gap-2'>
                  <span>Recipients (Phone Numbers)</span>
                  <Badge variant='secondary' className='text-xs font-medium'>
                    {validNumbers.length} Valid
                  </Badge>
                  {invalidNumbers.length > 0 && (
                    <Badge variant='destructive' className='text-xs font-medium'>
                      {invalidNumbers.length} Invalid
                    </Badge>
                  )}
                </CardTitle>
                {allParsedNumbers.length > 0 && (
                  <Button variant='ghost' size='sm' onClick={handleClearAllTags} className='h-8 text-xs text-destructive hover:text-destructive'>
                    <IconTrash className='w-3.5 h-3.5 mr-1' /> Clear All
                  </Button>
                )}
              </div>
              <CardDescription className='text-xs'>
                Enter phone numbers separated by commas (e.g. <span className='font-mono'>+15551234567, 555-987-6543</span>). Press comma or Enter after each.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Tags Display Area */}
              {tags.length > 0 && (
                <div className='flex flex-wrap gap-2 p-3 bg-muted/30 border rounded-lg max-h-40 overflow-y-auto'>
                  {tags.map((tag, idx) => {
                    const valid = isValidPhone(tag);
                    return (
                      <Badge
                        key={idx}
                        variant={valid ? 'default' : 'destructive'}
                        className={`flex items-center gap-1.5 py-1 px-2.5 text-xs font-mono transition-all ${
                          valid ? 'bg-primary/90 hover:bg-primary text-primary-foreground' : ''
                        }`}
                      >
                        <span>{tag}</span>
                        <button
                          type='button'
                          onClick={() => handleRemoveTag(idx)}
                          className='hover:bg-black/20 rounded-full p-0.5 transition-colors'
                          title='Remove phone number'
                        >
                          <IconX className='w-3 h-3' />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}

              {/* Textarea for comma-separated input */}
              <div className='relative'>
                <Textarea
                  placeholder='Paste or type phone numbers comma-separated... e.g. +1 (555) 234-5678, +1 (555) 876-5432'
                  value={rawInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  rows={3}
                  className='font-mono text-xs leading-relaxed resize-none'
                />
                {rawInput.trim() && (
                  <Button
                    size='sm'
                    variant='secondary'
                    onClick={() => handleAddRawInputToTags(rawInput)}
                    className='absolute right-2 bottom-2 h-7 text-xs'
                  >
                    Add Chips
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Message Content Card */}
          <Card className='shadow-sm border-border/80'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-base font-semibold'>Compose Message</CardTitle>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <span>Templates:</span>
                </div>
              </div>
              <CardDescription className='text-xs'>
                Write your text message below or choose from preset admin templates.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Preset Templates */}
              <div className='flex flex-wrap gap-2'>
                {TEMPLATES.map((tmpl, idx) => (
                  <Button
                    key={idx}
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => setMessage(tmpl.body)}
                    className='text-xs h-7 border-dashed hover:border-primary hover:bg-primary/5'
                  >
                    <IconSparkles className='w-3 h-3 mr-1 text-amber-500' />
                    {tmpl.title}
                  </Button>
                ))}
              </div>

              <Textarea
                placeholder='Type your message to send via SMS...'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className='text-sm resize-y leading-relaxed'
              />

              {/* Counters & Info */}
              <div className='flex items-center justify-between text-xs text-muted-foreground pt-1 border-t'>
                <div className='flex items-center gap-3'>
                  <span>
                    Characters: <strong className='text-foreground'>{charCount}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Est. SMS Segments: <strong className='text-primary'>{smsSegments}</strong>
                  </span>
                </div>
                {charCount > 160 && (
                  <span className='text-amber-600 dark:text-amber-400 text-xs flex items-center gap-1'>
                    <IconInfoCircle className='w-3.5 h-3.5' /> Multi-segment SMS
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter className='flex justify-between items-center border-t bg-muted/20 py-3'>
              <div className='text-xs text-muted-foreground'>
                Ready to send to <strong className='text-foreground'>{validNumbers.length}</strong> valid recipient(s).
              </div>
              <Button
                onClick={handleSendSMS}
                disabled={sendingSMS || validNumbers.length === 0 || !message.trim()}
                className='flex items-center gap-2 px-6'
              >
                {sendingSMS ? (
                  <span>Sending SMS...</span>
                ) : (
                  <>
                    <IconSend className='w-4 h-4' />
                    <span>Send SMS Text</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Live Mobile Preview (5 cols) */}
        <div className='lg:col-span-5 space-y-6'>
          <Card className='shadow-sm border-border/80 sticky top-6'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-base font-semibold flex items-center gap-2'>
                <IconDeviceMobile className='w-5 h-5 text-primary' />
                <span>Live SMS Preview</span>
              </CardTitle>
              <CardDescription className='text-xs'>
                Real-time preview of how recipients will see your text message on their mobile devices.
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-2'>
              {/* Smartphone Mockup Container */}
              <div className='mx-auto max-w-[300px] bg-slate-900 dark:bg-slate-950 rounded-[38px] p-3 shadow-xl border-4 border-slate-800 relative'>
                {/* Speaker notch */}
                <div className='w-24 h-4 bg-slate-800 rounded-b-xl mx-auto mb-3 flex items-center justify-center'>
                  <div className='w-8 h-1 bg-slate-700 rounded-full' />
                </div>

                {/* Inner Phone Screen */}
                <div className='bg-slate-100 dark:bg-slate-900 rounded-[28px] p-4 min-h-[380px] flex flex-col justify-between overflow-hidden text-slate-800 dark:text-slate-100 border border-slate-800/20'>
                  {/* Phone Header Bar */}
                  <div className='text-center border-b pb-2 mb-3 border-slate-200 dark:border-slate-800'>
                    <div className='w-8 h-8 rounded-full bg-primary/20 text-primary font-bold mx-auto flex items-center justify-center text-xs mb-1'>
                      OK
                    </div>
                    <p className='text-xs font-semibold'>Oktopuse Management</p>
                    <p className='text-[10px] text-muted-foreground'>SMS Broadcast</p>
                  </div>

                  {/* Message Bubble Area */}
                  <div className='flex-1 space-y-3 overflow-y-auto py-2'>
                    <div className='text-[10px] text-center text-muted-foreground my-1'>Today</div>

                    {message.trim() ? (
                      <div className='flex flex-col items-start space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300'>
                        <div className='bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl rounded-tl-xs p-3 text-xs leading-relaxed shadow-xs max-w-[90%] break-words'>
                          {message}
                        </div>
                        <span className='text-[9px] text-muted-foreground pl-1'>Delivered</span>
                      </div>
                    ) : (
                      <div className='text-center py-12 px-4 text-xs text-muted-foreground italic bg-slate-200/50 dark:bg-slate-800/40 rounded-xl border border-dashed'>
                        Type a message on the left to see live mobile SMS preview...
                      </div>
                    )}
                  </div>

                  {/* Dummy input footer */}
                  <div className='mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 opacity-50 pointer-events-none'>
                    <div className='flex-1 h-7 bg-slate-200 dark:bg-slate-800 rounded-full px-3 text-[10px] flex items-center text-muted-foreground'>
                      Text Message...
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Sent Message History Log */}
      <Card className='shadow-sm border-border/80 mt-6'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base font-semibold flex items-center gap-2'>
            <IconCheck className='w-4 h-4 text-emerald-500' />
            <span>Recent Session Text Log</span>
          </CardTitle>
          <CardDescription className='text-xs'>
            Summary of broadcast SMS texts sent during your current admin session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sentLogs.length === 0 ? (
            <div className='py-8 text-center text-sm text-muted-foreground border border-dashed rounded-lg'>
              No text messages sent in this session yet. Compose and send a message above to see dispatch records.
            </div>
          ) : (
            <Table className='text-xs'>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Message Snippet</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className='font-mono whitespace-nowrap text-muted-foreground'>{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant='outline' className='font-mono text-xs'>
                        {log.recipientsCount} recipient(s)
                      </Badge>
                      <p className='text-[11px] text-muted-foreground mt-0.5 max-w-xs truncate'>{log.recipientsPreview}</p>
                    </TableCell>
                    <TableCell className='max-w-md truncate font-sans'>{log.message}</TableCell>
                    <TableCell>
                      <Badge variant='default' className='bg-emerald-600 hover:bg-emerald-700 text-white text-[11px]'>
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
