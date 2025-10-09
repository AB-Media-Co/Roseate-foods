import React, { useId, useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function UniversalCarousel(props) {
  const {
    mode,
    images,
    children,

    loop = true,
    autoplayDelay = 2500,
    draggable = true,
    autoplay,
    showDots = true,
    showArrows = true,

    className,
    dotsColor = "rgba(0,0,0,0.35)",
    dotsActiveColor = "#111",
    arrowColor = "#111",
    arrowBg = "rgba(255,255,255,0.9)",
    arrowHoverBg = "white",

    prevArrowContent,
    nextArrowContent,

    spaceBetween = 16,
    slidesPerViewBase = 1,
    slidesPerViewMd = 2,
    slidesPerViewLg = 3,
  } = props;

  const uid = useId().replace(/[:]/g, "");
  const scope = `uc-${uid}`;
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const slides = useMemo(() => {
    if (mode === "images") {
      const list = images || [];
      return list.map((img, i) => (
        <SwiperSlide key={`${img.src}-${i}`} aria-roledescription="slide">
          {img.linkHref ? (
            <a href={img.linkHref} aria-label={img.alt || `slide-${i}`} style={{ display: "block" }}>
              <img
                src={img.src}
                alt={img.alt || ""}
                loading="lazy"
                decoding="async"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            </a>
          ) : (
            <img
              src={img.src}
              alt={img.alt || ""}
              loading="lazy"
              decoding="async"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          )}
        </SwiperSlide>
      ));
    }

    const kids = React.Children.toArray(children);
    return kids.map((child, i) => (
      <SwiperSlide key={i} aria-roledescription="slide">
        {child}
      </SwiperSlide>
    ));
  }, [mode, images, children]);

  if (mode === "images" && !(images && images.length)) return null;
  if (mode === "cards" && !React.Children.count(children)) return null;

  return (
    <div className={className} data-uc-scope={scope} style={{ position: "relative" }}>
      <style>{`
        [data-uc-scope="${scope}"] .swiper-pagination {
          position: relative !important;
          bottom: auto !important;
          margin-top: 20px !important;
          text-align: center;
        }
        [data-uc-scope="${scope}"] .swiper-pagination-bullet { 
          background: ${dotsColor}; 
          opacity: 1; 
          width: 8px;
          height: 8px;
          margin: 0 4px;
        }
        [data-uc-scope="${scope}"] .swiper-pagination-bullet-active { background: ${dotsActiveColor}; }
        [data-uc-scope="${scope}"] .uc-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          border: none; cursor: pointer; width: 40px; height: 40px; border-radius: 999px;
          display: grid; place-items: center; background: ${arrowBg}; color: ${arrowColor};
          box-shadow: 0 2px 6px rgba(0,0,0,0.12); transition: background .2s ease; z-index: 10;
        }
        [data-uc-scope="${scope}"] .uc-arrow:hover { background: ${arrowHoverBg}; }
        [data-uc-scope="${scope}"] .uc-prev { left: 8px; }
        [data-uc-scope="${scope}"] .uc-next { right: 8px; }
      `}</style>

      {showArrows && (
        <>
          <button ref={prevRef} className="uc-arrow uc-prev" aria-label="Previous slide" type="button">
            {props.prevArrowContent ?? (
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M12.5 15L7.5 10L12.5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <button ref={nextRef} className="uc-arrow uc-next" aria-label="Next slide" type="button">
            {props.nextArrowContent ?? (
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M7.5 5L12.5 10L7.5 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </>
      )}

      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y, Keyboard]}
        loop={loop}
        speed={600}
        slidesPerView={slidesPerViewBase}
        spaceBetween={spaceBetween}
        breakpoints={{
          640: { slidesPerView: slidesPerViewMd, spaceBetween },
          1024: { slidesPerView: slidesPerViewLg, spaceBetween: spaceBetween + 4 },
        }}
        // interactions
        allowTouchMove={draggable}
        simulateTouch={draggable}
        grabCursor={draggable}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        // custom navigation refs
        navigation={showArrows ? { prevEl: prevRef.current, nextEl: nextRef.current } : false}
        onBeforeInit={(swiper) => {
          if (showArrows) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        onSwiper={(swiper) => {
          if (showArrows && swiper.navigation) {
            swiper.navigation.init();
            swiper.navigation.update();
          }
        }}
        pagination={showDots ? { clickable: true } : false}
        lazyPreloadPrevNext={2}
        watchSlidesProgress
        autoplay={
          autoplay === false
            ? false
            : {
              delay: autoplayDelay || 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }
        }


      >
        {slides}
      </Swiper>
    </div>
  );
}
