import { useState } from 'react';
import { Search, MoreVertical, Send, Check, CheckCheck, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import clsx from 'clsx';
import { useAuthStore } from '@/auth/authStore';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

import { toast } from 'sonner';
import formatTime from '@/utils/format-time';

const TRHEAD_QUERY = gql`
  query GetThreads {
    getThreads {
      updatedAt
      id
      participants {
        firstName
        lastName
        role
      }
    }
  }
`;

const MESSAGE_QUERY = gql`
  query GetMessages($threadId: ID!) {
    getMessages(threadId: $threadId) {
      id
      sender
      receiver
      content
      read
      createdAt
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($receiverId: ID!, $content: String!) {
    sendMessage(receiverId: $receiverId, content: $content) {
      id
      threadId
      sender
      receiver
      content
      read
      createdAt
    }
  }
`;

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'contact';
  time: string;
  status?: 'read' | string;
};

const ContactSkeleton = () => (
  <div className='flex items-center gap-3 px-4 py-3'>
    <div className='h-12 w-12 rounded-full bg-gray-200 animate-pulse shrink-0' />
    <div className='flex-1 min-w-0'>
      <div className='flex justify-between items-baseline gap-4'>
        <div className='h-3.5 w-32 bg-gray-200 animate-pulse rounded' />
        <div className='h-3 w-10 bg-gray-200 animate-pulse rounded' />
      </div>
    </div>
  </div>
);

const MessageSkeleton = ({ align }: { align: 'left' | 'right' }) => (
  <div className={`flex ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`px-4 py-2 rounded-lg space-y-2 ${align === 'right' ? 'bg-green-50' : 'bg-white'}`}
    >
      <div className='h-3 bg-gray-200 animate-pulse rounded w-48' />
      <div className='h-3 bg-gray-200 animate-pulse rounded w-32' />
      <div className='flex justify-end'>
        <div className='h-2.5 bg-gray-200 animate-pulse rounded w-10' />
      </div>
    </div>
  </div>
);

const messageskeletons = [
  { id: 1, align: 'left' },
  { id: 2, align: 'right' },
  { id: 3, align: 'left' },
] as const;

export default function DashboardChats() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();

  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(SEND_MESSAGE_MUTATION);

  const { data: thread, loading: threadsLoading } = useQuery<any>(TRHEAD_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  const threadsFormatted =
    thread?.getThreads?.map((thr: any) => ({
      updatedAt: formatTime(thr.updatedAt),
      id: thr.id,
      participant: `${thr?.participants[0]?.firstName} ${thr.participants[0]?.lastName}`,
    })) || [];

  const {
    data: threadEff,
    loading: messagesLoading,
    refetch: refetchMessages,
  } = useQuery<any>(MESSAGE_QUERY, {
    fetchPolicy: 'cache-and-network',
    skip: !selectedContact,
    variables: {
      threadId: selectedContact,
    },
  });

  // console.log('threadEff', threadEff);

  const mockContacts: any = threadsFormatted.map((thr: any) => ({
    id: thr.id,
    name: thr.participant,
    avatar: '/api/placeholder/40/40',
    time: thr.updatedAt,
  }));

  const currentContact = mockContacts.find((c: any) => c.id === selectedContact);
  // const currentMessages = mockMessages[selectedContact] || [];

  const filteredContacts = mockContacts.filter((contact: any) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // const handleSendMessage = () => {
  //   if (messageInput.trim()) {
  //     setMessageInput('');
  //   }
  // };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      const { data: result } = await sendMessageMutation({
        variables: {
          receiverId: user?.managerInfo?.managerID,
          content: messageInput.trim(),
        },
      });

      if (result) {
        setMessageInput('');
        refetchMessages();
      }
    } catch (error: any) {
      toast.error(`Failed to send message: ${error.message}`);
    }
  };

  const messagesData = threadEff?.getMessages || [];
  const messagesFormatted = messagesData.map((msg: any) => ({
    id: msg.createdAt,
    messageId: msg.id,
    text: msg.content,
    sent: msg.sender,
    received: msg.receiver,
    sender: msg.sender === user?.id ? 'user' : 'contact',
    time: formatTime(msg.createdAt),
  }));

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
            {threadsLoading
              ? Array.from({ length: 3 }).map((_, i) => <ContactSkeleton key={i} />)
              : filteredContacts.map((contact: any) => (
                  <div
                    key={contact.id}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50',
                      selectedContact === contact.id ? 'bg-gray-100' : '',
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
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className='flex-1 min-h-0 p-4 bg-gray-50'>
                <div className='max-w-4xl mx-auto space-y-3'>
                  {messagesLoading
                    ? messageskeletons.map((s) => <MessageSkeleton key={s.id} align={s.align} />)
                    : messagesFormatted?.map((message: any) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
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
                <Input
                  placeholder='Type a message'
                  className='flex-1 bg-white'
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !sendingMessage && handleSendMessage()}
                  disabled={sendingMessage}
                />
                <Button
                  size='icon'
                  className='h-8 w-8 bg-green-500 hover:bg-green-600'
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !messageInput.trim()}
                >
                  {sendingMessage ? (
                    <Loader2 className='h-5 w-5 text-white animate-spin' />
                  ) : (
                    <Send className='h-5 w-5 text-white' />
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className='flex-1 flex items-center justify-center bg-gray-50'>
              <div className='text-center'>
                <h3 className='text-2xl font-medium text-gray-600 mb-2'>No new Messages</h3>
                <p className='text-gray-500'>Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
