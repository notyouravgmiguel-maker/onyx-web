import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, RotateCcw } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onUndo?: () => void;
  onClose: () => void;
}

export function UndoToast({ message, isVisible, onUndo, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 border border-white/15 shadow-2xl backdrop-blur-xl text-slate-100 text-xs font-medium"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>

          {onUndo && (
            <button
              onClick={() => {
                onUndo();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-blue-400" />
              <span>Undo</span>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UndoToast;
