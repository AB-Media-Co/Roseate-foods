import React from 'react';
import { BrandHeading } from '../../../components/BrandHeading';
import Button from '../../../components/ui/Button';
import UniversalCarousel from '../../../components/UniversalCarousel';

const defaultBenefits = [
  {
    icon: (
      <img
        src="/Home/goodheart.svg"
        alt="Good For Heart"
        width={48}
        height={48}
        className="filter brightness-0 invert"
      />
    ),
    title: "Good For Heart",
    description: "Contains Monounsaturated Fats And Magnesium That Help Maintain Healthy Cholesterol Levels.",
    gridClass: "col-span-2 row-start-1"
  },
  {
    icon: (
      <img
        src="/Home/boostbrain.svg"
        alt="Boosts Brain Health"
        width={48}
        height={48}
        className="filter brightness-0 invert"
      />
    ),
    title: "Boosts Brain Health",
    description: "Rich In Vitamin E, Healthy Fats And Antioxidants That Support Memory And Focus.",
    gridClass: "col-start-3 row-start-1"
  },
  {
    icon: (
      <img
        src="/Home/bones.svg"
        alt="Strengthens Bones"
        width={48}
        height={48}
        className="filter brightness-0 invert"
      />
    ),
    title: "Strengthens Bones",
    description: "Packed With Calcium, Phosphorus, And Magnesium.",
    gridClass: "col-start-1 row-start-2"
  },
  {
    icon: (
      <img
        src="/Home/skin.svg"
        alt="Improves Skin & Hair"
        width={48}
        height={48}
        className="filter brightness-0 invert"
      />
    ),
    title: "Improves Skin & Hair",
    description: "Vitamin E And Antioxidants Help Nourish Skin And Promote Healthy Hair.",
    gridClass: "col-span-2 col-start-2 row-start-2"
  }
];
const FuelYourDay = ({ slides }) => {

  const defaultSlides = [
    {
      titleLine: 'FUEL YOUR DAY WITH',
      brandHeadingMain: "NATURE'S",
      brandHeadingAccent: 'PERFECT BENEFIT',
      primaryCta: { label: 'Learn more', href: '#' },
      secondaryCta: { label: 'Buy Almonds', href: '#' },
      image: { src: '/Home/fueldayImage.png', alt: 'Roseate Farms Premium Almonds Package' },
      benefits: defaultBenefits,
    },
    {
      titleLine: 'FUEL YOUR DAY WITH',
      brandHeadingMain: "NATURE'S",
      brandHeadingAccent: 'PERFECT BENEFIT',
      primaryCta: { label: 'Learn more', href: '#' },
      secondaryCta: { label: 'Buy Almonds', href: '#' },
      image: { src: '/Home/fueldayImage.png', alt: 'Roseate Farms Premium Almonds Package' },
      benefits: defaultBenefits,
    },
  ];

  const slidesData = Array.isArray(slides) && slides.length ? slides : defaultSlides;

  return (
    <section className="bg-brand-500 py-16 md:py-20 lg:py-24">
      <div className="content">
        <UniversalCarousel
          mode="cards"
          slidesPerViewBase={1}
          slidesPerViewMd={1}
          slidesPerViewLg={1}
          spaceBetween={16}
          className=""
          dotsColor="rgba(255,255,255,0.5)"
          dotsActiveColor="#fff"
          arrowBg="rgba(255,255,255,0.9)"
          arrowHoverBg="#fff"
          arrowColor="#111"
        >
          {slidesData.map((slide, idx) => (
            <div key={idx} className="">
              {/* Header */}
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-heading text-white mb-2">
                  {slide.titleLine}
                </h2>
                <BrandHeading
                  className="text-heading text-white mb-8 md:mb-10"
                  accentWord={slide.brandHeadingAccent}
                  accentClassName="font-knewave text-white"
                >
                  {slide.brandHeadingMain}
                </BrandHeading>

                {/* Buttons */}
                <div className="flex flex-row gap-4 justify-center items-center">
                  {slide.primaryCta ? (
                    <a href={slide.primaryCta.href || '#'}>
                      <Button
                        variant="outline"
                        size="btn"
                        className=" px-8 py-2 rounded-full"
                      >
                        {slide.primaryCta.label || 'Learn more'}
                      </Button>
                    </a>
                  ) : null}
                  {slide.secondaryCta ? (
                    <a href={slide.secondaryCta.href || '#'}>
                      <Button
                        variant="solid"
                        size="btn"
                        className=" px-8 py-2 rounded-full text-brand-500 font-semibold"
                      >
                        {slide.secondaryCta.label || 'Buy Now'}
                      </Button>
                    </a>
                  ) : null}
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid lg:grid-cols-2 gap-8  items-stretch">
                {/* Product Image */}
                <div className="order-1 lg:order-1 flex items-center">
                  {slide.image ? (
                    <img
                      src={slide.image.src}
                      alt={slide.image.alt || ''}
                      className="w-full max-w-md lg:max-w-lg mx-auto"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </div>

                {/* Benefits Grid */}
                <div className="order-1 lg:order-2 flex items-center">
                  {/* Mobile */}
                  <div className="grid grid-cols-1 gap-2 md:gap-3 lg:hidden w-full">
                    {(slide.benefits || []).map((benefit, index) => (
                      <div
                        key={index}
                        className="bg-brand-300 rounded-xl p-4 md:p-5 text-white hover:bg-brand-400 transition-all duration-300 flex flex-col h-[160px] md:h-[180px]"
                      >
                        {/* Icon */}
                        <div className="mb-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                            {benefit.icon}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-base md:text-lg font-bold mb-2 leading-tight">
                          {benefit.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs md:text-sm opacity-90 leading-relaxed flex-1">
                          {benefit.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Desktop */}
                  <div className="hidden lg:grid grid-cols-3 gap-3 auto-rows-[minmax(100px,auto)] w-full h-full">
                    {(slide.benefits || []).map((benefit, index) => (
                      <div
                        key={index}
                        className={`${benefit.gridClass} bg-brand-300 rounded-xl p-5 text-white hover:bg-brand-400 transition-all duration-300 flex flex-col`}
                      >
                        {/* Icon */}
                        <div className="mb-3">
                          <div className="w-12 h-12 flex items-center justify-center">
                            {benefit.icon}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold mb-2 leading-tight">
                          {benefit.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm opacity-90 leading-relaxed flex-1">
                          {benefit.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </UniversalCarousel>
      </div>
    </section>
  );
};

export default FuelYourDay;