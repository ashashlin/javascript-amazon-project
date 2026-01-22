import { cart } from "./cart.js";

export const orders = JSON.parse(localStorage.getItem("orders")) || [];

export async function placeOrder() {
  try {
    const res = await fetch("https://supersimplebackend.dev/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
      }),
    });

    const order = await res.json();

    return order;
  } catch (error) {
    console.log("Unexpected Error. Please try again later.");
  }
}

export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem("orders", JSON.stringify(orders));
}
