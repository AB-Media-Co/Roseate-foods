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

const testimonials = [
  {
    id: 1,
    rating: 5,
    text: "Crunch is on point — not a single stale almond in the pack.",
    author: "Nisha",
    location: "Bengaluru",
    avatar: "/api/placeholder/60/60?text=N"
  },
  {
    id: 2,
    rating: 5,
    text: "Finally a lemon pickle without oil or vinegar. Bright, clean, addictive.",
    author: "Aditya",
    location: "Pune",
    avatar: "/api/placeholder/60/60?text=A"
  },
  {
    id: 3,
    rating: 5,
    text: "We switched to Roseate walnuts for our morning oatmeal — tastes fresher.",
    author: "Rohan",
    location: "Gurgaon",
    avatar: "/api/placeholder/60/60?text=R"
  },
  {
    id: 4,
    rating: 5,
    text: "Mom approved. Reminds her of the achar she made at home.",
    author: "Priya",
    location: "Lucknow",
    avatar: "/api/placeholder/60/60?text=P"
  },
  {
    id: 5,
    rating: 5,
    text: "Delivery was quick and the Batch ID scan is a clever touch for trust.",
    author: "Shreya",
    location: "Mumbai",
    avatar: "/api/placeholder/60/60?text=S"
  },
  {
    id: 6,
    rating: 4,
    text: "Raisins aren’t clumpy or over-sweet — just natural.",
    author: "Harsh",
    location: "Jaipur",
    avatar: "/api/placeholder/60/60?text=H"
  },
  {
    id: 7,
    rating: 5,
    text: "The 1kg almond pack is the best value. We refill glass jars and it stays crisp.",
    author: "Meera",
    location: "Chennai",
    avatar: "/api/placeholder/60/60?text=M"
  },
  {
    id: 8,
    rating: 5,
    text: "Garlic pickle has warmth without the heaviness of oil. Great with dal-chawal.",
    author: "Ankit",
    location: "Indore",
    avatar: "/api/placeholder/60/60?text=A"
  },
  {
    id: 9,
    rating: 5,
    text: "Customer care replaced a dented jar within two days. No drama.",
    author: "Sana",
    location: "Hyderabad",
    avatar: "/api/placeholder/60/60?text=S"
  },
  {
    id: 10,
    rating: 5,
    text: "Love the subscription — one less grocery to think about.",
    author: "Arjun",
    location: "Thane",
    avatar: "/api/placeholder/60/60?text=A"
  },
  {
    id: 11,
    rating: 5,
    text: "Cashews are evenly sized and toast up beautifully for kheer.",
    author: "Fatima",
    location: "Kochi",
    avatar: "/api/placeholder/60/60?text=F"
  },
  {
    id: 12,
    rating: 5,
    text: "Gifted the combo box at Diwali — the story card made it feel personal.",
    author: "Kavya",
    location: "Ahmedabad",
    avatar: "/api/placeholder/60/60?text=K"
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
