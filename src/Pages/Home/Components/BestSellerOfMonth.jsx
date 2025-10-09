import React, { useState } from 'react';
import { useCollection } from "../../../hooks/useProducts";
import { BrandHeading } from '../../../components/BrandHeading';
import AddToCartButton from '../../../components/AddToCartButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
// Example: icon imports – change to your library if needed
import { Eye, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BestSellerOfMonth = () => {
  const { data, isLoading, error } = useCollection("best-seller", 8);

  if (isLoading) return (
    <section className="py-12 md:py-16">
      <div className="content">
        <div className="text-center">
          <div className="text-body text-gray-500">Loading Best Sellers...</div>
        </div>
      </div>
    </section>
  );

  if (error) return (
    <section className="py-12 md:py-16">
      <div className="content">
        <div className="text-center">
          <div className="text-body text-red-500">Error loading products</div>
        </div>
      </div>
    </section>
  );

  const products = data?.pages.flatMap(page => page?.products ?? []) ?? [];

  // Product Card
  const ProductCard = ({ product }) => {
    const navigate = useNavigate()
    const [quantity, setQuantity] = useState(1);
    const image = product.featuredImage?.url;
    const price = product.priceRange?.minVariantPrice?.amount || "349";
    const comparePrice = product.compareAtPriceRange?.maxVariantPrice?.amount;
    const currency = '₹';
    const isOnSale = comparePrice && parseFloat(comparePrice) > parseFloat(price);
    const reviewCount = product.reviewCount || 3;
    const rating = product.rating || 5;
    const variantEdges = product?.variants?.edges || [];
    const firstAvailable = variantEdges.find(e => e?.node?.availableForSale)?.node?.id;
    const variantId = firstAvailable || variantEdges?.[0]?.node?.id || product?.variants?.[0]?.id || null;

    const renderStars = r => (
      [...Array(5)].map((_, i) =>
        <span key={i} className={i < Math.floor(r) ? "text-brand-500 text-lg" : "text-gray-300 text-lg"}>★</span>
      )
    );

    return (
      <div className="bg-white relative rounded-2xl border border-gray-200 flex flex-col shadow-lg w-[300px] mx-auto overflow-visible transition-transform hover:-translate-y-1 hover:shadow-xl font-sans">
        {/* "Best Seller" Badge */}
        <div className="absolute left-2 top-2 z-10">
          <span className="bg-[var(--color-brand-500)] text-white px-3 py-1 text-[12px] rounded-full font-semibold text-small">
            Best Seller
          </span>
        </div>
        {/* Action Icons */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
          <button className="bg-white rounded-full p-2 shadow hover:scale-105">
            <Share2 className="h-4 w-4 text-[var(--color-brand-500)]" />
          </button>
          <button className="bg-white rounded-full p-2 shadow hover:scale-105">
            <Eye className="h-4 w-4 text-[var(--color-brand-500)]" />
          </button>
        </div>
        {/* Product Image */}
        <div className="p-8 pb-2">
          {image
            ? <img src={image} alt={product.title || "Product"} className="w-[120px] h-[160px] object-contain mx-auto" />
            : <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
          }
        </div>
        {/* Product Info */}
        <div className="p-4 pt-0 flex-grow flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-gray-500 line-through text-[14px] font-normal">
              {isOnSale && `${currency}${comparePrice}`}
            </span>
            <span className="text-lg font-bold text-[var(--color-brand-500)]">{currency}{price}</span>
          </div>
          <h3 className="font-semibold text-brand-500 hover:underline cursor-pointer mt-1 mb-1 text-body min-h-6"
            onClick={() => navigate(`/collection/product/${product.handle || encodeURIComponent(product.title)}`)}
          >
            {product.title || "California Almonds"}
          </h3>
          <div className="flex items-center mt-1 mb-2">
            <div className="flex text-sm">{renderStars(rating)}</div>
            <span className="text-xs text-gray-500 ml-1 text-small">({reviewCount})</span>
          </div>

          <div className="flex items-center justify-between mt-1 mb-3">
            <span className="text-small text-gray-600">Quantity</span>
            <div className="flex items-center py-1 border border-gray-300 rounded-full overflow-hidden text-small">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2 text-[var(--color-brand-500)]">−</button>
              <span className="px-3">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-2 text-[var(--color-brand-500)]">+</button>
            </div>
          </div>
          <AddToCartButton
            variantId={variantId}
            quantity={quantity}
            productTitle={product.title}
            className="w-full border-[var(--color-brand-500)] text-[var(--color-brand-500)] font-semibold "
            variant="outlinebrand"
            size="btn"
          >
            Add To Cart
          </AddToCartButton>
        </div>
      </div>
    );
  };

  if (!products.length) {
    return (
      <section className="py-12 md:py-16">
        <div className="content">
          <div className="text-center mb-10 md:mb-14">
            <BrandHeading accentWord="SELLERS THIS MONTH">EXPLORE BEST</BrandHeading>
          </div>
          <div className="text-center text-body text-gray-500">No best seller products found.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 relative overflow-hidden font-sans">
      {/* Background Text */}
      <div className="absolute inset-0 z-0 top-[13rem]">
        <img src="/Home/BestSellersBg.png" alt="" className="w-full h-[300px] object-contain" />
      </div>

      <div className="content relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <BrandHeading accentWord="SELLERS THIS MONTH">EXPLORE BEST</BrandHeading>

        </div>
        {/* Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={100}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop={true}
            className="best-sellers-swiper min-h-[340px]"
            centeredSlides={true}
          >
            {products.map(product => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Custom Navigation */}
          <div className="swiper-button-prev-custom absolute left-[-60px] md:left-[30%] top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow cursor-pointer z-20">
            <svg className="w-6 h-6 text-[var(--color-brand-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="swiper-button-next-custom absolute right-[-60px] md:right-[30%] top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow cursor-pointer z-20">
            <svg className="w-6 h-6 text-[var(--color-brand-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellerOfMonth;
