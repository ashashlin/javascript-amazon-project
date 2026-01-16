import { loadProducts } from "./data/products.js";
import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
import { renderCartSummary } from "./checkout/cartSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";

async function loadPage() {
  await loadProducts();
  renderCheckoutHeader();
  renderCartSummary();
  renderPaymentSummary();
}

await loadPage();

// renderCheckoutHeader();
// renderCartSummary();
// renderPaymentSummary();
