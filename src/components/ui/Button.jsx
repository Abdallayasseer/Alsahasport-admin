import clsx from 'clsx';

export const Button = ({ children, variant = 'primary', className, ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 border border-white/10',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-[0_4px_15px_rgba(244,63,94,0.3)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.5)] hover:-translate-y-0.5 border border-white/10',
    outline: 'bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-md',
    ghost: 'text-zinc-400 hover:text-white hover:bg-white/5',
  };

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
