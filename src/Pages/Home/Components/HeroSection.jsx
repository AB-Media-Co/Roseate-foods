import React from 'react';
import UniversalCarousel from '../../../components/UniversalCarousel';

const HeroSection = () => {
  // Convert to the images shape { src, alt }
  const images = [
    { src: '/Home/Banner/bannerImg.png', alt: 'First image' },
    { src: '/Home/Banner/bannerImg.png', alt: 'First image' },
    { src: '/Home/Banner/bannerImg.png', alt: 'First image' },
    { src: '/Home/Banner/bannerImg.png', alt: 'First image' },
    { src: '/Home/Banner/bannerImg.png', alt: 'First image' },
    { src: '/Home/Banner/bannerImg.png', alt: 'First image' },
  ];

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
