import { products, loadProducts } from "./data/products.js";
import { addToCart, updateCartQuantity } from "./data/cart.js";

// Update cartQuantity in the header
document.querySelector(".js-cart-quantity").innerHTML = updateCartQuantity();

function renderProductsGrid() {
  let productsHTML = "";

  products.forEach((product) => {
    productsHTML += `
      <div class="product-container js-product-container js-product-container-${
        product.id
      }">
          <div class="product-image-container">
            <img
              class="product-image"
              src="${product.image}"
            />
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img
              class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png"
            />
            <div class="product-rating-count link-primary">${
              product.rating.count
            }</div>
          </div>

          <div class="product-price">$${(product.priceCents / 100).toFixed(
            2
          )}</div>

          <div class="product-quantity-container">
            <select class="js-product-quantity js-product-quantity-${
              product.id
            }" data-product-id="${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart">
            <img src="images/icons/checkmark.png" />
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${
            product.id
          }">Add to Cart</button>
        </div>
    `;
  });

  document.querySelector(".js-products-grid").innerHTML = productsHTML;
}

// Add product to cart when clicking add to cart button
const timeoutIds = {};

function addProductToCart() {
  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const { productId } = button.dataset;
      const productContainer = button.closest(".js-product-container");
      const quantityDropdown = productContainer.querySelector(
        ".js-product-quantity"
      );
      const quantity = Number(quantityDropdown.value);

      addToCart(productId, quantity);

      // Update cartQuantity in the header
      document.querySelector(".js-cart-quantity").innerHTML =
        updateCartQuantity();

      // Display 'Added' after clicking add to cart
      const addedMsg = productContainer.querySelector(".js-added-to-cart");

      addedMsg.classList.add("added");
      clearTimeout(timeoutIds[productId]);
      const timeoutId = setTimeout(() => {
        addedMsg.classList.remove("added");
      }, 2000);
      timeoutIds[productId] = timeoutId;
    });
  });
}

async function loadPage() {
  await loadProducts();
  renderProductsGrid();
  addProductToCart();
}

await loadPage();
