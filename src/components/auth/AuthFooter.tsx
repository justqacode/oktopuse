export const AuthFooter = ({
  isLogin,
  navigate,
}: {
  isLogin: boolean;
  navigate: (p: string) => void;
}) => (
  <>
    <div className='mt-8 pb-8 text-center'>
      <p className='text-sm text-gray-600'>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => navigate(isLogin ? '/register' : '/login')}
          className='font-medium text-blue-600 hover:text-blue-800 transition-colors'
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>

    <div className='mt-8 text-center text-sm text-gray-600 px-4'>
      Join the millions of smart investors who trust us to manage their finances. Log in to access
      your personalized dashboard, track your portfolio performance, and make informed investment
      decisions.
    </div>
  </>
);
