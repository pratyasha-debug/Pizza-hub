// Add to Cart
function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push({ name, price, image });
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${name} added to cart!`);
  updateCartCount();
}

// Update Cart Count Badge (both desktop & mobile)
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const countDesktop = document.getElementById('cart-count');
  const countMobile = document.getElementById('cart-count-mobile');

  if (countDesktop) countDesktop.textContent = cart.length;
  if (countMobile) countMobile.textContent = cart.length;
}

// Load Cart Items on Cart Page
function loadCartItems() {
  const container = document.getElementById('cartItems');
  if (container) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;
    container.innerHTML = '';

    cart.forEach((item, index) => {
      let div = document.createElement('div');
      div.className = 'flex items-center justify-between border p-3 bg-white rounded';
      div.innerHTML = `
        <div class="flex items-center">
          <img src="${item.image}" class="w-16 h-16 object-cover rounded mr-3">
          <span class="text-lg">${item.name} (₹${item.price})</span>
        </div>
        <button onclick="removeItem(${index})" class="text-red-600 text-xl">❌</button>
      `;
      container.appendChild(div);
      total += item.price;
    });

    document.getElementById('cartTotal').textContent = `Total: ₹${total}`;
  }
}

// Remove Item from Cart
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  loadCartItems();
}

// Handle Order Form Submission
function handleOrderForm() {
  const form = document.getElementById('orderForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const mobile = document.getElementById('mobile').value;
      const address = document.getElementById('address').value;
      const city = document.getElementById('city').value;

      if (!name || !mobile || !address || !city) {
        alert('Please fill all fields.');
        return;
      }

      localStorage.setItem('customerDetails', JSON.stringify({ name, mobile, address, city }));
      window.location.href = 'order-summary.html';
    });
  }
}

// Load Order Summary Page
function loadOrderSummary() {
  const summary = document.getElementById('orderSummary');
  if (summary) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let customer = JSON.parse(localStorage.getItem('customerDetails')) || {};
    let total = 0;
    summary.innerHTML = '';

    cart.forEach(item => {
      let p = document.createElement('p');
      p.textContent = `${item.name} - ₹${item.price}`;
      summary.appendChild(p);
      total += item.price;
    });

    document.getElementById('totalAmount').textContent = `Total: ₹${total}`;
    document.getElementById('customerDetails').innerHTML = `
      <p><strong>Name:</strong> ${customer.name}</p>
      <p><strong>Mobile:</strong> ${customer.mobile}</p>
      <p><strong>Address:</strong> ${customer.address}</p>
      <p><strong>City:</strong> ${customer.city}</p>
    `;

    // Clear cart & details after displaying
    localStorage.removeItem('cart');
    localStorage.removeItem('customerDetails');
    updateCartCount();
  }
}

// Signup
function signupUser() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!name || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  localStorage.setItem("pizzaUser", JSON.stringify({ name, email, password }));
  alert("Signup successful! Please login now.");
  window.location.href = "login.html";
}

// Login
function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const savedUser = JSON.parse(localStorage.getItem("pizzaUser"));

  if (savedUser && email === savedUser.email && password === savedUser.password) {
    localStorage.setItem("loggedInUser", JSON.stringify(savedUser));
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    alert("Invalid email or password.");
  }
}

// Show User Info / Login Links in Navbar (Desktop & Mobile)
function checkLoginStatus() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const headerArea = document.getElementById("userAreaHeader");
  const mobileArea = document.getElementById("userAreaMobile");

  let html = '';

  if (user) {
    html = `<span class="mr-3">Hi, ${user.name}</span> <a href="#" onclick="logoutUser()" class="underline">Logout</a>`;
  } else {
    html = `
      <a href="login.html" class="underline mr-3">Login</a>
      <a href="signup.html" class="underline">Sign Up</a>
    `;
  }

  if (headerArea) headerArea.innerHTML = html;
  if (mobileArea) mobileArea.innerHTML = html;
}

// Logout
function logoutUser() {
  localStorage.removeItem("loggedInUser");
  window.location.reload();
}

// Protect Restricted Pages
function protectPage() {
  if (!localStorage.getItem("loggedInUser")) {
    alert("Please login first.");
    window.location.href = "login.html";
  }
}

// Page Initialization
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  loadCartItems();
  handleOrderForm();
  loadOrderSummary();
  checkLoginStatus();

  // Protect restricted pages
  const restrictedPages = ['cart.html', 'order-summary.html'];
  const currentPage = window.location.pathname.split("/").pop();
  if (restrictedPages.includes(currentPage)) {
    protectPage();
  }

  // 🍕 Mobile Menu Toggle
  const toggle = document.getElementById("menuToggle");
  const mobile = document.getElementById("mobileMenu");
  const closeBtn = document.getElementById("menuClose");

  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      mobile.classList.remove("hidden");
    });
  }

  if (closeBtn && mobile) {
    closeBtn.addEventListener("click", () => {
      mobile.classList.add("hidden");
    });
  }
});

