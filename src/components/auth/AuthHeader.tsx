export const AuthHeader = ({ isLogin }: { isLogin: boolean }) => (
  <div className='p-8 text-center'>
    <h1 className='text-3xl font-bold text-gray-900 mb-2'>
      {isLogin ? 'Welcome Back' : 'Create an account'}
    </h1>
    <p className='text-gray-600'>
      {isLogin ? 'Please enter Your details' : 'Please fill in your details to create an account'}
    </p>
  </div>
);
