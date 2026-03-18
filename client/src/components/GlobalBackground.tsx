import { useEffect, useRef } from "react";

export default function GlobalBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scrollRaf = 0;
    let cursorRaf = 0;
    const finePointer = window.matchMedia("(pointer:fine)").matches;

    const updateParallax = () => {
      scrollRaf = 0;
      const scrollY = window.scrollY;
      if (videoRef.current) {
        videoRef.current.style.transform = `translateY(${scrollY * 0.2}px) scale(1.05)`;
      }
    };

    const handleScroll = () => {
      if (scrollRaf) return;
      scrollRaf = window.requestAnimationFrame(updateParallax);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!finePointer || !cursorRef.current) return;
      if (cursorRaf) cancelAnimationFrame(cursorRaf);
      cursorRaf = window.requestAnimationFrame(() => {
        if (!cursorRef.current) return;
        cursorRef.current.style.left = `${event.clientX}px`;
        cursorRef.current.style.top = `${event.clientY}px`;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (cursorRaf) cancelAnimationFrame(cursorRaf);
    };
  }, []);

  return (
    <>
      <div
        className="global-bg"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.18)), url('/bg-red.jpg')",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="bg-video"
          poster="/bg-red.jpg"
        >
          <source src="/bg-red.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="bg-overlay" aria-hidden="true" />
      <div className="energy-lines" aria-hidden="true" />
      <div className="glow-bottom glow-pulse" aria-hidden="true" />
      <div className="glow-core glow-pulse" aria-hidden="true" />
      <div
        ref={cursorRef}
        className="cursor-glow hidden md:block"
        aria-hidden="true"
      />
    </>
  );
}
