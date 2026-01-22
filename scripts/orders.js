import { orders } from "./data/orders.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { loadProducts, products } from "./data/products.js";

function renderOrderProducts(order) {
  const orderProducts = order.products;

  let orderProductsHTML = "";

  orderProducts.forEach((orderProduct) => {
    const { productId } = orderProduct;
    const deliveryDate = dayjs(orderProduct.estimatedDeliveryTime).format(
      "MMMM D"
    );

    let matchingProduct;

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    });

    if (matchingProduct) {
      orderProductsHTML += `
        <div class="product-image-container">
          <img src="${matchingProduct.image}" />
        </div>

        <div class="product-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-delivery-date">Arriving on: ${deliveryDate}</div>
          <div class="product-quantity">Quantity: ${orderProduct.quantity}</div>
          <button class="buy-again-button button-primary">
            <img class="buy-again-icon" src="images/icons/buy-again.png" />
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${matchingProduct.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    }
  });

  return orderProductsHTML;
}

function renderOrders() {
  console.log(orders);

  let ordersHTML = "";

  orders.forEach((order) => {
    const orderDate = dayjs(order.orderTime).format("MMMM D");
    const orderTotal = (order.totalCostCents / 100).toFixed(2);

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${orderTotal}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${renderOrderProducts(order)}
        </div>
      </div>
    `;
  });

  document.querySelector(".js-orders-grid").innerHTML = ordersHTML;
}

async function renderOrdersPage() {
  await loadProducts();
  renderOrders();
}

await renderOrdersPage();
