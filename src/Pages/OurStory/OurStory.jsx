import React from "react";
import OurstoryFarms from "./Components/OurstoryFarms";
import AboutConTent from "./Components/AboutContent";
import { BrandHeading } from "../../components/BrandHeading";
import MadeByPeople from "./Components/MadeByPeople";
import Banner from "./Components/Banner";
import Seed from "./Components/Seed";
import OurKitchen from "./Components/OurKitchen";

const OurStory = () => {
  return (
    <div className="">
      <Banner />
      <AboutConTent />
      <OurstoryFarms />
      <Seed/>
      <MadeByPeople />    
      <OurKitchen/>
    </div>
  );
};

export default OurStory;
