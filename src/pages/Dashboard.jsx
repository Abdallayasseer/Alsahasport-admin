import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";
import { Card } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import {
  Users,
  Server,
  Ticket,
  TrendingUp,
  Activity,
  Copy,
  Lock,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/Button";

// GSAP Imports
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { dashboardTimeline } from "../animations/dashboardAnimations";
import { animateCardHover } from "../animations/commonAnimations";

const StatCard = ({
  title,
  value,
  change,
  gradient,
  icon: Icon,
  isLoading,
}) => {
  const cardRef = useRef(null);

  const { contextSafe } = useGSAP({ scope: cardRef });

  const handleMouseEnter = contextSafe(() => {
    !isLoading && animateCardHover(cardRef.current, true);
  });

  const handleMouseLeave = contextSafe(() => {
    !isLoading && animateCardHover(cardRef.current, false);
  });

  if (isLoading) {
    return (
      <div className="stat-card h-full">
        <Card className="relative overflow-hidden h-full p-6 flex flex-col justify-between gap-4 border-white/5 bg-zinc-900/50">
          <div className="flex justify-between items-start">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-24 w-24 rounded-full opacity-5 absolute -right-4 -top-4" />
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
          className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}
        >
          <Icon className="w-24 h-24 -mr-4 -mt-4 transform rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div
              className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10 mb-4 shadow-lg shadow-black/20 ring-1 ring-white/5`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white tracking-tight mb-1">
              {value}
            </h3>
            <p className="text-sm font-medium text-zinc-400">{title}</p>
          </div>

          <div className="mt-4 flex items-center text-xs font-medium">
            <span className="text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              {change}
            </span>
            <span className="ml-auto text-zinc-600">vs last week</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

const TimelineItem = ({ title, time, status, type, details, onCopy }) => (
  <div className="relative pl-6 pb-6 border-l border-white/5 last:pb-0 group/item">
    {/* ... TimelineItem content remains same ... */}
    <div
      className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-zinc-950 ${
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
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-zinc-500 font-mono">{time}</span>
          {details && (
            <>
              <span className="text-zinc-700">•</span>
              <span className="text-xs text-zinc-400">{details}</span>
            </>
          )}
        </div>
      </div>
      {type === "CODE_CREATED" && (
        <button
          onClick={onCopy}
          className="opacity-0 group-hover/item:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white"
          title="Reveal & Copy Code"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  </div>
);

const PasswordModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  // ... PasswordModal implementation remains same ...
  const [password, setPassword] = useState("");
  const modalRef = useRef(null);

  useGSAP(() => {
    if (isOpen) {
      gsap.from(modalRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(password);
    setPassword("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 ring-1 ring-indigo-500/20">
            <Lock className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Security Check</h3>
          <p className="text-sm text-zinc-400 mt-1">
            Please enter your admin password to reveal and copy this activation
            code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
              autoFocus
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
              disabled={!password || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Reveal Code"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const containerRef = useRef(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCodeId, setSelectedCodeId] = useState(null);
  const [isRevealing, setIsRevealing] = useState(false);

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

  // 0. System Status
  const { data: statusData, isLoading: isStatusLoading } = useQuery({
    queryKey: ["system", "status"],
    queryFn: async () => {
      const { data } = await api.get("/admin/system/status");
      return data.data;
    },
    refetchInterval: 30000,
  });

  // Calculate system status safely
  const isSystemOnline = statusData?.status === "online";

  // 1. Fetch Stats
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/stats");
      return data.data;
    },
    refetchInterval: 30000,
  });

  // 2. Fetch Weekly Stats
  const { data: weeklyData } = useQuery({
    queryKey: ["admin", "stats", "weekly"],
    queryFn: async () => {
      const { data } = await api.get("/admin/stats/weekly");
      return data.data;
    },
  });

  // 3. Fetch Activity
  const { data: activityData } = useQuery({
    queryKey: ["admin", "activity"],
    queryFn: async () => {
      const { data } = await api.get("/admin/activity");
      return data.data;
    },
    refetchInterval: 15000,
  });

  const stats = statsData || {
    totalCodes: 0,
    activeSessions: 0,
    serverLoad: 0,
    revenue: 0,
  };
  const weeklyStats = weeklyData || [];
  const activity = activityData || [];

  // Normalize weekly data for chart (ensure all 7 days exist)
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const found = weeklyStats.find((s) => s._id === dateStr);
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      value: found ? found.count : 0,
    };
  });

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
  const handleCopyRequest = (codeId) => {
    setSelectedCodeId(codeId);
    setIsModalOpen(true);
  };

  const handleRevealConfirm = async (password) => {
    if (!selectedCodeId) return;

    setIsRevealing(true);
    try {
      const { data } = await api.post(`/admin/codes/${selectedCodeId}/reveal`, {
        password,
      });
      if (data.success && data.data?.code) {
        await navigator.clipboard.writeText(data.data.code);
        toast.success("Code copied to clipboard", {
          icon: "📋",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setIsModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reveal code");
    } finally {
      setIsRevealing(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-8 max-w-7xl mx-auto">
      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleRevealConfirm}
        isLoading={isRevealing}
      />

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
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              {user?.username || "Admin"}
            </span>
          </h1>
          <p className="mt-2 text-zinc-400 max-w-xl">
            Here's what's happening in your workspace today. Server load is
            stable and user activity is trending up.
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-light text-white tracking-tighter">
            {timeString}
          </div>
          <div className="text-sm font-medium text-zinc-500 uppercase tracking-widest mt-1">
            {dateString}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Generated Codes"
          value={stats?.totalCodes?.toLocaleString() ?? "0"}
          change="+12%" // TODO: Implement calculate change
          icon={Ticket}
          gradient="from-indigo-500 to-blue-600"
          isLoading={isStatsLoading}
        />
        <StatCard
          title="Active Sessions"
          value={stats?.activeSessions?.toLocaleString() ?? "0"}
          change="+5%"
          icon={Users}
          gradient="from-violet-500 to-fuchsia-600"
          isLoading={isStatsLoading}
        />
        <StatCard
          title="Server Load"
          value={`${stats?.serverLoad ?? 0}%`}
          change="-2%"
          icon={Server}
          gradient="from-emerald-500 to-teal-600"
          isLoading={isStatsLoading}
        />
        <StatCard
          title="Est. Revenue"
          value={`$${stats?.revenue?.toLocaleString() ?? "0"}`}
          change="+8%"
          icon={TrendingUp}
          gradient="from-amber-500 to-orange-600"
          isLoading={isStatsLoading}
        />
      </div>

      {/* Recent Activity Area */}
      <div className="dashboard-content-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white">
                Weekly Code Generation
              </h3>
              <p className="text-sm text-zinc-500">
                Performance metrics over the last 7 days
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-4">
            {chartData.map((d, i) => (
              <div
                key={i}
                className="w-full bg-zinc-800/50 rounded-t-lg relative group h-full flex flex-col justify-end"
              >
                <div
                  className="w-full bg-gradient-to-t from-indigo-600/20 to-indigo-500/80 rounded-t-lg transition-all duration-500 group-hover:to-violet-500 relative"
                  style={{
                    height: `${
                      d.value > 0
                        ? (d.value /
                            Math.max(...chartData.map((c) => c.value), 10)) *
                          100
                        : 5
                    }%`,
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 px-2 py-1 rounded border border-white/10">
                    {d.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-4 mt-2 text-xs text-zinc-500 font-mono uppercase">
            {chartData.map((d, i) => (
              <span key={i}>{d.day}</span>
            ))}
          </div>
        </Card>

        {/* Timeline */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Recent Actions
            </h3>
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[320px] scrollbar-thin scrollbar-thumb-zinc-800">
            {activity.length === 0 ? (
              <div className="text-zinc-500 text-sm py-4 text-center">
                No recent activity
              </div>
            ) : (
              activity.map((item, idx) => (
                <TimelineItem
                  key={idx}
                  title={item.title}
                  time={new Date(item.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  status={item.status}
                  type={item.type}
                  details={item.details}
                  onCopy={() => handleCopyRequest(item.id)}
                />
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
