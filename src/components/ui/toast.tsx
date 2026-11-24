import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [message, duration, onClose]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4"
      style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="pointer-events-auto rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-foreground shadow-2xl"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
