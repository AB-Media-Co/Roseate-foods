import React from "react";
import {
  useJudgeMePublicWidgetByExternalId,
  useJudgeMeProductIdByExternalId,
} from "../hooks/useJudgeMe";
import Button from "./ui/Button";
import { BrandHeading } from "./BrandHeading";
import WriteReviewForm from "./WriteReviewForm";

/* ---------------- helpers ---------------- */

function normalizeWidgetHtml(raw) {
  if (!raw) return null;
  if (typeof raw === "object") {
    const maybe = (raw.widget && (raw.widget.html || raw.widget)) || raw.html || null;
    if (typeof maybe === "string") raw = maybe;
    else return null;
  }
  if (typeof raw !== "string") return null;
  if (/\\u003c|\\u003e|\\u0026/.test(raw)) {
    raw = raw.replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/\\u0026/g, "&");
  }
  if (/&lt;|&gt;|&amp;/.test(raw)) {
    const t = document.createElement("textarea");
    t.innerHTML = raw;
    raw = t.value;
  }
  return raw;
}

function parseJudgeMeWidget(html) {
  if (!html) return null;
  const div = document.createElement("div");
  div.innerHTML = html;
  const root = div.querySelector(".jdgm-rev-widg");
  if (!root) return null;

  const averageRating = parseFloat(root.getAttribute("data-average-rating") || "0");
  const numberOfReviews = parseInt(root.getAttribute("data-number-of-reviews") || "0", 10);
  const histogram = Array.from(div.querySelectorAll(".jdgm-histogram__row"))
    .filter((r) => r.getAttribute("data-rating"))
    .map((r) => ({
      rating: parseInt(r.getAttribute("data-rating")),
      percentage: parseFloat(r.getAttribute("data-percentage")),
      frequency: parseInt(r.getAttribute("data-frequency")),
    }))
    .sort((a, b) => b.rating - a.rating);

  const reviews = Array.from(div.querySelectorAll(".jdgm-rev")).map((r) => ({
    id: r.getAttribute("data-review-id"),
    author: r.querySelector(".jdgm-rev__author")?.textContent?.trim(),
    rating: parseFloat(r.querySelector(".jdgm-rev__rating")?.getAttribute("data-score") || "0"),
    body: r.querySelector(".jdgm-rev__body")?.textContent?.trim(),
    verified: r.getAttribute("data-verified-buyer") === "true",
    timestampUTC: r.querySelector(".jdgm-rev__timestamp")?.getAttribute("data-content") || null,
  }));

  return { averageRating, numberOfReviews, histogram, reviews };
}

function Stars({ value, size = "default" }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  
  const sizeClasses = {
    small: "text-sm",
    default: "text-lg",
    large: "text-xl"
  };
  
  return (
    <div className={`inline-flex text-brand-500 ${sizeClasses[size]} leading-none`}>
      {"★".repeat(full)}
      {half ? <span style={{ position: "relative" }}>
        <span style={{ opacity: 0.3 }}>★</span>
        <span style={{ position: "absolute", inset: 0, width: "50%", overflow: "hidden" }}>★</span>
      </span> : null}
      <span style={{ opacity: 0.3 }}>{"★".repeat(empty)}</span>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-brand-500 text-white text-small px-3 py-1 rounded-full font-medium">
      <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 0l2.39 4.84L18 6l-3.9 3.8L14.8 16 10 13.6 5.2 16l.7-6.2L2 6l5.61-1.16L10 0z" />
      </svg>
      Verified
    </span>
  );
}

/* --------------- main component --------------- */

export default function ProductReviewsCustom({ shopifyProductGid, productName }) {
  const [data, setData] = React.useState(null);
  const [visibleCount, setVisibleCount] = React.useState(2);
  const [sort, setSort] = React.useState("recent");
  const [showReviewForm, setShowReviewForm] = React.useState(false);

  const externalId = React.useMemo(() => {
    if (!shopifyProductGid) return null;
    return String(shopifyProductGid).replace("gid://shopify/Product/", "");
  }, [shopifyProductGid]);

  const { data: widgetByExt, isLoading, refetch: refetchWidget } = useJudgeMePublicWidgetByExternalId(externalId);
  const { data: productData } = useJudgeMeProductIdByExternalId(externalId);

  React.useEffect(() => {
    const raw =
      (typeof widgetByExt?.widget === "string" ? widgetByExt.widget : null) ||
      widgetByExt?.widget ||
      widgetByExt?.html ||
      null;
    const html = normalizeWidgetHtml(raw);
    const parsed = parseJudgeMeWidget(html);
    if (parsed) setData(parsed);
  }, [widgetByExt]);

  if (isLoading || !data) {
    return (
      <section className="content py-12">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const { averageRating, numberOfReviews, histogram, reviews } = data;

  // Sort logic
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === "high") return b.rating - a.rating;
    if (sort === "low") return a.rating - b.rating;
    return (b.timestampUTC || "").localeCompare(a.timestampUTC || "");
  });

  const visibleReviews = sortedReviews.slice(0, visibleCount);
  const hasMore = visibleCount < sortedReviews.length;

  return (
    <section className="content py-6 md:py-12">
      <div className="bg-white">
        {/* Header */}
        <div className="px-4 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6">
          <BrandHeading 
            accentWord="REVIEWS"
            className="text-center text-subheading text-brand-500 uppercase mb-2"
            accentClassName="font-knewave text-brand-500"
          >
            CUSTOMER
          </BrandHeading>
        </div>

        {/* Summary */}
        <div className=" py-4 md:py-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="flex flex-col items-start text-center">
              <Stars value={averageRating} size="large" />
              <div className="text-sm md:text-body font-semibold text-gray-800 mt-1">
                {averageRating.toFixed(2)} Out Of 5
              </div>
              <div className="text-xs md:text-small text-gray-600">
                Based On {numberOfReviews} Reviews
              </div>
            </div>

            {/* Histogram */}
            <div className="flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((r) => {
                const h = histogram.find((h) => h.rating === r) || {
                  rating: r,
                  percentage: 0,
                  frequency: 0,
                };
                return (
                  <div key={r} className="flex items-center gap-2 md:gap-3">
                    <div className="whitespace-nowrap w-16 md:w-20 text-xs md:text-small text-brand-600">
                      {"★".repeat(r)}
                      {"☆".repeat(5 - r)}
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded">
                      <div
                        className="h-2 bg-brand-500 rounded"
                        style={{ width: `${h.percentage || 0}%` }}
                      />
                    </div>
                    <div className="w-4 md:w-6 text-right text-xs md:text-small text-gray-600">
                      {h.frequency}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center md:justify-end items-center mt-4 md:mt-0">
              <Button
                variant="default"
                size="btn"
                onClick={() => setShowReviewForm(true)}
                href="#write-review-form"
                className="w-full md:w-auto"
              >
                Write A Review
              </Button>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className=" py-3 md:py-4 border-t border-gray-100">
          <div className="flex justify-start">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-200 text-gray-700 rounded-full px-3 md:px-4 py-2 text-xs md:text-small bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent w-full md:w-auto"
            >
              <option value="recent">Most Recent</option>
              <option value="high">Highest Rated</option>
              <option value="low">Lowest Rated</option>
            </select>
          </div>
        </div>

        {/* Reviews */}
        <div className=" py-4 md:py-6">
          <div className="space-y-4 md:space-y-6">
            {visibleReviews.map((r) => (
              <div key={r.id} className="border-b border-gray-100 pb-3 md:pb-4 last:border-b-0">
                <Stars value={r.rating} size="default" />
                <div className="flex items-center gap-2 md:gap-3 mt-2">
                  <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-gray-100 flex items-center justify-center text-brand-500 flex-shrink-0">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="md:w-[18px] md:h-[18px]"
                    >
                      <path
                        d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5.33 0-8 2.67-8 5v1h16v-1c0-2.33-2.67-5-8-5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="font-medium text-sm md:text-base text-gray-800 truncate">{r.author}</div>
                  {r.verified && <VerifiedBadge />}
                </div>
                <p className="mt-2 text-sm md:text-base text-gray-700 font-medium leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* See More/Less */}
        {sortedReviews.length > 2 && (
          <div className="px-4 md:px-8 py-4 md:py-6 border-t border-gray-100 text-center">
            {hasMore ? (
              <Button
                variant="default"
                size="btn"
                onClick={() => setVisibleCount(sortedReviews.length)}
                className="w-full md:w-auto"
              >
                See More
              </Button>
            ) : (
              <Button
                variant="default"
                size="btn"
                onClick={() => setVisibleCount(2)}
                className="w-full md:w-auto"
              >
                See Less
              </Button>
            )}
          </div>
        )}

        {/* Write Review Form Section - Only show when button is clicked */}
        {showReviewForm && (
          <div className="px-4 md:px-8 py-6 md:py-8 border-t border-gray-100">
            <WriteReviewForm
              productId={productData?.product?.id}
              productName={productName}
              onSuccess={() => {
                // Refresh the widget data to show the new review
                refetchWidget();
                setShowReviewForm(false);
              }}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
