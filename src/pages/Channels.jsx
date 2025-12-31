import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Tv, Signal, Hash, PlayCircle, Plus } from 'lucide-react';
import api from '../api/axios';
import { Button } from '../components/ui/Button';

// Mock function for now if backend doesn't support generic GET yet (it does)
const fetchChannels = async (category = '') => {
  const { data } = await api.get('/stream/channels', {
    params: { category },
  });
  return data;
};

const Channels = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ['channels', selectedCategory],
    queryFn: () => fetchChannels(selectedCategory === 'All' ? '' : selectedCategory),
  });

  const channels = responseData?.data || [];
  
  // Client-side search filtering
  const filteredChannels = channels.filter(channel => 
    channel.name.toLowerCase().includes(search.toLowerCase()) ||
    channel.category.toLowerCase().includes(search.toLowerCase())
  );

  // Derive categories from data
  const categories = ['All', ...new Set(channels.map(c => c.category))];

  if (isError) return <div className="p-8 text-center text-red-400">Error loading channels...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Channels
            <Tv className="h-6 w-6 text-indigo-500" />
          </h1>
          <p className="mt-2 text-sm text-zinc-400">Manage stream sources and categories.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Channel
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="flex-1 flex items-center rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-md px-4 py-3 shadow-lg transition-all focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20">
            <Search className="mr-3 h-5 w-5 text-zinc-500" />
            <input
            type="text"
            placeholder="Search channels..."
            className="w-full border-none bg-transparent p-0 text-sm text-white placeholder:text-zinc-600 focus:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
        </div>

        {/* Categories (Simple Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {categories.slice(0, 5).map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                        selectedCategory === cat 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                        : 'bg-zinc-900/50 text-zinc-400 border border-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
            // Skeletons
            [...Array(8)].map((_, i) => (
                <div key={i} className="aspect-video rounded-2xl bg-zinc-900 border border-white/5 p-4 animate-pulse flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="h-10 w-10 rounded-full bg-zinc-800"></div>
                        <div className="h-4 w-12 rounded bg-zinc-800"></div>
                    </div>
                    <div className="space-y-2 mt-4">
                        <div className="h-5 w-3/4 rounded bg-zinc-800"></div>
                        <div className="h-4 w-1/2 rounded bg-zinc-800"></div>
                    </div>
                </div>
            ))
        ) : filteredChannels.length === 0 ? (
            <div className="col-span-full py-12 text-center text-zinc-500">
                No channels found matching your search.
            </div>
        ) : (
            filteredChannels.map(channel => (
                <div key={channel._id} className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 p-5 transition-all hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] hover:-translate-y-1">
                    <div className="flex items-start justify-between">
                         <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-black border border-white/10 p-1">
                            {channel.logoUrl ? (
                                <img src={channel.logoUrl} alt={channel.name} className="h-full w-full object-contain" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-zinc-500">
                                    <Tv className="h-5 w-5" />
                                </div>
                            )}
                         </div>
                         <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                             channel.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                         }`}>
                             {channel.isActive ? 'Online' : 'Offline'}
                         </div>
                    </div>
                    
                    <div className="mt-4">
                        <h3 className="text-lg font-bold text-white truncate group-hover:text-indigo-400 transition-colors">{channel.name}</h3>
                        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                             <Hash className="h-3 w-3" />
                             {channel.category}
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                         <Button size="sm" variant="ghost" className="text-xs h-8">Edit</Button>
                         <Button size="sm" className="h-8 bg-white/10 hover:bg-white/20 border-0">
                            <PlayCircle className="mr-1.5 h-3 w-3" /> Preview
                         </Button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Channels;
