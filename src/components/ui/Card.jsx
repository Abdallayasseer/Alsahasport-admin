import clsx from 'clsx';

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-6 transition-all duration-300 group hover:border-white/10 hover:shadow-2xl hover:shadow-black/50',
        className
      )}
      {...props}
    >
        {/* Hover Gradient Effect */}
        <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
             style={{ 
               background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99,102,241,0.06), transparent 40%)' 
             }} 
        />
        
        <div className="relative z-10">
            {children}
        </div>
    </div>
  );
};
