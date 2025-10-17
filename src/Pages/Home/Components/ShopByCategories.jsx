import React from "react";
import { BrandHeading } from "../../../components/BrandHeading";
import { useStorefront } from "../../../context/StorefrontContext";
import UniversalCarousel from "../../../components/UniversalCarousel";
import Loader from "../../../components/ui/Loader";
import Empty from "../../../components/ui/Empty";
import { useNavigate } from "react-router-dom";

/* === Single round image + label === */
function CategoryCard({ product }) {
  const img = product?.image?.url;
  const title = (product?.title || "Product").toUpperCase();
  const navigate = useNavigate()

  return (
    <article className="flex flex-col my-2 items-center justify-start">
      {/* round image frame */}
      <div
        className="
          w-36 h-36 md:w-40 md:h-40 lg:w-44 lg:h-44
          rounded-full overflow-hidden
          ring-2 ring-[#0d9488]
          shadow-sm
          bg-white
          transition-transform duration-200 ease-out cursor-pointer hover:scale-[1.03]
        "
        style={{ display: "grid", placeItems: "center" }}
        onClick={() => navigate(`/collection/${product.handle}`)}
      >
        {img && (
          <img
            src={img}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* label */}
      <h3 className="mt-4 text-body tracking-[0.2em] text-[#3d3d3d]">
        {title}
      </h3>
    </article>
  );
}

export default function ShopByCategories() {
  const { collections, collectionsLoading } = useStorefront();
  // console.log(collections)

  if (collectionsLoading) return <Loader message="Loading categories..." />;


  // ✅ filter the collections by handle
  const allowedHandles = ["almonds", "cashew", "anjeer","makhana","pistachios","raisins"];
  const filteredItems = collections.items.filter((col) =>
    allowedHandles.includes(col.handle?.toLowerCase())
  );


  return (
    <div className="my-10 md:my-14 content">
      <div className="text-center mb-8 md:mb-10">
        <BrandHeading accentWord="CATEGORIES">SHOP BY OUR</BrandHeading>
      </div>

      {/* arrows 25px on mobile */}
      <style>{`
        @media (max-width: 767px) {
          [data-uc-scope] .uc-arrow { width: 25px !important; height: 25px !important; }
          [data-uc-scope] .uc-prev { left: 4px !important; }
          [data-uc-scope] .uc-next { right: 4px !important; }
        }
      `}</style>

      {filteredItems.length === 0 ? (
        <Empty title="No categories" message="No categories available to display." />
      ) : (
        <UniversalCarousel
        mode="cards"
        loop
        draggable
        showDots
        showArrows
        // arrows: solid green with white chevrons (like screenshot)
        arrowBg="#0d9488"
        arrowColor="#ffffff"
        arrowHoverBg="#0b7e73"
        // dots: green active + pale green inactive
        dotsActiveColor="#0d9488"
        dotsColor="#cfeee8"
        // layout: 1 / 2 / 4
        spaceBetween={28}
        slidesPerViewBase={2}
        slidesPerViewMd={2}
        slidesPerViewLg={4}
        autoplayDelay={0}
        >
          {filteredItems.map((p) => (
            <CategoryCard key={p.id} product={p} />
          ))}
        </UniversalCarousel>
      )}
    </div>
  );
}
