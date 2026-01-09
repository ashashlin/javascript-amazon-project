import { cart } from "./data/cart.js";
import { products } from "./data/products.js";
import { deliveryOptions } from "./data/deliveryOptions.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

function renderDeliveryOptions(cartItem) {
  let deliveryOptionsHTML = "";

  const today = dayjs();

  deliveryOptions.forEach((option) => {
    const deliveryDateObj = today.add(option.deliveryDays, "day");
    const deliveryDate = deliveryDateObj.format("dddd, MMMM D");
    const deliveryPrice =
      option.priceCents === 0
        ? "FREE"
        : `$${(option.priceCents / 100).toFixed(2)} -`;

    deliveryOptionsHTML += `
      <div class="delivery-option">
        <input
          type="radio"
          ${
            cartItem.deliveryOptionId === option.deliveryOptionId
              ? "checked"
              : ""
          }
          class="delivery-option-input"
          name="delivery-option-${cartItem.productId}"
        />
        <div>
          <div class="delivery-option-date">${deliveryDate}</div>
          <div class="delivery-option-price">${deliveryPrice} Shipping</div>
        </div>
      </div>
    `;
  });

  return deliveryOptionsHTML;
}

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
      cartSummaryHTML += `
        <div class="cart-item-container">
            <div class="delivery-date">Delivery date: Tuesday, June 21</div>

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
                ${renderDeliveryOptions(cartItem)}
              </div>
            </div>
          </div>
      `;
    }
  });

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;
}

renderCartSummary();
