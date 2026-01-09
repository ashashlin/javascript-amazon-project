import { cart, saveToStorage } from "./data/cart.js";
import { products } from "./data/products.js";
import {
  deliveryOptions,
  renderDeliveryOptions,
  generateDeliveryDate,
} from "./data/deliveryOptions.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

function renderCartSummary() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    let matchingProduct;

    products.forEach((product) => {
      if (product.id === cartItem.productId) {
        matchingProduct = product;
      }
    });

    if (matchingProduct) {
      const today = dayjs();
      const deliveryDate = generateDeliveryDate(today, cartItem);

      cartSummaryHTML += `
        <div class="cart-item-container">
            <div class="delivery-date">Delivery date: ${deliveryDate}</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${matchingProduct.image}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">$${(
                  matchingProduct.priceCents / 100
                ).toFixed(2)}</div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label">${
                    cartItem.quantity
                  }</span> </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${renderDeliveryOptions(today, cartItem)}
              </div>
            </div>
          </div>
      `;
    }
  });

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  // Make deliveryOptions interactive
  document.querySelectorAll(".js-radio").forEach((button) => {
    button.addEventListener("click", () => {
      const { deliveryOptionId, productId } = button.dataset;

      cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
          cartItem.deliveryOptionId = deliveryOptionId;
          saveToStorage();
          renderCartSummary();
        }
      });
    });
  });
}

renderCartSummary();
