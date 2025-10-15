import React, { useMemo, useState } from "react";
import { BrandHeading } from "../../../components/BrandHeading";
import { useStorefront } from "../../../context/StorefrontContext";

import bg1 from "/Home/products/bg1.png";
import bg2 from "/Home/products/bg2.png";
import bg3 from "/Home/products/bg3.png";
import Button from "../../../components/ui/Button";
import Empty from "../../../components/ui/Empty";
import Loader from "../../../components/ui/Loader";

const ProductCard = ({ collection, bg, height = "500px" }) => (
  <div
    className="flex flex-col items-center justify-between rounded-xl p-6"
    style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height,
      color: "white",
    }}
  >
    <div className="flex flex-col items-center justify-center h-full">
      {!!collection.image?.url && (
        <img
          src={collection.image.url}
          alt={collection.title}
          className="h-[300px] object-contain mb-6"
        />
      )}
      <h3 className="text-2xl font-semibold mb-4 text-center">{collection.title}</h3>
      <Button
        variant="outline"
        size="btn"
        className="text-brand-500 hover:text-brand-600 hover:bg-transparent"
        onClick={() => (window.location.href = `/collection/${collection.handle}`)}
      >
        Explore Now
      </Button>
    </div>
  </div>
);

const ProductSection = () => {
  const { collections, collectionsLoading } = useStorefront();
  const [showAll, setShowAll] = useState(false);

  const bgs = useMemo(() => [bg1, bg2, bg3], []);
  const bgAt = (i) => bgs[i % bgs.length];

  if (collectionsLoading) return <Loader message="Loading collections..." />;
  if (!collections?.items?.length) return (
    <div className="my-10 content">
      <div className="text-center mb-10 md:mb-14">
        <BrandHeading accentWord="PRODUCTS">Meet our ROSEATE</BrandHeading>
      </div>
      <Empty title="No collections" message="No collections available right now." />
    </div>
  );

  // filter by handle
  const allowedHandles = ["dry-fruits", "pickles", "spices"];
  const filtered = collections.items.filter((c) =>
    allowedHandles.includes(c.handle?.toLowerCase())
  );

  if (!filtered.length) return (
    <div className="my-10 content">
      <div className="text-center mb-10 md:mb-14">
        <BrandHeading accentWord="PRODUCTS">Meet our ROSEATE</BrandHeading>
      </div>
      <Empty title="No collections" message="No matching collections to show." />
    </div>
  );

  // show first 3 until expanded
  const visibleItems = showAll ? filtered : filtered.slice(0, 3);
  const canExpand = filtered.length > 3;

  return (
    <div className="my-10 content">
      <div className="text-center mb-10 md:mb-14">
        <BrandHeading accentWord="PRODUCTS">Meet our ROSEATE</BrandHeading>
      </div>

      {/* Responsive grid: 1 / 2 / 3 columns */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((collection, index) => (
          <ProductCard
            key={collection.id}
            collection={collection}
            bg={bgAt(index)}
          />
        ))}
      </div>

      {canExpand && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAll((s) => !s)}
            className="px-6 py-2 rounded-full bg-brand-500 text-white"
            type="button"
          >
            {showAll ? "Show Less" : "Explore More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductSection;
