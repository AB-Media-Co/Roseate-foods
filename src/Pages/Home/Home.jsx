import React from 'react'
import WhyRoseateFarms from './Components/WhyRoseateFarms';
import HeroSection from './Components/HeroSection';
import SaleCountdownBanner from './Components/SaleCountdownBanner';
import ProductSection from './Components/ProductSection';
import ShopByCategories from './Components/ShopByCategories';

const Home = () => {

  return (
    <div className='py-10 content'>
      <HeroSection/>
      <WhyRoseateFarms/>
      <ProductSection/>
      <SaleCountdownBanner/>
      <ShopByCategories/>

    </div>
  )
}

export default Home
