import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HardDrive, ShieldCheck, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* Inline glyphs that sit in the sentence like punctuation. Sized in em so they track the type. */
const Wave = () => (
  <svg viewBox="0 0 120 40" className="h-[0.6em] w-[1.8em]" fill="none" aria-hidden>
    <path d="M2 20 C 22 2, 38 2, 60 20 S 98 38, 118 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Loop = () => (
  <svg viewBox="0 0 120 40" className="h-[0.7em] w-[2em]" fill="none" aria-hidden>
    <path
      d="M2 30 C 30 30, 40 6, 60 6 C 80 6, 80 34, 60 34 C 40 34, 40 6, 70 6 C 90 6, 100 30, 118 30"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const Arc = () => (
  <svg viewBox="0 0 80 40" className="h-[0.5em] w-[1em]" fill="none" aria-hidden>
    <path d="M4 36 Q 40 -10, 76 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Linked = () => (
  <svg viewBox="0 0 80 48" className="h-[0.7em] w-[1.2em]" fill="none" aria-hidden>
    <circle cx="28" cy="24" r="18" stroke="currentColor" strokeWidth="3" />
    <circle cx="52" cy="24" r="18" stroke="currentColor" strokeWidth="3" />
  </svg>
);

const Badge = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex h-[0.9em] w-[0.9em] items-center justify-center rounded-full border border-primary/30 [&>svg]:h-[0.45em] [&>svg]:w-[0.45em]">
    {children}
  </span>
);

// One long sentence: words and glyphs flow in a single flex row with variable gaps.
const flow: { node: ReactNode; gap?: string; className?: string }[] = [
  { node: "Onyx opens every tab" },
  { node: <Badge><Zap /></Badge>, className: "text-primary" },
  { node: "Instantly,", className: "font-serif italic text-primary" },
  { node: <Wave />, gap: "0.5em", className: "text-primary/60" },
  { node: "keeps every tracker" },
  { node: <ShieldCheck className="h-[0.55em] w-[0.55em]" />, gap: "0.25em", className: "text-primary" },
  { node: "Blocked,", className: "font-serif italic text-primary" },
  { node: <Loop />, gap: "0.45em", className: "text-primary/60" },
  { node: "saves your history on your own" },
  { node: <Badge><HardDrive /></Badge>, gap: "0.25em", className: "text-primary" },
  { node: "Machine", className: "font-serif italic text-primary" },
  { node: <Arc />, gap: "0.4em", className: "translate-y-[0.1em] text-primary/60" },
  { node: "and simply gets out of your" },
  { node: <Linked />, gap: "0.45em", className: "text-primary" },
  { node: "Way", className: "font-semibold text-primary" },
];

/** Screen readers get the sentence as plain text; the visual row is aria-hidden. */
const sentence = flow
  .map((f) => f.node)
  .filter((n): n is string => typeof n === "string")
  .join(" ");

export function HorizontalTicker() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label={sentence}
      className="flex h-svh items-center overflow-hidden motion-reduce:h-auto motion-reduce:py-24"
    >
      <div
        ref={trackRef}
        aria-hidden
        className="flex items-center whitespace-nowrap px-[8vw] text-[13vw] font-medium leading-none tracking-[-0.04em] text-foreground will-change-transform motion-reduce:flex-wrap motion-reduce:whitespace-normal motion-reduce:text-[10vw] md:text-[9vw]"
      >
        {flow.map((item, i) => (
          <span
            key={i}
            className={`inline-flex shrink-0 items-center ${item.className ?? ""}`}
            style={{ marginRight: item.gap ?? "0.3em" }}
          >
            {item.node}
          </span>
        ))}
      </div>
    </section>
  );
}

export default HorizontalTicker;
