import React from "react";
import { BrandHeading } from "../../../components/BrandHeading";

function AboutContent() {
  return (
    <div className="">
      <div className="content h-full py-10 flex justify-center items-center text-[16px] lg:text-xl">
        <p className="p-2">
          At Roseate Farms, we are passionate about delivering the finest dry
          fruits, spices, and pickles that celebrate nature’s bounty. From the
          sun-kissed orchards to your kitchen, every product is carefully
          sourced, handpicked, and crafted to ensure premium quality, freshness,
          and authentic taste. We believe in the power of natural goodness. Our
          dry fruits are rich in nutrition, our spices awaken the senses, and
          our pickles are made using traditional recipes that bring a burst of
          flavour to every meal. Every item is a testament to our commitment to
          health, taste, and purity. Our journey is rooted in trust,
          transparency, and excellence. We work closely with farmers and
          artisans, ensuring ethical practices and sustainable sourcing. At
          Roseate Farms, it’s not just about product sit's about creating a
          wholesome experience for our customers, making every meal healthier,
          tastier, and more memorable.
        </p>
      </div>
      <div className="text-center mt-10">
        <BrandHeading accentWord="STORY" className="text-4xl  text-brand-500 mb-6">OUR</BrandHeading>
        <div className="flex justify-center items-center w-full content flex-col-reverse lg:flex-row md:flex-col-reverse">
          <div className="w-full text-[18px] text-left lg:text-xl">
            <p className="p-2">
              Roseate Farms began with a simple belief: that the best flavours
              come from nature, nurtured with care. What started as a small
              passion for quality dry fruits, spices, and pickles has grown into
              a journey dedicated to bringing fresh, wholesome, and authentic
              products to every home. Rooted in tradition but inspired by modern
              tastes, we carefully select each ingredient, ensuring it meets the
              highest standards of purity, nutrition, and taste. From working
              closely with farmers to handcrafting our products, every step
              reflects our commitment to quality, sustainability, and
              authenticity. Our story is about bringing people closer to nature,
              enhancing meals, and creating moments of joy and health. At
              Roseate Farms, it’s more than just food it’s a celebration of
              flavours, care, and trust. From our farms to your family, every
              product carries a promise of excellence.
            </p>
          </div>
          <div className="w-full p-2 mb-6 lg:p-10">
            <img
              src="./Home\Assets\farm.webp"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutContent;
