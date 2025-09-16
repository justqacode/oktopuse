import React from 'react';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className='min-h-screen pt-20 bg-gray-50 flex items-center justify-center p-4'>
    <div className='w-full max-w-md'>{children}</div>
  </div>
);
