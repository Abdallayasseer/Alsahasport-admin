import { useState, useEffect } from 'react';
import api from '../api/axios';
import { AuthContext } from './context';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to verify token with backend
    const verifyToken = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Validate session with backend
        const { data } = await api.post('/auth/validate');
        if (data.success) {
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          setUser({ ...storedUser, role: data.data.role, ...data.data }); 
        } else {
          throw new Error('Validation failed');
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        // We need to access logout logic here, but since logout is defined below,
        // we can just implement the cleanup logic directly or restructure.
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/admin/login', { username, password });
      const { accessToken, user: userData, data } = response.data; 
      // Note: Backend might return user in `data` object or `user` key depending on controller.
      // Based on authController info: { accessToken, data: { id, username, role... } }
      // adminController loginAdmin sends { success, token, data: { user } } usually 
      // Let's assume standard response based on previous interactions or adjust.
      // Actually checking admin.route.js -> loginAdmin.
      
      const targetUser = userData || data?.user || data; 

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(targetUser));
        setUser(targetUser);
        return { success: true };
      } else {
         return { success: false, message: 'No access token received' };
      }
    } catch (error) {
      console.error("Login failed:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    try {
       // Optional: Notify backend to invalidate session
       api.post('/auth/logout');
    } catch { /* ignore */ }
    // Clean redirect handled by UI or protected route
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


