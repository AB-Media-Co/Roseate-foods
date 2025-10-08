import React from 'react'
import { BrandHeading } from '../../../components/BrandHeading';

const Marquee = ({ children, speed = 25 }) => {
  const duplicatedChildren = (
    <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10">
      {children}
      {children}
      {children}
    </div>
  );

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        className="inline-block animate-[scroll_var(--duration)_linear_infinite]"
        style={{
          '--duration': `${speed}s`,
          animationTimingFunction: 'linear',
        }}
      >
        {duplicatedChildren}
      </div>
    </div>
  );
};

const SaveSection = () => {
  const items = [
    { img: "/Home/a.svg", text: "SAVE 50", accent: "TODAY" },
    { img: "/Home/c.svg", text: "SAVE 50", accent: "TODAY" },
    { img: "/Home/al.svg", text: "SAVE 50", accent: "TODAY" },
  ];

  return (
    <div 
      className="relative bg-cover bg-center bg-no-repeat py-6 sm:py-10"
      style={{
        backgroundImage: "url('/Home/savebg.svg')",
      }}
    >
      <Marquee speed={20}>
        {items.map((item, index) => (
          <div key={index} className='flex gap-2 sm:gap-3 md:gap-4 items-center px-4 sm:px-6 flex-shrink-0'>
            <img 
              src={item.img} 
              className='h-12 sm:h-16 md:h-20 lg:h-24 w-auto flex-shrink-0' 
              alt="" 
            />
            <BrandHeading 
              className='text-lg sm:text-xl md:text-2xl lg:text-subheading text-white uppercase whitespace-nowrap' 
              accentWord={item.accent}
            >
              {item.text}
            </BrandHeading>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default SaveSection;