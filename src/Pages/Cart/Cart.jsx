import React, { useMemo } from "react";
import { useCart } from "../../state/CartProvider";
import Button from "../../components/ui/Button";
import Breadcrumb from "../../components/Breadcrumb";

const Cart = () => {
  const { cart, checkoutUrl, updateCartQty, removeFromCart, totalQuantity } = useCart();

  const lines = useMemo(() => cart?.lines?.edges?.map((e) => e.node) ?? [], [cart]);

  const computedSubtotal = useMemo(() => {
    return lines.reduce((sum, l) => {
      const p = Number(l?.merchandise?.price?.amount) || 0;
      const q = Number(l?.quantity || 0);
      return sum + p * q;
    }, 0);
  }, [lines]);

  const formatMoney = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return v ?? "0";
    return n.toFixed(2);
  };

  const onCheckout = () => {
    if (checkoutUrl) window.open(checkoutUrl, "_blank");
  };

  return (
    <>
      <Breadcrumb />
      <section className="content pb-6 sm:pb-8">
        <h1 className="text-subheading text-brand-600 mb-6">Your Cart</h1>

        {!lines.length ? (
          <div className="bg-white border rounded-2xl p-8 text-center">
            <p className="text-body text-gray-600 mb-4">Your cart is empty.</p>
            <a href="/" className="inline-flex items-center justify-center rounded-full text-white text-small h-10 px-6 bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-500)] transition-colors">Continue Shopping</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {lines.map((l) => {
                const img = l?.merchandise?.product?.featuredImage?.url;
                const title = l?.merchandise?.product?.title;
                const variantTitle = l?.merchandise?.title;
                const qty = l?.quantity ?? 1;
                const price = l?.merchandise?.price?.amount;
                const lineTotal = Number(price) * Number(qty || 0);
                return (
                  <div key={l.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex gap-3 sm:gap-4 shadow-sm">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl  overflow-hidden flex-shrink-0 bg-gray-50">
                      {img ? (
                        <img src={img} alt={title} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-body text-brand-600 font-medium truncate">{title}</div>
                      <div className="text-small text-gray-500">{variantTitle}</div>
                      <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4 text-body text-gray-700">
                        {/* qty controls */}
                        <div className="inline-flex items-center border border-gray-300 rounded-full overflow-hidden">
                          <button
                            className="px-3 sm:px-4"
                            onClick={() => updateCartQty(l.id, Math.max(1, (qty || 1) - 1))}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="px-3 sm:px-4 select-none">{qty}</span>
                          <button
                            className="px-3 sm:px-4"
                            onClick={() => updateCartQty(l.id, (qty || 1) + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* pricing */}
                        {price ? (
                          <div className="sm:ml-auto flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
                            <span className="text-gray-500 text-small">Price</span>
                            <span className="font-medium text-brand-600">₹{formatMoney(price)}</span>
                            <span className="text-gray-400">×</span>
                            <span className="text-gray-600">{qty}</span>
                            <span className="text-gray-400">=</span>
                            <span className="font-semibold text-brand-600">₹{formatMoney(lineTotal)}</span>
                          </div>
                        ) : null}
                      </div>
                      <div className="mt-3">
                        <button
                          className="text-small text-red-500 hover:underline"
                          onClick={() => removeFromCart(l.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <aside className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 h-fit shadow-sm lg:sticky lg:top-6">
              <h2 className="text-body font-semibold text-brand-600 mb-4">Order Summary</h2>

              {/* Promo code */}
              {/* <div className="mb-4">
                <label className="block text-small text-gray-600 mb-1">Promo Code</label>
                <div className="flex flex-col lg:flex-row gap-2">
                  <input
                    type="text"
                    className="flex-1 h-10 px-3 py-3 rounded-full border border-gray-300 bg-white text-body placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300"
                    placeholder="Enter code"
                  />
                  <Button variant="outlinebrand" size="btn" className="whitespace-nowrap border border-[var(--color-brand-500)] text-[var(--color-brand-600)] hover:bg-[var(--color-brand-50)]">Apply</Button>
                </div>
              </div> */}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-body">
                  <span className="text-gray-600">Items</span>
                  <span className="text-gray-700">{totalQuantity}</span>
                </div>
                <div className="flex items-center justify-between text-body">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-brand-600">₹{formatMoney(computedSubtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-body">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-body font-semibold text-brand-600">Total</span>
                  <span className="text-body font-semibold text-brand-600">₹{formatMoney(computedSubtotal)}</span>
                </div>
                <div className="text-small text-gray-500">Taxes included. Shipping calculated at checkout.</div>
              </div>

              <Button
                variant="default"
                size="btn"
                className="w-full mt-4 bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-500)]"
                onClick={onCheckout}
                disabled={!checkoutUrl}
              >
                Place Order
              </Button>


              <a href="/" className="mt-3 block text-center text-small text-brand-600 hover:underline">Continue Shopping</a>
            </aside>
          </div>
        )}
      </section>
    </>
  );
};

export default Cart;


