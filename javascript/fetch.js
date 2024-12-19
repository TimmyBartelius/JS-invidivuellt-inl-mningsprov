import { cartManager } from "./cart.js";

const APIkey = "yum-NKsTcw3OPrMQPoSz"; //Min egen API nyckel
const tenant = "erjp";
let wontonItems = [];
//Hämta från nyckeln och en egen tenant, sätt items på 0/eller "tom"

const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/";
//Ser till att det går att gå vidare - dubbelkolla detta

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
//Hämtar menyns beställningsvaror eller ger tillbaka error beroende på responsen

async function placeOrder(cartManager) {
  const orderData = {
    items: cartManager
      .getCartItems()
      .flatMap((item) => Array(item.quantity).fill(Number(item.id))),
  };
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-zocom": APIkey,
      },
      body: JSON.stringify(orderData),
    };

    //Funktion för att lägga en order som hamnar i cart/cartmanager/nästa "sida"

    const response = await fetch(`${apiUrl}${tenant}/orders`, options);

    if (!response.ok) {
      const errorResponse = await response.text();
      console.error("Error response", errorResponse);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error placing order", error.message);
    throw error;
  }
}

//if NOT response.ok = vänta på response, skriv ut error response, byt ut respons-status

async function getReceipt(data) {
  if (!data || !data.order || !data.order.id) {
    throw new Error("Invalid data provided. Missing order ID.");
  }
  const orderId = data.order.id;
  try {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-zocom": APIkey,
      },
    };
    //get receipt = if NOTdata OR NOTdata.order OR NOTdata.order.id

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
//Läs på mer om fetch // REMINDER

export { getMenuItems, placeOrder, getReceipt };
