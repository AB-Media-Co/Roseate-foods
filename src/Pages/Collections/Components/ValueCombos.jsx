import React from 'react';
import { BrandHeading } from '../../../components/BrandHeading';
import { useProducts } from '../../../hooks/useProducts';
import AddToCartButton from "../../../components/AddToCartButton";
import { getDiscountLabel, getDiscountPercent } from '../../../utils/price';


const isComboProduct = (p) => {
    const title = String(p?.title || '').toLowerCase();
    const productType = String(p?.productType || '').toLowerCase();
    const vendor = String(p?.vendor || '').toLowerCase();

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
        'value pack',
        'pack of',
        'assorted pack',
        'variety pack',
        'set of',
        'kit',
        'bogo',
    ];

    const inText = cues.some((c) => title.includes(c));
    const inType = cues.some((c) => productType.includes(c));
    const inVendor = cues.some((c) => vendor.includes(c));
    const inTags = tags.some((t) => cues.some((c) => t.includes(c)));

    const multiPackRegexes = [
        /\bpack\s*of\s*\d+\b/i,
        /\bset\s*of\s*\d+\b/i,
        /\b\d+\s*x\s*\d+\b/i,
        /\b\d+-?pack\b/i,
    ];
    const inPattern = multiPackRegexes.some((re) => re.test(title));

    return inText || inType || inVendor || inTags || inPattern;
};



const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};


const ComboCard = ({ product }) => {
    const title = product?.title || "Combo Pack";
    const image =
        product?.featuredImage?.url ||
        product?.images?.[0]?.src ||
        "/api/placeholder/300/300";

    const price =
        toNumber(product?.priceRange?.minVariantPrice?.amount) ??
        toNumber(product?.price) ??
        0;

    const comparePrice =
        toNumber(product?.compareAtPriceRange?.maxVariantPrice?.amount) ??
        null;

    const discountPct = getDiscountPercent(price, comparePrice, {
        round: 'round',   // 'floor' | 'ceil' | 'round'
        minPct: 1,        // <1% not shown
        maxPct: 95,       // clamp
        // step: 5,       // enable if you want 5%-steps (e.g., 33% => 35%)
    });

    const discountLabel = getDiscountLabel(price, comparePrice);


    const variantId =
        product?.variants?.edges?.[0]?.node?.id ||
        product?.variants?.[0]?.id ||
        null;

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* image + tag */}
            <div className="relative aspect-square bg-gray-50">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover rounded-t-xl"
                />
                <div className="absolute top-4 right-0 bg-brand-500 text-white text-xs px-2 py-1  flex items-center gap-1">
                    Combo Offer
                </div>

            </div>

            {/* info */}
            <div className="p-4 relative">
                {discountPct ? (
                    <div className="absolute -top-1  left-[35%] font-bold bg-[#E43861] text-white text-[9px] px-2 py-1 ">
                        {discountLabel}
                    </div>
                ) : null}
                <div className="flex  items-baseline gap-2 mb-2">
                    <span className="text-lg text-semibold">MRP:</span>
                    {comparePrice ? (
                        <span className="text-sm text-gray-400 line-through">
                            ₹{comparePrice}
                        </span>
                    ) : null}


                    <span className="text-lg font-semibold text-brand-600">₹{price}</span>
                </div>

                <h3
                    className="text-gray-800 hover:underline cursor-pointer font-medium mb-2 line-clamp-2 mb-2"
                    onClick={() =>
                        (window.location.href = `/collection/product/${product.handle}`)
                    }
                >
                    {title}
                </h3>

                <AddToCartButton
                    variantId={variantId}
                    quantity={1}
                    productTitle={title}
                    showSuccessToast
                    showErrorToast
                />
            </div>
        </div>
    );
};



const ValueCombos = () => {
    const {
        data: allProducts = [],
        isLoading: isAllLoading,
        isError: isAllError,
    } = useProducts(100);

    const comboProducts = (allProducts || []).filter(isComboProduct);

    if (isAllLoading)
        return <p className="text-center py-8 text-body">Loading combos...</p>;
    if (isAllError)
        return (
            <p className="text-center py-8 text-red-600 text-body">
                Failed to load combos.
            </p>
        );

    return (
        <div className="content py-8">
            <div className="text-center my-10 md:my-14">
                <BrandHeading
                    accentWord="Combos"
                    className="text-subheading text-brand-500 uppercase mb-4"
                >
                    Value
                </BrandHeading>
                <p className="text-body text-gray-600 max-w-2xl mx-auto">
                    Perfectly Paired: The Ideal Share & Gift Sets.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
                {comboProducts.length > 0 ? (
                    comboProducts.map((p, idx) => (
                        <ComboCard key={p.id || idx} product={p} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500 text-body">
                        No combo products found.
                    </div>
                )}
            </div>

        </div>
    );
};

export default ValueCombos;
