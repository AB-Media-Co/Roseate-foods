import { useCart } from "../state/CartProvider";

function Money({ amount, currencyCode }) {
  if (!amount) return null;
  const n = Number(amount);
  return <>{n.toLocaleString(undefined, { style: "currency", currency: currencyCode })}</>;
}

export default function Cart() {
  const {
    cart,
    totalQuantity,
    checkoutUrl,
    removeFromCart,
    updateCartQty,
    isLoading,
    error,
  } = useCart();

  if (error) return <p className="text-red-600">{error.message}</p>;
  if (!cart) return <p className="text-body">Cart is empty</p>;

  const lines = cart?.lines?.edges ?? [];

  return (
    <div className="mt-10 rounded-xl border p-4">
      <h2 className="text-subheading font-semibold">Cart ({totalQuantity})</h2>

      <ul className="mt-4 space-y-3">
        {lines.map(({ node }) => {
          const img = node.merchandise?.product?.featuredImage?.url;
          const price = node.merchandise?.price;
          return (
            <li key={node.id} className="flex items-center gap-3">
              {img && <img src={img} alt="" className="w-16 h-16 rounded object-cover" />}
              <div className="flex-1">
                <div className="font-medium">{node.merchandise?.product?.title}</div>
                <div className="text-small text-gray-600">
                  <Money amount={price?.amount} currencyCode={price?.currencyCode} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="btn-outline"
                  onClick={() => updateCartQty(node.id, Math.max(1, node.quantity - 1))}
                  disabled={isLoading}
                >
                  −
                </button>
                <span className="w-8 text-center">{node.quantity}</span>
                <button
                  className="btn-outline"
                  onClick={() => updateCartQty(node.id, node.quantity + 1)}
                  disabled={isLoading}
                >
                  +
                </button>
              </div>

              <button
                className="btn-outline"
                onClick={() => removeFromCart(node.id)}
                disabled={isLoading}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-body">
          Total:{" "}
          <Money
            amount={cart.cost?.totalAmount?.amount}
            currencyCode={cart.cost?.totalAmount?.currencyCode}
          />
        </div>
        {checkoutUrl && (
          <a className="btn-primary" href={checkoutUrl} target="_blank" rel="noreferrer">
            Checkout
          </a>
        )}
      </div>
    </div>
  );
}
