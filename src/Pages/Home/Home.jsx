import React from 'react'
import WhyRoseateFarms from './Components/WhyRoseateFarms';
import HeroSection from './Components/HeroSection';
import SaleCountdownBanner from './Components/SaleCountdownBanner';
import ProductSection from './Components/ProductSection';
import ShopByCategories from './Components/ShopByCategories';
import FuelYourDay from './Components/FuelYourDay';
import SaveSection from './Components/SaveSection';
import WhyShopOurProduct from './Components/WhyShopOurProduct';
import ProductShowcase from './Components/ProductShowcase';

const Home = () => {

  return (
    <div className='py-10 '>
      <HeroSection/>
      <WhyRoseateFarms/>
      <ProductSection/>
      <SaleCountdownBanner/>
      <ShopByCategories/>
      {/* <ProductShowcase/> */}
      <SaveSection/>
      <FuelYourDay/>
      <WhyShopOurProduct/>

    </div>
  )
}

export default Home
