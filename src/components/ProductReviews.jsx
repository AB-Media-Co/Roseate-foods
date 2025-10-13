import React from "react";
import {
  useJudgeMeProductIdByExternalId,
  useJudgeMePublicWidget,
  useJudgeMePublicWidgetByExternalId,
} from "../hooks/useJudgeMe";
import { judgeMeInternals } from "../api/judgemeClient";

export default function ProductReviews({ shopifyProductGid }) {
  const sectionRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const headingIdRef = React.useRef(
    `product-reviews-heading-${Math.random().toString(36).slice(2)}`
  );
  const headingId = headingIdRef.current;

  React.useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some(
          (e) => e.isIntersecting || e.intersectionRatio > 0
        );
        if (anyVisible) setIsVisible(true);
      },
      { root: null, rootMargin: "200px 0px", threshold: [0, 0.01, 0.1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const externalId = React.useMemo(() => {
    if (!shopifyProductGid) return null;
    return String(shopifyProductGid).replace("gid://shopify/Product/", "");
  }, [shopifyProductGid]);

  const { data: widgetByExt, isLoading: loadingByExt, error: errorByExt } =
    useJudgeMePublicWidgetByExternalId(externalId && isVisible ? externalId : null);

  const widgetHtmlByExt =
    (typeof widgetByExt?.widget === "string" ? widgetByExt.widget : null) ||
    widgetByExt?.widget?.html ||
    widgetByExt?.html ||
    null;

  const hasExternalWidget = !!widgetHtmlByExt;
  const shouldEnableFallback = !!externalId && !loadingByExt && !hasExternalWidget;

  const { data: mapData, isLoading: isMapLoading, error: errorMap } =
    useJudgeMeProductIdByExternalId(isVisible && shouldEnableFallback ? externalId : null);
  const judgeMeProductId = mapData?.product?.id || mapData?.id || null;

  const { data: widgetData, isLoading: isWidgetLoading, error: errorWidget } =
    useJudgeMePublicWidget(
      isVisible && shouldEnableFallback && judgeMeProductId ? judgeMeProductId : null
    );

  const widgetHtml =
    widgetHtmlByExt || widgetData?.widget?.html || widgetData?.html || null;

  const widgetRef = React.useRef(null);
  React.useEffect(() => {
    if (!widgetRef.current) return;
    widgetRef.current.innerHTML = "";
    if (!widgetHtml) return;
    widgetRef.current.innerHTML = widgetHtml;

    // bring stylesheet <link> tags into <head> once
    try {
      const styleLinks = Array.from(
        widgetRef.current.querySelectorAll('link[rel="stylesheet"]')
      );
      styleLinks.forEach((lnk) => {
        const href = lnk.getAttribute("href");
        if (!href) return;
        const already = Array.from(
          document.querySelectorAll('link[rel="stylesheet"]')
        ).some((h) => h.href === lnk.href);
        if (!already) {
          const headLink = document.createElement("link");
          headLink.rel = "stylesheet";
          headLink.href = href;
          headLink.media = lnk.media || "all";
          document.head.appendChild(headLink);
        }
      });
    } catch { }

    // re-execute scripts
    const scripts = Array.from(widgetRef.current.querySelectorAll("script"));
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.async = oldScript.async;
      newScript.defer = oldScript.defer;
      if (oldScript.src) newScript.src = oldScript.src;
      else newScript.text = oldScript.text || oldScript.innerHTML;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    // ensure Judge.me core script
    const ensureJudgeMeScript = () =>
      new Promise((resolve) => {
        if (window.jdgm && typeof window.jdgm.initializeWidgets === "function") {
          resolve();
          return;
        }
        const existing = document.getElementById("jdgm-installed-js");
        if (existing) {
          existing.addEventListener("load", () => resolve());
          setTimeout(resolve, 500);
          return;
        }
        const s = document.createElement("script");
        s.id = "jdgm-installed-js";
        s.async = true;
        s.src = `https://cdn.judge.me/assets/installed.js?shop_domain=${encodeURIComponent(
          judgeMeInternals.SHOP_DOMAIN
        )}`;
        s.onload = () => resolve();
        document.head.appendChild(s);
      });

    ensureJudgeMeScript().then(() => {
      try {
        if (window.jdgm && typeof window.jdgm.initializeWidgets === "function") {
          window.jdgm.initializeWidgets();
        }
      } catch { }
      const hideStyle = widgetRef.current.querySelector(".jdgm-temp-hiding-style");
      if (hideStyle?.parentNode) hideStyle.parentNode.removeChild(hideStyle);
      const root = widgetRef.current.querySelector(".jdgm-rev-widg");
      if (root && root.style && root.style.display === "none") root.style.display = "";
    });
  }, [widgetHtml]);

  if (!externalId) return null;

  const isLoading = (loadingByExt || isMapLoading || isWidgetLoading) && isVisible;
  const hasError = !!(errorByExt || errorMap || errorWidget);
  const showEmpty = !isLoading && !hasError && isVisible && !widgetHtml;

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      role="region"
      className="mt-8 rounded-2xl border border-[#F0F2F5] bg-white p-0 overflow-hidden"
      style={{ "--jdgm-green": "#167F6E" }}
    >
      {/* Header */}
      <div className="px-6 pt-10 pb-6 bg-white text-center">
        <h2
          id={headingId}
          className="tracking-widest uppercase font-extrabold"
          style={{
            letterSpacing: "0.15em",
            color: "var(--jdgm-green)",
            fontSize: "32px",
            // optional: plug in a script-like heading font if you have one loaded sitewide
            fontFamily: "var(--reviews-heading-font, inherit)",
          }}
        >
          Customer <span style={{ fontStyle: "italic" }}>Reviews</span>
        </h2>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        {isLoading && (
          <div aria-hidden className="animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl border border-[#EEF1F4] bg-white p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-full bg-gray-200" />
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-11/12" />
                    <div className="h-3 bg-gray-200 rounded w-9/12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasError && (
          <div
            role="status"
            className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3"
          >
            We’re having trouble loading reviews right now. Please try again later.
          </div>
        )}

        {showEmpty && (
          <div className="text-sm text-gray-700 bg-white border border-[#EEF1F4] rounded-xl p-5">
            <div className="font-medium mb-1">No reviews yet</div>
            <div className="mb-3">Be the first to share your experience.</div>
            <button
              type="button"
              className="px-5 py-3 rounded-full text-white shadow-sm hover:shadow transition-shadow"
              style={{ backgroundColor: "var(--jdgm-green)" }}
              onClick={() => {
                const formAnchor =
                  document.querySelector('#judgeme_product_reviews .jdgm-write-rev-link') ||
                  document.querySelector('.jdgm-write-rev-link');
                if (formAnchor) {
                  formAnchor.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                  formAnchor.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
            >
              Write a Review
            </button>
          </div>
        )}

        {/* Judge.me widget HTML */}
        <div ref={widgetRef} className="jdgm-widget" />
      </div>


    </section>
  );
}
