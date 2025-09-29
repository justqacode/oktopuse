import { TooltipProvider } from './components/ui/tooltip';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Auth, Home } from './pages';
import Navbar from './components/layout/public/Navbar';
import DashboardLayout from './components/layout/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/dashboard-home';
import Settings from './pages/dashboard/settings';
import { ApolloProvider } from '@apollo/client/react';
import client from './lib/apollo-client';
import TestPage from './pages/dashboard/test-page';

const checkAuth = () => {
  const user = 'mario';
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

function App() {
  return (
    <ApolloProvider client={client}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Auth />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route element={<RequireAuth />}>
              <Route path='/dashboard' element={<DashboardLayoutV />}>
                <Route index element={<DashboardHome />} />
                <Route path='settings' element={<Settings />} />
                <Route path='test-page' element={<TestPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position='top-center' richColors duration={2000} />
      </TooltipProvider>
    </ApolloProvider>
  );
}

export default App;
