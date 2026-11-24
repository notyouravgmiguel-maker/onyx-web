import React, { useState, useEffect } from "react";
import { 
  Download, 
  Terminal, 
  ShieldCheck, 
  Database, 
  Layers, 
  Cpu, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Code, 
  Bookmark, 
  FolderDown, 
  Search, 
  Check, 
  ExternalLink 
} from "lucide-react";
import { PrismaHero } from "./components/ui/prisma-hero";
import { JellySqueeze } from "./components/ui/jelly-squeeze";
import { InteractiveFolder } from "./components/ui/interactive-folder";
import { HorizontalTicker } from "./components/ui/horizontal-ticker";
import { CommandMenu } from "./components/ui/command-menu";
import { UndoToast } from "./components/ui/undo-toast";

export function App() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<"installer" | "portable">("installer");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleDownload = (format: "installer" | "portable" = "installer") => {
    // Generate idempotency key for download action
    const idempotencyKey = `dl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const filename = format === "installer" ? "Onyx-Browser.exe" : "Onyx-Browser-win-x64.zip";
    const url = `downloads/${filename}`;

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    triggerToast(`Starting download: ${filename}`);
  };

  const handleCommandAction = (actionId: string) => {
    if (actionId === "download-exe") {
      handleDownload("installer");
    } else if (actionId === "download-zip") {
      handleDownload("portable");
    } else if (actionId === "goto-hero") {
      document.getElementById("hero-section")?.scrollIntoView({ behavior: "smooth" });
    } else if (actionId === "goto-squeeze") {
      document.getElementById("download-section")?.scrollIntoView({ behavior: "smooth" });
    } else if (actionId === "goto-features") {
      document.getElementById("architecture-section")?.scrollIntoView({ behavior: "smooth" });
    } else if (actionId === "copy-link") {
      const fullUrl = `${window.location.origin}${window.location.pathname}downloads/Onyx-Browser.exe`;
      navigator.clipboard.writeText(fullUrl);
      triggerToast("Download URL copied to clipboard");
    } else if (actionId === "toggle-command") {
      setCommandOpen(prev => !prev);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#080c14]/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="assets/icon.png" alt="Onyx" className="w-8 h-8 rounded-lg shadow-md shadow-blue-500/20" />
            <span className="font-bold text-base tracking-tight text-white">Onyx</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              v1.0.0
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-slate-400">
            <a href="#hero-section" className="hover:text-white transition-colors">Showcase</a>
            <a href="#download-section" className="hover:text-white transition-colors">Physics Core</a>
            <a href="#resources-section" className="hover:text-white transition-colors">Interactive Folders</a>
            <a href="#architecture-section" className="hover:text-white transition-colors">Architecture</a>
          </nav>

          <div className="flex items-center space-x-3">
            {/* Command Menu Trigger */}
            <button
              onClick={() => setCommandOpen(true)}
              className="touch-target-44 inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors"
              title="Open Command Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-400">⌘K</kbd>
            </button>

            {/* Quick Download */}
            <button
              onClick={() => handleDownload("installer")}
              className="touch-target-44 inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col space-y-24 pb-20">
        
        {/* Section 1: Prisma Hero Canvas */}
        <section id="hero-section" className="w-full pt-4 px-4 sm:px-6 max-w-7xl mx-auto">
          <PrismaHero />
        </section>

        {/* Section 2: Continuous GSAP Scroll Ticker */}
        <section className="w-full">
          <HorizontalTicker />
        </section>

        {/* Section 3: Interactive Download Section with JellySqueeze Physics */}
        <section id="download-section" className="max-w-5xl mx-auto px-6 w-full">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-wider uppercase text-blue-400">
              Interactive Hardware Acceleration
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-2">
              Feel the Responsiveness
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Jelly Component */}
            <div className="lg:col-span-7">
              <JellySqueeze 
                title="Drag vertically to squeeze" 
                showControls={true} 
                onDownload={() => handleDownload(activeTab)}
              />
            </div>

            {/* Download Hub Card */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6 p-8 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                  Verified Binary Build
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Ready for Windows
                </h3>
              </div>

              {/* Tab Selector for Format */}
              <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
                <button
                  onClick={() => setActiveTab("installer")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === "installer"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Setup Installer (.exe)
                </button>
                <button
                  onClick={() => setActiveTab("portable")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === "portable"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Portable ZIP (.zip)
                </button>
              </div>

              {/* Specs List */}
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Platform</span>
                  <span className="font-medium text-white">Windows 10 / 11 (64-bit)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">File Size</span>
                  <span className="font-mono tabular-nums text-white">
                    {activeTab === "installer" ? "188 MB (Standalone)" : "315 MB (Full Runtime)"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Runtime Core</span>
                  <span className="font-medium text-white">Electron 33 • Chromium 130</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Integrity Check</span>
                  <span className="font-mono text-emerald-400">Self-Contained DLLs Included</span>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={() => handleDownload(activeTab)}
                className="w-full touch-target-44 flex items-center justify-center space-x-2 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <Download className="w-4 h-4" />
                <span>
                  {activeTab === "installer" ? "Download Onyx-Browser.exe" : "Download Onyx-Browser-win-x64.zip"}
                </span>
              </button>

              <div className="text-[11px] text-slate-500 text-center">
                Runs out of the box with zero setup dependencies.
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Interactive Folders Showcase */}
        <section id="resources-section" className="max-w-6xl mx-auto px-6 w-full">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-wider uppercase text-blue-400">
              Interactive Storage Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-2">
              Organized with Tactile Precision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Folder 1: Downloads */}
            <div className="flex flex-col items-center p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-lg">
              <InteractiveFolder 
                size={1.2} 
                color="#2563EB" 
                label="DOWNLOADS"
                items={[
                  <FolderDown key="1" className="w-6 h-6 text-blue-400" />,
                  <FileText key="2" className="w-6 h-6 text-slate-300" />,
                  <Code key="3" className="w-6 h-6 text-emerald-400" />
                ]}
              />
              <h4 className="font-semibold text-sm text-white mt-6">Downloads Manager</h4>
              <p className="text-xs text-slate-400 text-center mt-2">
                Automated unique file path collision resolution with instant desktop reveal.
              </p>
            </div>

            {/* Folder 2: Bookmarks */}
            <div className="flex flex-col items-center p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-lg">
              <InteractiveFolder 
                size={1.2} 
                color="#0D9488" 
                label="BOOKMARKS"
                items={[
                  <Bookmark key="1" className="w-6 h-6 text-teal-400" />,
                  <Sparkles key="2" className="w-6 h-6 text-amber-300" />,
                  <ImageIcon key="3" className="w-6 h-6 text-teal-200" />
                ]}
              />
              <h4 className="font-semibold text-sm text-white mt-6">Glassmorphic Bookmarks</h4>
              <p className="text-xs text-slate-400 text-center mt-2">
                Offline local SQLite persistence with fast search and cached favicons.
              </p>
            </div>

            {/* Folder 3: Sessions */}
            <div className="flex flex-col items-center p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-lg">
              <InteractiveFolder 
                size={1.2} 
                color="#334155" 
                label="MEDIA SESSIONS"
                items={[
                  <Music key="1" className="w-6 h-6 text-blue-300" />,
                  <Layers key="2" className="w-6 h-6 text-slate-400" />,
                  <Cpu key="3" className="w-6 h-6 text-indigo-400" />
                ]}
              />
              <h4 className="font-semibold text-sm text-white mt-6">Universal Media Hub</h4>
              <p className="text-xs text-slate-400 text-center mt-2">
                Cross-frame audio capture with play/pause/seek controls for any active tab.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Architecture Specifications */}
        <section id="architecture-section" className="max-w-6xl mx-auto px-6 w-full">
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-8 sm:p-12">
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-semibold tracking-wider uppercase text-blue-400">
                Core Engineering
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                Built Without Compromise
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                <Layers className="w-6 h-6 text-blue-400 mb-3" />
                <h4 className="font-semibold text-sm text-white">BaseWindow Multi-View</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Decoupled WebContentsView stack eliminating iframe overhead.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                <Database className="w-6 h-6 text-teal-400 mb-3" />
                <h4 className="font-semibold text-sm text-white">Dual SQLite Engine</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Native better-sqlite3 with an instant WASM sql.js fallback.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mb-3" />
                <h4 className="font-semibold text-sm text-white">Zero Telemetry</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Local favicon cache directly via net.fetch. No third-party leaks.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                <Cpu className="w-6 h-6 text-indigo-400 mb-3" />
                <h4 className="font-semibold text-sm text-white">Frameless Canvas</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Seamless borderless window with integrated frosted controls.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 bg-[#060910]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-400">Onyx Browser Project</span>
            <span>•</span>
            <span>Open Architecture</span>
          </div>

          <div className="flex items-center space-x-6">
            <a href="downloads/Onyx-Browser.exe" download className="hover:text-slate-300 transition-colors">
              Onyx-Browser.exe
            </a>
            <a href="downloads/Onyx-Browser-win-x64.zip" download className="hover:text-slate-300 transition-colors">
              Portable ZIP
            </a>
            <button onClick={() => setCommandOpen(true)} className="hover:text-slate-300 transition-colors">
              Palette (⌘K)
            </button>
          </div>
        </div>
      </footer>

      {/* Command Menu Palette */}
      <CommandMenu
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        onSelectAction={handleCommandAction}
      />

      {/* Undo Toast */}
      <UndoToast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        onUndo={() => triggerToast("Action reverted")}
      />
    </div>
  );
}

export default App;
