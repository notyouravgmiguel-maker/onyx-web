import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Bookmark,
  Cpu,
  Database,
  Download,
  FileArchive,
  FileText,
  Layers,
  Link2,
  Music,
  Search,
  ShieldCheck,
  Image as ImageIcon,
  ArrowDown,
  LayoutGrid,
} from "lucide-react";
import icon from "../assets/icon.png";
import { PrismaHero } from "@/components/ui/prisma-hero";
import { HorizontalTicker } from "@/components/ui/horizontal-ticker";
import { InteractiveFolder } from "@/components/ui/interactive-folder";
import { CommandMenu, Kbd, modKey, type CommandItem } from "@/components/ui/command-menu";
import { Toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const FILES = {
  exe: { name: "Onyx-Browser.exe", size: "301 MB" },
  zip: { name: "Onyx-Browser-win-x64.zip", size: "301 MB" },
} as const;
type Format = keyof typeof FILES;

/** Where the installers live: downloads/ on WAMP, the GitHub Release on Pages (set at build time). */
const DOWNLOAD_BASE = import.meta.env.VITE_DOWNLOAD_BASE ?? "downloads/";
const fileUrl = (name: string) => new URL(DOWNLOAD_BASE + name, location.href).href;

/** Ignore repeat clicks on the same file for this long, so a double tap never starts two 300 MB downloads. */
const DOWNLOAD_DEDUPE_MS = 5000;

const scrollToId = (id: string, smooth = true) => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: smooth && !reduce ? "smooth" : "auto" });
};

/** In-page navigation that also lands in history, so Back returns to where you were. */
const goTo = (id: string) => {
  if (location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
  scrollToId(id);
};

const specs = [
  { icon: Layers, title: "BaseWindow views" },
  { icon: Database, title: "Local SQLite" },
  { icon: ShieldCheck, title: "Tracker blocking" },
  { icon: Cpu, title: "Electron 33" },
];

export function App() {
  const [format, setFormat] = useState<Format>("exe");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const lastDownload = useRef<{ name: string; at: number } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  const download = useCallback((which: Format) => {
    const { name } = FILES[which];
    const now = Date.now();
    if (lastDownload.current?.name === name && now - lastDownload.current.at < DOWNLOAD_DEDUPE_MS) {
      setToast(`${name} is already downloading`);
      return;
    }
    lastDownload.current = { name, at: now };

    const a = document.createElement("a");
    a.href = fileUrl(name);
    a.download = name;
    a.click();
    setToast(`Downloading ${name}`);
  }, []);

  const copyLink = useCallback(async () => {
    const url = fileUrl(FILES[format].name);
    try {
      await navigator.clipboard.writeText(url);
      setToast("Link copied");
    } catch {
      setToast(url);
    }
  }, [format]);

  const commands = useMemo<CommandItem[]>(
    () => [
      { id: "dl", title: `Download ${FILES[format].name}`, icon: Download, shortcut: "D", run: () => download(format) },
      { id: "dl-exe", title: "Download .exe", icon: Download, run: () => download("exe") },
      { id: "dl-zip", title: "Download .zip", icon: FileArchive, run: () => download("zip") },
      { id: "copy", title: "Copy download link", icon: Link2, run: copyLink },
      { id: "go-download", title: "Go to Download", icon: ArrowDown, run: () => goTo("download") },
      { id: "go-features", title: "Go to Features", icon: LayoutGrid, run: () => goTo("features") },
    ],
    [format, download, copyLink]
  );

  // Smooth-scroll every "#id" link, honour deep links once pins are laid out, and follow Back/Forward.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const id = a?.getAttribute("href")!.slice(1);
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      goTo(id);
    };
    const onPop = () => {
      const id = location.hash.slice(1);
      if (id) scrollToId(id);
      else window.scrollTo({ top: 0, behavior: "smooth" });
    };
    // The pinned ticker changes page height, so jump only after ScrollTrigger has measured it.
    const onLoad = () => {
      const id = location.hash.slice(1);
      if (!id) return;
      const jump = () => {
        ScrollTrigger.removeEventListener("refresh", jump);
        scrollToId(id, false);
      };
      ScrollTrigger.addEventListener("refresh", jump);
      ScrollTrigger.refresh();
    };

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  // "D" downloads the selected format from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (paletteOpen || e.metaKey || e.ctrlKey || e.altKey || t.matches("input, textarea, [contenteditable]")) return;
      if (e.key.toLowerCase() === "d") download(format);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [download, format, paletteOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <header className="sticky top-0 z-40 border-b border-line bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:px-6">
          <a href="#" className="mr-auto flex min-h-11 items-center gap-2.5 text-sm font-semibold tracking-tight">
            <img src={icon} alt="" width={24} height={24} className="h-6 w-6 rounded-md" />
            Onyx
          </a>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            title={`Search (${modKey}K)`}
            aria-label="Search"
            className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-2 text-muted transition-colors hover:text-foreground"
          >
            <Search className="h-4 w-4" />
            <Kbd className="hidden sm:inline">{`${modKey}K`}</Kbd>
          </button>

          <button
            type="button"
            onClick={() => download(format)}
            title="Download (D)"
            className="hit-44 inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.97]"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </header>

      <main>
        <div className="px-2 pt-2 sm:px-4 sm:pt-4">
          <PrismaHero
            title="Onyx"
            description="A fast, private browser for Windows."
            ctaLabel="Download"
            onCtaClick={() => goTo("download")}
            navItems={[
              { label: "Download", href: "#download" },
              { label: "Features", href: "#features" },
            ]}
            className="h-[calc(100svh-4rem)] sm:h-[calc(100svh-5rem)]"
          />
        </div>

        <HorizontalTicker />

        <section id="download" className="mx-auto flex max-w-xl scroll-mt-14 flex-col items-center px-4 py-32 sm:py-40">
          <h2 className="text-4xl font-medium tracking-tight sm:text-5xl">Download</h2>

          <button
            type="button"
            onClick={() => download(format)}
            title="Download (D)"
            className="group mt-10 inline-flex h-14 items-center gap-3 rounded-full bg-primary pl-7 pr-2 text-base font-medium text-primary-foreground transition-transform active:scale-[0.98]"
          >
            Download for Windows
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black transition-transform group-hover:translate-y-0.5">
              <Download className="h-4 w-4 text-primary" />
            </span>
          </button>

          <div className="mt-6 flex items-center gap-4">
            <div role="radiogroup" aria-label="Format" className="flex rounded-xl border border-line p-1">
              {(Object.keys(FILES) as Format[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  role="radio"
                  aria-checked={format === f}
                  onClick={() => setFormat(f)}
                  className={cn(
                    "min-h-11 min-w-16 rounded-lg px-4 text-sm transition-colors",
                    format === f ? "bg-white/[0.08] text-foreground" : "text-muted hover:text-foreground"
                  )}
                >
                  .{f}
                </button>
              ))}
            </div>
            <span className="text-sm tabular-nums text-muted">{FILES[format].size}</span>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-5xl scroll-mt-14 px-4 pb-24 sm:pb-32">
          <h2 className="text-center text-4xl font-medium tracking-tight sm:text-5xl">Features</h2>

          <div className="mt-16 grid grid-cols-1 place-items-center gap-y-20 sm:grid-cols-3">
            <InteractiveFolder
              size={1.4}
              color="#E1E0CC"
              label="Downloads"
              items={[
                <Download key="1" className="h-6 w-6 text-zinc-500" />,
                <FileText key="2" className="h-6 w-6 text-zinc-500" />,
                <FileArchive key="3" className="h-6 w-6 text-zinc-500" />,
              ]}
            />
            <InteractiveFolder
              size={1.4}
              color="#3F3F46"
              label="Bookmarks"
              items={[
                <Bookmark key="1" className="h-6 w-6 text-zinc-500" />,
                <ImageIcon key="2" className="h-6 w-6 text-zinc-500" />,
                <Link2 key="3" className="h-6 w-6 text-zinc-500" />,
              ]}
            />
            <InteractiveFolder
              size={1.4}
              color="#27272A"
              label="Media"
              items={[
                <Music key="1" className="h-6 w-6 text-zinc-500" />,
                <Layers key="2" className="h-6 w-6 text-zinc-500" />,
                <Cpu key="3" className="h-6 w-6 text-zinc-500" />,
              ]}
            />
          </div>

          <ul className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
            {specs.map(({ icon: Icon, title }) => (
              <li key={title} className="flex items-center gap-3 bg-background p-5 text-sm">
                <Icon className="h-4 w-4 text-muted" />
                {title}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-sm text-muted sm:px-6">
          <span>Onyx · MIT</span>
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="flex min-h-11 items-center gap-2 transition-colors hover:text-foreground"
          >
            Commands <Kbd>{`${modKey}K`}</Kbd>
          </button>
        </div>
      </footer>

      <CommandMenu open={paletteOpen} onOpenChange={setPaletteOpen} items={commands} />
      <Toast message={toast} onClose={closeToast} />
    </MotionConfig>
  );
}

export default App;
