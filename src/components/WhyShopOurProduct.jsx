import React, { useEffect, useMemo, useRef, useState } from 'react';
import UniversalCarousel from './UniversalCarousel';
import { BrandHeading } from './BrandHeading';

/* ========================= CountUp ========================= */
const CountUp = ({
  value,               // number | string (e.g., "25,000+", "4.8/5", "95%")
  duration = 1200,     // animation ms
  locale = 'en-IN',    // number formatting (Indian grouping by default)
  startFrom = 0,       // optional custom start value
  easing = (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
}) => {
  const [display, setDisplay] = useState('');
  const ref = useRef(null);
  const startedRef = useRef(false);

  // Extract numeric part + prefix/suffix so "25,000+" keeps '+'
  const { end, prefix, suffix, decimals } = useMemo(() => {
    if (typeof value === 'number') {
      return {
        end: value,
        prefix: '',
        suffix: '',
        decimals: Number.isInteger(value) ? 0 : String(value).split('.')[1]?.length || 0,
      };
    }
    const raw = String(value ?? '').trim();
    const match = raw.match(/([-+]?\d[\d,]*(?:\.\d+)?)/);
    if (!match) {
      return { end: 0, prefix: '', suffix: raw, decimals: 0 };
    }
    const numText = match[0].replace(/,/g, '');
    const parsed = parseFloat(numText);
    const startIdx = match.index ?? 0;
    const prefix = raw.slice(0, startIdx);
    const suffix = raw.slice(startIdx + match[0].length);
    const decimals = numText.includes('.') ? (numText.split('.')[1]?.length || 0) : 0;
    return { end: isNaN(parsed) ? 0 : parsed, prefix, suffix, decimals };
  }, [value]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;

    const startAnim = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      const startTime = performance.now();
      const from = startFrom;
      const formatter = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      });

      const tick = (now) => {
        const t = Math.min(1, (now - startTime) / duration); // <-- regular minus
        const eased = easing(t);
        const current = from + (end - from) * eased;
        const valueToFormat = decimals
          ? parseFloat(current.toFixed(decimals))
          : Math.round(current);
        setDisplay(`${prefix}${formatter.format(valueToFormat)}${suffix}`);
        if (t < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    // Start when in view
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnim();
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [end, decimals, duration, easing, locale, prefix, startFrom, suffix]);

  return <span ref={ref}>{display || `${prefix}${startFrom}${suffix}`}</span>;
};
/* =========================================================== */

const WhyShopOurProduct = ({ stats = [], testimonials = [] }) => {
  const renderStars = (rating = 0) =>
    Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-brand-500' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));

  const TestimonialCard = ({ testimonial }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-2 h-full min-h-[280px] flex flex-col">
      <div className="flex mb-4">{renderStars(testimonial.rating)}</div>
      <p className="text-gray-700 mb-6 flex-1 text-body">{testimonial.text}</p>
      <div className="flex items-center">
       
        <div>
          <p className="font-semibold text-gray-900 text-small">{testimonial.author}</p>
          <p className="text-gray-500 text-small opacity-75">{testimonial.location}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="content">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <BrandHeading accentWord="PRODUCTS" className="text-subheading text-brand-500 uppercase mb-8">
            WHY SHOP OUR
          </BrandHeading>

          {/* Stats with counting animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-brand-500 font-medium text-small uppercase mb-2">{stat.label}</p>
                <p className="text-5xl md:text-6xl font-bold text-brand-500 mb-2">
                  <CountUp
                    value={stat.value}                 // "25,000+", "4.8/5", 95000, "95%"
                    duration={stat.duration || 1200}   // per-stat override
                    locale={stat.locale || 'en-IN'}    // Indian grouping by default
                    startFrom={stat.startFrom ?? 0}    // optional
                  />
                </p>
                <p className="text-gray-600 text-small font-medium uppercase">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="mt-16">
          <UniversalCarousel
            mode="cards"
            className="testimonials-carousel"
            slidesPerViewBase={1}
            slidesPerViewMd={2}
            slidesPerViewLg={3}
            spaceBetween={20}
            loop
            autoplayDelay={4000}
            showDots
            showArrows
            dotsColor="rgba(19, 125, 103, 0.3)"
            dotsActiveColor="#137D67"
            arrowColor="#137D67"
            arrowBg="rgba(255,255,255,0.9)"
            arrowHoverBg="white"
          >
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </UniversalCarousel>
        </div>
      </div>
    </section>
  );
};

export default WhyShopOurProduct;
