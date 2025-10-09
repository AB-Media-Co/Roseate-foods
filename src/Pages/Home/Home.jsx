import React from 'react'
import WhyRoseateFarms from './Components/WhyRoseateFarms';
import HeroSection from './Components/HeroSection';
import SaleCountdownBanner from './Components/SaleCountdownBanner';
import ProductSection from './Components/ProductSection';
import ShopByCategories from './Components/ShopByCategories';
import FuelYourDay from './Components/FuelYourDay';
import SaveSection from './Components/SaveSection';
import WhyShopOurProduct from '../../components/WhyShopOurProduct';
import ProductShowcase from './Components/ProductShowcase';
import BestSellerOfMonth from './Components/BestSellerOfMonth';
import ProductReviews from '../../components/ProductReviews';

const Home = () => {
  // Stats data from the image
  const stats = [
    {
      label: "OVER",
      value: "142K",
      description: "PRODUCTS SOLD"
    },
    {
      label: "WITH",
      value: "95%",
      description: "POSITIVE REVIEWS"
    },
    {
      label: "SELLING IN",
      value: "12",
      description: "TERRITORIES"
    }
  ];

  // Dummy testimonials data
  const testimonials = [
    {
      id: 1,
      rating: 5,
      text: "Great, our stuff is the brand house and it's the real deal! I STRONGLY recommend Roseate and is EVERYONE interested in farming!",
      author: "Lane Burney",
      location: "Richmond, IN",
      avatar: "/api/placeholder/60/60"
    },
    {
      id: 2,
      rating: 5,
      text: "I like Shiny Estate more with more each day because if makes me feel like it should! I don't understand how we could been trying different farming before it.",
      author: "Mrs. Van Hartmeyer",
      location: "Houston, TX",
      avatar: "/api/placeholder/60/60"
    },
    {
      id: 3,
      rating: 4,
      text: "You've saved our business! Shiny Estate has got everything! Our organic tomatoes are totally wonderful!",
      author: "Philip Dickens",
      location: "New Plymouth, OH",
      avatar: "/api/placeholder/60/60"
    },
    {
      id: 4,
      rating: 5,
      text: "Absolutely fantastic products! The quality is unmatched and customer service is top-notch. Highly recommend to anyone looking for premium farming supplies.",
      author: "Sarah Johnson",
      location: "Denver, CO",
      avatar: "/api/placeholder/60/60"
    },
    {
      id: 5,
      rating: 5,
      text: "Been using their products for over 2 years now. Consistent quality and excellent results every time. Will definitely continue ordering from them.",
      author: "Mike Thompson",
      location: "Portland, OR",
      avatar: "/api/placeholder/60/60"
    }
  ];

  return (
    <div className='py-10 '>
      <HeroSection />
      <WhyRoseateFarms />
      <ProductSection />
      <SaleCountdownBanner />
      <ShopByCategories />
      <ProductShowcase />
      <SaveSection />
      <BestSellerOfMonth/>
      <FuelYourDay />
      <WhyShopOurProduct stats={stats} testimonials={testimonials} />

      {/* <ProductReviews/> */}

    </div>
  )
}

export default Home
