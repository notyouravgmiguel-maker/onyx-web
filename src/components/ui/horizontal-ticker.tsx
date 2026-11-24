import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Sparkles, Compass, ShieldCheck, Zap, Globe, Layers } from "lucide-react";

export function HorizontalTicker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    // Smooth horizontal marquee ticker animation
    const track = trackRef.current;
    const tween = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: 28,
      repeat: -1,
    });

    let lastScroll = window.scrollY;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScroll;
      lastScroll = currentScroll;

      // React to scroll velocity like a physical tape
      gsap.to(tween, {
        timeScale: 1 + Math.min(Math.abs(delta) * 0.05, 4),
        duration: 0.3,
        onComplete: () => {
          gsap.to(tween, { timeScale: 1, duration: 0.8 });
        },
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      tween.kill();
    };
  }, []);

  const renderContent = () => (
    <div className="flex items-center space-x-8 sm:space-x-12 px-6 shrink-0">
      <span className="text-2xl sm:text-4xl md:text-5xl font-light text-slate-300 tracking-tight">
        In every bottle
      </span>

      {/* Inline visual element acting as punctuation / conjunction */}
      <span className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400">
        <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 animate-pulse" />
      </span>

      <span className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-slate-100">
        discover the undeniable
      </span>

      {/* SVG wavy connector */}
      <svg className="w-16 sm:w-24 h-6 text-blue-400" viewBox="0 0 100 24" fill="none">
        <path d="M0 12 Q 25 0, 50 12 T 100 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-white bg-clip-text">
        Real Magic
      </span>

      <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs sm:text-sm font-mono text-blue-300">
        <Zap className="w-3.5 h-3.5 mr-1.5 text-blue-400 inline" /> 60 FPS Flow
      </span>

      <span className="text-2xl sm:text-4xl md:text-5xl font-light text-slate-300">
        of sharing pure
      </span>

      <span className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
        Refreshment
      </span>

      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-300">
        <Compass className="w-4 h-4" />
      </span>

      <span className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-slate-200">
        that brings us
      </span>

      {/* Pill badge */}
      <span className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white border-b-2 border-blue-500 pb-1">
        Together
      </span>

      <span className="text-slate-600 text-3xl font-light select-none">•</span>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="relative w-full py-12 overflow-hidden border-y border-white/10 bg-[#070b12] select-none"
    >
      {/* Edge gradient masks for seamless ticker look */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-40 z-10 bg-gradient-to-r from-[#070b12] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-40 z-10 bg-gradient-to-l from-[#070b12] to-transparent" />

      {/* Infinite Flex Track */}
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {renderContent()}
        {renderContent()}
      </div>
    </div>
  );
}

export default HorizontalTicker;
