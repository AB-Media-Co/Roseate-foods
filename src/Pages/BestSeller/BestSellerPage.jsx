import React from 'react';
import { BrandHeading } from '../../components/BrandHeading';
import BestSellerOfMonth from '../Home/Components/BestSellerOfMonth';
import Banner from '../../components/Banner';
import WhyShopOurProduct from '../../components/WhyShopOurProduct';
import ProductBenefits from '../../components/ProductBenefits';

const BestSellerPage = () => {
  const benefits = [
    {
      id: 1,
      icon: '/productPage/quality.svg',
      title: 'Premium Quality',
      subtitle: '100% Quality Guarantee'
    },
    {
      id: 2,
      icon: '/productPage/shipping.svg',
      title: 'Swift Shipping',
      subtitle: 'Delivering Across PAN'
    },
    {
      id: 3,
      icon: '/productPage/easy-return.svg',
      title: 'Easy Return',
      subtitle: 'Hassle Return Policy'
    },
    {
      id: 4,
      icon: '/productPage/24by7.svg',
      title: '24/7 Support',
      subtitle: 'Support every time'
    }
  ];

  return (
    <div className="best-seller-page">
      {/* Page Title */}
      <div className="bg-brand-500 py-6 mb-8 text-center">
        <h1 className="text-white text-3xl font-semibold">Our Best Sellers</h1>
        <p className="text-white mt-2">Discover our most popular products loved by customers</p>
      </div>

      {/* Best Seller Products */}
      <BestSellerOfMonth />



      {/* Why Shop Our Products */}
      <div className="my-12">
        <WhyShopOurProduct />
      </div>

      {/* Product Benefits */}
      <div className="my-12">
        <div className="content">
          <div className="text-center mb-8">
            <BrandHeading accentWord="BENEFITS">PRODUCT </BrandHeading>
          </div>
          <ProductBenefits benefits={benefits} />
        </div>
      </div>
    </div>
  );
};

export default BestSellerPage;