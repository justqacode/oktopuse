import { useState } from 'react';
import {
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Send,
  Phone,
  Video,
  Check,
  CheckCheck,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import clsx from 'clsx';
import type { UserAdmin } from '../types';

const mockContacts = [
  {
    id: 1,
    name: 'Property Manager',
    avatar: '/api/placeholder/40/40',
    lastMessage: 'Your maintenance request has been approved',
    time: '10:30 AM',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Maintenance Team',
    avatar: '/api/placeholder/40/40',
    lastMessage: 'We will arrive at 2 PM today',
    time: '9:45 AM',
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: 'Building Security',
    avatar: '/api/placeholder/40/40',
    lastMessage: 'Package delivered to your door',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: 'Tenant Support',
    avatar: '/api/placeholder/40/40',
    lastMessage: 'How can we help you today?',
    time: 'Monday',
    unread: 0,
    online: true,
  },
  {
    id: 5,
    name: 'Landlord',
    avatar: '/api/placeholder/40/40',
    lastMessage: 'Rent receipt sent via email',
    time: 'Friday',
    unread: 0,
    online: false,
  },
];

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'contact';
  time: string;
  status?: 'read' | string;
};

const mockMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      text: 'Hello! I submitted a maintenance request for the AC unit',
      sender: 'user',
      time: '10:15 AM',
      status: 'read',
    },
    {
      id: 2,
      text: 'Hi there! I have received your request. Let me check the details.',
      sender: 'contact',
      time: '10:20 AM',
    },
    {
      id: 3,
      text: 'Your maintenance request has been approved',
      sender: 'contact',
      time: '10:30 AM',
    },
    {
      id: 4,
      text: 'Our team will visit tomorrow between 2-4 PM',
      sender: 'contact',
      time: '10:30 AM',
    },
    { id: 5, text: 'Perfect! Thank you so much', sender: 'user', time: '10:32 AM', status: 'read' },
  ],
  2: [
    {
      id: 1,
      text: 'Hi, when can you come to fix the AC?',
      sender: 'user',
      time: '9:30 AM',
      status: 'read',
    },
    { id: 2, text: 'We will arrive at 2 PM today', sender: 'contact', time: '9:45 AM' },
  ],
  3: [{ id: 1, text: 'Package delivered to your door', sender: 'contact', time: '2:15 PM' }],
};

export default function DashboardChats() {
  const [selectedContact, setSelectedContact] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentContact = mockContacts.find((c) => c.id === selectedContact);
  const currentMessages = mockMessages[selectedContact] || [];

  const filteredContacts = mockContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput('');
    }
  };

  return (
    <div className='flex flex-1 flex-col h-[calc(100vh-48px)]'>
      <div className='flex flex-1 overflow-hidden bg-white'>
        {/* Sidebar - Contacts List */}
        <div className='w-full md:w-96 border-r border-gray-200 flex flex-col'>
          {/* Header */}
          <div className='bg-gray-100 px-4 py-3 flex items-center justify-between'>
            <Avatar className='h-10 w-10'>
              <AvatarImage src='/api/placeholder/40/40' />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className='flex gap-6'>
              <Button variant='ghost' size='icon' className='h-10 w-10 text-gray-600'>
                <MoreVertical className='h-5 w-5' />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className='px-3 py-2 bg-white border-b'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search or start new chat'
                className='pl-10 bg-gray-100 border-0'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Contacts List */}
          <ScrollArea className='flex-1'>
            {filteredContacts.map((contact) => (
              // <div
              //   key={contact.id}
              //   className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${
              //     selectedContact === contact.id ? 'bg-gray-100' : ''
              //   }`}
              //   onClick={() => setSelectedContact(contact.id)}
              // >
              <div
                key={contact.id}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50',
                  selectedContact === contact.id ? 'bg-gray-100' : ''
                )}
                onClick={() => setSelectedContact(contact.id)}
              >
                <div className='relative'>
                  <Avatar className='h-12 w-12'>
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <div className='absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white' />
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex justify-between items-baseline'>
                    <h3 className='font-medium text-sm truncate'>{contact.name}</h3>
                    <span className='text-xs text-gray-500'>{contact.time}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <p className='text-sm text-gray-600 truncate'>
                      {contact.lastMessage.slice(0, 30)}
                      {contact.lastMessage.length > 30 ? '...' : ''}
                    </p>
                    {contact.unread > 0 && (
                      <span className='bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2'>
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className='flex-1 flex flex-col'>
          {currentContact ? (
            <>
              {/* Chat Header */}
              <div className='bg-gray-100 px-4 py-3 flex items-center justify-between border-b'>
                <div className='flex items-center gap-3'>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src={currentContact.avatar} />
                    <AvatarFallback>{currentContact.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className='font-medium text-sm'>{currentContact.name}</h3>
                    <p className='text-xs text-gray-500'>
                      {currentContact.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className='flex gap-4'>
                  <Button variant='ghost' size='icon' className='h-10 w-10 text-gray-600'>
                    <Video className='h-5 w-5' />
                  </Button>
                  <Button variant='ghost' size='icon' className='h-10 w-10 text-gray-600'>
                    <Phone className='h-5 w-5' />
                  </Button>
                  <Button variant='ghost' size='icon' className='h-10 w-10 text-gray-600'>
                    <MoreVertical className='h-5 w-5' />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea
                className='flex-1 p-4 bg-gray-50'
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='%23f0f2f5'/%3E%3Cpath d='M20 20h10v10H20zM40 40h10v10H40zM60 20h10v10H60zM80 40h10v10H80z' fill='%23e9edef' fill-opacity='.4'/%3E%3C/svg%3E\")",
                }}
              >
                <div className='max-w-4xl mx-auto space-y-3'>
                  {currentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user' ? 'bg-green-100' : 'bg-white'
                        }`}
                      >
                        <p className='text-sm'>{message.text}</p>
                        <div className='flex items-center justify-end gap-1 mt-1'>
                          <span className='text-xs text-gray-500'>{message.time}</span>
                          {message.sender === 'user' && (
                            <span className='text-gray-500'>
                              {message.status === 'read' ? (
                                <CheckCheck className='h-4 w-4 text-blue-500' />
                              ) : (
                                <Check className='h-4 w-4' />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className='bg-gray-100 px-4 py-3 flex items-center gap-2'>
                <Button variant='ghost' size='icon' className='h-10 w-10 text-gray-600'>
                  <Smile className='h-5 w-5' />
                </Button>
                <Button variant='ghost' size='icon' className='h-10 w-10 text-gray-600'>
                  <Paperclip className='h-5 w-5' />
                </Button>
                <Input
                  placeholder='Type a message'
                  className='flex-1 bg-white'
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  size='icon'
                  className='h-10 w-10 bg-green-500 hover:bg-green-600'
                  onClick={handleSendMessage}
                >
                  {messageInput.trim() ? (
                    <Send className='h-5 w-5 text-white' />
                  ) : (
                    <Mic className='h-5 w-5 text-white' />
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className='flex-1 flex items-center justify-center bg-gray-50'>
              <div className='text-center'>
                <h3 className='text-2xl font-medium text-gray-600 mb-2'>WhatsApp Web</h3>
                <p className='text-gray-500'>Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const usersAdminMockData: UserAdmin[] = [
  {
    userName: 'Emma Johnson',
    email: 'emma.johnson@example.com',
    role: 'Admin',
    accountStatus: 'Active',
    registerdDate: 'May 01, 2023',
    lastLogin: 'Today',
    verified: true,
  },
  {
    userName: 'Michael Smith',
    email: 'michael.smith@example.com',
    role: 'PM',
    accountStatus: 'Active',
    registerdDate: 'Apr 14, 2023',
    lastLogin: '6 days ago',
    verified: true,
  },
  {
    userName: 'Sarah Evans',
    email: 'sarah.evans@example.com',
    role: 'Landlord',
    accountStatus: 'Pending Verification',
    registerdDate: 'Jun 20, 2023',
    lastLogin: 'Never',
    verified: false,
  },
  {
    userName: 'David Lee',
    email: 'david.lee@example.com',
    role: 'Tenant',
    accountStatus: 'Not Verified',
    registerdDate: 'Feb 25, 2023',
    lastLogin: '1 week ago',
    verified: false,
  },
  {
    userName: 'Jessica Brown',
    email: 'jessica.brown@example.com',
    role: 'PM',
    accountStatus: 'Suspended',
    registerdDate: 'Jan 10, 2023',
    lastLogin: 'Sep 12, 2023',
    verified: true,
  },
  {
    userName: 'Daniel Wilson',
    email: 'daniel.wilson@example.com',
    role: 'Landlord',
    accountStatus: 'Active',
    registerdDate: 'May 14, 2023',
    lastLogin: '6 days ago',
    verified: true,
  },
  {
    userName: 'Amanda Tumer',
    email: 'amanda.tumer@example.com',
    role: 'PM',
    accountStatus: 'Suspended',
    registerdDate: 'Feb 11, 2023',
    lastLogin: 'Today',
    verified: false,
  },
  {
    userName: 'Robert Miller',
    email: 'robert.miller@example.com',
    role: 'Landlord',
    accountStatus: 'Active',
    registerdDate: 'Mar 13, 2022',
    lastLogin: 'Never',
    verified: true,
  },
  {
    userName: 'Susan Adams',
    email: 'susan.adams@example.com',
    role: 'PM',
    accountStatus: 'Not Verified',
    registerdDate: 'Apr 12, 2023',
    lastLogin: 'Sep 26, 2023',
    verified: true,
  },
  {
    userName: 'James Clark',
    email: 'james.clark@example.com',
    role: 'Tenant',
    accountStatus: 'Active',
    registerdDate: 'May 23, 2023',
    lastLogin: '1 week ago',
    verified: true,
  },
  {
    userName: 'James Clark',
    email: 'james.clark@example.com',
    role: 'Tenant',
    accountStatus: 'Suspended',
    registerdDate: 'Apr 13, 2023',
    lastLogin: 'Sep 8, 2023',
    verified: true,
  },
];
