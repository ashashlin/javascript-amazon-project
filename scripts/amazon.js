import { products, loadProducts } from "./data/products.js";
import { addToCart, updateCartQuantity } from "./data/cart.js";

// Update cartQuantity in the header
document.querySelector(".js-cart-quantity").innerHTML = updateCartQuantity();

// Clear search and newProducts in localStorage when the home page link is clicked
document.querySelector(".js-header-link").addEventListener("click", () => {
  localStorage.removeItem("search");
  localStorage.removeItem("newProducts");
  renderProductsGrid(products);
  addProductToCart();
});

function renderProductsGrid(products) {
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
            2,
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
        ".js-product-quantity",
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

// For products filtering when the search button is clicked
let newProducts = JSON.parse(localStorage.getItem("newProducts")) || [];

const url = new URL(window.location.href);
if (localStorage.getItem("search")) {
  url.searchParams.set("search", localStorage.getItem("search"));
  window.history.replaceState(null, "", url); // changes address bar without reloading the page
}

function searchProducts() {
  document.querySelector(".js-search-button").addEventListener("click", () => {
    const searchValue = document
      .querySelector(".js-search-bar")
      .value.toLowerCase();

    if (!searchValue) {
      return;
    }

    localStorage.setItem("search", searchValue);
    url.searchParams.set("search", searchValue);
    window.history.replaceState(null, "", url); // changes address bar without reloading the page

    newProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchValue),
    );
    localStorage.setItem("newProducts", JSON.stringify(newProducts));

    renderProductsGrid(newProducts);
    addProductToCart();
  });
}

searchProducts();

async function loadPage() {
  const products = await loadProducts();

  const searchParam = url.searchParams.get("search");

  if (!searchParam) {
    renderProductsGrid(products);
  } else {
    renderProductsGrid(newProducts);
  }

  addProductToCart();
}

await loadPage();
