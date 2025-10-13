import React, { useState, useMemo, useEffect } from 'react';
import { BrandHeading } from '../../../components/BrandHeading';
import { useStorefront } from '../../../context/StorefrontContext';
import Button from '../../../components/ui/Button';
import UniversalCarousel from '../../../components/UniversalCarousel';
import AddToCartButton from '../../../components/AddToCartButton';
import { useNavigate } from "react-router-dom";
import { getDiscountLabel, getDiscountPercent, isNewProduct } from '../../../utils/price';

const ProductShowcase = () => {
  const { products, productsLoading } = useStorefront();
  // console.log("Products in ProductShowcase:", products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products?.length) return [];

    if (selectedCategory === 'all') {
      return products.slice(0, 8); // Show first 8 products
    }

    return products.filter(product => {
      const tags = product.tags || [];
      const productType = product.productType?.toLowerCase() || '';
      const title = product.title?.toLowerCase() || '';

      return tags.some(tag => tag.toLowerCase().includes(selectedCategory)) ||
        productType.includes(selectedCategory) ||
        title.includes(selectedCategory);
    }).slice(0, 8);
  }, [products, selectedCategory]);

  // Product Card Component
  const ProductCard = ({ product }) => {
    const image = product.featuredImage?.url;
    const price = product.priceRange?.minVariantPrice?.amount || "349";
    const comparePrice = product.compareAtPriceRange?.maxVariantPrice?.amount;
    const currency = '₹';
    const rating = product.rating || 5;
    const reviewCount = product.reviewCount || 3;
    const variantEdges = product?.variants?.edges || [];
    const firstAvailable = variantEdges.find(e => e?.node?.availableForSale)?.node?.id;
    const variantId = firstAvailable || variantEdges?.[0]?.node?.id || product?.variants?.[0]?.id || null;
    // console.log("Product in ProductCard:", product);
    const newItem = isNewProduct(product);

    // console.log("Is New Item:", price, comparePrice);
    const discountPct = getDiscountPercent(price, comparePrice, {
      round: 'round',   // 'floor' | 'ceil' | 'round'
      minPct: 1,        // <1% not shown
      maxPct: 95,       // clamp
      // step: 5,       // enable if you want 5%-steps (e.g., 33% => 35%)
    });

    const discountLabel = getDiscountLabel(price, comparePrice);


    // Redirect function
    const handleRedirect = (prod) => {
      const h = prod?.handle || (prod?.title ? encodeURIComponent(prod.title) : '');
      navigate(`/collection/product/${h}`);
    };

    // Function to render star rating
    const renderStars = (rating) => {
      const stars = [];
      for (let i = 0; i < 5; i++) {
        stars.push(
          <span key={i} className={i < Math.floor(rating) ? "text-brand-500 text-lg" : "text-gray-300 text-lg"}>
            ★
          </span>
        );
      }
      return stars;
    };

    return (
      <div className="bg-white rounded-lg  overflow-hidden border border-gray-200 flex flex-col shadow-sm hover:shadow-md transition-shadow"

      >
        {/* Product Image with Badges */}
        <div className="relative">
          {image ? (
            <img
              src={image}
              alt={product.title || "California Almonds"}
              className="w-full  object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400">No Image</div>
            </div>
          )}

          {/* Sale Badge */}
          {discountPct ? (
            <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs px-2 py-1 ">
              {discountLabel}
            </div>
          ) : null}



          {/* New Badge */}
          {newItem && (
            <div className="absolute top-8 right-0 bg-brand-600 text-white px-2 py-0.5 text-xs font-medium">
              New
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-grow flex flex-col">
          {/* Price */}
          <div className="text-sm text-brand-500 font-medium">
            From {currency} {price}
          </div>

          {/* Title */}
          <h3 className="text-brand-500 hover:underline cursor-pointer font-medium mt-1 line-cl"
            onClick={() => handleRedirect(product)}
          >
            {product.title || "California Almonds"}
          </h3>

          {/* Rating */}
          <div className="flex items-center mt-1">
            <div className="flex text-sm">
              {renderStars(rating)}
            </div>
            <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
          </div>

          {/* Button */}
          <div className="mt-auto pt-2">
            <AddToCartButton
              variantId={variantId}
              quantity={1}
              productTitle={product.title}
              variant="outlinebrand"
              size="btn"
              className="w-full border-brand-500 text-brand-500 "
              onSuccess={() => console.log("Added successfully!")}

            >
              Buy Now
            </AddToCartButton>
          </div>

          {/* Action Icons */}
          <div className="flex items-center justify-start mt-2 gap-4 pt-4">
            <button className=" transition-colors">
              <img src="/ProductNature.svg" alt="Nature" />
            </button>
            <button className=" transition-colors">
              <img src="/productJars.svg" alt="Cart" />
            </button>
            <button className=" transition-colors">
              <img src="/productLeaf.svg" alt="Leaf" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (productsLoading) {
    return (
      <section className="py-12 md:py-16">
        <div className="content">
          <div className="text-center">
            <div className="text-body text-gray-500">Loading products...</div>
          </div>
        </div>
      </section>
    );
  }

  if (!filteredProducts.length) {
    return (
      <section className="py-12 md:py-16">
        <div className="content">
          <div className="text-center mb-10 md:mb-14">
            <BrandHeading accentWord="SHOWCASE">Product</BrandHeading>
          </div>
          <div className="text-center text-body text-gray-500">
            No products found for the selected category.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 md:py-10">
      <div className="content relative">
        <div className='flex justify-end'>
          <Button
            variant="default"
            size="btn"
            className="border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white"
            onClick={() => navigate('/collection/allproducts')}

          >
            View All
          </Button>

        </div>


        {/* Products Display - Responsive: Grid for desktop, Carousel for mobile */}
        {!isMobile ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-12">
            <UniversalCarousel
              mode="cards"
              className="products-carousel"
              slidesPerViewBase={1.2}
              slidesPerViewMd={2}
              slidesPerViewLg={3}
              spaceBetween={16}
              loop={true}
              autoplayDelay={5000}
              showDots={true}
              showArrows={false}
              dotsColor="rgba(19, 125, 103, 0.3)"
              dotsActiveColor="#137D67"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </UniversalCarousel>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductShowcase;
