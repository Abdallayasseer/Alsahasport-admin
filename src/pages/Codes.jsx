import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Ticket,
  Users,
  Clock,
  Copy,
  Check,
  Lock,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLuxuryToast } from "../hooks/useLuxuryToast";

import api from "../api/axios";
import RoleGuard from "../components/guard/RoleGuard";
import { Button } from "../components/ui/Button";
import PasswordConfirmationModal from "../components/modals/PasswordConfirmationModal";
// Removed duplicate import

// --- API Functions ---
const fetchCodes = async (page = 1, limit = 10, search = "") => {
  const { data } = await api.get("/admin/codes", {
    params: { page, limit, search },
  });
  return data;
};

const createCode = async (codeData) => {
  const { data } = await api.post("/admin/codes", codeData);
  return data;
};

// Removed verifyPassword function

// --- Validation ---
const codeSchema = z.object({
  durationDays: z.number().min(1, "Duration must be at least 1 day"),
  maxDevices: z.number().min(1, "Max devices must be at least 1"),
});

const Codes = () => {
  const toast = useLuxuryToast();
  const [search, setSearch] = useState("");
  // Security Verification State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'DELETE' | 'REVEAL'
    variant: "info", // ADDED DEFAULT
    data: null, // { id: string }
    title: "",
    description: "",
  });

  // ... (Lines 59-411 unchanged) ...

  const [isVerifying, setIsVerifying] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createdCode, setCreatedCode] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const queryClient = useQueryClient();

  // Backend doesn't support pagination yet, so we just fetch all.
  const {
    data: responseData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["codes", search],
    queryFn: () => fetchCodes(1, 1000, search), // Fetch all (pseudo)
    keepPreviousData: true,
  });

  const codes = responseData?.data || [];

  const createMutation = useMutation({
    mutationFn: createCode,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["codes"]);
      toast.success("Code created successfully! 🎉");
      setIsCreateModalOpen(false);
      setCreatedCode(response.data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create code");
    },
  });

  /* Updated Delete Mutation (Direct Delete) */
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      // Step 1: Proceed with Delete (no password)
      await api.delete(`/admin/codes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["codes"]);
      toast.success("Code deleted permanently 🗑️");
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Could not delete code";
      toast.error(msg);
    },
  });

  const handleDeleteClick = (id) => {
    setConfirmModal({
      isOpen: true,
      type: "DELETE",
      variant: "danger",
      data: { id },
      title: "Delete Activation Code",
      description:
        "You are about to permanently delete this activation code. This action requires Master Admin authentication.",
    });
  };

  const handleRevealClick = (id) => {
    setConfirmModal({
      isOpen: true,
      type: "REVEAL",
      variant: "info",
      data: { id },
      title: "Reveal & Copy Code",
      description:
        "You are viewing a hidden security code. Please confirm your Master Admin password to reveal and copy it.",
    });
  };

  const handlePasswordVerified = async (password, setModalError) => {
    setIsVerifying(true);
    try {
      // 1. Verify Password with Backend
      await api.post("/admin/verify-master-password", { password });

      // 2. Perform Action based on Type
      if (confirmModal.type === "DELETE") {
        await deleteMutation.mutateAsync(confirmModal.data.id);
        setConfirmModal({ ...confirmModal, isOpen: false });
      } else if (confirmModal.type === "REVEAL") {
        await executeReveal(confirmModal.data.id, password);
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    } catch (err) {
      console.error(err);
      const isAuthError = err.response?.status === 401;

      if (isAuthError) {
        setModalError("Incorrect Master Admin password");
        // Do NOT close modal
      } else {
        setModalError(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = async (text, id = null) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }
      toast.success("Copied to clipboard! 📋");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(codeSchema),
  });

  const onSubmitCreate = (data) => {
    createMutation.mutate(data);
    reset();
  };

  const executeReveal = async (id, password) => {
    try {
      // Step 2: Reveal & Copy (Direct)
      const { data } = await api.post(`/admin/codes/${id}/reveal`, {
        password,
      });
      await navigator.clipboard.writeText(data.data.code);
      toast.success("Copied to clipboard! 📋");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reveal failed");
    }
  };

  if (isError)
    return (
      <div className="p-8 text-center text-red-400">Error loading codes...</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Access Codes
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Manage digital access keys.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Generate Code
        </Button>
      </div>

      <div className="flex items-center rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-md px-4 py-3 shadow-lg transition-all focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20">
        <Search className="mr-3 h-5 w-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search codes..."
          className="w-full border-none bg-transparent p-0 text-sm text-white placeholder:text-zinc-600 focus:ring-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-6 py-5 text-left text-[0.7rem] font-bold uppercase tracking-widest text-zinc-500">
                  Code ID
                </th>
                <th className="px-6 py-5 text-left text-[0.7rem] font-bold uppercase tracking-widest text-zinc-500">
                  Duration
                </th>
                <th className="px-6 py-5 text-left text-[0.7rem] font-bold uppercase tracking-widest text-zinc-500">
                  Capacity
                </th>
                <th className="px-6 py-5 text-left text-[0.7rem] font-bold uppercase tracking-widest text-zinc-500">
                  Status
                </th>
                <th className="px-6 py-5 text-right text-[0.7rem] font-bold uppercase tracking-widest text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading
                ? // Dark Skeletons
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-5">
                        <div className="h-5 w-32 rounded bg-zinc-800 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-5 w-16 rounded bg-zinc-800 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-5 w-20 rounded bg-zinc-800 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-5 w-16 rounded bg-zinc-800 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-5 w-8 rounded bg-zinc-800 animate-pulse ml-auto"></div>
                      </td>
                    </tr>
                  ))
                : codes.map((code) => (
                    <tr
                      key={code._id}
                      className="group transition-all duration-200 hover:bg-white/[0.03]"
                    >
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                            <Ticket className="h-5 w-5" />
                          </div>
                          <div className="font-mono text-zinc-400 text-xs">
                            ...{code._id.slice(-6)}
                          </div>
                          <RoleGuard allowedRoles={["MASTER_ADMIN"]}>
                            <button
                              onClick={() => handleRevealClick(code._id)}
                              className="ml-2 rounded-md p-1 hover:bg-white/10 text-zinc-500 hover:text-white transition-all focus:outline-none"
                              title="Copy Code"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </RoleGuard>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Clock className="h-4 w-4 text-zinc-600" />
                          {code.durationDays} Days
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Users className="h-4 w-4 text-zinc-600" />
                          <span className="text-zinc-200">
                            {code.usedCount || 0}
                          </span>{" "}
                          / {code.maxDevices}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                            code.status === "active" || code.status === "unused"
                              ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]"
                              : "bg-red-500/10 text-red-400 ring-red-500/20"
                          }`}
                        >
                          {code.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-right text-sm font-medium">
                        <RoleGuard allowedRoles={["MASTER_ADMIN"]}>
                          <button
                            onClick={() => handleDeleteClick(code._id)}
                            className="text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 bg-white/5 p-2 rounded-lg hover:bg-white/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </RoleGuard>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal (Dark Theme) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-all animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-white/10 p-8 shadow-2xl ring-1 ring-white/10">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">
                Generate Access Key
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Create a new secure entry point.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide">
                    Validity (Days)
                  </label>
                  <input
                    type="number"
                    {...register("durationDays", { valueAsNumber: true })}
                    className="mt-2 block w-full rounded-xl border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.durationDays && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.durationDays.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide">
                    Max Devices
                  </label>
                  <input
                    type="number"
                    {...register("maxDevices", { valueAsNumber: true })}
                    className="mt-2 block w-full rounded-xl border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.maxDevices && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.maxDevices.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="shadow-indigo-500/20"
                >
                  {createMutation.isLoading ? "Generating..." : "Create Key"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <PasswordConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handlePasswordVerified}
        title={confirmModal.title}
        description={confirmModal.description}
        isLoading={isVerifying}
        variant={confirmModal.variant}
      />

      {/* Success/Copy Code Modal */}
      {createdCode && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all animate-in fade-in duration-300">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-emerald-500/30 p-8 shadow-[0_0_50px_rgba(16,185,129,0.1)] ring-1 ring-white/10">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">Success!</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Access Key Generated Successfully.
              </p>

              <div className="mt-6 w-full rounded-xl border border-white/10 bg-black/40 p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Your Access Code
                </p>
                <div className="flex items-center justify-between gap-3">
                  <code className="text-xl font-mono font-bold text-emerald-400 tracking-wider">
                    {createdCode.code}
                  </code>
                  <Button
                    onClick={() => copyToClipboard(createdCode.code, "created")}
                    size="sm"
                    className="bg-zinc-800 hover:bg-zinc-700 text-white border-white/5"
                  >
                    {copiedId === "created" ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <Copy className="mr-2 h-4 w-4" />
                    )}
                    {copiedId === "created" ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-xs text-yellow-500/80 bg-yellow-500/5 px-3 py-2 rounded-lg border border-yellow-500/10">
                Warning: This code is only visible once. Copy it now.
              </div>

              <div className="mt-8 w-full">
                <Button onClick={() => setCreatedCode(null)} className="w-full">
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Codes;
