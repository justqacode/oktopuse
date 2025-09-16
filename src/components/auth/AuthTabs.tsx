export const AuthTabs = ({
  isLogin,
  navigate,
}: {
  isLogin: boolean;
  navigate: (path: string) => void;
}) => (
  <div className='px-8 mb-6'>
    <div className='flex bg-gray-100 rounded-lg p-1'>
      <button
        onClick={() => navigate('/login')}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
          isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Sign In
      </button>
      <button
        onClick={() => navigate('/register')}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
          !isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Signup
      </button>
    </div>
  </div>
);
