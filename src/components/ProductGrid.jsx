import { useProducts } from "../hooks/useProducts";
import { useCart } from "../state/CartProvider";

function Money({ amount, currencyCode }) {
  if (!amount) return null;
  const n = Number(amount);
  return <>{n.toLocaleString(undefined, { style: "currency", currency: currencyCode })}</>;
}

export default function ProductGrid() {
  const { data: products, status, error } = useProducts(12);
  console.log(products);
  const { addToCart, isLoading } = useCart();

  if (status === "pending") return <p className="text-body">Loading…</p>;
  if (status === "error") return <p className="text-body text-red-600">{error.message}</p>;

  return (
    <div>
      <h1 className="text-heading text-brand-500">Products</h1>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => {
          const variantId = p?.variants?.edges?.[0]?.node?.id;
          const price = p?.priceRange?.minVariantPrice;
          return (
            <article key={p.id} className="rounded-xl border p-4">
              {p.featuredImage?.url && (
                <img
                  src={p.featuredImage.url}
                  alt={p.featuredImage.altText ?? p.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <h3 className="mt-3 text-body font-semibold">{p.title}</h3>
              <p className="text-small text-gray-600">
                <Money amount={price?.amount} currencyCode={price?.currencyCode} />
              </p>
              <button
                className="btn-primary mt-3"
                disabled={!variantId || isLoading}
                onClick={() => addToCart(variantId, 1)}
              >
                {isLoading ? "Adding…" : "Add to cart"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
