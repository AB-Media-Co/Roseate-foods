import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStorefront } from '../../../context/StorefrontContext'
import AddToCartButton from '../../../components/AddToCartButton'
import Button from '../../../components/ui/Button'
import { getDiscountLabel, getDiscountPercent } from '../../../utils/price'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'

// helpers
const SIZE_REGEX = /(\d+(?:\.\d+)?)\s*(g|kg|ml|l)\b/i
const stripSize = (s = '') => s.replace(SIZE_REGEX, '').replace(/\s+\|\s+.*/, '').replace(/\s{2,}/g, ' ').trim()
const getSizeLabel = (s = '') => {
  const m = s.match(SIZE_REGEX)
  return m ? `${m[1]}${m[2].toLowerCase()}` : null
}
const toNumber = (v) => {
  if (v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}
const parseRating = (mf) => {
  try {
    if (!mf || !mf.value) return null
    const j = JSON.parse(mf.value)
    return Number(j.value ?? j.rating ?? j.score) || null
  } catch {
    return null
  }
}

const ProductDetailPage = () => {
  const { handle } = useParams()
  const navigate = useNavigate()
  const { products } = useStorefront()
  console.log(products)
  const [qty, setQty] = useState(1)

  const safeDecode = (str = "") => {
  try {
    return decodeURIComponent(str);
  } catch {
    return str; // fallback: return raw if decode fails
  }
};


  // find current product (by handle; fallback by title)
  const current = useMemo(() => {
    if (!products?.length) return null
    const byHandle = products.find((p) => p.handle === handle)
    if (byHandle) return byHandle
    // fallback: URL may have title instead of handle
    const decoded = safeDecode(handle || '')
    return products.find((p) => p.title === decoded) || null
  }, [products, handle])

  // group similar products (sizes) by base title so we can show chips even if sizes are separate products
  const group = useMemo(() => {
    if (!current) return null
    const base = stripSize(current.title)
    const list = (products || []).filter((p) => stripSize(p.title) === base)
    // sort by size when possible
    const toG = (title) => {
      const m = title?.match(/([\d.]+)\s*(g|kg|ml|l)/i)
      if (!m) return Number.POSITIVE_INFINITY
      const n = parseFloat(m[1])
      const u = m[2]?.toLowerCase()
      if (u === 'kg' || u === 'l') return n * 1000
      return n
    }
    list.sort((a, b) => toG(a.title) - toG(b.title))
    return { baseTitle: base, variants: list }
  }, [current, products])

  const [selIdx, setSelIdx] = useState(0)

  const sel = useMemo(() => {
    if (!group) return current
    // choose selected product if exists; default to item whose handle == current.handle
    const idx = Math.max(0, group.variants.findIndex((p) => p.handle === current?.handle))
    return group.variants[selIdx ?? (idx >= 0 ? idx : 0)] || current
  }, [group, selIdx, current])


  console.log(sel,",@alala")

  // pricing
  const price = sel?.priceRange?.minVariantPrice?.amount ?? sel?.variants?.[0]?.price ?? sel?.price ?? null
  const compare = sel?.compareAtPriceRange?.maxVariantPrice?.amount ?? sel?.variants?.[0]?.compareAtPrice ?? null
  const discountPct = getDiscountPercent(price, compare, { round: 'round', minPct: 1, maxPct: 95 })
  const discountLabel = getDiscountLabel(price, compare)

  // rating
  const rating = parseRating(sel?.productRating)
  const ratingCount = Number(sel?.productRatingCount?.value || 0) || null

  // size options
  const sizeOptions = group?.variants?.map((p) => ({ label: getSizeLabel(p.title) || 'Pack', handle: p.handle })) || []
  const onPickSize = (i) => { setSelIdx(i) }

  // variant id for add to cart
  const edges = sel?.variants?.edges || []
  const firstAvailable = edges.find((e) => e?.node?.availableForSale)?.node?.id
  const variantId = firstAvailable || edges?.[0]?.node?.id || sel?.variants?.[0]?.id || null

  const per100 = useMemo(() => {
    // compute per 100g price if units are g/kg only
    const label = getSizeLabel(sel?.title)
    if (!label) return null
    const m = label.match(/([\d.]+)(g|kg)/i)
    if (!m) return null
    const qtyG = m[2].toLowerCase() === 'kg' ? parseFloat(m[1]) * 1000 : parseFloat(m[1])
    const p = toNumber(price)
    if (!p || !qtyG || qtyG <= 0) return null
    const val = (p / qtyG) * 100
    return `₹${val.toFixed(2)}/100g`
  }, [sel?.title, price])

  const images = useMemo(() => {
    // Collect images from Shopify media connection, legacy images array, and featured image
    const list = []
    // media.edges -> node.image.url or node.previewImage.url
    const mediaEdges = sel?.media?.edges || []
    mediaEdges.forEach((e) => {
      const n = e?.node || {}
      const src = n?.image?.url || n?.previewImage?.url || null
      if (src) list.push(src)
    })
    if (sel?.images?.length) list.push(...sel.images.map((x) => x.src))
    if (sel?.featuredImage?.url) list.unshift(sel.featuredImage.url)
    return Array.from(new Set(list))
  }, [sel])
  const [mainSwiper, setMainSwiper] = useState(null)
  const [activeIdx, setActiveIdx] = useState(0)

  if (!current) {
    return <div className="content py-12"><p className="text-body text-gray-600">Product not found.</p></div>
  }


  return (
    <section className="content grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Gallery */}
      <div>
        <div className="relative bg-white border rounded-2xl p-3">
          <Swiper
            modules={[Navigation, FreeMode]}
            navigation
            onSwiper={setMainSwiper}
            onSlideChange={(s) => setActiveIdx(s.activeIndex)}
            className="rounded-xl overflow-hidden"
          >
            {(images.length ? images : [sel?.featuredImage?.url]).map((src, i) => (
              <SwiperSlide key={i}>
                <div className="aspect-[3/4] w-full flex items-center justify-center">
                  <img src={src} alt={sel?.title} className="max-h-full object-contain" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {discountPct ? (
            <span className="absolute left-4 top-4 text-xs text-white px-2 py-1 rounded" style={{ backgroundColor: 'var(--color-brand-500)' }}>{discountLabel}</span>
          ) : null}
        </div>

        {images.length > 1 && (
          <div className="mt-3 flex gap-3">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => { setActiveIdx(i); mainSwiper?.slideTo(i); }}
                className={`w-20 h-20 rounded-xl border overflow-hidden ${activeIdx===i ? 'ring-2 ring-[var(--color-brand-500)]' : ''}`}
              >
                <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-subheading text-[color:var(--color-brand-700)] leading-tight">{stripSize(sel?.title)}</h1>
          {/* actions */}
          <div className="flex items-center gap-2 text-gray-500">
            <button title="Share" className="p-2 rounded-full hover:bg-gray-100">
              <img src="/share2.svg" alt="share" />
            </button>
          </div>
        </div>

        {/* rating */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => {
              const filled = rating && i < Math.round(rating)
              return <svg key={i} viewBox="0 0 20 20" className="w-4 h-4" style={{ color: filled ? 'var(--color-brand-400)' : '#e5e7eb' }}><path d="M10 15.27l-5.18 3.04 1-5.82L.64 7.96l5.86-.85L10 1.67l2.5 5.44 5.86.85-4.18 4.53 1 5.82z" fill="currentColor" /></svg>
            })}
          </div>
          <span className="text-small text-gray-600">{rating ? rating.toFixed(1) : '—'}{ratingCount ? ` (${ratingCount})` : ''}</span>
        </div>

        {/* price */}
        <div className="flex items-baseline gap-2">
          <span className="text-gray-600">MRP:</span>
          {compare ? <span className="text-small text-gray-400 line-through">₹{compare}</span> : null}
          <span className="text-lg font-semibold text-[color:var(--color-brand-600)]">₹{price}</span>
          {per100 ? <span className="text-xs text-gray-500">({per100})</span> : null}
        </div>
        <div className="text-[11px] text-gray-500">Taxes included. Shipping calculated at checkout.</div>

        {/* size chips */}
        {sizeOptions?.length > 1 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {sizeOptions.map((o, i) => (
              <button key={o.handle} onClick={() => onPickSize(i)} className={`px-3 py-1.5 rounded-full border text-sm ${i === selIdx ? 'bg-[var(--color-brand-50)] border-[var(--color-brand-500)] text-[var(--color-brand-700)]' : 'text-gray-700'}`}>{o.label}</button>
            ))}
          </div>
        )}

        {/* quantity + buttons */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center border rounded-full overflow-hidden">
            <button className="px-3" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="px-3 select-none">{qty}</span>
            <button className="px-3" onClick={() => setQty((q) => q + 1)}>+</button>
          </div>

          <AddToCartButton
            variantId={variantId}
            quantity={qty}
            productTitle={stripSize(sel?.title)}
            className="min-w-[140px]"
          />

          <AddToCartButton
            variantId={variantId}
            quantity={qty}
            productTitle={stripSize(sel?.title)}
            variant="solid"
            className="min-w-[120px] bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-700)]"
            onSuccess={() => {
              // after adding, navigate to cart page if you have one; fallback to checkout url if present later
              // For now, just show toast from button and stay
            }}
          >
            Buy Now
          </AddToCartButton>
        </div>

        {/* badges row (illustrative) */}
        <div className="grid grid-cols-4 gap-3 mt-4 text-center text-xs text-gray-700">
          <div className="flex flex-col items-center gap-1">
            <img src="/ProductNature.svg" alt="High Protein" />
            <span>High Protein</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <img src="/productLeaf.svg" alt="100% Natural" />
            <span>100% Natural</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <img src="/productJars.svg" alt="Lab Tested" />
            <span>Lab Tested</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <img src="/productJars.svg" alt="FSSAI" />
            <span>FSSAI</span>
          </div>
        </div>

        {/* accordions */}
        <details className="mt-4 border rounded-lg p-3">
          <summary className="cursor-pointer font-medium">Shipping Details</summary>
          <div className="text-small text-gray-600 mt-2">
            Your order is packed with care and dispatched within 24 hours. PAN-India delivery. Hygienic packaging. Typical transit 3–7 business days. Free shipping on orders above ₹499.
          </div>
        </details>
        <details className="border rounded-lg p-3">
          <summary className="cursor-pointer font-medium">Description</summary>
          <div className="text-small text-gray-600 mt-2">
            {sel?.description || 'Delicious and nutritious — perfect for snacking and cooking.'}
          </div>
        </details>
        <details className="border rounded-lg p-3">
          <summary className="cursor-pointer font-medium">Other Details</summary>
          <div className="text-small text-gray-600 mt-2">Country of Origin: India · Storage: Keep in a cool, dry place · Shelf life varies by pack.</div>
        </details>

        {/* payment logos (illustrative) */}
        <div className="mt-4 flex items-center gap-3 opacity-80">
          <img src="/visa.svg" alt="Visa" />
          <img src="/upi.svg" alt="UPI" />
          <img src="/cod.svg" alt="COD" />
        </div>
      </div>
    </section>
  )
}

export default ProductDetailPage
