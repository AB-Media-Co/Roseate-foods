// src/components/Nav.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import Button from "./ui/Button";
import { useStorefront } from "../context/StorefrontContext";
import { useCart } from "../state/CartProvider";
import { Link } from "react-router-dom";
import { useMenus } from "../hooks/useProducts";

/* ------------------------------ small helpers ------------------------------ */

function toPath(url = "") {
  // Convert Shopify absolute menu URLs to router paths
  if (!url) return "/";
  try {
    const u = new URL(url);
    return `${u.pathname}${u.search || ""}` || "/";
  } catch {
    return url.startsWith("http") ? "/" : url;
  }
}

/* -------------------------------- Skeleton -------------------------------- */

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

/* -------------------- search suggestion row (kept as-is) ------------------- */

const ProductRow = React.memo(function ProductRow({ p }) {
  return (
    <a
      href={`/collection/product/${p.handle}`}
      className="group relative flex items-center gap-3 rounded-lg px-3 py-2 transition
                 hover:bg-gradient-to-r hover:from-brand-50/80 hover:to-transparent
                 focus:outline-none focus:ring-2 focus:ring-brand-300 transform-gpu"
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
      <ChevronDown className="ml-auto h-4 w-4 opacity-0 -rotate-90 transition group-hover:opacity-60" />
    </a>
  );
});

/* ------------------------------ tiny virtual list ----------------------------- */

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
  const rafRef = useRef(null);

  const onScroll = (e) => {
    const top = e.currentTarget.scrollTop;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setScrollTop(top));
  };

  useEffect(() => () => rafRef.current && cancelAnimationFrame(rafRef.current), []);

  const total = items?.length ?? 0;
  const verticalPadding = 16;
  const totalHeight = total * itemHeight + verticalPadding;
  const visibleCount = Math.ceil(height / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(total - 1, startIndex + visibleCount + overscan * 2);
  const offsetY = startIndex * itemHeight + 8;
  const renderAll = totalHeight <= height;

  return (
    <div
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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent" />
      {renderAll ? (
        <div className="py-2">{items.map(renderItem)}</div>
      ) : (
        <div style={{ height: totalHeight, position: "relative" }}>
          <div
            className="absolute left-0 right-0"
            style={{ transform: `translateY(${offsetY}px)` }}
          >
            {items.slice(startIndex, endIndex + 1).map((it) => renderItem(it))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------- desktop dropdown from menu ------------------------ */

function MenuDropdown({ items = [] }) {
  return (
    <div className="absolute top-full left-0 mt-1 min-w-[200px] rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5 z-50">
      <ul className="py-2">
        {items.map((child) => (
          <li key={child.id}>
            <Link
              to={toPath(child.url)}
              className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
            >
              {child.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------- mobile accordion ----------------------------- */

function MobileAccordion({ title, items = [] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-2"
      >
        <span>{title?.toUpperCase?.() || title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden ml-2">
          <div className="rounded-xl border border-white/10 bg-white/95">
            <ul className="py-1">
              {items.map((ci) => (
                <li key={ci.id}>
                  <Link to={toPath(ci.url)} className="block px-4 py-2 text-sm text-gray-800">
                    {ci.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- NAV ---------------------------------- */

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { products, productsLoading } = useStorefront(); // for search suggestions
  const { totalQuantity } = useCart();

  const { data: menus, isLoading: menusLoading } = useMenus();
  const mainMenuItems = menus?.main?.items ?? [];

  const productList = useMemo(() => products ?? [], [products]);

  // search state
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
    if (first?.handle) window.location.href = `/collection/product/${first.handle}`;
  };

  // which desktop menu index is open
  const [openIdx, setOpenIdx] = useState(null);

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
            {isMobileMenuOpen ? <X className="h-6 w-6 text-brand-500" /> : <Menu className="h-6 w-6 text-brand-500" />}
          </button>

          <img src="/roseate.svg" alt="Roseate" className="w-auto" />

          <Link to="/cart" aria-label="Cart" className="relative p-1">
            <img src="/cart.svg" alt="Cart" className="h-6 w-6" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center font-medium text-white">
                {totalQuantity}
              </span>
            )}
          </Link>
        </nav>

        {/* mobile search bar */}
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
              onKeyDown={(e) => e.key === "Enter" && goToFirstResult()}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500"
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

        {/* mobile menu drawer (menu-driven) */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
            isMobileMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          } bg-brand-500`}
        >
          <div className="overflow-hidden">
            <div className="px-6 py-4 space-y-3 text-white font-medium">
              {menusLoading && <span className="opacity-80">Loading menu…</span>}
              {!menusLoading &&
                mainMenuItems.map((item) => {
                  const hasChildren = item.items && item.items.length > 0;
                  if (hasChildren) {
                    return (
                      <MobileAccordion key={item.id} title={item.title} items={item.items} />
                    );
                  }
                  return (
                    <Link key={item.id} to={toPath(item.url)} className="block hover:opacity-90">
                      {item.title.toUpperCase()}
                    </Link>
                  );
                })}
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
              {/* Menu-driven links */}
              <div className="flex items-center gap-8">
                {menusLoading && (
                  <span className="text-gray-500">Loading…</span>
                )}

                {!menusLoading &&
                  mainMenuItems.map((item, idx) => {
                    const hasChildren = item.items && item.items.length > 0;

                    if (!hasChildren) {
                      return (
                        <Link
                          key={item.id}
                          to={toPath(item.url)}
                          className="text-brand-500 font-medium text-body hover:text-brand-600 transition-colors"
                        >
                          {item.title.toUpperCase()}
                        </Link>
                      );
                    }

                    return (
                      <div
                        key={item.id}
                        className="relative"
                        onMouseEnter={() => setOpenIdx(idx)}
                        onMouseLeave={() => setOpenIdx((v) => (v === idx ? null : v))}
                      >
                        <button className="flex cursor-pointer items-center gap-1 text-brand-500 font-medium text-body hover:text-brand-600 transition-colors">
                          {item.title.toUpperCase()}
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              openIdx === idx ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {openIdx === idx && <MenuDropdown items={item.items} />}
                      </div>
                    );
                  })}
              </div>

              {/* Right - search + cart */}
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
                    onKeyDown={(e) => e.key === "Enter" && goToFirstResult()}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500"
                  >
                    <Search />
                  </Button>
                  {isSearchOpen && filteredProducts.length > 0 && (
                    <div className="absolute md:left-[-180px] lg:left-[-100px] mt-2 min-w-md rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5 z-50">
                      <VirtualList
                        items={filteredProducts}
                        height={520}
                        itemHeight={56}
                        overscan={6}
                        renderItem={(p) => <ProductRow key={p.id} p={p} />}
                      />
                    </div>
                  )}
                </div>

                <Link
                  to="/cart"
                  className="relative inline-grid place-items-center w-10 h-10 text-brand-500 hover:text-brand-600"
                >
                  <img src="/cart.svg" alt="Cart" />
                  {totalQuantity > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center font-medium">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
