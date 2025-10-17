import React, { useMemo, useState } from "react";
import { useStorefront } from "../../../context/StorefrontContext";
import Loader from "../../../components/ui/Loader";
import Empty from "../../../components/ui/Empty";
import UniversalCarousel from "../../../components/UniversalCarousel";
import { BrandHeading } from "../../../components/BrandHeading";
import AddToCartButton from "../../../components/AddToCartButton";
import { getDiscountLabel, getDiscountPercent, isComboProduct } from "../../../utils/price";
import { useNavigate } from "react-router-dom";

/* ---------- helpers ---------- */
const SIZE_REGEX = /\b(\d+(?:\.\d+)?)\s?(g|kg|ml|l)\b/i;

const stripSize = (title = "") =>
  title
    .replace(SIZE_REGEX, "")         // remove one size token
    .replace(/\s+\|\s+.*/g, "")      // drop trailing "| ..."
    .replace(/\s{2,}/g, " ")         // collapse spaces
    .trim();

const getSizeLabel = (title = "") => {
  const m = title.match(SIZE_REGEX);
  return m ? `${m[1]}${m[2].toLowerCase()}` : null;
};

const inr = (v) => {
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? `₹${n.toLocaleString("en-IN")}` : "";
};

const parseRating = (mf) => {
  try {
    if (!mf || !mf.value) return null;
    const j = JSON.parse(mf.value);
    return Number(j.value ?? j.rating ?? j.score) || null;
  } catch {
    return null;
  }
};

/* ---------- product card ---------- */
function ProductCard({ variants }) {
  // default to cheapest option
  const defaultIdx = useMemo(() => {
    let min = Infinity, idx = 0;
    variants.forEach((p, i) => {
      const a = Number(p?.priceRange?.minVariantPrice?.amount ?? Infinity);
      if (a < min) { min = a; idx = i; }
    });
    return idx;
  }, [variants]);

  const [sel, setSel] = useState(defaultIdx);
  const p = variants[sel];

  const baseTitle = stripSize(p.title);
  const sizes = variants.map((v, i) => ({
    i,
    label: getSizeLabel(v.title) || `Size ${i + 1}`,
  }));

  const price = p.priceRange?.minVariantPrice;
  const compareMax = p.compareAtPriceRange?.maxVariantPrice;

  const rating = parseRating(p.productRating);
  const ratingCount = Number(p.productRatingCount?.value || 0) || null;


  const navigate = useNavigate();

  const discountPct = getDiscountPercent(price?.amount, compareMax?.amount, {
    round: 'round',   // 'floor' | 'ceil' | 'round'
    minPct: 1,        // <1% not shown
    maxPct: 95,       // clamp
    // step: 5,       // enable if you want 5%-steps (e.g., 33% => 35%)
  });

  const discountLabel = getDiscountLabel(price?.amount, compareMax?.amount);

  const variantEdges = p?.variants?.edges || [];
  const firstAvailable = variantEdges.find(e => e?.node?.availableForSale)?.node?.id;
  const variantId = firstAvailable || variantEdges?.[0]?.node?.id || p?.variants?.[0]?.id || null;

  const handleRedirect = (prod) => {
    const h = prod?.handle || (prod?.title ? encodeURIComponent(prod.title) : '');
    window.location.href = `/collection/product/${h}`;
  };

  return (
    <div className="rounded-2xl border border-[color:var(--color-brand-50)] shadow-sm p-4 flex flex-col gap-3 bg-white">
      <div className="relative">
        {discountPct && (
          <span
            className="absolute right-0 top-2 text-white text-[11px] px-2 py-1"
            style={{ backgroundColor: "var(--color-brand-500)" }}
          >
            {discountLabel}
          </span>
        )}
        <img
          src={p.featuredImage?.url}
          alt={p.featuredImage?.altText || baseTitle}
          className="w-full h-56 object-contain rounded-xl bg-white"
          loading="lazy"
        />
      </div>

      <div className="text-small text-[color:var(--color-brand-600)]">
        From <span className="font-semibold text-[color:var(--color-brand-600)]">{inr(price?.amount)}</span>
      </div>

      <div
        onClick={() => handleRedirect(p)}
        className="text-body font-semibold text-[color:var(--color-brand-600)] leading-snug hover:underline cursor-pointer">
        {baseTitle}
      </div>

      {/* rating */}
      <div className="flex items-center gap-1" aria-label={rating ? `Rated ${rating.toFixed(1)} out of 5` : "No ratings yet"}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = rating && i < Math.round(rating);
          return (
            <svg
              key={i}
              viewBox="0 0 20 20"
              className="w-4 h-4"
              aria-hidden="true"
              style={{ color: filled ? "var(--color-brand-400)" : "#e5e7eb" }}
            >
              <path
                d="M10 15.27l-5.18 3.04 1-5.82L.64 7.96l5.86-.85L10 1.67l2.5 5.44 5.86.85-4.18 4.53 1 5.82z"
                fill="currentColor"
              />
            </svg>
          );
        })}
        <span className="ml-1 text-small text-gray-600">
          {rating ? rating.toFixed(1) : "0"}
          {ratingCount ? ` (${ratingCount})` : ""}
        </span>
      </div>

      {/* size selector */}
      <div>
        <label className="sr-only">Choose size</label>
        <select
          value={sel}
          onChange={(e) => setSel(Number(e.target.value))}
          className="w-full rounded-lg border border-[color:var(--color-brand-50)] text-small px-3 py-2 focus:outline-none focus:ring-2"
          style={{ focusRingColor: "var(--color-brand-400)" }}
        >
          {sizes.map((s) => (
            <option key={s.i} value={s.i}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <AddToCartButton
        variantId={variantId}
        quantity={1}
        productTitle={baseTitle}
        disabled={!variantId}
        showSuccessToast
        showErrorToast
        className="mt-1 inline-flex items-center justify-center rounded-full text-white text-small h-10 px-5 bg-[var(--color-brand-500)] hover:bg-[var(--color-brand-600)] transition-colors"
      >
        Add To Cart
      </AddToCartButton>
    </div>
  );
}

/* ---------- main section ---------- */
export default function YouMayAlsoLike() {
  const { products, productsLoading } = useStorefront();

  const cards = useMemo(() => {
    const list = (products || []).filter((p) => !isComboProduct(p));

    // group by base title (strip size tokens)
    const groups = {};
    list.forEach((p) => {
      const key = stripSize(p.title);
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });

    // sort sizes within each group by numeric amount (g/ml -> grams)
    const toG = (size) => {
      if (!size) return Number.POSITIVE_INFINITY;
      const m = size.match(/([\d.]+)\s?(g|kg|ml|l)/i);
      if (!m) return Number.POSITIVE_INFINITY;
      const n = parseFloat(m[1]);
      const unit = m[2].toLowerCase();
      if (unit === "kg" || unit === "l") return n * 1000;
      return n; // g or ml
    };

    Object.values(groups).forEach((arr) => {
      arr.sort((a, b) => toG(getSizeLabel(a.title)) - toG(getSizeLabel(b.title)));
    });

    return Object.values(groups).map((variants, i) => (
      <div className="">
        <ProductCard key={`${stripSize(variants[0].title)}-${i}`} variants={variants} />

      </div>
    ));
  }, [products]);

  if (productsLoading) {
    return (
      <div className="py-8 text-center">
        <Loader message="Loading recommendations…" />
      </div>
    );
  }
  if (!cards.length) return (
    <section className="my-8 content">
      <div className=" text-center mb-4">
        <BrandHeading accentWord="LIKE">YOU MAY ALSO </BrandHeading>
      </div>
      <Empty title="No recommendations" message="We couldn’t find related products right now." />
    </section>
  );

  return (
    <section className="my-8 content">
      <div className=" text-center mb-4">
        {/* YOU MAY ALSO <span className="italic font-knewave" style={{ color: "var(--color-brand-400)" }}>LIKE</span> */}
        <BrandHeading accentWord="LIKE">YOU MAY ALSO </BrandHeading>

      </div>

      <UniversalCarousel
        mode="cards"
        showDots={false}
        autoplay={false}
        slidesPerViewBase={1}
        slidesPerViewMd={2}
        slidesPerViewLg={4}
        spaceBetween={20}
      >
        {cards}
      </UniversalCarousel>
    </section>
  );
}
