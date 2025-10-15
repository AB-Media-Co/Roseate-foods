import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";

const announcements = [
  "Extra 2% off on prepaid + Free Shipping ₹1,499",
  "Free Shipping over ₹1,000 + Festive Offers",
  "SAVER8: Get 8% off ₹899+ (today only).",
];

const DEFAULT_ROTATION_MS = 4500;

const AnnouncementBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const prev = () => setCurrentIndex((i) => (i === 0 ? announcements.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === announcements.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const rm =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isPaused || rm) return;
    const id = window.setInterval(next, DEFAULT_ROTATION_MS);
    return () => window.clearInterval(id);
  }, [isPaused, currentIndex]);

  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) (dx > 0 ? prev() : next());
    touchStartX.current = null;
  };

  return (
    <div className="w-full bg-brand-500 text-white">
      <div className="mx-auto max-w-[1400px] px-0 sm:px-4">
        <div className="flex items-center h-10 sm:h-11 md:h-12 text-xs sm:text-sm">
          {/* Left: socials (visible md+), phone (lg+ only, no wrap) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
              <Button href="https://www.facebook.com/people/Roseate-Farms/pfbid028djGjjwpFN2yAsWwzvQ1oHW8BUmTb8hJVB6iqenFnmVmjoGFVcELgTQQDwXdL5jul/" variant="ghost" size="icon" aria-label="Facebook" className="h-8 w-8 md:h-9 md:w-9">
                <img src="/fb.svg" alt="Facebook" className="h-4 w-4" />
              </Button>
              <Button href="https://x.com/roseatefarms" variant="ghost" size="icon" aria-label="Twitter/X" className="h-8 w-8 md:h-9 md:w-9">
                <img src="/x.svg" alt="Twitter/X" className="h-4 w-4" />
              </Button>
              {/* <Button href="https://www.youtube.com/channel/UC33h333333333333333333" variant="ghost" size="icon" aria-label="YouTube" className="h-8 w-8 md:h-9 md:w-9">
                <img src="/yt.svg" alt="YouTube" className="h-4 w-4" />
              </Button> */}
              <Button href="https://www.instagram.com/roseatefarms/" variant="ghost" size="icon" aria-label="Instagram" className="h-8 w-8 md:h-9 md:w-9">
                <img src="/insta.svg" alt="Instagram" className="h-4 w-4" />
              </Button>
            </div>

            {/* phone shows only on lg+ to avoid md tablet crowding */}
            <a href="tel:+911234456791" className="hidden lg:flex items-center gap-1 border-l border-white/30 pl-3 ml-1 text-sm whitespace-nowrap">
              <span >+ (91) 123-4456791</span>
            </a>
          </div>

          {/* Center: give it the ability to shrink & truncate */}
          <div
            className="
              flex items-center justify-center gap-1.5 sm:gap-2
              flex-1 min-w-0 mx-2 md:mx-4
            "
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              aria-label="Previous announcement"
              className="h-8 w-8 md:h-9 md:w-9 shrink-0"
            >
              <ChevronLeft size={18} />
            </Button>

            <div
              className="
                text-center font-medium
                text-[12px] sm:text-sm md:text-sm lg:text-base
                px-1 sm:px-2
                
                max-w-[72vw] sm:max-w-[60vw] md:max-w-[50vw] lg:max-w-[38rem] uppercase
              "
              title={announcements[currentIndex]}
              aria-live="polite"
            >
              {announcements[currentIndex]}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              aria-label="Next announcement"
              className="h-8 w-8 md:h-9 md:w-9 shrink-0"
            >
              <ChevronRight size={18} />
            </Button>
          </div>

          {/* Right: compact on small, expand on md+ */}

          <div className="hidden md:flex items-center gap-3 lg:gap-4 text-[11px] md:text-sm shrink-0">
            {/* <Button href="/faq" variant="link" size="sm" className="px-0 hover:opacity-80">FAQ</Button> */}
            <Button href="/contact" variant="link" size="sm" className="px-0 hover:opacity-80">Contact</Button>
            <Button href="/refund-policy" variant="link" size="sm" className="px-0 hover:opacity-80">Returns</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
