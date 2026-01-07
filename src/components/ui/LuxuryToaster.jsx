import { Toaster } from "sonner";

const LuxuryToaster = () => {
  return (
    <Toaster
      position="bottom-right"
      theme="dark"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl flex items-center gap-4 p-4 w-full min-w-[356px] transition-all duration-300 hover:scale-[1.02] hover:bg-black/70",
          title: "text-white font-medium text-sm",
          description: "text-zinc-400 text-xs mt-0.5",
          actionButton: "bg-zinc-800 text-white hover:bg-zinc-700",
          cancelButton: "bg-zinc-800 text-white hover:bg-zinc-700",
          success:
            "border-emerald-500/20 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]",
          error:
            "border-rose-500/20 shadow-[0_0_20px_-5px_rgba(244,63,94,0.3)]",
          info: "border-blue-500/20 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]",
          warning:
            "border-amber-500/20 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]",
        },
      }}
    />
  );
};

export default LuxuryToaster;
