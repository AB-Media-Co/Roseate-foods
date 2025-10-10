const BASE_PRIVATE = "https://api.judge.me/api/v1";
const BASE_PUBLIC = "https://judge.me/api/v1";

const SHOP_DOMAIN = "roseatefoods.myshopify.com";
const PUBLIC_TOKEN = "K7ZY4WrP9vG9CCuFUROB_kmzq0g";

async function fetchJson(input, init) {
    const res = await fetch(input, {
        ...init,
        headers: { "Content-Type": "application/json", ...(init && init.headers) }
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} – ${text || "Request failed"}`);
    }
    return res.json();
}

// PRIVATE: external Shopify product_id -> internal Judge.me product_id
export async function getProductByExternalId(externalId) {
    const url = `${BASE_PRIVATE}/products/-1?shop_domain=${encodeURIComponent(SHOP_DOMAIN)}&api_token=${encodeURIComponent(PUBLIC_TOKEN)}&external_id=${encodeURIComponent(String(externalId))}`;
    return fetchJson(url);
}

// PRIVATE: list reviews by internal product_id (pagination)
export async function listReviews({ productId, page = 1, perPage = 20 }) {
    const url = `${BASE_PRIVATE}/reviews?shop_domain=${encodeURIComponent(SHOP_DOMAIN)}&api_token=${encodeURIComponent(PUBLIC_TOKEN)}&product_id=${productId}&page=${page}&per_page=${perPage}`;
    return fetchJson(url);
}

// PRIVATE: create a review
export async function createReview({ product_id, rating, title, body }) {
    const url = `${BASE_PRIVATE}/reviews`;
    const bodyJson = JSON.stringify({ shop_domain: SHOP_DOMAIN, api_token: PUBLIC_TOKEN, product_id, rating, title, body });
    return fetchJson(url, { method: "POST", body: bodyJson });
}

// PRIVATE: send manual review request
export async function sendManualReviewRequest({ reviewer_name, reviewer_email, shopify_product_id, product_handle, fulfilled_at }) {
    const url = `${BASE_PRIVATE}/orders/send_manual_review_request`;
    const bodyJson = JSON.stringify({ api_token: PUBLIC_TOKEN, reviewer_name, reviewer_email, shopify_product_id, product_handle, fulfilled_at });
    return fetchJson(url, { method: "POST", body: bodyJson });
}

// PUBLIC: product review widget (safe client-side)
export async function getProductReviewWidget(productId) {
    const url = `${BASE_PUBLIC}/widgets/product_review?shop_domain=${encodeURIComponent(SHOP_DOMAIN)}&api_token=${encodeURIComponent(PUBLIC_TOKEN)}&product_id=${productId}`;
    return fetchJson(url);
}

export const judgeMeInternals = { BASE_PRIVATE, BASE_PUBLIC, SHOP_DOMAIN, PUBLIC_TOKEN };
