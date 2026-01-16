import { updateCartQuantity, cart } from "../data/cart.js";
import { deliveryOptions } from "../data/deliveryOptions.js";
import { addOrder, placeOrder } from "../data/orders.js";
import { products } from "../data/products.js";

export function renderPaymentSummary() {
  const cartQuantity = updateCartQuantity();

  let itemsCents = 0;
  let shippingCents = 0;

  cart.forEach((cartItem) => {
    const { productId, quantity, deliveryOptionId } = cartItem;

    let matchingProduct;

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    });

    if (matchingProduct) {
      itemsCents += matchingProduct.priceCents * quantity;
    }

    let matchingDeliveryOption;

    deliveryOptions.forEach((option) => {
      if (option.deliveryOptionId === deliveryOptionId) {
        matchingDeliveryOption = option;
      }
    });

    if (matchingDeliveryOption) {
      shippingCents += matchingDeliveryOption.priceCents;
    }
  });

  const totalCentsBeforeTax = itemsCents + shippingCents;
  const taxCents = totalCentsBeforeTax * 0.1;
  const totalCents = totalCentsBeforeTax + taxCents;

  const paymentHTML = `
    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items (${cartQuantity}):</div>
      <div class="payment-summary-money">
        $${(itemsCents / 100).toFixed(2)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">
        $${(shippingCents / 100).toFixed(2)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
        $${(totalCentsBeforeTax / 100).toFixed(2)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
        $${(taxCents / 100).toFixed(2)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">
        $${(totalCents / 100).toFixed(2)}
      </div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;

  document.querySelector(".js-payment-summary").innerHTML = paymentHTML;

  document
    .querySelector(".js-place-order")
    .addEventListener("click", async () => {
      const order = await placeOrder();
      addOrder(order);
      window.location.href = "orders.html";
    });
}
