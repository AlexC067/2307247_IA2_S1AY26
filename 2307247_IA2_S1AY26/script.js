/* ==========================================
   SCRIPT.JS — 876Kickz
   by Alex Crawford | 2307247
   ========================================== */

/* PRODUCT LIST */
const PRODUCTS = [
  {
    id: 1,
    title: "Custom Football Jersey",
    price: 40.50,
    img: "../Assets/product1.png",
    desc: "Premium football jersey featuring your name and the official 876Kickz logo."
  },
  {
    id: 2,
    title: "Track Suit + Shoes (unisex)",
    price: 74.99,
    img: "../Assets/product2.png",
    desc: "Complete athletic tracksuit with matching footwear — built for performance."
  },
  {
    id: 3,
    title: "Female Gym Wear Set",
    price: 45.99,
    img: "../Assets/product3.png",
    desc: "Leggings + sports bra + sneakers — fashionable & performance-ready."
  }
   {
    id: 4,
    title: "Female Gym Wear Set",
    price: 25.99,
    img: "../Assets/product4.png",
    desc: "Leggings + sports bra + sneakers — fashionable & performance-ready."
  }
];

const TAX_RATE = 0.12;

/* CART FUNCTIONS */
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

/* ADD TO CART */
function addToCart(id, qty = 1) {
  const cart = getCart();
  const item = cart.find(x => x.id === id);

  if (item) item.qty += qty;
  else cart.push({ id, qty });

  saveCart(cart);
}

/* UPDATE CART COUNT */
function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;

  const total = getCart().reduce((sum, p) => sum + p.qty, 0);
  el.textContent = total;
}

/* LOAD PRODUCT LIST PAGE */
function renderProducts() {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = "";

  PRODUCTS.forEach(p => {
    container.innerHTML += `
      <article class="product-card">
        <img src="${p.img}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <p class="price">$${p.price.toFixed(2)}</p>

        <button class="btn primary" onclick="addToCart(${p.id})">Add to Cart</button>
        <a class="btn" href="product.html?id=${p.id}">View Details</a>
      </article>
    `;
  });
}

/* PRODUCT DETAIL PAGE */
function renderProductDetail() {
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id"));
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const main = document.querySelector("main.container");

  main.innerHTML = `
    <div class="product-detail-card">
      <img src="${p.img}" class="product-detail-img" alt="${p.title}">
      <h2>${p.title}</h2>
      <p>${p.desc}</p>
      <p class="price">$${p.price.toFixed(2)}</p>

      <button class="btn primary" onclick="addToCart(${p.id})">Add to Cart</button>
      <a href="product-list.html" class="btn">Back</a>
    </div>
  `;
}

/* CART PAGE */
function renderCartPage() {
  const container = document.getElementById("cart-contents");
  const summary = document.getElementById("cart-summary");
  if (!container || !summary) return;

  const cart = getCart();
  container.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    const line = p.price * item.qty;
    subtotal += line;

    container.innerHTML += `
      <div class="cart-line">
        <span>${p.title} (${item.qty})</span>
        <span>$${line.toFixed(2)}</span>
      </div>
    `;
  });

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  summary.innerHTML = `
    <div class="cart-line"><b>Subtotal</b> <span>$${subtotal.toFixed(2)}</span></div>
    <div class="cart-line"><b>Tax</b> <span>$${tax.toFixed(2)}</span></div>
    <div class="cart-line"><b>Total</b> <span>$${total.toFixed(2)}</span></div>
  `;
}

/* CHECKOUT PAGE */
function renderCheckoutSummary() {
  const container = document.getElementById("checkout-cart-summary");
  if (!container) return;

  const cart = getCart();
  let subtotal = 0;
  let html = "";

  cart.forEach(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    const line = p.price * item.qty;
    subtotal += line;

    html += `<p>${p.title} × ${item.qty} — $${line.toFixed(2)}</p>`;
  });

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  html += `
    <p><b>Subtotal:</b> $${subtotal.toFixed(2)}</p>
    <p><b>Tax:</b> $${tax.toFixed(2)}</p>
    <p><b>Total:</b> $${total.toFixed(2)}</p>
  `;

  container.innerHTML = html;
  document.getElementById("amount").value = total.toFixed(2);
}

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderProducts();
  renderProductDetail();
  renderCartPage();
  renderCheckoutSummary();
});
