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
  Tv,
  BarChart,
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
          {/* Subtle Background Gradient */}
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
              {formatDistanceToNow(new Date(time), { addSuffix: true })}
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
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 bg-zinc-900/40">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
          {getDeviceIcon(session.userAgent)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-white font-mono">
              {session.clientPublicIp || session.ipAddress}
            </p>
            <span
              className={`text-[10px] px-1.5 rounded-sm ${
                session.role.includes("ADMIN")
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-zinc-700 text-zinc-400"
              }`}
            >
              {session.role === "user" ? "USER" : "ADMIN"}
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 truncate max-w-[120px]">
            {session.userAgent}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-zinc-400">
          {session.lastActive
            ? formatDistanceToNow(new Date(session.lastActive), {
                addSuffix: true,
              })
            : "Unknown"}
        </p>
        {/* Confidence Indicator */}
        <div
          className={`text-[9px] font-bold mt-0.5 ${
            session.ipConfidence === "HIGH"
              ? "text-emerald-500"
              : "text-amber-500"
          }`}
        >
          {session.ipConfidence} CONF.
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const containerRef = useRef(null);
  const queryClient = useQueryClient();

  // Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    codeId: null,
  });

  // Initialize Dashboard Animations
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

  // 1. System Status
  const { data: statusData } = useQuery({
    queryKey: ["system", "status"],
    queryFn: async () => (await api.get("/admin/system/status")).data.data,
    refetchInterval: 30000,
  });

  const isSystemOnline = statusData?.status === "online";

  // 2. Fetch Stats (With Trends)
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => (await api.get("/admin/stats")).data.data,
    refetchInterval: 30000,
  });

  // 3. Fetch Activity
  const { data: activityData } = useQuery({
    queryKey: ["admin", "activity"],
    queryFn: async () => (await api.get("/admin/activity")).data.data,
    refetchInterval: 15000,
  });

  // 4. Fetch Analytics (New Endpoint)
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => (await api.get("/admin/analytics")).data.data,
    refetchInterval: 60000, // Cached longer
  });

  // 5. Fetch Live Sessions Preview
  const { data: sessionsData } = useQuery({
    queryKey: ["sessions", "live"],
    queryFn: async () => (await api.get("/admin/sessions/live")).data.data,
    refetchInterval: 10000,
  });

  const stats = statsData || {};
  const trends = stats.trends || {};
  const activity = activityData || [];
  const recentSessions = sessionsData?.sessions?.slice(0, 5) || [];

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

  // Handlers
  const handleCopyRequest = async (codeId) => {
    try {
      const { data } = await api.post(`/admin/codes/${codeId}/reveal`);
      if (data.success && data.data?.code) {
        await navigator.clipboard.writeText(data.data.code);
        toast.success("Code copied to clipboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reveal code");
    }
  };

  const confirmDelete = async (password, setError) => {
    try {
      await api.post("/admin/verify-master-password", { password });
      await api.delete(`/admin/codes/${deleteModal.codeId}`);
      toast.success("Code deleted successfully");
      setDeleteModal({ isOpen: false, codeId: null });
      queryClient.invalidateQueries(["admin", "activity"]);
      queryClient.invalidateQueries(["admin", "stats"]);
      queryClient.invalidateQueries(["admin", "analytics"]);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div ref={containerRef} className="space-y-8 max-w-[1600px] mx-auto pb-10">
      {/* Header Section */}
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

      {/* 2. Key Metrics Grid (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers?.toLocaleString() ?? "0"}
          icon={Users}
          gradient="from-indigo-500 to-indigo-600"
          isLoading={isStatsLoading}
          change={trends.users}
        />
        <StatCard
          title="Active Sessions"
          value={stats.activeSessions?.toLocaleString() ?? "0"}
          icon={Activity}
          gradient="from-violet-500 to-fuchsia-600"
          isLoading={isStatsLoading}
          change={trends.sessions}
        />
        <StatCard
          title="Total Codes"
          value={stats.totalCodes?.toLocaleString() ?? "0"}
          icon={Ticket}
          gradient="from-blue-500 to-cyan-600"
          isLoading={isStatsLoading}
          change={trends.codes}
        />
        <StatCard
          title="Server Load"
          value={`${stats.serverLoad}%`}
          icon={Server}
          gradient={
            stats.serverLoad > 80
              ? "from-red-500 to-red-600"
              : "from-emerald-500 to-emerald-600"
          }
          isLoading={isStatsLoading}
          statusColor={stats.serverLoad > 80 ? "bg-red-500" : "bg-emerald-500"}
        />
      </div>

      {/* 3. Analytics Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          {isAnalyticsLoading ? (
            <Skeleton className="h-[400px] w-full rounded-xl" />
          ) : (
            <SessionsChart data={analyticsData?.sessionsChart || []} />
          )}
        </div>
        <div className="xl:col-span-1">
          {isAnalyticsLoading ? (
            <Skeleton className="h-[400px] w-full rounded-xl" />
          ) : (
            <RoleDistChart data={analyticsData?.roleDistribution || []} />
          )}
        </div>
      </div>

      {/* 4. Activity & Live Details */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Pages/Activity */}
        <div className="xl:col-span-2 space-y-6">
          {isAnalyticsLoading ? (
            <Skeleton className="h-[400px] w-full rounded-xl" />
          ) : (
            <CodesChart data={analyticsData?.codesChart || []} />
          )}
        </div>

        {/* Right Column: Live Feed & Activity */}
        <div className="space-y-6">
          {/* Live Sessions Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Live Activity
              </h3>
              <span className="text-xs text-zinc-500">Real-time</span>
            </div>
            <div className="space-y-3">
              {recentSessions.length === 0 ? (
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

          {/* Audit Log */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-zinc-400" />
                Audit Log
              </h3>
            </div>
            <div className="space-y-0 relative">
              <div className="absolute left-[9px] top-2 bottom-2 w-[1px] bg-white/5"></div>
              {activity.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-4">
                  No recent activity
                </p>
              ) : (
                activity.map((item, idx) => (
                  <TimelineItem
                    key={idx}
                    title={item.title}
                    time={item.time}
                    status={item.status}
                    type={item.type}
                    details={item.details}
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
      </div>

      {/* Delete Confirmation Modal */}
      <PasswordConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, codeId: null })}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        description="This action cannot be undone. Please enter your master password to confirm deletion."
        variant="danger"
      />
    </div>
  );
};

export default Dashboard;
