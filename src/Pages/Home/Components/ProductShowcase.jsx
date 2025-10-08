import React, { useState, useMemo } from 'react';
import { BrandHeading } from '../../../components/BrandHeading';
import { useStorefront } from '../../../context/StorefrontContext';
import Button from '../../../components/ui/Button';
import UniversalCarousel from '../../../components/UniversalCarousel';

const ProductShowcase = () => {
  const { products, productsLoading } = useStorefront();
  console.log(products)
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'carousel'

  // Filter categories - you can customize these based on your product structure
  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'dry-fruits', label: 'Dry Fruits' },
    { id: 'pickles', label: 'Pickles' },
    { id: 'spices', label: 'Spices' },
    { id: 'organic', label: 'Organic' }
  ];

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (!products?.length) return [];
    
    if (selectedCategory === 'all') {
      return products.slice(0, 8); // Show first 8 products
    }
    
    return products.filter(product => {
      // You can customize this filtering logic based on your product data structure
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
    console.log(product);
    const image =  product.featuredImage?.url;
    const price = product.priceRange?.minVariantPrice?.amount;
    const comparePrice = product.compareAtPriceRange?.minVariantPrice?.amount;
    const currency = product.priceRange?.minVariantPrice?.currencyCode || 'USD';

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Product Image */}
        <div className="relative overflow-hidden h-64 bg-gray-100">
          {image ? (
            <img
              src={image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Sale Badge */}
          {comparePrice && parseFloat(comparePrice) > parseFloat(price) && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              SALE
            </div>
          )}
          
          {/* Quick View Button */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <Button
              variant="solid"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => window.location.href = `/products/${product.handle}`}
            >
              Quick View
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-body font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-brand-500 font-bold text-lg">
              {currency} {parseFloat(price).toFixed(2)}
            </span>
            {comparePrice && parseFloat(comparePrice) > parseFloat(price) && (
              <span className="text-gray-500 line-through text-small">
                {currency} {parseFloat(comparePrice).toFixed(2)}
              </span>
            )}
          </div>

          {/* Product Description */}
          {product.description && (
            <p className="text-small text-gray-600 mb-3 line-clamp-2">
              {product.description.replace(/<[^>]*>/g, '').substring(0, 100)}...
            </p>
          )}

          {/* Add to Cart Button */}
          <Button
            variant="default"
            size="btn"
            className="w-full"
            onClick={() => {
              // Add to cart functionality - you'll need to implement this
              console.log('Add to cart:', product.id);
            }}
          >
            Add to Cart
          </Button>
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
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="content">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <BrandHeading 
            accentWord="SHOWCASE" 
            className="text-subheading text-brand-500 uppercase mb-8"
          >
            Product
          </BrandHeading>
          <p className="text-body text-gray-600 max-w-2xl mx-auto">
            Discover our premium collection of organic products, carefully selected and crafted to bring you the finest quality from farm to table.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-small font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-brand-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-brand-50 hover:text-brand-500'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-brand-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-brand-50'
              }`}
              title="Grid View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('carousel')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'carousel'
                  ? 'bg-brand-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-brand-50'
              }`}
              title="Carousel View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Products Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <UniversalCarousel
            mode="cards"
            className="products-carousel"
            slidesPerViewBase={1}
            slidesPerViewMd={2}
            slidesPerViewLg={3}
            spaceBetween={24}
            loop={false}
            autoplayDelay={5000}
            showDots={true}
            showArrows={true}
            dotsColor="rgba(19, 125, 103, 0.3)"
            dotsActiveColor="#137D67"
            arrowColor="#137D67"
            arrowBg="rgba(255,255,255,0.9)"
            arrowHoverBg="white"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </UniversalCarousel>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white"
            onClick={() => window.location.href = '/products'}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;