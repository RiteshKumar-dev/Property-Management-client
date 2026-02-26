import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';

const toastStyles = {
  success: {
    icon: <CheckCircle size={20} />,
    bg: 'bg-green-100',
    text: 'text-green-700',
  },
  error: {
    icon: <AlertCircle size={20} />,
    bg: 'bg-red-100',
    text: 'text-red-700',
  },
  warning: {
    icon: <AlertTriangle size={20} />,
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
  },
};

const Toast = ({ type = 'success', message, onClose }) => {
  const style = toastStyles[type];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${style.bg} ${style.text}`}
        >
          {style.icon}
          <span className="text-sm font-medium">{message}</span>

          <button onClick={onClose}>
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
