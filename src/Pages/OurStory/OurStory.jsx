import React from "react";
import OurstoryFarms from "./Components/OurstoryFarms";
import AboutConTent from "./Components/AboutContent";
import { BrandHeading } from "../../components/BrandHeading";
import MadeByPeople from "./Components/MadeByPeople";
import Banner from "./Components/Banner";

const OurStory = () => {
  return (
    <div className="">
      <Banner />
      <AboutConTent />
      <OurstoryFarms />
      <MadeByPeople />
    </div>
  );
};

export default OurStory;
