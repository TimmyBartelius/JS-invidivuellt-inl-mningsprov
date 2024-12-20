export function animateToCart(buttonElement) {
  const cartButton = document.querySelector(".cart-button");

  const itemRect = buttonElement.getBoundingClientRect();
  const cartRect = cartButton.getBoundingClientRect();

  const ball = document.createElement("div");
  ball.classList.add("animated-ball");
  document.body.appendChild(ball);

  ball.style.top = `${itemRect.top + window.scrollY}px`;
  ball.style.left = `${itemRect.left + window.scrollX}px`;

  requestAnimationFrame(() => {
    const translateX =
      cartRect.left -
      itemRect.left +
      (cartButton.offsetWidth / 2 - parseInt(ball.style.width) / 2);
    const translateY =
      cartRect.top -
      itemRect.top +
      (cartButton.offsetHeight / 2 - parseInt(ball.style.height) / 2);

    ball.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.3)`;
    ball.style.transition =
      "transform 1s cubic-bezier(1, 0, 0.2, 5), opacity 0.5s";

    setTimeout(() => {
      ball.style.opacity = "0";
    }, 400);

    setTimeout(() => {
      document.body.removeChild(ball);
    }, 900);
  });
}
//Tog hjälp av Vilmers kod för animationen men gjorde min egen där det är en röd boll istället för att all text hänger med - grundade min kod på Vilmers kod som syns ovan. Lämnar kvar den som referensmall/facit

// const clone = buttonElement.cloneNode(true);
// clone.classList.add("animated-item");
// document.body.appendChild(clone);

// clone.style.position = "absolute";
// clone.style.zIndex = "1000";
// clone.style.top = `${itemRect.top + window.scrollY}px`;
// clone.style.left = `${itemRect.left + window.scrollX}px`;
// clone.style.width = `${itemRect.width}px`;
// clone.style.height = `${itemRect.height}px`;

// requestAnimationFrame(() => {
//   const translateX =
//     cartRect.left -
//     itemRect.left +
//     (cartButton.offsetWidth / 2 - itemRect.width / 2);
//   const translateY =
//     cartRect.top -
//     itemRect.top +
//     (cartButton.offsetHeight / 2 - itemRect.height / 2);

// clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.3)`;
// clone.style.transition =
//   "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s";

// setTimeout(() => {
//   clone.style.opacity = "0";
// }, 400);

//   setTimeout(() => {
//     document.body.removeChild(clone);
//   }, 900);
// });
