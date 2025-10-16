// src/components/Nav.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Search,
  User,
  ShoppingCart,
  ChevronDown,
  Heart,
  Menu,
  X,
} from "lucide-react";
import Button from "./ui/Button";
import { useStorefront } from "../context/StorefrontContext";
import { useCart } from "../state/CartProvider";
import { Link } from "react-router-dom";

/* --------------------------------- Shared --------------------------------- */

function SkeletonItem() {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="h-10 w-10 rounded-md bg-gray-200 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 rounded bg-gray-200 animate-pulse" />
        <div className="h-3 w-1/3 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}

/* Ultra-light, memoized row */
const ProductRow = React.memo(function ProductRow({ p }) {
  return (
    <a
      href={`/collection/product/${p.handle}`}
      className="group relative flex items-center gap-3 rounded-lg px-3 py-2 transition
                 hover:bg-gradient-to-r hover:from-brand-50/80 hover:to-transparent
                 focus:outline-none focus:ring-2 focus:ring-brand-300 will-change-transform transform-gpu"
    >
      <div className="relative flex-shrink-0 h-12 w-12 overflow-hidden rounded-md bg-gray-50 ring-1 ring-gray-200">
        <img
          src={p?.featuredImage?.url || "/placeholder.png"}
          alt={p.title}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          width={48}
          height={48}
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="min-w-0">
        <div className="hover:underline font-medium text-gray-900 capitalize">
          {p.title}
        </div>
        <div className="text-xs text-gray-500">View details</div>
      </div>
      <ChevronDown className="ml-auto h-4 w-4 opacity-0 -rotate-90 transition group-hover:opacity-60 transform-gpu" />
    </a>
  );
});

/* -------------------------- Tiny Virtual List Core ------------------------- */

function VirtualList({
  items,
  height = 350,
  itemHeight = 56,
  overscan = 6,
  renderItem,
  className = "",
  style = {},
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const ref = useRef(null);
  const rafRef = useRef(null);

  // rAF-throttled onScroll to cut state updates
  const onScroll = (e) => {
    const top = e.currentTarget.scrollTop;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setScrollTop(top);
    });
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const total = items?.length ?? 0;
  // Add vertical padding so the last item can scroll fully above the bottom fade
  const verticalPadding = 16; // 8px top + 8px bottom
  const totalHeight = total * itemHeight + verticalPadding;
  const visibleCount = Math.ceil(height / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    total - 1,
    startIndex + visibleCount + overscan * 2
  );
  const offsetY = startIndex * itemHeight + 8; // account for top padding

  // If few items, render all (no virtualization overhead)
  const renderAll = totalHeight <= height;

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      className={`relative overflow-y-auto ${className}`}
      style={{
        ...style,
        maxHeight: height,
        paddingTop: 8,
        paddingBottom: 8,
        willChange: "transform",
        contain: "layout paint style",
        WebkitOverflowScrolling: "touch",
        scrollbarGutter: "stable",
      }}
    >
      {/* fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent" />

      {renderAll ? (
        <div className="py-2">{items.map(renderItem)}</div>
      ) : (
        <div style={{ height: totalHeight, position: "relative" }}>
          <div
            className="absolute left-0 right-0 will-change-transform transform-gpu"
            style={{ transform: `translateY(${offsetY}px)` }}
          >
            {items.slice(startIndex, endIndex + 1).map((item) => renderItem(item))}
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------- Products Dropdown UI -------------------------- */

function ProductsDropdown({
  isOpen,
  onToggle,
  products,
  loading,
  variant = "desktop",
}) {
  const listHeight = 350;
  const rowHeight = 56; // matches px-3 py-2 + content

  const listContent = loading ? (
    <div className="p-2">
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
    </div>
  ) : (
    <VirtualList
      items={products ?? []}
      height={listHeight}
      itemHeight={rowHeight}
      overscan={8}
      className="relative"
      style={{}}
      renderItem={(p) => <ProductRow key={p.id} p={p} />}
    />
  );

  if (variant === "mobile") {
    return (
      <div className="w-full">
        <button
          className="w-full flex items-center justify-between py-2"
          onClick={onToggle}
        >
          <span>PRODUCTS</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
        >
          <div className="overflow-hidden ml-2">
            {/* Solid bg; no blur */}
            <div className="rounded-xl border border-white/10 bg-white/95 px-1">
              {listContent}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;
  return (
    <div className="absolute top-full left-0 mt-1 w-[320px] rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5 z-50">
      {/* header bar */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <span className="text-xs font-semibold tracking-wider text-gray-600">
          PRODUCTS
        </span>
        <span className="text-[10px] text-gray-400">Scroll to see more</span>
      </div>

      {listContent}

      {/* soft edge */}
      <div className="pointer-events-none absolute inset-x-0 -top-3 h-3 bg-gradient-to-b from-transparent to-white/0" />
    </div>
  );
}

/* --------------------------------- Main ---------------------------------- */

const Nav = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false); // desktop
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const { products, productsLoading } = useStorefront();
  const { totalQuantity } = useCart();
  console.log(totalQuantity)

  const productList = useMemo(() => products ?? [], [products]);

  // search state (shared)
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const filteredProducts = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    if (!q) return [];
    const starts = [];
    const contains = [];
    for (const p of productList) {
      const t = (p?.title || "").toLowerCase();
      if (!t) continue;
      if (t.startsWith(q)) starts.push(p);
      else if (t.includes(q)) contains.push(p);
    }
    return [...starts, ...contains].slice(0, 20);
  }, [productList, searchQuery]);

  useEffect(() => {
    function onDocClick(e) {
      const ds = desktopSearchRef.current;
      const ms = mobileSearchRef.current;
      if (ds && ds.contains(e.target)) return;
      if (ms && ms.contains(e.target)) return;
      setIsSearchOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const goToFirstResult = () => {
    const first = filteredProducts?.[0];
    if (first?.handle) {
      window.location.href = `/collection/product/${first.handle}`;
    }
  };

  return (
    <div>
      {/* ===================== MOBILE ===================== */}
      <header className="md:hidden w-full bg-white text-gray-800 shadow-md z-50">
        <nav className="flex items-center justify-between px-4 py-3">
          <button
            aria-label="Open menu"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="p-2 -ml-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-brand-500" />
            ) : (
              <Menu className="h-6 w-6 text-brand-500" />
            )}
          </button>

          <img src="/roseate.svg" alt="Roseate" className="w-auto" />

          <a href="/cart" aria-label="Cart" className="relative p-1">
            <img src="/cart.svg" alt="Cart" className="h-6 w-6" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center font-medium text-white">
                {totalQuantity}
              </span>
            )}
          </a>
        </nav>

        {/* mobile search bar - full width below nav */}
        <div className="px-4 pb-4 pt-2">
          <div className="relative" ref={mobileSearchRef}>
            <input
              type="text"
              placeholder="Search For Almond"
              className="w-full h-12 pl-4 pr-12 bg-[#E6E6E6] rounded-full font-[500] text-sm text-gray-700 placeholder:text-[#666060] focus:outline-none focus:ring-2 focus:ring-brand-300"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  goToFirstResult();
                }
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 transition-colors"
            >
              <Search className="h-5 w-5" />
            </Button>
            {isSearchOpen && filteredProducts.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5 z-50">
                <VirtualList
                  items={filteredProducts}
                  height={300}
                  itemHeight={56}
                  overscan={6}
                  renderItem={(p) => <ProductRow key={p.id} p={p} />}
                />
              </div>
            )}
          </div>
        </div>

        {/* mobile menu drawer */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isMobileMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
            } bg-brand-500`}
        >
          <div className="overflow-hidden">
            <div className="px-6 py-4 space-y-3 text-white font-medium">
              <a href="/" className="block hover:opacity-90">
                HOME
              </a>

              {/* Reused dropdown (mobile variant) */}
              <ProductsDropdown
                variant="mobile"
                isOpen={isMobileProductsOpen}
                onToggle={() => setIsMobileProductsOpen((v) => !v)}
                products={productList}
                loading={productsLoading}
              />

              <a href="/our-story" className="block hover:opacity-90">
                OUR STORY
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ===================== DESKTOP ===================== */}
      <nav className="hidden md:block w-full bg-background shadow-md py-4">
        <div className="content mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="/roseate.svg" alt="Roseate" className="h-[87px] w-auto" />
            </Link>

            <div className="flex gap-20">
              {/* Links */}
              <div className="flex items-center gap-8">
                <a
                  href="/"
                  className="text-brand-500 font-medium text-body hover:text-brand-600 transition-colors"
                >
                  HOME
                </a>

                <div
                  className="relative"
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                >
                  <button className="flex cursor-pointer items-center gap-1 text-brand-500 font-medium text-body hover:text-brand-600 transition-colors">
                    PRODUCTS
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isProductsOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Reused dropdown (desktop variant) */}
                  <ProductsDropdown
                    isOpen={isProductsOpen}
                    products={productList}
                    loading={productsLoading}
                    variant="desktop"
                  />
                </div>

                <a
                  href="/our-story"
                  className="text-brand-500 font-medium text-body hover:text-brand-600 transition-colors"
                >
                  OUR STORY
                </a>
                <a
                  href="/contact"
                  className="text-brand-500 font-medium text-body hover:text-brand-600 transition-colors"
                >
                  CONTACT
                </a>
              </div>

              {/* Right - Icons + search */}
              <div className="flex items-start justify-end gap-4">
                <div className="relative" ref={desktopSearchRef}>
                  <input
                    type="text"
                    placeholder="Search For Almond"
                    className="w-64 h-10 pl-4 pr-10 bg-[#E6E6E6] rounded-full font-[500] text-sm text-gray-700 placeholder:text-[#666060] focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        goToFirstResult();
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 transition-colors"
                  >
                    <Search className="text-brand-500" />
                  </Button>
                  {isSearchOpen && filteredProducts.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5 z-50">
                      <VirtualList
                        items={filteredProducts}
                        height={320}
                        itemHeight={56}
                        overscan={6}
                        renderItem={(p) => <ProductRow key={p.id} p={p} />}
                      />
                    </div>
                  )}
                </div>


                <a href="/cart" className="relative inline-grid place-items-center w-10 h-10 text-brand-500 hover:text-brand-600">
                  <img src="/cart.svg" alt="Cart" />
                  {totalQuantity > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center font-medium">
                      {totalQuantity}
                    </span>
                  )}
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;