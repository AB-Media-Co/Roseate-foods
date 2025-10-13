import React, { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStorefront } from '../../../context/StorefrontContext'
import AddToCartButton from '../../../components/AddToCartButton'
import ProductReviews from '../../../components/ProductReviews'
import Button from '../../../components/ui/Button'
import { getDiscountLabel, getDiscountPercent } from '../../../utils/price'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Autoplay } from 'swiper/modules'
import 'swiper/css'
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
  const navigate = useNavigate() // eslint-disable-line no-unused-vars
  const { products } = useStorefront()
  // console.log(products)
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


  console.log(sel?.id, ",@alala")

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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)

  // keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false)
      if (e.key === 'ArrowRight') setLightboxIdx((i) => (i + 1) % (images.length || 1))
      if (e.key === 'ArrowLeft') setLightboxIdx((i) => (i - 1 + (images.length || 1)) % (images.length || 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isLightboxOpen, images.length])

  if (!current) {
    return <div className="content py-12"><p className="text-body text-gray-600">Product not found.</p></div>
  }


  return (
    <>
      <section className="content grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gallery */}
        <div>
          <div className="relative bg-white  rounded-2xl p-3">
            <Swiper
              modules={[FreeMode, Autoplay]}
              loop={true}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              onSwiper={setMainSwiper}
              onSlideChange={(s) => setActiveIdx(s.realIndex ?? s.activeIndex)}
              className="rounded-xl overflow-hidden"
            >
              {(images.length ? images : [sel?.featuredImage?.url]).map((src, i) => (
                <SwiperSlide key={i}>
                  <div
                    className="aspect-[3/4] w-full h-[750px] flex border border-[#F2F2F2] bg-[#F2F2F2] items-center justify-center cursor-zoom-in"
                    onClick={() => { setLightboxIdx(i); setIsLightboxOpen(true) }}
                  >
                    <img src={src} alt={sel?.title} className="max-h-full p-6 object-contain" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              title="Zoom"
              className="absolute right-4 top-4 p-2 rounded-full bg-white/80 hover:bg-white shadow"
              onClick={() => { setLightboxIdx(activeIdx); setIsLightboxOpen(true) }}
            >
              <img src="/glass.svg" alt="zoom" className="w-5 h-5" />
            </button>
            {discountPct ? (
              <span className="absolute left-4 top-4 text-xs text-white px-2 py-1 rounded" style={{ backgroundColor: 'var(--color-brand-500)' }}>{discountLabel}</span>
            ) : null}
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveIdx(i); mainSwiper?.slideToLoop ? mainSwiper.slideToLoop(i) : mainSwiper?.slideTo(i); }}
                  className={`w-[120px] h-[120px] rounded-xl border border-[#F2F2F2] bg-[#F2F2F2] overflow-hidden ${activeIdx === i ? 'ring-2 ring-[var(--color-brand-500)]' : ''}`}
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
            <div className="flex text-brand-500">
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = rating && i < Math.round(rating)
                return <svg key={i} viewBox="0 0 20 20" className="w-4 h-4" style={{ color: filled ? 'var(--color-brand-500)' : '#e5e7eb' }}><path d="M10 15.27l-5.18 3.04 1-5.82L.64 7.96l5.86-.85L10 1.67l2.5 5.44 5.86.85-4.18 4.53 1 5.82z" fill="currentColor" /></svg>
              })}
            </div>
            <span className="text-small text-gray-700">{rating ? rating.toFixed(1) : '—'}{ratingCount ? ` (${ratingCount})` : ''}</span>
          </div>

          <div className='relative'>
            {discountLabel ? (
              <span className="absolute top-0 left-[25%] -mt-1 align-middle text-[10px] leading-[1] text-white px-2 py-1" style={{ backgroundColor: '#E43861' }}>
                {discountLabel}
              </span>
            ) : null}

          </div>
          {/* price */}
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg">MRP:</span>
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
          <div className="flex items-center gap-4 flex-wrap">
            {/* Quantity controls styled as circular buttons */}
            <div className="flex items-center gap-4">
              <button
                className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center text-2xl leading-none"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="text-xl font-medium select-none min-w-[16px] text-center">{qty}</span>
              <button
                className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center text-2xl leading-none"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
              {/* Wishlist heart */}
              <button
                className="w-14 h-14 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: 'var(--color-brand-600)' }}
                aria-label="Add to wishlist"
              >
                {/* Heart icon */}
                <svg width="22" height="20" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21s-7.053-4.19-9.6-8.127C.533 10.27 1.02 6.97 3.6 5.207 6.18 3.445 9 4.55 12 7.5c3-2.95 5.82-4.055 8.4-2.293 2.58 1.763 3.067 5.063 1.2 7.666C19.053 16.81 12 21 12 21z" stroke="white" strokeWidth="1.8" fill="none"/>
                </svg>
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4">
              <AddToCartButton
                variantId={variantId}
                quantity={qty}
                productTitle={stripSize(sel?.title)}
                size="btn"
                className="px-8 min-w-[170px] rounded-full text-white"
                variant="default"
                style={{ backgroundColor: 'var(--color-brand-600)' }}
              />

              <AddToCartButton
                variantId={variantId}
                quantity={qty}
                productTitle={stripSize(sel?.title)}
                size="btn"
                className="px-8 min-w-[170px] rounded-full text-white"
                variant="default"
                style={{ backgroundColor: 'var(--color-brand-600)' }}
                onSuccess={() => {
                  // after adding, navigate to cart page if you have one; fallback to checkout url if present later
                }}
              >
                Buy Now
              </AddToCartButton>
            </div>
          </div>

          {/* feature badges */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4 text-center text-[11px] text-gray-700">
            <div className="flex flex-col items-center gap-1">
              <img src="/productPage/bannericons/protein.svg" alt="High Protein" />
              <span>High Protein</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <img src="/productPage/bannericons/fiber.svg" alt="High Fibre" />
              <span>High Fibre</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <img src="/productPage/bannericons/labteste.svg" alt="Lab Tested" />
              <span>Lab Tested</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <img src="/productPage/bannericons/natural.svg" alt="100% Natural" />
              <span>100% Natural</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <img src="/productPage/bannericons/nature.svg" alt="Farm Fresh" />
              <span>Farm Fresh</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <img src="/productPage/bannericons/pure.svg" alt="Pure" />
              <span>Pure</span>
            </div>
          </div>

          {/* accordions */}
          <details open className="group mt-4 border border-[#F2F2F2] bg-[#F2F2F2] rounded-4xl p-3">
            <summary className="cursor-pointer font-medium flex items-center justify-between">
              <span>Shipping Details</span>
              <svg className="w-5 h-5 opacity-70 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <div className="text-small text-gray-600 mt-2">
              Your order is packed with care and dispatched within 24 hours. Expect safe, hygienic delivery at your doorstep in 3–7 business days. Free shipping available on orders above ₹499.
            </div>
          </details>
          <details className="group border border-[#F2F2F2] bg-[#F2F2F2] rounded-4xl p-3">
            <summary className="cursor-pointer font-medium flex items-center justify-between">
              <span>Description</span>
              <svg className="w-5 h-5 opacity-70 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <div className="text-small text-gray-600 mt-2">
              {sel?.description || 'Delicious and nutritious — perfect for snacking and cooking.'}
            </div>
          </details>
          <details className="group border border-[#F2F2F2] bg-[#F2F2F2] rounded-4xl p-3">
            <summary className="cursor-pointer font-medium flex items-center justify-between">
              <span>Other Details</span>
              <svg className="w-5 h-5 opacity-70 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <div className="text-small text-gray-600 mt-2">Country of Origin: India · Storage: Keep in a cool, dry place · Shelf life varies by pack.</div>
          </details>

          {/* bottom benefits */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-[11px] text-gray-700">
            <div className="flex flex-col items-center gap-1 opacity-90">
              <img src="/productPage/bannericons/freedelivery.svg" alt="Free Delivery" />
              <span>Free Delivery above 1000</span>
            </div>
            <div className="flex flex-col items-center gap-1 opacity-90">
              <img src="/productPage/bannericons/happpyCustomers.svg" alt="Happy Customers" />
              <span>100+ Happy Customers</span>
            </div>
            <div className="flex flex-col items-center gap-1 opacity-90">
              <img src="/productPage/bannericons/securePayment.svg" alt="Secure Payment" />
              <span>Secure Payment</span>
            </div>

            <div className="flex flex-col items-center gap-1 opacity-90">
              <img src="/productPage/bannericons/SecureCheckout.svg" alt="Secure Checkout" />
              <span>Secure Checkout</span>
            </div>
          </div>

          {/* guaranteed safe checkout */}
          <div className="mt-4">

            <div className="flex items-center justify-between flex-wrap gap-3 opacity-90">
              <img src="/productPage/bannericons/gpay.svg" alt="GPay" />
              <img src="/productPage/bannericons/phonepay.svg" alt="PhonePe" />
              <img src="/productPage/bannericons/Paypal_2014_logo 1.svg" alt="PayPal" />
              <img src="/productPage/bannericons/Apple_Pay.svg" alt="Apple Pay" />
              <img src="/productPage/bannericons/Visa-Card.svg" alt="Visa" />
              <img src="/productPage/bannericons/amazonpay.svg" alt="Amazon Pay" />
            </div>
          </div>
        </div>
      </section>
      {/* Reviews widget */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Prev */}
          {images.length > 1 && (
            <button
              className="absolute left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 text-white text-2xl sm:text-3xl px-3 py-2 bg-black/40 hover:bg-black/60 rounded-full"
              onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i - 1 + images.length) % images.length) }}
            >
              ‹
            </button>
          )}
          <button
            className="absolute top-4 right-4 text-white text-xl px-3 py-1 bg-black/40 rounded-full"
            onClick={() => setIsLightboxOpen(false)}
          >
            ×
          </button>
          <img
            src={(images.length ? images : [sel?.featuredImage?.url])[lightboxIdx]}
            alt="zoomed"
            className="max-w-[95vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {/* Next */}
          {images.length > 1 && (
            <button
              className="absolute right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 text-white text-2xl sm:text-3xl px-3 py-2 bg-black/40 hover:bg-black/60 rounded-full"
              onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i + 1) % images.length) }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  )
}

export default ProductDetailPage
