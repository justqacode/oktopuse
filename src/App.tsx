import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from './components/ui/tooltip';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Auth, Home } from './pages';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <TooltipProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Auth />} />
          </Routes>
        </BrowserRouter>
        <Toaster position='top-center' richColors duration={2000} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
