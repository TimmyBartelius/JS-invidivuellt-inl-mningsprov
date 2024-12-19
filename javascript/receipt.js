import { getReceipt } from "./fetch.js";

export async function handleReceipt(data) {
  if (!data || !data.order || !data.order.id) {
    console.error("Invalid order data. Cannot fetch receipt.");
    return;
  }

  try {
    const receiptArray = await getReceipt(data);

    if (receiptArray && receiptArray.receipt.items) {
      const receiptContainer = document.querySelector(".receipt-inner");
      receiptContainer.innerHTML = "";

      receiptArray.receipt.items.forEach((item) => {
        const receiptItem = document.createElement("div");
        receiptItem.classList.add("receipt-item");

        const receiptItemInner = document.createElement("div");
        receiptItemInner.classList.add("receipt-item-inner");

        const receiptItemName = document.createElement("p");
        receiptItemName.innerText = item.name;

        const receiptDivider = document.createElement("div");
        receiptDivider.classList.add("dotted-divider-receipt");

        const receiptItemPrice = document.createElement("p");
        receiptItemPrice.innerText = `${item.price} SEK`;

        receiptItemInner.appendChild(receiptItemName);
        receiptItemInner.appendChild(receiptDivider);
        receiptItemInner.appendChild(receiptItemPrice);

        const receiptAmount = document.createElement("p");
        receiptAmount.classList.add("receipt-amount");
        receiptAmount.innerText = `${item.quantity} stycken`;

        receiptItem.appendChild(receiptItemInner);
        receiptItem.appendChild(receiptAmount);

        const receiptContainer = document.querySelector(".receipt-inner");
        receiptContainer.appendChild(receiptItem);

        const receiptTotal = document.querySelector(".receipt-total");
        receiptTotal.innerText = `${receiptArray.receipt.orderValue} SEK`;
      });
    } else {
      console.error("No items found in the receipt.");
    }
  } catch (error) {
    console.error("Error handling receipt:", error.message);
  }
}
