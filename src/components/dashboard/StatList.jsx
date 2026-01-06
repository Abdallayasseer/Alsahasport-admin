import React from "react";
import { Activity, Ticket, Users, ShieldAlert } from "lucide-react";
import { Skeleton } from "../ui/Skeleton";

const StatList = ({ stats, roleData, isLoading }) => {
  // Safe Data Extraction
  const activeSessions = stats?.activeSessions || 0;
  const totalCodes = stats?.totalCodes || 0;

  // Role Breakdown (Fetched directly from DB)
  const adminCount = stats?.totalAdmins || 0;
  const userCount = stats?.activeUsers || 0;

  // Number Formatter
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {/* Skeleton Loader matching the Grid Layout */}
        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden">
          <Skeleton className="h-4 w-8 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden">
          <Skeleton className="h-4 w-8 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="col-span-2 bg-zinc-900/50 border border-white/5 p-4 rounded-xl h-24 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-12" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* 1. Critical Metric: Active Sessions */}
      <div className="relative bg-zinc-900/80 backdrop-blur-md border border-indigo-500/20 p-4 rounded-2xl flex flex-col justify-between h-32 overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
          <Activity className="w-12 h-12 text-indigo-500" />
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-indigo-500/10 rounded-lg">
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            {formatNumber(activeSessions)}
          </h3>
          <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mt-1">
            Active Sessions
          </p>
        </div>
      </div>

      {/* 2. Secondary Metric: Total Codes */}
      <div className="relative bg-zinc-900/80 backdrop-blur-md border border-emerald-500/20 p-4 rounded-2xl flex flex-col justify-between h-32 overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
          <Ticket className="w-12 h-12 text-emerald-500" />
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-emerald-500/10 rounded-lg">
            <Ticket className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            {formatNumber(totalCodes)}
          </h3>
          <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mt-1">
            Total Codes
          </p>
        </div>
      </div>

      {/* 3. User vs Admin Count (Wide Card) */}
      <div className="col-span-2 bg-zinc-900/60 border border-white/5 p-4 rounded-2xl flex items-center justify-between relative overflow-hidden">
        {/* Users Side */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">
              {formatNumber(userCount)}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
              Active Users
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-white/10 mx-4"></div>

        {/* Admins Side */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xl font-bold text-white">
              {formatNumber(adminCount)}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
              Admins
            </p>
          </div>
          <div className="p-2 bg-purple-500/10 rounded-xl">
            <ShieldAlert className="w-5 h-5 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatList;
