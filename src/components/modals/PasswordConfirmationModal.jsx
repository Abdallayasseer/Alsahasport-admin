import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Shield, Lock, AlertTriangle, X, Check, Key } from "lucide-react";
import { Button } from "../ui/Button";

const PasswordConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Security Verification",
  description = "Please verify your master credentials to proceed.",
  isLoading = false,
  variant = "danger", // 'danger' | 'info'
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      setError(null);
      await onConfirm(password, (errorMessage) => {
        setError(errorMessage);
        setPassword("");
        inputRef.current?.focus();
      });
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    }
  };

  if (!isOpen) return null;

  // Theme Configuration
  const isDanger = variant === "danger";
  const theme = {
    color: isDanger ? "red" : "indigo",
    borderColor: isDanger ? "border-red-500/20" : "border-indigo-500/20",
    shadowColor: isDanger
      ? "shadow-[0_0_50px_rgba(239,68,68,0.15)]"
      : "shadow-[0_0_50px_rgba(99,102,241,0.15)]",
    iconBg: isDanger ? "bg-red-500/10" : "bg-indigo-500/10",
    iconText: isDanger ? "text-red-500" : "text-indigo-400",
    ring: isDanger ? "ring-red-500/20" : "ring-indigo-500/20",
    headerBg: isDanger ? "bg-red-500/5" : "bg-indigo-500/5",
    headerBorder: isDanger ? "border-red-500/10" : "border-indigo-500/10",
    focusRing: isDanger ? "focus:ring-red-500/20" : "focus:ring-indigo-500/20",
    focusBorder: isDanger
      ? "focus:border-red-500/50"
      : "focus:border-indigo-500",
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div
        className={`w-full max-w-[420px] bg-zinc-900/90 backdrop-blur-xl rounded-2xl border ${theme.borderColor} ${theme.shadowColor} overflow-hidden scale-100 animate-in zoom-in-95 duration-200 ring-1 ring-white/5`}
      >
        {/* Header */}
        <div
          className={`${theme.headerBg} px-6 py-4 border-b ${theme.headerBorder} flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${theme.iconBg} ${theme.iconText} ring-1 ring-inset ${theme.ring}`}
            >
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {isDanger ? "Destructive Action" : "Protected Action"}
              </h3>
              <p className="text-[10px] text-zinc-500 font-medium">
                Master Admin Verification
              </p>
            </div>
          </div>
          {!isLoading && (
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-7">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10">
              {isDanger ? (
                <AlertTriangle className="h-6 w-6 text-red-500" />
              ) : (
                <Key className="h-6 w-6 text-indigo-400" />
              )}
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-[300px] mx-auto">
              {description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest ml-1">
                Master Password
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock
                    className={`h-4 w-4 ${
                      error ? "text-red-400" : "text-zinc-500"
                    } transition-colors group-focus-within:text-white`}
                  />
                </div>
                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  className={`block w-full rounded-xl border bg-black/40 py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 sm:text-sm transition-all outline-none ring-2 ring-transparent
                    ${
                      error
                        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
                        : `border-white/10 hover:border-white/20 ${theme.focusBorder} ${theme.focusRing}`
                    }`}
                  placeholder="Enter secure password..."
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>

              {/* Error Message Area */}
              {error && (
                <div className="flex items-center gap-2 text-xs text-red-400 font-medium animate-in slide-in-from-top-1 fade-in px-1">
                  <AlertTriangle className="h-3 w-3" />
                  {error}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
                className="w-full text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !password}
                className={`w-full shadow-lg transition-all duration-300 overflow-hidden relative group ${
                  error ? "shadow-red-900/20" : theme.shadowColor
                }`}
                variant={isDanger || error ? "destructive" : "primary"}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify
                      <Check className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </>
                  )}
                </span>
                {!isDanger && !error && (
                  <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PasswordConfirmationModal;
