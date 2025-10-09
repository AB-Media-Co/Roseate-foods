import { useEffect, useRef } from "react";
import { useStorefront } from "../context/StorefrontContext";

export default function ProductReviews() {
  const { products, productsLoading } = useStorefront();
  const product = products?.[0];
  const productId = !productsLoading && product?.id ? product.id.split("/").pop() : null;

  // ⬇️ set YOUR values (or use env vars)
  const SHOP_DOMAIN = "roseatefoods.myshopify.com";
  const PUBLIC_TOKEN = "9mXCFibYIsTUUQUeVC5Bs66bRi4";

  const containerRef = useRef(null);

  useEffect(() => {
    if (!productId || !containerRef.current) return;

    // 1) Prepare the container Judge.me expects
    const el = containerRef.current;
    el.className = "jdgm-widget jdgm-review-widget";
    el.setAttribute("data-id", String(productId)); // NUMERIC Shopify product ID

    // 2) Set global jdgm config BEFORE loading the script
    //    (this is what your error says is missing)
    //    PLATFORM is "shopify" even for headless.
    window.jdgm = {
      ...(window.jdgm || {}),
      PLATFORM: "shopify",
      SHOP_DOMAIN,
      PUBLIC_TOKEN,
    };

    // 3) Load the widget script once (or rely on a global include)
    const SCRIPT_ID = "jdgm-platform-independent-widget";
    let script = document.getElementById(SCRIPT_ID);

    const onScriptLoad = () => {
      // Ask Judge.me to (re-)scan the page for widgets
      if (window.jdgm && typeof window.jdgm.initializeWidgets === "function") {
        window.jdgm.initializeWidgets();
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;

      // If your dashboard snippet shows a different src, use that exact URL.
      script.src = "https://cdn.judge.me/widget_preloader.js";

      // Alternative way (some accounts use data-attrs instead of window.jdgm):
      // script.setAttribute("data-platform", "shopify");
      // script.setAttribute("data-shop-domain", SHOP_DOMAIN);
      // script.setAttribute("data-public-token", PUBLIC_TOKEN);

      script.addEventListener("load", onScriptLoad);
      document.body.appendChild(script);
    } else {
      // Script already present; just try to render
      onScriptLoad();
    }
  }, [productId]);

  if (productsLoading) {
    return <div className="mt-6 animate-pulse text-gray-500">Loading product reviews…</div>;
  }

  return (
    <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Customer Reviews</h2>
      {/* Judge.me will fill this div with the widget */}
      <div ref={containerRef} />
    </section>
  );
}

