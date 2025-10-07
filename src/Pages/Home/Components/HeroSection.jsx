import React from 'react';
import UniversalCarousel from '../../../components/UniversalCarousel';

const HeroSection = () => {
    const slides = [
        { type: 'image', image: '/Home/Banner/bannerImg.png', alt: 'First image' },
        { type: 'image', image: '/Home/Banner/bannerImg.png', alt: 'First image' },
        { type: 'image', image: '/Home/Banner/bannerImg.png', alt: 'First image' },
        { type: 'image', image: '/Home/Banner/bannerImg.png', alt: 'First image' },
        { type: 'image', image: '/Home/Banner/bannerImg.png', alt: 'First image' },
        { type: 'image', image: '/Home/Banner/bannerImg.png', alt: 'First image' },
    ];

    return (
        <UniversalCarousel
            visibleItemsCount={1}
            withIndicator
            isInfinite
            activeDotColor="#ffff"
            closeDotColor="#a1e3b4"
            farDotColor="#d6f5e0"
            arrowBgColor="#ffffff"
            arrowIconColor="#0d9488"
            arrowHoverBgColor="#e0f2f1"
        >

            {slides.map((i, k) => (
                <div
                    key={k}
                    style={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                    }}
                >
                    <img
                        src={i.image}
                        alt={i.alt}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                </div>
            ))}
        </UniversalCarousel>

    );
};

export default HeroSection;
