import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, User } from "lucide-react";

import { useAuth } from "../context/useAuth";
import { useIpDetection } from "../hooks/useIpDetection";
import { Button } from "../components/ui/Button";

// --- Schema Validation ---
const loginSchema = z.object({
  identifier: z.string().min(1, "Username or Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const { login, user } = useAuth();
  const { ip: clientIp } = useIpDetection();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null); // Add local error state

  // Redirect Logic:
  // If user is already authenticated, redirect to Dashboard.
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data, e) => {
    // 1. STRICT Prevent Default (Stop Page Reload)
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // 2. Reset Error State
    setError(null);

    try {
      // 3. Attempt Login
      const result = await login(data.identifier, data.password, clientIp);

      // 4. Fail-Safe Result Check & Conditional Navigation
      if (result?.success) {
        toast.success("Welcome back, Admin!");
        // Navigate ONLY on explicit success
        navigate("/admin/dashboard");
      } else {
        // 5. Handle Failure (Set Error, Do NOT Navigate)
        // Defensively access message to prevent crashes
        const failMsg = result?.message || "Invalid credentials";
        setError(failMsg);
      }
    } catch (err) {
      console.error("Login Error:", err);
      // 6. Robust Error Extraction (Prevent 'undefined' crashes)
      const serverMsg =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred.";
      setError(serverMsg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Gradients for Premium Feel */}
      <div className="pointer-events-none absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-violet-500/10 blur-[120px]" />

      <div className="w-full max-w-md space-y-8 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-10 shadow-2xl shadow-black/50 relative z-10 transition-all duration-500 hover:border-white/10">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Secure Admin Portal Access
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="rounded-md bg-red-500/10 p-4 border border-red-500/20 flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Lock className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
            <div className="flex-1 text-sm text-red-400 font-medium">
              {error}
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest ml-1 mb-2">
                Username or Email
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors duration-300">
                  <User className="h-5 w-5 text-zinc-500 group-focus-within:text-indigo-400" />
                </div>
                <input
                  type="text"
                  autoComplete="username"
                  className={`block w-full rounded-xl border bg-zinc-950/50 py-3.5 pl-11 text-white placeholder:text-zinc-600 sm:text-sm transition-all duration-300 outline-none
                    ${
                      errors.identifier
                        ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-white/5 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-white/10"
                    }`}
                  placeholder="Enter username or email"
                  {...register("identifier")}
                />
              </div>
              {errors.identifier && (
                <p className="mt-2 text-xs text-red-400 font-medium animate-pulse ml-1">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest ml-1 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors duration-300">
                  <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-indigo-400" />
                </div>
                <input
                  type="password"
                  autoComplete="current-password"
                  className={`block w-full rounded-xl border bg-zinc-950/50 py-3.5 pl-11 text-white placeholder:text-zinc-600 sm:text-sm transition-all duration-300 outline-none
                    ${
                      errors.password
                        ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-white/5 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-white/10"
                    }`}
                  placeholder="Enter your password"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-xs text-red-400 font-medium animate-pulse ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base shadow-lg shadow-indigo-500/20"
            variant="primary"
          >
            {isSubmitting ? "Authenticating..." : "Sign in to Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
