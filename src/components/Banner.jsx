import React from "react";

const Banner = ({
  desktopSrc,
  mobileSrc,
  alt = "Banner image",
  height = "h-auto",
  children,
}) => {
  return (
    <div className={`relative w-full ${height}`}>
      {/* Desktop Banner */}
      <img
        src={desktopSrc}
        alt={`${alt} desktop`}
        className="hidden sm:block w-full h-full object-cover"
      />

      {/* Mobile Banner */}
      <img
        src={mobileSrc}
        alt={`${alt} mobile`}
        className="block sm:hidden w-full h-full object-cover"
      />

      {/* Optional overlay (centered) */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center text-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default Banner;
