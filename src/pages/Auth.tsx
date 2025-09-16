import {
  AuthHeader,
  AuthLayout,
  AuthTabs,
  LoginForm,
  RegisterForm,
  SocialLogin,
} from '@/components/auth';
import { useRouterSwitch } from '@/components/auth/useRouterSwitch';

export const Auth = () => {
  const { route, navigate } = useRouterSwitch();
  const isLogin = route === '/login';

  return (
    <AuthLayout>
      <div className='bg-white rounded-2xl shadow-lg pb-12 overflow-hidden'>
        <AuthHeader isLogin={isLogin} />
        <AuthTabs isLogin={isLogin} navigate={navigate} />
        <div className='px-8'>{isLogin ? <LoginForm /> : <RegisterForm />}</div>
        <div className='px-8'>
          <SocialLogin />
          {/* <AuthFooter isLogin={isLogin} navigate={navigate} /> */}
        </div>
      </div>
    </AuthLayout>
  );
};
