export const AuthHeader = ({ route }: { route: string }) => (
  <div className='p-8 text-center'>
    <h1 className='text-3xl font-bold text-gray-900 mb-2'>
      {route === '/login' && 'Welcome Back'}
      {route === '/register' && 'Create an account'}
      {route === '/forgotpassword' && 'Forgot Password?'}
      {route === '/reset-password' && 'Create New Password'}
      {route === '/contact' && 'Contact Us'}
    </h1>
    <p className='text-gray-600'>
      {route === '/login' && 'Please enter your login details'}
      {route === '/register' && 'Please fill in your details to create an account'}
      {route === '/forgotpassword' && 'Please enter your email'}
      {route === '/reset-password' && 'Add a new password'}
    </p>
  </div>
);
