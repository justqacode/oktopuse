export const AuthHeader = ({ route }: { route: string }) => (
  <div className='p-8 text-center'>
    <h1 className='text-3xl font-extrabold text-foreground tracking-tight mb-2'>
      {route === '/login' && 'Welcome Back'}
      {route === '/register' && 'Create an account'}
      {/* {route.startsWith('/register') && 'Create an account'} */}
      {route === '/forgotpassword' && 'Forgot Password?'}
      {route === '/reset-password' && 'Create New Password'}
      {route === '/contact' && 'Contact Us'}
      {route === '/2fa' && 'Verify Your Identity'}
    </h1>
    <p className='text-sm text-muted-foreground'>
      {route === '/login' && 'Please enter your login details'}
      {route === '/register' && 'Please fill in your details to create an account'}
      {/* {route.startsWith('/register') && 'Please fill in your details to create an account'} */}
      {route === '/forgotpassword' && 'Please enter your email'}
      {route === '/reset-password' && 'Add a new password'}
      {route === '/2fa' &&
        "We've sent a 6-digit verification code to your email address. Please copy and paste it below to continue."}
    </p>
  </div>
);
