import { cartManager } from "./cart.js";

const APIkey = "yum-NKsTcw3OPrMQPoSz";
const tenant = "epjp";
let wontonItems = [];

const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/";

async function getMenuItems(Url) {
  try {
    const response = await fetch(Url, {
      method: "GET",
      headers: {
        "x-zocom": APIkey,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    wontonItems = data;
    return data.items;
  } catch (error) {
    console.log("Error getting menu", error);
    return [];
  }
}

async function placeOrder(cartManager) {
  const orderData = {
    items: cartManager
      .getCartItems()
      .flatMap((item) => Array(item.quantity).fill(Number(item.id))),
  };
  // console.log("placing order", orderData)
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-zocom": APIkey,
      },
      body: JSON.stringify(orderData),
    };

    // console.log("Order data before sending:", JSON.stringify(orderData));
    const response = await fetch(`${apiUrl}${tenant}/orders`, options);

    if (!response.ok) {
      const errorResponse = await response.text();
      console.error("Error response", errorResponse);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log('Order placed sucsessfully', data);
    return data;
  } catch (error) {
    console.error("Error placing order", error.message);
    throw error;
  }
}

async function getReceipt(data) {
  if (!data || !data.order || !data.order.id) {
    throw new Error("Invalid data provided. Missing order ID.");
  }

  const orderId = data.order.id;
  // console.log('fetching receipt for orderId:', orderId)
  try {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-zocom": APIkey,
      },
    };

    const response = await fetch(`${apiUrl}/receipts/${orderId}`, options);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }
    const receiptData = await response.json();
    return receiptData;
  } catch (error) {
    console.error("Error geting receipt", error.message);
  }
}

export { getMenuItems, placeOrder, getReceipt };
