/* ===========================
   CART SYSTEM (LocalStorage)
   =========================== */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* Save Cart */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* Add to Cart */
function handleAddToCartClick(event) {
  const btn = event.currentTarget;
  let id, name, price;

  // ✅ Case 1: product card on index.html (home)
  const card = btn.closest(".product-card");
  if (card) {
    id = card.dataset.productId;
    const nameEl = card.querySelector(".product-name");
    const priceEl = card.querySelector(".price");

    name = nameEl ? nameEl.textContent.trim() : "Item";
    if (priceEl) {
      if (priceEl.dataset.price) {
        price = parseFloat(priceEl.dataset.price);
      } else {
        price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ""));
      }
    }
  } else {
    // ✅ Case 2: product.html detail page
    const titleEl = document.querySelector(".pd-title");
    const priceEl = document.querySelector(".pd-price");

    id = "detail-p1"; // simple id for detail product
    name = titleEl ? titleEl.textContent.trim() : "Item";
    if (priceEl) {
      price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ""));
    }
  }

  if (!price || isNaN(price)) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }

  saveCart();
  alert(`${name} added to cart.`);
}

/* Load Cart Table (cart.html) */
function loadCartTable() {
  const tbody = document.querySelector("#cartBody");
  const subtotalEl = document.querySelector("#subtotal");
  const taxEl = document.querySelector("#tax");
  const discountEl = document.querySelector("#discount");
  const totalEl = document.querySelector("#total");

  if (!tbody) return;

  tbody.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>${item.qty}</td>
      <td>$${(item.price * item.qty).toFixed(2)}</td>
    `;

    subtotal += item.price * item.qty;
    tbody.appendChild(row);
  });

  let discount = subtotal > 100 ? subtotal * 0.10 : 0;
  let tax = subtotal * 0.15;
  let total = subtotal - discount + tax;

  subtotalEl.textContent = "$" + subtotal.toFixed(2);
  discountEl.textContent = "$" + discount.toFixed(2);
  taxEl.textContent = "$" + tax.toFixed(2);
  totalEl.textContent = "$" + total.toFixed(2);

  localStorage.setItem("cartTotals", total);
}

/* Clear Cart */
function clearCart() {
  cart = [];
  saveCart();
}

/* ===========================
   LOGIN + REGISTER + CHECKOUT
   =========================== */

function validateLoginForm(event) {
  event.preventDefault();

  let user = document.getElementById("loginUsername").value.trim();
  let pass = document.getElementById("loginPassword").value.trim();
  let err = document.getElementById("loginError");

  if (!user || !pass) {
    err.textContent = "Please fill in all fields.";
    return;
  }

  localStorage.setItem("currentUser", user);
  window.location.href = "index.html";
}

function validateRegisterForm(event) {
  event.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const dob = document.getElementById("regDob").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const err = document.getElementById("regError");

  const errors = [];

  if (!name) errors.push("Full name is required.");
  if (!dob) errors.push("Date of birth is required.");

  //  PHONE VALIDATION FORMAT
  const phoneRegex = /^[0-9]{3}[-]?[0-9]{3}[-]?[0-9]{4}$/;
  if (!phoneRegex.test(phone)) {
    errors.push("Phone number must be valid (e.g. 876-555-1234).");
  }

  if (!email.includes("@")) errors.push("A valid email is required.");
  if (!username) errors.push("Username is required.");
  if (password.length < 6) errors.push("Password must be at least 6 characters long.");

  if (errors.length > 0) {
    err.textContent = errors.join(" ");
    return;
  }

  err.textContent = "";

  // Save the user to localStorage
  const user = {
    name,
    dob,
    phone,
    email,
    username
  };

  localStorage.setItem("registeredUser", JSON.stringify(user));

  alert("Registration successful!");
  window.location.href = "login.html";
}


function handleCheckoutSubmit(event) {
  event.preventDefault();

  let amount = parseFloat(document.getElementById("amountPaid").value);
  let err = document.getElementById("checkoutError");

  let total = parseFloat(localStorage.getItem("cartTotals"));

  if (!amount || amount < total) {
    err.textContent = "Amount must be at least the total.";
    return;
  }

  alert("Order confirmed! Thank you for shopping.");
  clearCart();
  window.location.href = "index.html";
}

/* AUTO INITIALIZATION */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart").forEach(btn =>
    btn.addEventListener("click", handleAddToCartClick)
  );

  loadCartTable();
});
