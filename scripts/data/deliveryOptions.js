export const deliveryOptions = [
  {
    deliveryOptionId: "1",
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    deliveryOptionId: "2",
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    deliveryOptionId: "3",
    deliveryDays: 1,
    priceCents: 999,
  },
];

export function renderDeliveryOptions(today, cartItem) {
  let deliveryOptionsHTML = "";

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
          type="radio" class="js-radio" data-delivery-option-id="${
            option.deliveryOptionId
          }" data-product-id="${cartItem.productId}"
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

export function generateDeliveryDate(today, cartItem) {
  let matchingDeliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.deliveryOptionId === cartItem.deliveryOptionId) {
      matchingDeliveryOption = option;
    }
  });

  let deliveryDateObj;
  let deliveryDate;

  if (matchingDeliveryOption) {
    deliveryDateObj = today.add(matchingDeliveryOption.deliveryDays, "day");
    deliveryDate = deliveryDateObj.format("dddd, MMMM D");
  }

  return deliveryDate;
}
