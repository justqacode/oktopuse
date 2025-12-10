import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { useIP } from '@/hooks/user-ip';
import { useAuthStore } from '@/auth/authStore';
import { config } from '@/config/app.config';

export const SocialLogin = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, isLoading } = useAuthStore();
  const ip = useIP();
  const userAgent = navigator.userAgent || 'N/A';
  const googleConfigured = Boolean(config.GOOGLE_CLIENT_ID);

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (tokenResponse) => {
      // const credential = tokenResponse?.code || tokenResponse?.access_token;
      const credential = tokenResponse?.code || '';

      if (!credential) {
        toast.error('Unable to retrieve Google credential. Please try again.');
        return;
      }

      await loginWithGoogle(credential, ip, userAgent, navigate);
    },
    onError: () => {
      toast.error('Google sign-in failed. Please try again.');
    },
    scope: 'openid profile email',
  });

  const handleGoogleClick = () => {
    if (!googleConfigured) {
      toast.error('Google sign-in is not configured. Please try again later.');
      return;
    }
    googleLogin();
  };

  return (
    <div className='mt-8'>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-gray-300' />
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='px-2 bg-white text-gray-500'>Or continue with</span>
        </div>
      </div>

      <div className='mt-6 grid grid-cols-1'>
        <button
          type='button'
          onClick={handleGoogleClick}
          disabled={isLoading || !googleConfigured}
          className='w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70'
        >
          <FcGoogle className='w-6 h-6 mr-2' />
          {isLoading ? 'Connecting...' : 'Continue with Google'}
        </button>
      </div>
    </div>
  );
};
