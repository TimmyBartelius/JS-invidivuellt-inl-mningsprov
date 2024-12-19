import { getMenuItems, placeOrder } from "./fetch.js";
import { cartManager, updateCart } from "./cart.js";
import { handleReceipt } from "./receipt.js";
import { animateToCart } from "./ani.js";

const menuContainer = document.querySelector("#menu-container");
const wonton = "wonton";
const drink = "drink";
const dip = "dip";
let lastOrderData = null;

//getting the menu items and calling the correct function
async function fetchMenuItems(type) {
  const Url = `https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu?type=${type}`;
  const items = await getMenuItems(Url);

  if (type == wonton && items.length > 0) {
    createMenu(items);
  } else if ((type == drink || type === dip) && items.length > 0) {
    createSubMenu(items);
  } else {
    console.log("error getting menu items");
  }
}

//Creating the menu items and showing them
function createMenu(items) {
  // console.log(items);

  items.forEach((item) => {
    const menuItem = document.createElement("button");
    menuItem.classList.add("menu-item");
    menuItem.setAttribute("data-price", item.price);
    menuItem.setAttribute("data-id", item.id);

    const menuItemInner = document.createElement("div");
    menuItemInner.classList.add("menu-item-inner");

    const nameElement = document.createElement("span");
    nameElement.classList.add("item-name");
    nameElement.innerText = item.name;

    const dottedDivider = document.createElement("div");
    dottedDivider.classList.add("dotted-divider");

    const priceElement = document.createElement("span");
    priceElement.innerText = `${item.price} SEK`;
    priceElement.classList.add("item-price");

    menuItemInner.appendChild(nameElement);
    menuItemInner.appendChild(dottedDivider);
    menuItemInner.appendChild(priceElement);

    const ingredientsElement = document.createElement("span");
    ingredientsElement.classList.add("ingredients");
    ingredientsElement.innerText = item.ingredients.join(", ");

    menuItem.appendChild(menuItemInner);
    menuItem.appendChild(ingredientsElement);

    menuContainer.appendChild(menuItem);
  });
}

//Creating the submenus and showing them
function createSubMenu(items) {
  items.forEach((item) => {
    const subMenuItem = document.createElement("button");
    subMenuItem.classList.add("submenu-item");
    subMenuItem.innerText = item.name;
    subMenuItem.setAttribute("data-price", item.price);
    subMenuItem.setAttribute("data-id", item.id);

    const subMenuSelections = document.querySelector(
      `.submenu-selections[data-type="${item.type}"]`
    );
    subMenuSelections.appendChild(subMenuItem);
  });

  //making sure prices are updated correctly
  const dipItem = items.find((item) => item.type === "dip");
  const drinkItem = items.find((item) => item.type === "drink");

  if (dipItem) {
    const subMenuDipPrice = document.querySelector(".dip-price");
    subMenuDipPrice.innerText = `${dipItem.price} SEK`;
  }

  if (drinkItem) {
    const subMenuDrinkPrice = document.querySelector(".drink-price");
    subMenuDrinkPrice.innerText = `${drinkItem.price} SEK`;
  }
}

//makes an order and calls to update eta
async function handleOrder() {
  try {
    const data = await placeOrder(cartManager);
    lastOrderData = data;
    updateEta(data);
    showEta();
  } catch (error) {
    console.error("failed to place the order:", error);
  }
}

//updates eta screen
function updateEta(data) {
  const etaElement = document.querySelector(".time-estimate");
  const orderIdElement = document.querySelector(".order-id");

  const orderEta = new Date(data.order.eta);
  const currentTime = new Date();

  const timeDifference = Math.max(0, orderEta - currentTime); //
  const minutesLeft = Math.ceil(timeDifference / (1000 * 60));

  const orderId = data.order.id;

  orderIdElement.innerText = `#${orderId}`;
  etaElement.innerText = `ETA: ${minutesLeft} MIN`;
  handleReceipt(lastOrderData);
}

//reset the page to make a new order
function resetOrder() {
  cartManager.resetCart();
  updateCart();
  hideEta();
  showMenu();
  hideReciept();
  document.body.classList.forEach((className) => {
    document.body.classList.remove(className);
  });
}

//Buttons
function handleButtons() {
  const submenuButtons = document.querySelectorAll(".submenu-item");
  const menuButtons = document.querySelectorAll(".menu-item");

  submenuButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const targetButton = event.currentTarget;
      const itemName = targetButton.textContent;
      const itemType = targetButton.dataset.type;
      const price = parseInt(targetButton.dataset.price, 10);
      const itemId = targetButton.dataset.id;

      cartManager.addItem(itemName, price, itemType, itemId);

      animateToCart(button);
      updateCart();
    });
  });

  menuButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const targetButton = event.currentTarget;
      const itemName = targetButton.querySelector(".item-name").textContent;
      const price = parseInt(
        targetButton.querySelector(".item-price").textContent.split("")[0],
        10
      );
      const itemId = targetButton.dataset.id;

      cartManager.addItem(itemName, price, "wonton", itemId);
      animateToCart(button);
      updateCart();
    });
  });
}

const payButton = document.querySelector(".pay-button");
const newOrderButton = document.querySelector(".new-order");
const receiptButton = document.querySelector(".receipt");
const receiptResetBUtton = document.querySelector(".receipt-new-order");

payButton.addEventListener("click", () => {
  handleOrder();
});

newOrderButton.addEventListener("click", () => {
  resetOrder();
});

receiptButton.addEventListener("click", () => {
  showReciept();
  hideEta();
});

receiptResetBUtton.addEventListener("click", () => {
  resetOrder();
});

//Switching between different views
const menuSection = document.querySelector("#menu");
const cartSection = document.querySelector("#cart");
const etaSection = document.querySelector("#eta");
const receiptSection = document.querySelector("#receipt-section");

const cartButton = document.querySelector(".cart-button");
const cartReturnButton = document.querySelector(".cart-return-button");

function showEta() {
  cartSection.classList.remove("display-flex");
  etaSection.classList.add("display-flex");

  document.body.classList.remove("white");
  document.body.classList.add("light-gray");
}

function hideEta() {
  etaSection.classList.remove("display-flex");
}

function showMenu() {
  menuSection.classList.add("display-flex");
}

function showReciept() {
  receiptSection.classList.add("display-flex");
}

function hideReciept() {
  receiptSection.classList.remove("display-flex");
}

cartReturnButton.addEventListener("click", () => {
  cartSection.classList.remove("display-flex");
  menuSection.classList.add("display-flex");

  document.body.classList.remove("white");
});
cartButton.addEventListener("click", () => {
  cartSection.classList.add("display-flex");
  menuSection.classList.remove("display-flex");
  document.body.classList.add("white");
});

// load on startup
async function loadMenu() {
  await fetchMenuItems(wonton);
  await fetchMenuItems(drink);
  await fetchMenuItems(dip);

  handleButtons();
}
loadMenu();
updateCart();
