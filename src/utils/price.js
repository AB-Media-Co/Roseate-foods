// utils/price.js

// Safe number coercion
export const toNumber = (v) => {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};


export const getDiscountPercent = (price, compareAt, options = {}) => {
  const roundMode = options.round || 'round';
  const minPct = options.minPct ?? 1;
  const maxPct = options.maxPct ?? 95;
  const step = options.step ?? null;

  const p = toNumber(price);
  const c = toNumber(compareAt);

  if (p == null || c == null) return null;
  if (c <= 0 || p <= 0) return null;
  if (p >= c) return null;

  let pct = ((c - p) / c) * 100;

  // optional step rounding first (e.g. nearest 5%)
  if (step && step > 0) {
    pct = Math.round(pct / step) * step;
  }

  // final rounding mode
  if (roundMode === 'floor') pct = Math.floor(pct);
  else if (roundMode === 'ceil') pct = Math.ceil(pct);
  else pct = Math.round(pct);

  // clamp & threshold
  pct = Math.max(0, Math.min(pct, maxPct));
  if (pct < minPct) return null;

  return pct;
};

// Convenience label helper
export const getDiscountLabel = (price, compareAt, options = {}) => {
  const pct = getDiscountPercent(price, compareAt, options);
  return pct ? `-${pct}% Off` : null;
};


export const isNewProduct = (product, options = {}) => {
  const days = options.days ?? 10;
  const now = options.now ? new Date(options.now) : new Date();

  const createdAt = product?.createdAt ? new Date(product.createdAt) : null;
  const updatedAt = product?.updatedAt ? new Date(product.updatedAt) : null;

  const baseDate = createdAt || updatedAt;
  if (!baseDate || isNaN(baseDate.getTime())) return false;

  const diffDays = (now - baseDate) / (1000 * 60 * 60 * 24);

  return diffDays <= days;
}; 



// combo/bundle detector (plain JS)
export const isComboProduct = (p) => {
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
    /\bpack\s*of\s*\d+\b/i, // "Pack of 2"
    /\bset\s*of\s*\d+\b/i,  // "Set of 3"
    /\b\d+\s*x\s*\d+\b/i,   // "200g x 2"
    /\b\d+-?pack\b/i,       // "2-pack"
  ];
  const inPattern = multiPackRegexes.some((re) => re.test(title));

  return inText || inType || inVendor || inTags || inPattern;
};
