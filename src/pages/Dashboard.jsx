import React, { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";
import { Card } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import PasswordConfirmationModal from "../components/modals/PasswordConfirmationModal";
import {
  SessionsChart,
  CodesChart,
  RoleDistChart,
} from "../components/dashboard/AnalyticsCharts";
import {
  Users,
  Server,
  Ticket,
  TrendingUp,
  Activity,
  Copy,
  Trash2,
  Lock,
  Smartphone,
  Globe,
  Monitor,
} from "lucide-react";

// GSAP Imports
import { useGSAP } from "@gsap/react";
import { dashboardTimeline } from "../animations/dashboardAnimations";
import { animateCardHover } from "../animations/commonAnimations";
import { formatDistanceToNow } from "date-fns";

// --- Constants ---
// Mocks removed for production use

// --- Components ---

const StatCard = React.memo(
  ({ title, value, change, gradient, icon: Icon, isLoading, statusColor }) => {
    const cardRef = useRef(null);
    const { contextSafe } = useGSAP({ scope: cardRef });

    const handleMouseEnter = contextSafe((e) => {
      !isLoading && animateCardHover(e.currentTarget, true);
    });

    const handleMouseLeave = contextSafe((e) => {
      !isLoading && animateCardHover(e.currentTarget, false);
    });

    if (isLoading) {
      return (
        <div className="stat-card h-full">
          <Card className="relative overflow-hidden h-full p-6 flex flex-col justify-between gap-4 border-white/5 bg-zinc-900/50">
            <div className="flex justify-between items-start">
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="stat-card"
      >
        <Card className="relative overflow-hidden group hover:border-white/20 transition-colors duration-300 h-full">
          <div
            className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-2xl bg-gradient-to-br ${gradient}`}
          />
          <div className="relative z-10 flex flex-col h-full justify-between p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-400">{title}</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">
                  {value}
                </h3>
              </div>
              <div
                className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10 shadow-lg ring-1 ring-white/5`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-medium">
              {statusColor ? (
                <span
                  className={`flex items-center gap-2 ${statusColor.replace(
                    "bg-",
                    "text-"
                  )}`}
                >
                  <span
                    className={`flex h-2 w-2 rounded-full ${statusColor} shadow-[0_0_8px_currentColor]`}
                  />
                  {value}
                </span>
              ) : change ? (
                <span className="text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3 mr-1" />+{change}% vs yesterday
                </span>
              ) : (
                <span className="text-zinc-500">No change</span>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }
);

const TimelineItem = React.memo(
  ({ title, time, status, type, details, onCopy, onDelete }) => (
    <div className="relative pl-6 pb-6 border-l border-white/5 last:pb-0 group/item">
      <div
        className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-zinc-950 ${
          status === "success"
            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            : status === "warning"
            ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
            : "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
        }`}
      />
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-medium text-zinc-200">{title}</h4>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
            <span>
              {time
                ? formatDistanceToNow(new Date(time), { addSuffix: true })
                : "Unknown time"}
            </span>
            {details && (
              <>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">{details}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
          {type === "CODE_CREATED" && (
            <>
              <button
                onClick={onCopy}
                className="p-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                title="Reveal & Copy Code"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 rounded-md hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
                title="Delete Code"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
);

const LiveSessionRow = ({ session }) => {
  const getDeviceIcon = (ua) => {
    if (!ua) return <Globe className="h-4 w-4 text-zinc-500" />;
    const lower = ua.toLowerCase();
    if (lower.includes("mobile") || lower.includes("android"))
      return <Smartphone className="h-4 w-4 text-indigo-400" />;
    return <Monitor className="h-4 w-4 text-purple-400" />;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 bg-zinc-900/40 gap-3 sm:gap-0">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400 shrink-0">
          {getDeviceIcon(session.userAgent)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs font-medium text-white font-mono truncate">
              {session.clientPublicIp || session.ipAddress}
            </p>
            <span
              className={`text-[10px] px-1.5 rounded-sm shrink-0 ${
                session.role.includes("ADMIN")
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-zinc-700 text-zinc-400"
              }`}
            >
              {session.role === "user" ? "USER" : "ADMIN"}
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 truncate max-w-[150px] sm:max-w-[120px]">
            {session.userAgent}
          </p>
        </div>
      </div>
      <div className="w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end pl-11 sm:pl-0">
        <p className="text-xs text-zinc-400">
          {session.lastActive
            ? formatDistanceToNow(new Date(session.lastActive), {
                addSuffix: true,
              })
            : "Unknown"}
        </p>
        <div
          className={`text-[9px] font-bold sm:mt-0.5 ${
            session.ipConfidence === "HIGH"
              ? "text-emerald-500"
              : "text-amber-500"
          }`}
        >
          {session.ipConfidence || "LOW"} CONF.
        </div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---

const Dashboard = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const containerRef = useRef(null);
  const queryClient = useQueryClient();
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    codeId: null,
  });

  useGSAP(
    () => {
      dashboardTimeline(containerRef);
    },
    { scope: containerRef }
  );

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // --- SINGLE ROBUST DATA FETCHING ---
  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      try {
        const res = await api.get("/admin/stats");
        console.log("Dashboard Data:", res.data); // Debug log
        return res.data.data;
      } catch (err) {
        console.error("Dashboard API Error:", err);
        throw err;
      }
    },
    refetchInterval: 30000,
  });

  // Safe Data Extraction (Defaults to 0/empty to prevent crashes)
  const stats = dashboardData?.stats || {
    totalUsers: 0,
    activeSessions: 0,
    totalCodes: 0,
    revenue: 0,
    trends: {},
  };
  const activity = dashboardData?.recentActivity || [];
  const recentSessions = dashboardData?.liveSessions || [];
  const analytics = dashboardData?.analytics || {
    sessionsChart: [],
    roleDistribution: [],
    codesChart: [],
  };

  const isSystemOnline = true; // Always online as requested

  const timeString = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
  const dateString = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);

  const handleCopyRequest = async (codeId) => {
    try {
      const { data } = await api.post(`/admin/codes/${codeId}/reveal`);
      if (data.success && data.data?.code) {
        await navigator.clipboard.writeText(data.data.code);
        toast.success("Code copied");
      }
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const confirmDelete = async (password, setError) => {
    try {
      await api.delete(`/admin/codes/${deleteModal.codeId}`);
      toast.success("Code deleted successfully");
      setDeleteModal({ isOpen: false, codeId: null });
      queryClient.invalidateQueries(["admin", "dashboard"]); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete");
    }
  };

  if (isError) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <h3 className="text-lg font-medium text-red-500">
            Failed to load dashboard data
          </h3>
          <p className="text-sm text-red-400 mt-1">
            {error?.message || "Unknown error occurred"}
          </p>
          <p className="text-xs text-zinc-500 mt-2">
            Check console for details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-8 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="dashboard-header flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div
            className={`flex items-center gap-2 ${
              isSystemOnline ? "text-emerald-400" : "text-red-400"
            } text-xs font-bold tracking-wider uppercase mb-2`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  isSystemOnline ? "bg-emerald-400" : "bg-red-400"
                } opacity-75`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isSystemOnline ? "bg-emerald-500" : "bg-red-500"
                }`}
              ></span>
            </span>
            {isSystemOnline ? "System Online" : "System Offline"}
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Good{" "}
            {date.getHours() < 12
              ? "Morning"
              : date.getHours() < 18
              ? "Afternoon"
              : "Evening"}
            ,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              {user?.username || "Admin"}
            </span>
          </h1>
          <p className="mt-2 text-zinc-400 max-w-xl">
            Here is what's happening in your application today.
          </p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-4xl font-light text-white tracking-tighter">
            {timeString}
          </div>
          <div className="text-sm font-medium text-zinc-500 uppercase tracking-widest mt-1">
            {dateString}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers?.toLocaleString() ?? "0"}
          icon={Users}
          gradient="from-indigo-500 to-indigo-600"
          isLoading={isLoading}
          change={stats.trends?.users}
        />
        <StatCard
          title="Active Sessions"
          value={stats.activeSessions?.toLocaleString() ?? "0"}
          icon={Activity}
          gradient="from-violet-500 to-fuchsia-600"
          isLoading={isLoading}
          change={stats.trends?.sessions}
        />
        <StatCard
          title="Total Codes"
          value={stats.totalCodes?.toLocaleString() ?? "0"}
          icon={Ticket}
          gradient="from-blue-500 to-cyan-600"
          isLoading={isLoading}
          change={stats.trends?.codes}
        />
        <StatCard
          title="Revenue (Est.)"
          value={`$${
            stats.revenue?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) ?? "0.00"
          }`}
          icon={TrendingUp}
          gradient="from-emerald-500 to-emerald-600"
          isLoading={isLoading}
          change={stats.trends?.revenue}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {!isLoading && <SessionsChart data={analytics.sessionsChart} />}
          {isLoading && (
            <Skeleton className="h-[300px] w-full rounded-2xl bg-zinc-900/50" />
          )}
        </div>
        <div>
          {!isLoading && <RoleDistChart data={analytics.roleDistribution} />}
          {isLoading && (
            <Skeleton className="h-[300px] w-full rounded-2xl bg-zinc-900/50" />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {!isLoading && <CodesChart data={analytics.codesChart} />}
        {isLoading && (
          <Skeleton className="h-[300px] w-full rounded-2xl bg-zinc-900/50" />
        )}
      </div>

      {/* Activity & Details */}
      <div className="dashboard-content-grid grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" /> Recent Activity
              </h3>
            </div>
            <div className="space-y-0">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="py-4 border-l border-white/5 pl-6">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))
              ) : activity.length === 0 ? (
                <p className="text-sm text-zinc-500 py-4 pl-6">
                  No recent activity
                </p>
              ) : (
                activity.map((item) => (
                  <TimelineItem
                    key={item.id}
                    {...item}
                    onCopy={() => handleCopyRequest(item.id)}
                    onDelete={() =>
                      setDeleteModal({ isOpen: true, codeId: item.id })
                    }
                  />
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Live Sessions */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" /> Live Sessions
              </h3>
              <span className="text-xs text-zinc-500">Real-time</span>
            </div>
            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))
              ) : recentSessions.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-4">
                  No active sessions
                </p>
              ) : (
                recentSessions.map((session) => (
                  <LiveSessionRow key={session._id} session={session} />
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      <PasswordConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, codeId: null })}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        description="Cannot be undone."
        variant="danger"
      />
    </div>
  );
};

export default Dashboard;
