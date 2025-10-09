import React from "react";
import { BrandHeading } from "../../../components/BrandHeading";

function Banner() {
  return (
    <div className="w-full">
      {/* Mobile */}
      <img
        src="./Home/Banner/About-banner-mobile.webp"
        alt="About page banner"
        className="block md:hidden w-full h-auto mx-auto object-cover"
      />

      {/* Desktop */}
      <img
        src="./Home/Banner/About-banner.webp"
        alt="About page banner"
        className="hidden lg:block w-full h-auto mx-auto object-cover"
      />
    </div>
  );
}

export default Banner;
