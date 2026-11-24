import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { Check, Download, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

interface JellySqueezeProps {
  /**
   * Whether to show the bottom controls
   * @default true
   */
  showControls?: boolean;
  /**
   * Background color class
   * @default "bg-transparent"
   */
  className?: string;
  /**
   * Title text to display above the jelly
   * @default "Squeeze to Launch Download"
   */
  title?: string;
  onDownload?: () => void;
}

export function JellySqueeze({ 
  showControls = true, 
  className,
  title = "Drag vertically to squeeze",
  onDownload
}: JellySqueezeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragTriggerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [followMouse, setFollowMouse] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  // Animation refs to persist across renders
  const animState = useRef({
    totalFrames: 215,
    startFrame: 70,
    images: [] as HTMLImageElement[],
    currentFrame: -1,
    dragFrame: 70, // Start at startFrame
    displayFrame: 70, // Start at startFrame
    dragSensitivity: 5.2,
    smoothing: 0.11,
    startTime: 0,
    rafId: 0,
    isMounted: false
  });

  // Preload images
  useEffect(() => {
    animState.current.isMounted = true;
    const totalFrames = animState.current.totalFrames;
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    const loadImages = async () => {
      // Batch load slightly to not freeze UI but load fast
      for (let i = 0; i < totalFrames; i++) {
        if (!animState.current.isMounted) return;
        
        const img = new Image();
        img.src = `https://cerpow.github.io/cerpow-img/jelly/jelly_${i
          .toString()
          .padStart(5, "0")}.jpg`;
        
        img.onload = () => {
          loaded++;
          setImagesLoaded(prev => prev + 1);
          if (loaded === totalFrames) {
            setIsLoading(false);
          }
        };
        img.onerror = () => {
          loaded++; 
          setImagesLoaded(prev => prev + 1);
          if (loaded === totalFrames) setIsLoading(false);
        };
        
        images[i] = img;
      }
      
      animState.current.images = images;
    };

    loadImages();

    return () => {
      animState.current.isMounted = false;
      cancelAnimationFrame(animState.current.rafId);
    };
  }, []);

  // Initialize Canvas & GSAP
  useLayoutEffect(() => {
    if (isLoading || !canvasRef.current || !dragTriggerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const state = animState.current;
    
    // Initial GSAP setup
    gsap.set(canvas, { y: state.startFrame / state.dragSensitivity });

    // Helper to clamp frame
    const resetWithinBounds = (frame: number) => {
      return Math.max(0, Math.min(state.totalFrames - 1, Math.floor(frame)));
    };

    // Canvas sizing
    const setCanvasSize = () => {
      if (!canvas) return;
      const ratio = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = width * (3 / 4); // Force 4:3
      
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.height = `${height}px`;
      
      if (ctx) {
        ctx.scale(ratio, ratio);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "medium";
      }
      
      state.currentFrame = -1; // Force redraw
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Draggable setup
    const draggable = Draggable.create(canvas, {
      trigger: dragTriggerRef.current,
      type: "y",
      inertia: true,
      bounds: { minY: 0, maxY: (state.totalFrames - 1) / state.dragSensitivity },
      allowNativeTouchScrolling: false,
      dragResistance: 0.5,
      edgeResistance: 1,
      minDuration: 0.4,
      onDrag: function() {
        state.dragFrame = this.y * state.dragSensitivity;
      },
      onThrowUpdate: function() {
        state.dragFrame = this.y * state.dragSensitivity;
      }
    })[0];

    // Animation Loop
    state.startTime = Date.now();
    const animate = () => {
      if (!state.isMounted) return;
      
      const now = Date.now();
      const dt = (now - state.startTime) / 1000;
      state.startTime = now;

      // Dampening logic from original
      const dampening = 1.0 - Math.exp(-state.smoothing * 60 * dt);
      state.displayFrame += (state.dragFrame - state.displayFrame) * dampening;

      const newFrame = resetWithinBounds(state.displayFrame);

      if (newFrame !== state.currentFrame && state.images[newFrame]?.complete && ctx) {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        ctx.drawImage(
          state.images[newFrame],
          0,
          0,
          canvas.clientWidth,
          canvas.clientHeight
        );
        state.currentFrame = newFrame;
      }

      state.rafId = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Mouse move handler for "Follow Mouse" mode
    const handleMouseMove = (e: MouseEvent) => {
      if (followMouse) {
        const normalizedY = e.clientY / window.innerHeight;
        state.dragFrame = normalizedY * (state.totalFrames - 1);
      }
    };
    
    if (followMouse) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Toggle Draggable based on followMouse
    if (followMouse) {
      draggable.disable();
    } else {
      draggable.enable();
      gsap.set(canvas, { y: state.displayFrame / state.dragSensitivity });
      draggable.update();
    }

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(state.rafId);
      draggable.kill();
    };
  }, [isLoading, followMouse]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative flex flex-col items-center justify-center w-full min-h-[480px] overflow-hidden select-none",
        "rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl text-slate-200 p-6 shadow-2xl",
        className
      )}
    >
      {/* Header */}
      <div 
        className="absolute top-6 z-20 text-center pointer-events-none transition-opacity duration-700"
        style={{ opacity: isLoading ? 0 : 1 }}
      >
        <span className="text-xs font-semibold tracking-wider uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
          Interactive Physics Core
        </span>
        <h3 className="text-lg font-medium tracking-tight mt-2 text-white">
          {title}
        </h3>
      </div>

      {/* Canvas Container */}
      <div className="relative w-full max-w-[540px] aspect-[4/3] z-10 flex items-center justify-center my-4">
        <canvas
          ref={canvasRef}
          className={cn(
            "w-full h-full rounded-[clamp(20px,5vw,36px)] transition-opacity duration-1000 ease-out shadow-inner",
            isLoading ? "opacity-0 scale-90" : "opacity-100 scale-100"
          )}
          style={{ transform: "scale3d(1, 1, 1)" }}
        />
        
        {/* Invisible Drag Trigger */}
        <div 
          ref={dragTriggerRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[49%] w-[58%] h-[54%] rounded-full cursor-grab active:cursor-grabbing z-20"
          aria-label="Drag to squeeze"
        />
      </div>

      {/* Loading Skeleton */}
      <div 
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 transition-all duration-500",
          !isLoading && "opacity-0 invisible pointer-events-none"
        )}
      >
        <div className="w-16 h-16 rounded-2xl bg-white/5 animate-pulse border border-white/10 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-blue-400 animate-spin" />
        </div>
        <div className="w-36 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-200" 
            style={{ width: `${Math.round((imagesLoaded / 215) * 100)}%` }} 
          />
        </div>
        <span className="text-[11px] text-slate-400 font-mono tabular-nums">
          Loading 3D asset ({Math.round((imagesLoaded / 215) * 100)}%)
        </span>
      </div>

      {/* Bottom Controls & Direct Download Trigger */}
      <div 
        className={cn(
          "mt-2 w-full flex flex-col sm:flex-row items-center justify-between gap-4 z-20 px-4 transition-opacity duration-700",
          isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors">
          <input 
            type="checkbox" 
            className="peer sr-only"
            checked={followMouse}
            onChange={(e) => setFollowMouse(e.target.checked)}
          />
          <div className="w-4 h-4 border border-white/20 rounded-md flex items-center justify-center transition-colors peer-checked:bg-blue-600 peer-checked:border-blue-600">
            <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
          </div>
          <span>Follow cursor movement</span>
        </label>

        {onDownload && (
          <button
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Onyx-Browser.exe</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default JellySqueeze;
