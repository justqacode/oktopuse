export const AuthHeader = ({ route }: { route: string }) => (
  <div className='p-8 text-center'>
    <h1 className='text-3xl font-bold text-gray-900 mb-2'>
      {route === '/login' && 'Welcome Back'}
      {route === '/register' && 'Create an account'}
      {route === '/forgotpassword' && 'Forgot Password?'}
    </h1>
    <p className='text-gray-600'>
      {route === '/login' && 'Please enter Your details'}
      {route === '/register' && 'Please fill in your details to create an account'}
      {route === '/forgotpassword' && 'Please enter your email'}
    </p>
  </div>
);
