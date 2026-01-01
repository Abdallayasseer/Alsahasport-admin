import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Shield, Lock, AlertTriangle, X } from "lucide-react";
import { Button } from "../ui/Button";

const PasswordConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Security Verification",
  description = "Please enter your Master Admin password to verify your identity.",
  isLoading = false,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError(null);
      // Small timeout to ensure render is complete
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
      // Clear previous errors before attempt
      setError(null);
      // Call parent handler
      await onConfirm(password, (errorMessage) => {
        setError(errorMessage);
        setPassword(""); // Clear password on error
        inputRef.current?.focus();
      });
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[400px] bg-zinc-900 rounded-2xl border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)] overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-red-500/5 px-6 py-4 border-b border-red-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 ring-1 ring-inset ring-red-500/20">
              <Shield className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Protected Action
            </h3>
          </div>
          {!isLoading && (
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
                Master Password
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock
                    className={`h-4 w-4 ${
                      error ? "text-red-400" : "text-zinc-500"
                    } transition-colors`}
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
                  className={`block w-full rounded-lg border bg-black/40 py-2.5 pl-10 pr-3 text-white placeholder:text-zinc-600 sm:text-sm focus:outline-none focus:ring-2 transition-all
                    ${
                      error
                        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                        : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-white/20"
                    }`}
                  placeholder="Enter password..."
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>

              {/* Error Message Area */}
              {error && (
                <div className="mt-2 flex items-center gap-2 text-xs text-red-400 font-medium animate-in slide-in-from-top-1 fade-in">
                  <AlertTriangle className="h-3 w-3" />
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
                className="text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !password}
                className={`min-w-[100px] shadow-lg ${
                  error ? "shadow-red-900/20" : "shadow-indigo-500/20"
                }`}
                variant={error ? "destructive" : "primary"}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Verifying...
                  </span>
                ) : (
                  "Confirm"
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
