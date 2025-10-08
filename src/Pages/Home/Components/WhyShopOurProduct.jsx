import React from 'react';
import UniversalCarousel from '../../../components/UniversalCarousel';
import { BrandHeading } from '../../../components/BrandHeading';

const WhyShopOurProduct = () => {
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-brand-500' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const TestimonialCard = ({ testimonial }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-2 h-full min-h-[280px] flex flex-col">
      {/* Stars */}
      <div className="flex mb-4">
        {renderStars(testimonial.rating)}
      </div>
      
      {/* Review text */}
      <p className="text-gray-700 mb-6 flex-1 text-body">
        {testimonial.text}
      </p>
      
      {/* Author info */}
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-3 flex-shrink-0">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.author}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-small">{testimonial.author}</p>
          <p className="text-gray-500 text-small opacity-75">{testimonial.location}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="content">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <BrandHeading 
            accentWord="PRODUCTS" 
            className="text-subheading text-brand-500 uppercase mb-8"
          >
            WHY SHOP OUR
          </BrandHeading>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-brand-500 font-medium text-small uppercase mb-2">{stat.label}</p>
                <p className="text-5xl md:text-6xl font-bold text-brand-500 mb-2">{stat.value}</p>
                <p className="text-gray-600 text-small font-medium uppercase">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="mt-16">
          <UniversalCarousel
            mode="cards"
            className="testimonials-carousel"
            slidesPerViewBase={1}
            slidesPerViewMd={2}
            slidesPerViewLg={3}
            spaceBetween={20}
            loop={true}
            autoplayDelay={4000}
            showDots={true}
            showArrows={true}
            dotsColor="rgba(19, 125, 103, 0.3)"
            dotsActiveColor="#137D67"
            arrowColor="#137D67"
            arrowBg="rgba(255,255,255,0.9)"
            arrowHoverBg="white"
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </UniversalCarousel>
        </div>
      </div>
    </section>
  );
};

export default WhyShopOurProduct;