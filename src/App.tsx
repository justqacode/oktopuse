import { TooltipProvider } from './components/ui/tooltip';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Auth, Home } from './pages';
import DashboardLayout from './components/layout/dashboard/DashboardLayout';
import Settings from './pages/dashboard/settings';
import { ApolloProvider } from '@apollo/client/react';
import client from './lib/apollo-client';
import DashboardHome from './pages/dashboard/dashboard-home';
import { useAuthStore } from './auth/authStore';
import { Footer, Navbar } from './components/layout/public';
import { Verify } from './pages/Verify';
import DashboardChats from './components/dashboard-main/chats';
import PaymentHistoryManager from './pages/dashboard/manager/dashboard-payments-manager';
import OktopuseTerms from './pages/Terms';
import OktopusePrivacy from './pages/Privacy-policy';
import AboutUs from './pages/About';
import GA4RouteTracker from './lib/GA4RouteTracker';
import { config } from './config/app.config';
import AssociateAccount from './pages/dashboard/associate-account';
import { useSEO } from './hooks/useSEO';

const checkAuth = () => {
  const { user } = useAuthStore();
  return !!user;
};

function RequireAuth() {
  const isAuthenticated = checkAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
}

function PublicLayout() {
  //This is for redeployment
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function DashboardLayoutV() {
  return (
    <>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </>
  );
}

// SEO Wrapper Components
function HomePage() {
  useSEO({
    title: 'Home',
    description: 'Welcome to Oktopuse - Your platform description',
    keywords: 'oktopuse, your, keywords, here',
  });
  return <Home />;
}

function LoginPage() {
  useSEO({
    title: 'Login',
    description: 'Sign in to your Oktopuse account',
  });
  return <Auth />;
}

function RegisterPage() {
  useSEO({
    title: 'Register',
    description: 'Create your Oktopuse account today',
  });
  return <Auth />;
}

function ContactPage() {
  useSEO({
    title: 'Contact',
    description: 'Get in touch with Oktopuse support',
  });
  return <Auth />;
}

function ForgotPasswordPage() {
  useSEO({
    title: 'Forgot Password',
    description: 'Reset your Oktopuse account password',
  });
  return <Auth />;
}

function ResetPasswordPage() {
  useSEO({
    title: 'Reset Password',
    description: 'Create a new password for your account',
  });
  return <Auth />;
}

function VerifyPage() {
  useSEO({
    title: 'Verify',
    description: 'Verify your Oktopuse account',
  });
  return <Verify />;
}

function AboutPage() {
  useSEO({
    title: 'About',
    description: 'Learn more about Oktopuse and our mission',
  });
  return <AboutUs />;
}

function TermsPage() {
  useSEO({
    title: 'Terms',
    description: 'Oktopuse Terms of Service',
  });
  return <OktopuseTerms />;
}

function PrivacyPage() {
  useSEO({
    title: 'Privacy Policy',
    description: 'Oktopuse Privacy Policy - How we protect your data',
  });
  return <OktopusePrivacy />;
}

function DashboardHomePage() {
  useSEO({
    title: 'Dashboard',
    description: 'Your Oktopuse dashboard',
  });
  return <DashboardHome />;
}

function PaymentsPage() {
  useSEO({
    title: 'Payments',
    description: 'View your payment history',
  });
  return <PaymentHistoryManager />;
}

function AssociateAccountPage() {
  useSEO({
    title: 'Associate Accounts',
    description: 'Connect and manage your associated accounts',
  });
  return <AssociateAccount />;
}

function SettingsPage() {
  useSEO({
    title: 'Settings',
    description: 'Manage your account settings',
  });
  return <Settings />;
}

function MessagesPage() {
  useSEO({
    title: 'Messages',
    description: 'View your messages and conversations',
  });
  return <DashboardChats />;
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Toaster position='top-center' expand={true} richColors duration={2000} />
      <TooltipProvider>
        <BrowserRouter>
          {process.env.NODE_ENV === 'production' && (
            <GA4RouteTracker measurementId={config.GA4_MEASUREMENT_ID || ''} />
          )}
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path='/' element={<HomePage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/contact' element={<ContactPage />} />
              <Route path='/forgotpassword' element={<ForgotPasswordPage />} />
              <Route path='/reset-password' element={<ResetPasswordPage />} />
              <Route path='/verify' element={<VerifyPage />} />
              <Route path='/verify/:id' element={<VerifyPage />} />
              <Route path='/about' element={<AboutPage />} />
              <Route path='/terms' element={<TermsPage />} />
              <Route path='/privacy-policy' element={<PrivacyPage />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route element={<RequireAuth />}>
              <Route path='/dashboard' element={<DashboardLayoutV />}>
                <Route index element={<DashboardHomePage />} />
                <Route path='payments' element={<PaymentsPage />} />
                <Route path='associate-accounts' element={<AssociateAccountPage />} />
                <Route path='settings' element={<SettingsPage />} />
                <Route path='messages' element={<MessagesPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ApolloProvider>
  );
}
