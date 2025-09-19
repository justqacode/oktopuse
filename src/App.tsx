import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from './components/ui/tooltip';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Auth, Home } from './pages';
import Navbar from './components/layout/public/Navbar';
import DashboardLayout from './components/layout/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/dashboard-home';
import Settings from './pages/dashboard/settings';

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
    <QueryClientProvider client={new QueryClient()}>
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
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position='top-center' richColors duration={2000} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
