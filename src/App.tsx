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

const checkAuth = () => {
  const { user } = useAuthStore();
  return !!user;
};

function RequireAuth() {
  const isAuthenticated = checkAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
}

function PublicLayout() {
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
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Auth />} />
              <Route path='/register' element={<Auth />} />
              <Route path='/contact' element={<Auth />} />
              <Route path='/forgotpassword' element={<Auth />} />
              <Route path='/reset-password' element={<Auth />} />
              <Route path='/verify' element={<Verify />} />
              <Route path='/verify/:id' element={<Verify />} />
              <Route path='/about' element={<AboutUs />} />
              <Route path='/terms' element={<OktopuseTerms />} />
              <Route path='/privacy-policy' element={<OktopusePrivacy />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route element={<RequireAuth />}>
              <Route path='/dashboard' element={<DashboardLayoutV />}>
                <Route index element={<DashboardHome />} />
                <Route path='payments' element={<PaymentHistoryManager />} />
                <Route path='associate-accounts' element={<AssociateAccount />} />
                <Route path='settings' element={<Settings />} />
                <Route path='messages' element={<DashboardChats />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ApolloProvider>
  );
}
