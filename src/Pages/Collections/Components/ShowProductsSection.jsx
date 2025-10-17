import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useCollection, useProducts } from '../../../hooks/useProducts';
import { useParams } from 'react-router-dom';
import { BrandHeading } from '../../../components/BrandHeading';
import { Star, StarHalf, Filter as FilterIcon } from 'lucide-react';
import Loader from '../../../components/ui/Loader';
import Empty from '../../../components/ui/Empty';
import AddToCartButton from '../../../components/AddToCartButton';
import { getDiscountLabel, getDiscountPercent } from '../../../utils/price';


const stripSizeTokens = (s = '') =>
    s
        .split('|')[0]
        .replace(/\b\d+(?:\.\d+)?\s*(g|kg|ml|l)\b/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

const deriveBaseKey = (title = '') => stripSizeTokens(title).toLowerCase();

const extractWeight = (title = '') => {
    const re = /(\d+(?:\.\d+)?)\s*(g|kg|ml|l)\b/i;
    const m = title.match(re);
    if (!m) return null;
    const num = m[1];
    const unit = m[2].toLowerCase() === 'l' ? 'L' : m[2].toLowerCase();
    return `${num}${unit}`;
};

const toNumber = (v) => {
    if (v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

const parseRating = (productRating) => {
    if (!productRating?.value) return null;
    try {
        const parsed = JSON.parse(productRating.value);
        return toNumber(parsed?.value);
    } catch {
        const m = String(productRating.value).match(/"value"\s*:\s*"(\d+(?:\.\d+)?)"/);
        return m ? toNumber(m[1]) : null;
    }
};

const parseRatingCount = (productRatingCount) => {
    if (!productRatingCount?.value) return null;
    return toNumber(productRatingCount.value);
};



// put near other helpers
const isComboProduct = (p) => {
    const title = String(p?.title || p?.baseTitle || '').toLowerCase();
    const productType = String(p?.productType || '').toLowerCase();
    const vendor = String(p?.vendor || '').toLowerCase();

    // tags can be array or edges shape
    const tagsArr =
        p?.tags?.edges?.map((e) => e?.node?.name) ??
        p?.tags ??
        p?.tagList ??
        [];
    const tags = Array.isArray(tagsArr)
        ? tagsArr.map((t) => String(t).toLowerCase())
        : [];

    const cues = [
        'combo',
        'combo pack',
        'bundle',
        'pack of',
        'value pack',
        'assorted pack',
        'variety pack',
        'kit',
        'set of',
        'bogo',
    ];

    const inText = cues.some((c) => title.includes(c));
    const inType = cues.some((c) => productType.includes(c));
    const inVendor = cues.some((c) => vendor.includes(c));
    const inTags = tags.some((t) => cues.some((c) => t.includes(c)));

    const multiPackRegexes = [
        /\bpack\s*of\s*\d+\b/i,   // "Pack of 2"
        /\bset\s*of\s*\d+\b/i,    // "Set of 3"
        /\b\d+\s*x\s*\d+\b/i,     // "200g x 2"
        /\b\d+-?pack\b/i,         // "2-pack"
    ];
    const inPattern =
        multiPackRegexes.some((re) => re.test(p?.title || '')) ||
        multiPackRegexes.some((re) => re.test(p?.baseTitle || ''));

    return inText || inType || inVendor || inTags || inPattern;
};




const groupProductsByBase = (products = []) => {
    const map = new Map();

    for (const p of products) {
        const title = p?.title || '';
        const baseKey = deriveBaseKey(title);
        const baseTitle = stripSizeTokens(title);

        // const weight =
        //     extractWeight(title) ||
        //     p?.variants?.edges?.[0]?.node?.weight ||
        //     null;

        const createdAt = p?.createdAt ? new Date(p.createdAt).getTime() : null;
        const inStockFlag = Boolean(
            p?.availableForSale === true ||
            (Array.isArray(p?.variants?.edges) && p.variants.edges.some((e) => e?.node?.availableForSale)) ||
            ((toNumber(p?.totalInventory) ?? 0) > 0)
        );

        const price =
            toNumber(p?.priceRange?.minVariantPrice?.amount) ??
            toNumber(p?.variants?.[0]?.price) ??
            toNumber(p?.price) ??
            null;

        const compareAtRaw =
            toNumber(p?.compareAtPriceRange?.maxVariantPrice?.amount) ??
            toNumber(p?.variants?.[0]?.compareAtPrice) ??
            null;

        const compareAt = compareAtRaw && compareAtRaw > 0 ? compareAtRaw : null;

        const edges = p?.variants?.edges || [];
        const firstAvailable = edges.find((e) => e?.node?.availableForSale)?.node?.id;
        const variantId =
            firstAvailable ||
            edges?.[0]?.node?.id ||
            p?.variants?.[0]?.id ||
            null;

        const image =
            p?.featuredImage?.url ||
            p?.images?.[0]?.src ||
            '/api/placeholder/300/300';

        const rating = parseRating(p?.productRating);
        const ratingCount = parseRatingCount(p?.productRatingCount);

        const entry = map.get(baseKey) || {
            id: baseKey,
            baseTitle,
            image,
            rating: rating ?? null,
            ratingCount: ratingCount ?? null,
            options: [],
            createdAt: createdAt ?? null,
            inStock: inStockFlag
        };

        if (rating != null && (entry.rating == null || (ratingCount ?? 0) > (entry.ratingCount ?? 0))) {
            entry.rating = rating;
            entry.ratingCount = ratingCount ?? entry.ratingCount;
        }

        // merge createdAt (keep latest) and stock flag
        if (createdAt != null) {
            entry.createdAt = Math.max(entry.createdAt ?? -Infinity, createdAt);
        }
        entry.inStock = Boolean(entry.inStock || inStockFlag);

        entry.options.push({
            label: extractWeight(title) || 'Pack',
            weight: extractWeight(title) || 'Pack',
            price,
            compareAt,
            variantId,
            productId: p.id,
            handle: p?.handle || null,
            image
        });

        map.set(baseKey, entry);
    }

    const grouped = Array.from(map.values()).map((g) => {
        const priced = g.options.filter((o) => o.price != null);
        g.options = (priced.length ? priced : g.options).sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        if (g.options[0]?.image) g.image = g.options[0].image;
        g.handle = g.options[0]?.handle || g.handle || null;

        return g;
    });

    grouped.sort((a, b) => a.baseTitle.localeCompare(b.baseTitle));
    return grouped;
};

/* ---------------------- Card ---------------------- */

const ProductCard = ({ product, isAllProductsPage = false }) => {


    const isGrouped = isAllProductsPage && Array.isArray(product?.options);
    const [selectedIdx, setSelectedIdx] = useState(0);

    const {
        displayTitle,
        image,
        price,
        comparePrice,
        rating,
        reviewCount,
        handle,
        variantId
    } = useMemo(() => {
        if (isGrouped) {
            const opt = product.options[selectedIdx] ?? product.options[0];
            return {
                displayTitle: product.baseTitle || 'Premium Product',
                image: opt?.image || product.image || '/api/placeholder/300/300',
                price: opt?.price ?? 0,
                comparePrice: opt?.compareAt ?? null,
                rating: product.rating ?? 0,
                reviewCount: product.ratingCount ?? 0,
                handle: opt?.handle || product?.handle || null,
                variantId: opt?.variantId ?? null
            };
        }

        const priceRaw =
            toNumber(product?.priceRange?.minVariantPrice?.amount) ??
            toNumber(product?.variants?.[0]?.price) ??
            toNumber(product?.price) ??
            0;

        const compareRaw =
            toNumber(product?.compareAtPriceRange?.maxVariantPrice?.amount) ??
            toNumber(product?.variants?.[0]?.compareAtPrice) ??
            null;

        return {
            displayTitle: stripSizeTokens(product?.title || 'Premium Product'),
            image:
                product?.images?.[0]?.src ||
                product?.featuredImage?.url ||
                '/api/placeholder/300/300',
            price: priceRaw,
            comparePrice: compareRaw && compareRaw > 0 ? compareRaw : null,
            rating: parseRating(product?.productRating) ?? 0,
            reviewCount: parseRatingCount(product?.productRatingCount) ?? 0,
            weight: extractWeight(product?.title) || product?.variants?.[0]?.weight || 'Pack',
            variantId:
                product?.variants?.edges?.[0]?.node?.id ||
                product?.variants?.[0]?.id ||
                null,
            handle: product?.handle || null

        };
    }, [isGrouped, product, selectedIdx]);

    const discountPct = getDiscountPercent(price, comparePrice, {
        round: 'round',   // 'floor' | 'ceil' | 'round'
        minPct: 1,        // <1% not shown
        maxPct: 95,       // clamp
        // step: 5,       // enable if you want 5%-steps (e.g., 33% => 35%)
    });

    const discountLabel = getDiscountLabel(price, comparePrice);


    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-50">
                <img
                    src={image}
                    alt={displayTitle}
                    className="w-full h-full object-cover"
                />
                {discountPct ? (
                    <div className="absolute top-6 right-0 bg-brand-500 text-white text-xs px-2 py-1 ">
                        {discountLabel}
                    </div>
                ) : null}
            </div>

            {/* Product Info */}
            <div className="p-4">
                {/* Price */}
                <div className="mb-2">
                    <span className="text-gray-600 text-small">From </span> <br />
                    <span className="text-lg font-semibold">₹{price}</span>
                    {comparePrice ? (
                        <span className="text-small text-gray-400 line-through ml-2">
                            ₹{comparePrice}
                        </span>
                    ) : null}
                </div>

                {/* Title */}
                <h3 className="text-gray-800 h-[50px] md:h-[30px] hover:underline cursor-pointer font-medium mb-2 line-clamp-2 text-body"
                    onClick={() => window.location.href = `/collection/product/${product.handle}`}
                >
                    {displayTitle}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => {
                            const diff = rating - i;
                            if (diff >= 1)
                                return <Star key={i} size={18} className="fill-brand-500  text-brand-500 " />;
                            if (diff > 0 && diff < 1)
                                return <StarHalf key={i} size={18} className="fill-brand-500  text-brand-500 " />;
                            return <Star key={i} size={14} className="text-gray-300" />;
                        })}
                        <span className="text-small text-gray-600 ml-1">({reviewCount})</span>
                    </div>

                </div>

                {/* Size Picker (All Products only) */}
                {isAllProductsPage && Array.isArray(product?.options) && (
                    <div className="mb-3">
                        <select
                            className="w-full border rounded-full px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-brand-400"
                            value={selectedIdx}
                            onChange={(e) => setSelectedIdx(Number(e.target.value))}
                        >
                            {product.options.map((opt, idx) => {
                                const label = opt?.label && opt.label !== 'Default' ? opt.label : 'Pack';
                                return (
                                    <option key={opt.variantId ?? idx} value={idx}>
                                        {label} — ₹{opt.price}
                                        {opt.compareAt && opt.compareAt > opt.price ? ` (was ₹${opt.compareAt})` : ''}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                )}

                {/* Add to Cart Button - Using Global Component with Toast */}
                <AddToCartButton
                    variantId={variantId}
                    quantity={1}
                    productTitle={displayTitle}
                    showSuccessToast={true}
                    showErrorToast={true}
                />
            </div>
        </div>
    );
};


const ShowProductsSection = () => {
    const { handle } = useParams();
    // const handle = 'allproducts';
    const isAllProductsPage = handle === 'allproducts';

    // filter and sort UI state
    const [priceSort, setPriceSort] = useState('none'); // 'none' | 'asc' | 'desc'
    const [nameSort, setNameSort] = useState('none');   // 'none' | 'az' | 'za'
    const [dateSort, setDateSort] = useState('none');   // 'none' | 'new' | 'old'

    // price range dual-thumb slider values (numbers). Initialized from computed bounds below
    const [rangeMin, setRangeMin] = useState(null);
    const [rangeMax, setRangeMax] = useState(null);

    const [availability, setAvailability] = useState({ in: false, out: false });

    const [showPriceMenu, setShowPriceMenu] = useState(false);
    const [showCatMenu, setShowCatMenu] = useState(false);
    const [showAvailMenu, setShowAvailMenu] = useState(false);

    // mobile modal state
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // close modal on Escape
    useEffect(() => {
        if (!showMobileFilters) return;
        const onKey = (e) => { if (e.key === 'Escape') setShowMobileFilters(false); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [showMobileFilters]);

    // refs for outside-click closing
    const priceMenuRef = useRef(null);
    const catMenuRef = useRef(null);
    const availMenuRef = useRef(null);

    // close other dropdowns when opening one
    const togglePriceMenu = () => {
        setShowPriceMenu((v) => {
            const next = !v; if (next) { setShowCatMenu(false); setShowAvailMenu(false); } return next;
        });
    };
    const toggleCatMenu = () => {
        setShowCatMenu((v) => {
            const next = !v; if (next) { setShowPriceMenu(false); setShowAvailMenu(false); } return next;
        });
    };
    const toggleAvailMenu = () => {
        setShowAvailMenu((v) => {
            const next = !v; if (next) { setShowPriceMenu(false); setShowCatMenu(false); } return next;
        });
    };

    // outside click to close menus
    useEffect(() => {
        const onDocClick = (e) => {
            const t = e.target;
            if (
                priceMenuRef.current && !priceMenuRef.current.contains(t) &&
                catMenuRef.current && !catMenuRef.current.contains(t) &&
                availMenuRef.current && !availMenuRef.current.contains(t)
            ) {
                setShowPriceMenu(false);
                setShowCatMenu(false);
                setShowAvailMenu(false);
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    const {
        data: collectionData,
        isLoading: isCollectionLoading,
        isError: isCollectionError,
    } = useCollection(handle, 50, { enabled: !isAllProductsPage });

    const {
        data: allProducts = [],
        isLoading: isAllLoading,
        isError: isAllError,
    } = useProducts(100, { enabled: isAllProductsPage });

    const rawProducts = isAllProductsPage
        ? (allProducts || []).filter((p) => !isComboProduct(p))
        : collectionData?.pages?.flatMap((page) => page?.products || []);


    console.log(rawProducts);
    const productsToRender = useMemo(() => {
        if (!isAllProductsPage) return rawProducts;
        return groupProductsByBase(rawProducts);
    }, [rawProducts, isAllProductsPage]);

    // helpers to derive comparable values
    const getMinPriceOf = (item) => {
        if (isAllProductsPage && Array.isArray(item?.options)) {
            const vals = (item.options || []).map((o) => toNumber(o.price)).filter((n) => n != null);
            return vals.length ? Math.min(...vals) : null;
        }
        return (
            toNumber(item?.priceRange?.minVariantPrice?.amount) ??
            toNumber(item?.variants?.[0]?.price) ??
            toNumber(item?.price) ??
            null
        );
    };

    const getNameOf = (item) => {
        if (isAllProductsPage && Array.isArray(item?.options)) return item?.baseTitle || '';
        return stripSizeTokens(item?.title || '');
    };

    // compute dynamic bounds based on current dataset
    const priceBounds = useMemo(() => {
        const vals = (productsToRender || [])
            .map((p) => getMinPriceOf(p))
            .filter((n) => n != null);
        if (!vals.length) return { min: 0, max: 0 };
        const min = Math.floor(Math.min(...vals));
        const max = Math.ceil(Math.max(...vals));
        return { min, max };
    }, [productsToRender]);

    // initialize range when bounds change
    useEffect(() => {
        if (priceBounds) {
            setRangeMin(priceBounds.min);
            setRangeMax(priceBounds.max);
        }
    }, [priceBounds.min, priceBounds.max]);

    const getDateOf = (item) => {
        if (isAllProductsPage && Array.isArray(item?.options)) return item?.createdAt ?? 0;
        return item?.createdAt ? new Date(item.createdAt).getTime() : 0;
    };

    const getStockOf = (item) => {
        if (isAllProductsPage && Array.isArray(item?.options)) return Boolean(item?.inStock);
        return Boolean(
            item?.availableForSale === true ||
            (Array.isArray(item?.variants?.edges) && item.variants.edges.some((e) => e?.node?.availableForSale)) ||
            ((toNumber(item?.totalInventory) ?? 0) > 0)
        );
    };

    const inStockCount = useMemo(() => (productsToRender || []).filter((p) => getStockOf(p)).length, [productsToRender]);
    const outStockCount = useMemo(() => (productsToRender || []).filter((p) => !getStockOf(p)).length, [productsToRender]);

    const filteredList = useMemo(() => {
        let list = [...(productsToRender || [])];
        const min = rangeMin;
        const max = rangeMax;
        if (min != null) list = list.filter((p) => { const v = getMinPriceOf(p); return v != null && v >= min; });
        if (max != null) list = list.filter((p) => { const v = getMinPriceOf(p); return v != null && v <= max; });

        if (availability.in && !availability.out) list = list.filter((p) => getStockOf(p));
        if (availability.out && !availability.in) list = list.filter((p) => !getStockOf(p));
        return list;
    }, [productsToRender, rangeMin, rangeMax, availability]);

    const sortedList = useMemo(() => {
        const arr = [...filteredList];
        const comparators = [];
        if (priceSort !== 'none') comparators.push((a, b) => {
            const av = getMinPriceOf(a) ?? Number.POSITIVE_INFINITY;
            const bv = getMinPriceOf(b) ?? Number.POSITIVE_INFINITY;
            return (av - bv) * (priceSort === 'asc' ? 1 : -1);
        });
        if (nameSort !== 'none') comparators.push((a, b) => {
            const an = (getNameOf(a) || '').toLowerCase();
            const bn = (getNameOf(b) || '').toLowerCase();
            return an.localeCompare(bn) * (nameSort === 'az' ? 1 : -1);
        });
        if (dateSort !== 'none') comparators.push((a, b) => {
            const ad = getDateOf(a);
            const bd = getDateOf(b);
            return (ad - bd) * (dateSort === 'old' ? 1 : -1); // 'new' puts newest first
        });
        if (comparators.length) {
            arr.sort((a, b) => {
                for (const cmp of comparators) {
                    const r = cmp(a, b);
                    if (r !== 0) return r;
                }
                return 0;
            });
        }
        return arr;
    }, [filteredList, priceSort, nameSort, dateSort]);

    // Loading / error states
    if (!handle) return <p className="text-center py-8 text-body">No collection handle provided.</p>;

    if (isAllProductsPage) {
        if (isAllLoading) return <Loader message="Loading all products..." />;
        if (isAllError) return <p className="text-center py-8 text-red-600 text-body">Failed to load all products.</p>;
    } else {
        if (isCollectionLoading) return <Loader message="Loading collection..." />;
        if (isCollectionError) return <p className="text-center py-8 text-red-600 text-body">Failed to load collection.</p>;
        if (!collectionData?.pages?.length) return <Empty title="No collection" message="Collection not found." />;
    }

    const toTitleCase = (s = "") =>
        s
            .replace(/[-_]+/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/\b\w/g, (c) => c.toUpperCase());

    /** Build "All X" and accent the last word (PRODUCTS / CASHEW / FRUITS) */
    const makeAllHeadingParts = (title = "") => {
        const clean = (title || "").trim();
        const words = clean.split(/\s+/);
        if (!clean) return { main: "All", accent: "PRODUCTS" };

        // prefix "All " then accent the last word in the full phrase
        const prefixed = ["All", ...words]; // ["All", "Dry", "Fruits"]
        const main = prefixed.slice(0, -1).join(" "); // "All Dry"
        const accent = prefixed[prefixed.length - 1].toUpperCase(); // "FRUITS"
        return { main, accent };
    };


    const baseTitle = isAllProductsPage
        ? "Products"
        : (collectionData?.pages?.[0]?.title || toTitleCase(handle || "Products"));

    const { main: headingMain, accent: headingAccent } = makeAllHeadingParts(baseTitle);


    return (
        <div className="content py-8">
            {/* Filters Bar */}
            {/* Mobile trigger button */}
            <div className="md:hidden mb-4 flex justify-end">
                <button
                    type="button"
                    onClick={() => setShowMobileFilters(true)}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-white shadow-sm"
                    style={{ backgroundColor: 'var(--color-brand-600)' }}
                >
                    <FilterIcon size={16} />
                    <span className="text-sm">Filter And Sort</span>
                </button>
            </div>

            <div className="hidden md:flex items-center justify-between mb-6">
                <div>
                    <span className="inline-block rounded-full px-4 py-2 text-small font-medium" style={{ color: "var(--color-brand-600)", backgroundColor: "rgba(19,125,103,0.08)" }}>
                        {/* All Products */}
                        {headingMain + " " + headingAccent}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Filter:</span>

                    {/* Price dropdown */}
                    <div className="relative" ref={priceMenuRef}>
                        <button
                            type="button"
                            className="rounded-full border px-4 py-2 text-sm flex items-center gap-2"
                            style={{ borderColor: "var(--color-brand-500)", color: "var(--color-brand-600)" }}
                            onClick={togglePriceMenu}
                        >
                            Price <span>▾</span>
                        </button>
                        {showPriceMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-20 origin-top-right transform transition duration-150 ease-out scale-100 opacity-100">
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50" onClick={() => { setPriceSort('asc'); setShowPriceMenu(false); }}>Low → High</button>
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50" onClick={() => { setPriceSort('desc'); setShowPriceMenu(false); }}>High → Low</button>
                                <div className="h-px bg-gray-200 my-1"></div>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:text-gray-700" onClick={() => { setPriceSort('none'); setShowPriceMenu(false); }}>Reset</button>
                            </div>
                        )}
                    </div>

                    {/* Category dropdown */}
                    <div className="relative" ref={catMenuRef}>
                        <button
                            type="button"
                            className="rounded-full border px-4 py-2 text-sm flex items-center gap-2"
                            style={{ borderColor: "var(--color-brand-500)", color: "var(--color-brand-600)" }}
                            onClick={toggleCatMenu}
                        >
                            Category <span>▾</span>
                        </button>
                        {showCatMenu && (
                            <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg z-20 p-3 origin-top-right transform transition duration-150 ease-out scale-100 opacity-100">
                                <div className="text-xs font-semibold text-gray-600 mb-2">Price range</div>
                                {/* Dual-thumb range slider */}
                                <div className="px-2 py-1">
                                    <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
                                        <span>₹{rangeMin ?? priceBounds.min}</span>
                                        <span>₹{rangeMax ?? priceBounds.max}</span>
                                    </div>
                                    <div className="relative h-6">
                                        {/* track */}
                                        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded-full bg-gray-200"></div>
                                        {/* selected range */}
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full"
                                            style={{
                                                left: `${((rangeMin ?? priceBounds.min) - priceBounds.min) / Math.max(1, (priceBounds.max - priceBounds.min)) * 100}%`,
                                                right: `${100 - (((rangeMax ?? priceBounds.max) - priceBounds.min) / Math.max(1, (priceBounds.max - priceBounds.min)) * 100)}%`,
                                                backgroundColor: 'var(--color-brand-500)'
                                            }}
                                        ></div>
                                        {/* min thumb */}
                                        <input
                                            type="range"
                                            min={priceBounds.min}
                                            max={priceBounds.max}
                                            step={1}
                                            value={rangeMin ?? priceBounds.min}
                                            onChange={(e) => {
                                                const v = Math.min(Number(e.target.value), (rangeMax ?? priceBounds.max) - 1);
                                                setRangeMin(v);
                                            }}
                                            className="absolute w-full appearance-none bg-transparent pointer-events-auto"
                                            style={{ WebkitAppearance: 'none', height: '6px' }}
                                        />
                                        {/* max thumb */}
                                        <input
                                            type="range"
                                            min={priceBounds.min}
                                            max={priceBounds.max}
                                            step={1}
                                            value={rangeMax ?? priceBounds.max}
                                            onChange={(e) => {
                                                const v = Math.max(Number(e.target.value), (rangeMin ?? priceBounds.min) + 1);
                                                setRangeMax(v);
                                            }}
                                            className="absolute w-full appearance-none bg-transparent pointer-events-auto"
                                            style={{ WebkitAppearance: 'none', height: '6px' }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-end gap-2 mt-2">
                                        <button className="text-xs text-gray-500 hover:text-gray-800" onClick={() => { setRangeMin(priceBounds.min); setRangeMax(priceBounds.max); }}>Reset</button>
                                        <button className="rounded-full px-3 py-1 text-white text-xs" style={{ backgroundColor: 'var(--color-brand-500)' }} onClick={() => setShowCatMenu(false)}>Apply</button>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-200 my-3"></div>
                                <div className="text-xs font-semibold text-gray-600 mb-1">Sort by name</div>
                                <div className="flex items-center gap-2 mb-2">
                                    <button className="rounded-full border px-3 py-1 text-xs" onClick={() => { setNameSort('az'); setShowCatMenu(false); }}>A–Z</button>
                                    <button className="rounded-full border px-3 py-1 text-xs" onClick={() => { setNameSort('za'); setShowCatMenu(false); }}>Z–A</button>
                                </div>
                                <div className="text-xs font-semibold text-gray-600 mb-1">Sort by date</div>
                                <div className="flex items-center gap-2">
                                    <button className="rounded-full border px-3 py-1 text-xs" onClick={() => { setDateSort('new'); setShowCatMenu(false); }}>Newest</button>
                                    <button className="rounded-full border px-3 py-1 text-xs" onClick={() => { setDateSort('old'); setShowCatMenu(false); }}>Oldest</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Availability dropdown */}
                    <div className="relative" ref={availMenuRef}>
                        <button
                            type="button"
                            className="rounded-full border px-4 py-2 text-sm flex items-center gap-2"
                            style={{ borderColor: "var(--color-brand-500)", color: "var(--color-brand-600)" }}
                            onClick={toggleAvailMenu}
                        >
                            Availability <span>▾</span>
                        </button>
                        {showAvailMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg z-20 p-3 origin-top-right transform transition duration-150 ease-out scale-100 opacity-100">
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                    <span>{(availability.in ? 1 : 0) + (availability.out ? 1 : 0)} Selected</span>
                                    <button className="text-xs text-gray-500 hover:text-gray-800" onClick={() => setAvailability({ in: false, out: false })}>Reset</button>
                                </div>
                                <label className="flex items-center gap-2 text-sm mb-2">
                                    <input type="checkbox" checked={availability.in} onChange={(e) => setAvailability((v) => ({ ...v, in: e.target.checked }))} />
                                    <span>In Stock ({inStockCount})</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked={availability.out} onChange={(e) => setAvailability((v) => ({ ...v, out: e.target.checked }))} />
                                    <span>Out Stock ({outStockCount})</span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filters Modal */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)}></div>
                    <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl p-4 max-h-[80vh] overflow-y-auto transition-transform duration-200 ease-out">
                        <div className="h-1 w-10 bg-gray-300 rounded-full mx-auto mb-4"></div>

                        {/* Price sort */}
                        <div className="mb-4">
                            <div className="text-sm font-medium text-gray-700 mb-2">Price</div>
                            <div className="grid grid-cols-2 gap-2">
                                <button className={`rounded-full border px-3 py-2 text-sm ${priceSort === 'asc' ? 'bg-[var(--color-brand-50)] border-[var(--color-brand-500)] text-[var(--color-brand-600)]' : ''}`} onClick={() => setPriceSort('asc')}>Low → High</button>
                                <button className={`rounded-full border px-3 py-2 text-sm ${priceSort === 'desc' ? 'bg-[var(--color-brand-50)] border-[var(--color-brand-500)] text-[var(--color-brand-600)]' : ''}`} onClick={() => setPriceSort('desc')}>High → Low</button>
                            </div>
                        </div>

                        {/* Price range slider */}
                        <div className="mb-6">
                            <div className="text-sm font-medium text-gray-700 mb-2">Price range</div>
                            <div className="px-1">
                                <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
                                    <span>₹{rangeMin ?? priceBounds.min}</span>
                                    <span>₹{rangeMax ?? priceBounds.max}</span>
                                </div>
                                <div className="relative h-6">
                                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded-full bg-gray-200"></div>
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full"
                                        style={{
                                            left: `${((rangeMin ?? priceBounds.min) - priceBounds.min) / Math.max(1, (priceBounds.max - priceBounds.min)) * 100}%`,
                                            right: `${100 - (((rangeMax ?? priceBounds.max) - priceBounds.min) / Math.max(1, (priceBounds.max - priceBounds.min)) * 100)}%`,
                                            backgroundColor: 'var(--color-brand-500)'
                                        }}
                                    ></div>
                                    <input type="range" min={priceBounds.min} max={priceBounds.max} step={1} value={rangeMin ?? priceBounds.min}
                                        onChange={(e) => { const v = Math.min(Number(e.target.value), (rangeMax ?? priceBounds.max) - 1); setRangeMin(v); }}
                                        className="absolute w-full appearance-none bg-transparent" style={{ WebkitAppearance: 'none', height: '6px' }} />
                                    <input type="range" min={priceBounds.min} max={priceBounds.max} step={1} value={rangeMax ?? priceBounds.max}
                                        onChange={(e) => { const v = Math.max(Number(e.target.value), (rangeMin ?? priceBounds.min) + 1); setRangeMax(v); }}
                                        className="absolute w-full appearance-none bg-transparent" style={{ WebkitAppearance: 'none', height: '6px' }} />
                                </div>
                            </div>
                        </div>

                        {/* Name/date sorting */}
                        <div className="mb-6">
                            <div className="text-sm font-medium text-gray-700 mb-2">Sort by name</div>
                            <div className="flex items-center gap-2 mb-3">
                                <button className={`rounded-full border px-3 py-1 text-xs ${nameSort === 'az' ? 'bg-[var(--color-brand-50)] border-[var(--color-brand-500)] text-[var(--color-brand-600)]' : ''}`} onClick={() => setNameSort('az')}>A–Z</button>
                                <button className={`rounded-full border px-3 py-1 text-xs ${nameSort === 'za' ? 'bg-[var(--color-brand-50)] border-[var(--color-brand-500)] text-[var(--color-brand-600)]' : ''}`} onClick={() => setNameSort('za')}>Z–A</button>
                            </div>
                            <div className="text-sm font-medium text-gray-700 mb-2">Sort by date</div>
                            <div className="flex items-center gap-2">
                                <button className={`rounded-full border px-3 py-1 text-xs ${dateSort === 'new' ? 'bg-[var(--color-brand-50)] border-[var(--color-brand-500)] text-[var(--color-brand-600)]' : ''}`} onClick={() => setDateSort('new')}>Newest</button>
                                <button className={`rounded-full border px-3 py-1 text-xs ${dateSort === 'old' ? 'bg-[var(--color-brand-50)] border-[var(--color-brand-500)] text-[var(--color-brand-600)]' : ''}`} onClick={() => setDateSort('old')}>Oldest</button>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="mb-6">
                            <div className="text-sm font-medium text-gray-700 mb-2">Availability</div>
                            <label className="flex items-center gap-2 text-sm mb-2">
                                <input type="checkbox" checked={availability.in} onChange={(e) => setAvailability(v => ({ ...v, in: e.target.checked }))} />
                                <span>In Stock ({inStockCount})</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={availability.out} onChange={(e) => setAvailability(v => ({ ...v, out: e.target.checked }))} />
                                <span>Out Stock ({outStockCount})</span>
                            </label>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <button
                                className="text-sm text-gray-600"
                                onClick={() => {
                                    setPriceSort('none');
                                    setNameSort('none');
                                    setDateSort('none');
                                    setRangeMin(priceBounds.min);
                                    setRangeMax(priceBounds.max);
                                    setAvailability({ in: false, out: false });
                                }}
                            >Reset</button>
                            <button
                                className="rounded-full px-5 py-2 text-white text-sm"
                                style={{ backgroundColor: 'var(--color-brand-600)' }}
                                onClick={() => setShowMobileFilters(false)}
                            >Apply</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="text-center my-10 md:my-14">
                <BrandHeading
                    accentWord={headingAccent}
                    className="text-subheading text-brand-500 uppercase mb-4"
                >
                    {headingMain}
                </BrandHeading>
                <p className="text-body text-gray-600 max-w-2xl mx-auto">
                    Explore Our Entire Range of Natural Goodness: Uncompromising Quality in Every Product We Offer.
                </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedList?.length > 0 ? (
                    sortedList.map((p, idx) => (
                        <ProductCard
                            key={p.id || p.productId || p?.id || idx}
                            product={p}
                            isAllProductsPage={isAllProductsPage}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500 text-body">
                        No products found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowProductsSection