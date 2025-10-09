import React, { useState, useEffect } from 'react';
import UniversalCarousel from '../../../components/UniversalCarousel';

const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Effect to detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desktop images
  const desktopImages = [
    { src: '/Home/Banner/bannerImg2.png', alt: 'Banner Image 2' },
    { src: '/Home/Banner/bannerImg.png', alt: 'Banner Image 1' },
  ];

  // Mobile images
  const mobileImages = [
    { src: '/Home/Banner/banner2Mimg.png', alt: 'Mobile Banner Image 2' },
    { src: '/Home/Banner/bannerMImg.png', alt: 'Mobile Banner Image 1' },
  ];

  // Choose images based on screen size
  const images = isMobile ? mobileImages : desktopImages;

  return (
    <div className='content'>
      <UniversalCarousel
        mode="images"
        images={images}
        // mapped props
        loop={true}                         // was: isInfinite
        showDots={true}                     // was: withIndicator
        showArrows={true}                   // (explicit)
        dotsActiveColor="#ffff"             // was: activeDotColor
        dotsColor="#a1e3b4"                 // was: closeDotColor (and farDotColor)
        arrowBg="rgba(255,255,255,1)"       // was: arrowBgColor
        arrowColor="#0d9488"                // was: arrowIconColor
        arrowHoverBg="#e0f2f1"              // was: arrowHoverBgColor

        // layout: 1 item at all breakpoints (was: visibleItemsCount={1})
        slidesPerViewBase={1}
        slidesPerViewMd={1}
        slidesPerViewLg={1}

        // optional goodies
        autoplayDelay={0}                   // set >0 to enable autoplay, e.g. 2500
        draggable={true}
        spaceBetween={0}
      />
    </div>
  );
};

export default HeroSection;
