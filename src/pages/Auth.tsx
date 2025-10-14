import {
  AuthHeader,
  AuthLayout,
  AuthTabs,
  LoginForm,
  RegisterForm,
  SocialLogin,
} from '@/components/auth';
import { ForgotPasswordForm } from '@/components/auth/ForgotPassword';
import { useLocation, useNavigate } from 'react-router-dom';

export const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/login' ? true : false;
  const route = location.pathname;

  return (
    <AuthLayout>
      <div className='bg-white rounded-2xl shadow-lg pb-12 overflow-hidden'>
        <AuthHeader route={route} />
        <AuthTabs isLogin={isLogin} navigate={navigate} />
        <div className='px-8'>{route === '/login' && <LoginForm />}</div>
        <div className='px-8'>{route === '/register' && <RegisterForm />}</div>
        <div className='px-8'>{route === '/forgotpassword' && <ForgotPasswordForm />}</div>
        <div className='px-8'>
          <SocialLogin />
          {/* <AuthFooter isLogin={isLogin} navigate={navigate} /> */}
        </div>
      </div>
    </AuthLayout>
  );
};
