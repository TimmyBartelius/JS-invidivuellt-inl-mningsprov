const cart = [];

export const cartManager = {
  addItem(name, price, type, id) {
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, name, price, type, quantity: 1 });
    }
  },

  removeItem(name) {
    const itemIndex = cart.findIndex((item) => item.name === name);
    if (itemIndex !== -1) {
      const item = cart[itemIndex];
      item.quantity -= 1;
      if (item.quantity === 0) {
        cart.splice(itemIndex, 1);
      }
    }
  },

  getTotalPrice() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getCartItems() {
    return [...cart];
  },

  resetCart() {
    cart.length = 0;
  },
};

export function updateCart() {
  const cartItems = cartManager.getCartItems();
  const cartInnerContainer = document.querySelector("#cart-inner-container");
  cartInnerContainer.innerHTML = "";

  let totalPrice = 0;
  let totalItems = 0;

  cartItems.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    const cartItemInner = document.createElement("div");
    cartItemInner.classList.add("cart-item-inner");

    const cartItemName = document.createElement("p");
    cartItemName.innerText = item.name;

    const cartDivider = document.createElement("div");
    cartDivider.classList.add("dotted-cart-divider");

    const cartItemPrice = document.createElement("p");
    cartItemPrice.innerText = `${item.price * item.quantity} SEK`;

    cartItemInner.appendChild(cartItemName);
    cartItemInner.appendChild(cartDivider);
    cartItemInner.appendChild(cartItemPrice);

    const cartItemCounter = document.createElement("div");
    cartItemCounter.classList.add("cart-item-counter");

    const addButton = document.createElement("button");
    addButton.classList.add("add-button");
    addButton.innerText = " + ";

    const priceCounterElement = document.createElement("p");
    priceCounterElement.classList.add("amount");
    priceCounterElement.innerText = `${item.quantity} stycken`;

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-button");
    removeButton.innerText = " - ";

    addButton.addEventListener("click", () => {
      cartManager.addItem(item.name, item.price, item.type);
      updateCart();
    });

    removeButton.addEventListener("click", () => {
      cartManager.removeItem(item.name);
      updateCart();
    });

    cartItemCounter.appendChild(removeButton);
    cartItemCounter.appendChild(priceCounterElement);
    cartItemCounter.appendChild(addButton);

    cartItem.appendChild(cartItemInner);
    cartItem.appendChild(cartItemCounter);

    cartInnerContainer.appendChild(cartItem);

    totalPrice += item.price * item.quantity;
    totalItems += item.quantity;
  });
  const payButton = document.querySelector(".pay-button");

  const totalPriceElement = document.querySelector(".total-price");
  totalPriceElement.innerText = `${totalPrice} SEK`;

  const totalItemsElement = document.querySelector(".total-items");
  if (totalItems <= 0) {
    totalItemsElement.classList.add("display-none");

    payButton.innerText = "VARUKORGEN ÄR TOM!";
    payButton.disabled = true;
    payButton.classList.remove("active");
  } else {
    totalItemsElement.classList.remove("display-none");
    totalItemsElement.innerText = totalItems;

    payButton.innerText = "TAKE MY MONEY!";
    payButton.disabled = false;
    payButton.classList.add("active");
  }
}
