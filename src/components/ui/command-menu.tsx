import { useEffect, useMemo, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CommandItem {
  id: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  /** Keyboard shortcut shown as a hint, e.g. "D". */
  shortcut?: string;
  run: () => void;
}

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
}

export const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);
export const modKey = isMac ? "⌘" : "Ctrl ";

export function Kbd({ children, className }: { children: string; className?: string }) {
  return (
    <kbd
      className={cn(
        "rounded-md border border-line px-1.5 py-0.5 font-sans text-[11px] leading-none text-muted",
        className
      )}
    >
      {children}
    </kbd>
  );
}

export function CommandMenu({ open, onOpenChange, items }: CommandMenuProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const isSheet = open && window.matchMedia("(max-width: 639px)").matches;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => i.title.toLowerCase().includes(q)) : items;
  }, [items, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const run = (item?: CommandItem) => {
    if (!item) return;
    onOpenChange(false);
    item.run();
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => (a + step + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => onOpenChange(false)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-start sm:px-4 sm:pt-[15vh]"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 38 }}
            // Bottom sheet on phones: drag down to dismiss.
            drag={isSheet ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 500) onOpenChange(false);
            }}
            className="w-full overflow-hidden rounded-t-3xl border border-line bg-surface shadow-2xl sm:max-w-lg sm:rounded-2xl"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-white/15 sm:hidden" aria-hidden />
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-4 w-4 shrink-0 text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Search"
                aria-label="Search commands"
                className="h-14 w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted"
              />
              <Kbd>Esc</Kbd>
            </div>

            <ul role="listbox" className="max-h-80 overflow-y-auto p-2">
              {results.map((item, i) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} role="option" aria-selected={i === active}>
                    <button
                      type="button"
                      onMouseMove={() => setActive(i)}
                      onClick={() => run(item)}
                      className={cn(
                        "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm text-foreground",
                        i === active && "bg-white/[0.06]"
                      )}
                    >
                      <Icon className="h-4 w-4 text-muted" />
                      <span className="flex-1">{item.title}</span>
                      {item.shortcut && <Kbd>{item.shortcut}</Kbd>}
                    </button>
                  </li>
                );
              })}
              {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No results</li>}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CommandMenu;
