import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, X, Info } from 'lucide-react';
import { useEffect } from 'react';

const toastStyles = {
  success: {
    icon: <CheckCircle2 size={20} className="text-emerald-500" />,
    border: 'border-emerald-500/20',
    accent: 'bg-emerald-500',
    label: 'Success',
  },
  error: {
    icon: <AlertCircle size={20} className="text-rose-500" />,
    border: 'border-rose-500/20',
    accent: 'bg-rose-500',
    label: 'Error',
  },
  warning: {
    icon: <AlertTriangle size={20} className="text-amber-500" />,
    border: 'border-amber-500/20',
    accent: 'bg-amber-500',
    label: 'Attention',
  },
  info: {
    icon: <Info size={20} className="text-indigo-500" />,
    border: 'border-indigo-500/20',
    accent: 'bg-indigo-500',
    label: 'Notice',
  },
};

const Toast = ({ type = 'success', message, onClose, duration = 5000 }) => {
  const style = toastStyles[type];

  // Auto-close logic
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          className="fixed top-8 right-6 z-[100] w-full max-w-sm"
        >
          <div
            className={`relative overflow-hidden bg-white/80 backdrop-blur-xl border ${style.border} shadow-2xl rounded-2xl p-4 flex items-start gap-4`}
          >
            {/* Left Accent Icon */}
            <div className="mt-0.5">{style.icon}</div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                {style.label}
              </span>
              <p className="text-sm font-semibold text-slate-800 leading-tight">{message}</p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            {/* Animated Progress Bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              className={`absolute bottom-0 left-0 h-1 ${style.accent} opacity-40`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
