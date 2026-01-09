import {
  cart,
  updateDeliveryOption,
  findMatchingItem,
  saveToStorage,
  removeFromCart,
} from "./data/cart.js";
import { products } from "./data/products.js";
import {
  deliveryOptions,
  renderDeliveryOptions,
  generateDeliveryDate,
} from "./data/deliveryOptions.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

// Update the cart item quantity based on user input
function updateCartItemQuantity(cartItemContainer, quantityInput, quantity) {
  const { productId } =
    cartItemContainer.querySelector(".js-quantity-input").dataset;

  if (quantityInput.value === "" || quantity < 0 || isNaN(quantity)) {
    cartItemContainer.classList.remove("is-editing-quantity");
    return;
  }

  if (quantity === 0) {
    removeFromCart(productId);
  } else {
    const matchingItem = findMatchingItem(productId);

    if (matchingItem) {
      matchingItem.quantity = quantity;
      saveToStorage();
    }
  }

  renderCartSummary();
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
      const today = dayjs();
      const deliveryDate = generateDeliveryDate(today, cartItem);

      cartSummaryHTML += `
        <div class="cart-item-container js-cart-item-container js-cart-item-container-${
          cartItem.productId
        }">
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
                  <span class="update-quantity-link link-primary js-update-quantity">
                    Update
                  </span>
                  <input type="text" class="quantity-input js-quantity-input" data-product-id="${
                    cartItem.productId
                  }">
                  <span class="save-quantity-link link-primary js-save-quantity" data-product-id="${
                    cartItem.productId
                  }">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-quantity" data-product-id="${
                    cartItem.productId
                  }">
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

      updateDeliveryOption(productId, deliveryOptionId);
      renderCartSummary();
    });
  });

  // Update cart item quantity
  document.querySelectorAll(".js-update-quantity").forEach((link) => {
    link.addEventListener("click", () => {
      const cartItemContainer = link.closest(".js-cart-item-container");
      cartItemContainer.classList.add("is-editing-quantity");
      cartItemContainer.querySelector(".js-quantity-input").value = "";
    });
  });

  // Update cart item quantity when clicking save
  document.querySelectorAll(".js-save-quantity").forEach((link) => {
    link.addEventListener("click", () => {
      const cartItemContainer = link.closest(".js-cart-item-container");
      const quantityInput =
        cartItemContainer.querySelector(".js-quantity-input");
      const quantity = Number(quantityInput.value);

      updateCartItemQuantity(cartItemContainer, quantityInput, quantity);
    });
  });

  // Update cart item quantity when pressing enter in the quantity input field
  document.querySelectorAll(".js-quantity-input").forEach((quantityInput) => {
    quantityInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cartItemContainer = quantityInput.closest(
          ".js-cart-item-container"
        );
        const quantity = Number(quantityInput.value);

        updateCartItemQuantity(cartItemContainer, quantityInput, quantity);
      }
    });
  });

  // Remove item from cart when clicking delete
  document.querySelectorAll(".js-delete-quantity").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId } = link.dataset;
      removeFromCart(productId);
      renderCartSummary();
    });
  });
}

renderCartSummary();
