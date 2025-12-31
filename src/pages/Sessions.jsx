import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Monitor, Smartphone, Globe, Clock, User, Shield, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios';
import { Button } from '../components/ui/Button';

const fetchSessions = async () => {
  const { data } = await api.get('/admin/sessions/live');
  return data;
};

const Sessions = () => {
  const [search, setSearch] = useState('');

  const { data: responseData, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['sessions', 'live'],
    queryFn: fetchSessions,
    refetchInterval: 10000, // Poll every 10s
    refetchOnWindowFocus: true,
  });

  const sessions = responseData?.data?.sessions || [];
  
  // Filter sessions (client-side for now as API doesn't support search yet)
  const filteredSessions = sessions.filter(session => {
    const searchLower = search.toLowerCase();
    return (
      (session.deviceId && session.deviceId.toLowerCase().includes(searchLower)) ||
      (session.ipAddress && session.ipAddress.toLowerCase().includes(searchLower)) ||
      (session.userId?._id && session.userId._id.toLowerCase().includes(searchLower)) ||
      (session.userId?.username && session.userId.username.toLowerCase().includes(searchLower))
    );
  });

  // Sort by lastActive (descending)
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    const dateA = new Date(a.lastActive || 0);
    const dateB = new Date(b.lastActive || 0);
    return dateB - dateA;
  });

  const getDeviceIcon = (ua) => {
    if (!ua) return <Globe className="h-4 w-4 text-zinc-500" />;
    if (ua.toLowerCase().includes('mobile') || ua.toLowerCase().includes('android')) return <Smartphone className="h-4 w-4 text-indigo-400" />;
    return <Monitor className="h-4 w-4 text-purple-400" />;
  };

  const isRecent = (dateString) => {
    if (!dateString) return false;
    const diff = new Date() - new Date(dateString);
    return diff < 5 * 60 * 1000; // 5 minutes
  };

  if (isError) return <div className="p-8 text-center text-red-400">Error loading sessions...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Active Sessions 
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
              Live
            </span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">Monitor real-time user activity across devices.</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5">
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} /> 
          Refresh
        </Button>
      </div>

      <div className="flex items-center rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-md px-4 py-3 shadow-lg transition-all focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20">
        <Search className="mr-3 h-5 w-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by IP, Device ID, or User..."
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
                <th className="px-6 py-5 text-left text-[0.7rem] font-bold uppercase tracking-widest text-zinc-500">User / Code</th>
                <th className="px-6 py-5 text-left text-[0.7rem] font-bold uppercase tracking-widest text-zinc-500">Device</th>
                <th className="px-6 py-5 text-left text-[0.7rem] font-bold uppercase tracking-widest text-zinc-500">Location (IP)</th>
                <th className="px-6 py-5 text-left text-[0.7rem] font-bold uppercase tracking-widest text-zinc-500">Last Active</th>
                <th className="px-6 py-5 text-left text-[0.7rem] font-bold uppercase tracking-widest text-zinc-500">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-5"><div className="h-5 w-32 rounded bg-zinc-800 animate-pulse"></div></td>
                    <td className="px-6 py-5"><div className="h-5 w-24 rounded bg-zinc-800 animate-pulse"></div></td>
                    <td className="px-6 py-5"><div className="h-5 w-20 rounded bg-zinc-800 animate-pulse"></div></td>
                    <td className="px-6 py-5"><div className="h-5 w-16 rounded bg-zinc-800 animate-pulse"></div></td>
                    <td className="px-6 py-5"><div className="h-5 w-12 rounded bg-zinc-800 animate-pulse"></div></td>
                  </tr>
                ))
              ) : sortedSessions.length === 0 ? (
                <tr>
                   <td colSpan="5" className="px-6 py-12 text-center text-zinc-500 italic">
                      No active sessions found.
                   </td>
                </tr>
              ) : (
                sortedSessions.map((session) => (
                  <tr 
                    key={session._id} 
                    className={`group transition-all duration-200 hover:bg-white/[0.03] ${isRecent(session.lastActive) ? 'bg-indigo-500/[0.03] border-l-2 border-l-indigo-500' : 'border-l-2 border-l-transparent'}`}
                  >
                    <td className="whitespace-nowrap px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            {session.userId?.username ? (
                                <div className="font-medium text-white">{session.userId.username}</div>
                            ) : (
                                <div className="font-mono text-zinc-400 text-xs">
                                   Code: ...{session.userId?._id?.slice(-6) || 'Unknown'}
                                </div>
                            )}
                            <div className="text-[10px] uppercase tracking-wide text-zinc-600 mt-0.5">ID: {session.userId?._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                         <div className="flex items-center gap-2 text-sm text-zinc-400">
                             <div className="p-1.5 rounded-md bg-white/5">
                                {getDeviceIcon(session.userAgent)}
                             </div>
                             <div className="flex flex-col">
                                <span className="text-zinc-300 text-xs font-medium max-w-[150px] truncate" title={session.deviceId}>{session.deviceId}</span>
                                <span className="text-[10px] text-zinc-600 truncate max-w-[150px]" title={session.userAgent}>{session.userAgent || 'Unknown Agent'}</span>
                             </div>
                         </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Globe className="h-4 w-4 text-zinc-600" />
                            <span className="font-mono text-xs">{session.ipAddress || 'Unknown'}</span>
                        </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Clock className="h-4 w-4 text-zinc-600" />
                            {session.lastActive ? formatDistanceToNow(new Date(session.lastActive), { addSuffix: true }) : 'Just now'}
                        </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                        session.role.includes('ADMIN') 
                            ? 'bg-purple-500/10 text-purple-400 ring-purple-500/20'
                            : 'bg-zinc-500/10 text-zinc-400 ring-zinc-500/20'
                      }`}>
                        {session.role.includes('ADMIN') && <Shield className="h-3 w-3" />}
                        {session.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sessions;
