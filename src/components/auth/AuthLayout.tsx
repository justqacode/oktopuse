import React from 'react';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className='min-h-screen pt-24 bg-gradient-to-b from-background via-muted/40 to-background flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500'>
    {/* Background glow effects */}
    <div className='absolute top-[-10%] right-[-10%] w-[30rem] h-[30rem] rounded-full bg-primary/5 opacity-20 blur-[100px] pointer-events-none'></div>
    <div className='absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] rounded-full bg-primary/5 opacity-20 blur-[100px] pointer-events-none'></div>
    
    <div className='w-full max-w-md relative z-10'>{children}</div>
  </div>
);
