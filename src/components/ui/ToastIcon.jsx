import { Check, X, AlertTriangle, Info } from "lucide-react";

const ToastIcon = ({ type }) => {
  const styles = {
    success: {
      icon: <Check size={18} className="text-emerald-400" />,
      container:
        "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]",
    },
    error: {
      icon: <X size={18} className="text-rose-400" />,
      container:
        "bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)]",
    },
    warning: {
      icon: <AlertTriangle size={18} className="text-amber-400" />,
      container:
        "bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]",
    },
    info: {
      icon: <Info size={18} className="text-blue-400" />,
      container:
        "bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]",
    },
  };

  const current = styles[type] || styles.info;

  return (
    <div
      className={`p-2 rounded-full border ${current.container} backdrop-blur-sm`}
    >
      {current.icon}
    </div>
  );
};

export default ToastIcon;
