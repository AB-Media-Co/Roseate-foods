import { useEffect } from "react";
import { useStorefront } from "../context/StorefrontContext";

export default function ProductReviews() {
  const { products } = useStorefront()
  console.log(products)
  // const ProductId = products[0]?.
  const productId = products[0]?.id.replace("gid://shopify/Product/", "");
  console.log(productId)



  const SHOP_DOMAIN = "roseatefoods.myshopify.com";
  const PUBLIC_TOKEN = "K7ZY4WrP9vG9CCuFUROB_kmzq0g";

  const url = `https://api.judge.me/api/v1/products/-1?shop_domain=${SHOP_DOMAIN}&api_token=${PUBLIC_TOKEN}&external_id=${productId}`



  useEffect(() => {
    if (!productId) return; // wait until we have an ID

    const SHOP_DOMAIN = "roseatefoods.myshopify.com";
    const PUBLIC_TOKEN = "K7ZY4WrP9vG9CCuFUROB_kmzq0g";

    const url = `https://api.judge.me/api/v1/products/-1?shop_domain=${SHOP_DOMAIN}&api_token=${PUBLIC_TOKEN}&external_id=${productId}`

    async function fetchData() {
      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("Judge.me Product Data:", data);
      } catch (error) {
        console.error("Judge.me API error:", error);
      }
    }

    fetchData();
  }, [productId]);

  return (
    <section className="mt-8 rounded-2xl border p-6 shadow-sm">
    </section>
  );
}
