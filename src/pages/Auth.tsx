import {
  AuthHeader,
  AuthLayout,
  AuthTabs,
  LoginForm,
  RegisterForm,
  SocialLogin,
} from '@/components/auth';
import { ContactForm } from '@/components/auth/ContactForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPassword';
import { ResetPasswordAfterForgetForm } from '@/components/auth/ResetPasswordAfterForget';
import { useLocation, useNavigate } from 'react-router-dom';

export const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/login' ? true : false;
  const regLogin = location.pathname === '/login' || location.pathname === '/register';
  const route = location.pathname;

  return (
    <AuthLayout>
      <div className='bg-white rounded-2xl shadow-lg pb-12 overflow-hidden'>
        <AuthHeader route={route} />
        {regLogin && <AuthTabs isLogin={isLogin} navigate={navigate} />}
        <div className='px-8'>{route === '/login' && <LoginForm />}</div>
        <div className='px-8'>{route === '/register' && <RegisterForm />}</div>
        <div className='px-8'>{route === '/forgotpassword' && <ForgotPasswordForm />}</div>
        <div className='px-8'>
          {route === '/reset-password' && <ResetPasswordAfterForgetForm />}
        </div>
        <div className='px-8'>{route === '/contact' && <ContactForm />}</div>
        <div className='px-8'>
          {/* <SocialLogin /> */}
          {/* <AuthFooter isLogin={isLogin} navigate={navigate} /> */}
        </div>
      </div>
    </AuthLayout>
  );
};
