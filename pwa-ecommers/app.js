// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("Service Worker Registered ✅"))
    .catch((err) => console.log("Service Worker Error ❌", err));
}

// Push Notification Button
const notifyBtn = document.getElementById("notifyBtn");

notifyBtn.addEventListener("click", async () => {
  if (!("Notification" in window)) {
    alert("Notifications not supported in this browser!");
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    new Notification("ShopEasy Deals 🎉", {
      body: "New discounts available! Check ShopEasy now.",
      icon: "icon-192.png"
    });
  } else {
    alert("Notification permission denied!");
  }
});

// CART SYSTEM
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cartCount");
const cartBtn = document.getElementById("cartBtn");
const cartBox = document.getElementById("cartBox");
const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");

const clearCartBtn = document.getElementById("clearCart");
const closeCartBtn = document.getElementById("closeCart");

// Update cart UI
function updateCartUI() {
  cartCount.textContent = cart.length;
  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += Number(item.price);

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - ₹${item.price}
      <button onclick="removeItem(${index})">X</button>
    `;
    cartItems.appendChild(li);
  });

  totalPrice.textContent = total;
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Remove item function
function removeItem(index) {
  cart.splice(index, 1);
  updateCartUI();
}
window.removeItem = removeItem;

// Add to cart buttons
const addButtons = document.querySelectorAll(".addToCart");

addButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const productName = btn.getAttribute("data-name");
    const productPrice = btn.getAttribute("data-price");

    cart.push({ name: productName, price: productPrice });
    updateCartUI();

    alert(productName + " added to cart ✅");
  });
});

// Open cart
cartBtn.addEventListener("click", () => {
  cartBox.style.display = "block";
  updateCartUI();
});

// Close cart
closeCartBtn.addEventListener("click", () => {
  cartBox.style.display = "none";
});

// Clear cart
clearCartBtn.addEventListener("click", () => {
  cart = [];
  updateCartUI();
  alert("Cart cleared 🗑");
});

// Load cart count on refresh
updateCartUI();