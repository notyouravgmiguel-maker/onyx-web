import React, { useState, useEffect } from "react";
import { Search, Download, Sparkles, BookOpen, Layers, Terminal, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
}

export function CommandMenu({ isOpen, onClose, onSelectAction }: CommandMenuProps) {
  const [query, setQuery] = useState("");

  const actions = [
    { id: "download-exe", title: "Download Onyx-Browser.exe", category: "Downloads", icon: Download, hint: "188 MB" },
    { id: "download-zip", title: "Download Portable Runtime ZIP", category: "Downloads", icon: Download, hint: "315 MB" },
    { id: "goto-hero", title: "Jump to Prisma Visual Canvas", category: "Showcase", icon: Sparkles, hint: "Section" },
    { id: "goto-squeeze", title: "Interact with 3D Physics Squeeze", category: "Interactive", icon: Layers, hint: "Physics" },
    { id: "goto-features", title: "View Core Architecture & Specs", category: "Docs", icon: BookOpen, hint: "Specs" },
    { id: "copy-link", title: "Copy Direct Download Link", category: "Utility", icon: ArrowUpRight, hint: "Clipboard" },
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectAction("toggle-command");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onSelectAction]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/15 shadow-2xl overflow-hidden text-slate-100"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search actions or jump to section..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500 text-white font-normal"
              />
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-400 border border-white/10">
                ESC
              </kbd>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/5">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No matching actions found.
                </div>
              ) : (
                filtered.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectAction(item.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-slate-200 group-hover:text-white">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {item.category}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {item.hint}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CommandMenu;
