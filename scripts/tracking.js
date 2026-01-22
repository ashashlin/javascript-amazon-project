import { orders } from "./data/orders.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { products, loadProducts } from "./data/products.js";
import { updateCartQuantity } from "./data/cart.js";

document.querySelector(".js-cart-quantity").innerHTML = updateCartQuantity();

function renderProductTracking() {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  let matchingOrder;

  orders.forEach((order) => {
    if (order.id === orderId) {
      matchingOrder = order;
    }
  });

  if (matchingOrder) {
    const orderProducts = matchingOrder.products;

    let matchingOrderProduct;

    orderProducts.forEach((orderProduct) => {
      if (orderProduct.productId === productId) {
        matchingOrderProduct = orderProduct;
      }
    });

    if (matchingOrderProduct) {
      const deliveryDate = dayjs(
        matchingOrderProduct.estimatedDeliveryTime
      ).format("MMMM D");

      let matchingProduct;

      products.forEach((product) => {
        if (product.id === productId) {
          matchingProduct = product;
        }
      });

      if (matchingProduct) {
        const html = `
          <a class="back-to-orders-link link-primary" href="orders.html">
            View all orders
          </a>

          <div class="delivery-date">Arriving on ${deliveryDate}</div>

          <div class="product-info">
            ${matchingProduct.name}
          </div>

          <div class="product-info">Quantity: ${matchingOrderProduct.quantity}</div>

          <img
            class="product-image"
            src="${matchingProduct.image}"
          />

          <div class="progress-labels-container">
            <div class="progress-label">Preparing</div>
            <div class="progress-label current-status">Shipped</div>
            <div class="progress-label">Delivered</div>
          </div>

          <div class="progress-bar-container">
            <div class="progress-bar"></div>
          </div>
        `;

        document.querySelector(".js-order-tracking").innerHTML = html;
      }
    }
  }
}

async function renderTrackingPage() {
  await loadProducts();
  renderProductTracking();
}

await renderTrackingPage();
