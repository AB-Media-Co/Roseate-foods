import React from "react";
import { BrandHeading } from "../../../components/BrandHeading";

function Seed() {
  return (
    <div className="content">
      <div className="text-center mt-10 md:mb-14">
        <BrandHeading
          accentWord="SPOON"
          className="text-4xl  text-brand-500 mb-10 "
        >
          FROM SEED TO
        </BrandHeading>
      </div>
      <iconcard className="grid grid-cols-2 gap-2 gap-y-10 mb-20 justify-between lg:grid-cols-4">
        <icard className="w-[99%] m-auto">
          <img src="./Home/farms/tree.png" alt="" className="w-[140px] pb-5 m-auto mb-4" />
          <h3 className="text-[21px] text-[#137D67] font-semibold pb-4 text-center">
            Grown right
          </h3>
          <p className="text-center text-[16px] font-medium">
            {" "}
            Our Sustainable farming nurtures partner farms organically,
            prioritizing biodiversity and soil vitality every step of the way
          </p>
        </icard>
        <icard className="w-[99%] m-auto">
          <img
            src="./Home/farms/handcrafted.png"
            alt=""
            className="w-[140px] pb-5 m-auto mb-4"
          />
          <h3 className="text-[21px] text-center text-[#137D67] font-semibold pb-4 ">
            Crafted not manufactured
          </h3>
          <p className="text-center text-[16px] font-medium">
            {" "}
            We sort, sun-dry, roast, ferment, and blend by hand, in small
            batches that protect flavour and nutrition.
          </p>
        </icard>
        <icard className="w-[90%] m-auto">
          <img src="./Home/farms/clean.png" alt="" className="w-[140px] pb-5 m-auto mb-4" />
          <h3 className="text-[21px] text-center text-[#137D67] font-semibold pb-4">
            Clean label, always
          </h3>
          <p className="text-center text-[16px] font-medium">
            {" "}
            No artificial colours, no additives, no preservatives just real
            ingredients.
          </p>
        </icard>
        <icard className=" w-[90%] m-auto">
          <img src="./Home/farms/bowl.png" alt="" className="w-[140px] pb-5 m-auto mb-4" />
          <h3 className="text-[21px] text-center text-[#137D67] font-semibold pb-4">
            Packed for freshness
          </h3>
          <p className="text-center text-[16px] font-medium">
            Careful packing and fast dispatch keep that farm-to-table freshness
            intact.
          </p>
        </icard>
      </iconcard>
    </div>
  );
}

export default Seed;
