import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/guard/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import { Loader2 } from "lucide-react";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Sessions = lazy(() => import("./pages/Sessions"));
const Channels = lazy(() => import("./pages/Channels"));
const Codes = lazy(() => import("./pages/Codes"));

const LoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
  </div>
);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/admin/login" element={<Login />} />

              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/codes" element={<Codes />} />
                <Route path="/admin/channels" element={<Channels />} />
                <Route path="/admin/sessions" element={<Sessions />} />
                <Route
                  path="/"
                  element={<Navigate to="/admin/dashboard" replace />}
                />
              </Route>

              <Route
                path="*"
                element={<Navigate to="/admin/dashboard" replace />}
              />
            </Routes>
          </Suspense>
          <Toaster position="top-center" reverseOrder={false} />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
