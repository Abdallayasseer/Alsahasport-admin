import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/guard/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/Sessions';
import Channels from './pages/Channels';
import Codes from './pages/Codes';

// Placeholder components for routes not yet implemented

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/admin/login" element={<Login />} />
            
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/codes" element={<Codes />} />
              <Route path="/admin/channels" element={<Channels />} />
              <Route path="/admin/sessions" element={<Sessions />} />
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
          <Toaster position="top-center" reverseOrder={false} />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
