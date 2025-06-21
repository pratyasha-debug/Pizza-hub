// Add to Cart
function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push({ name, price, image });
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${name} added to cart!`);
  updateCartCount();
}

// Update Cart Count Badge
function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartCountElement.textContent = cart.length;
  }
}

// Load Cart Items on Cart Page
function loadCartItems() {
  const cartItemsContainer = document.getElementById('cartItems');
  if (cartItemsContainer) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;
    cartItemsContainer.innerHTML = '';

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
      cartItemsContainer.appendChild(div);
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

// Load Order Summary
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

    // Clear only cart and customerDetails
    localStorage.removeItem('cart');
    localStorage.removeItem('customerDetails');
    updateCartCount();
  }
}

// User Signup
function signupUser() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!name || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  const newUser = { name, email, password };
  localStorage.setItem("pizzaUser", JSON.stringify(newUser));
  alert("Signup successful! Please login now.");
  window.location.href = "login.html";
}

// User Login
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

// Display Logged-in User
function checkLoginStatus() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const userArea = document.getElementById("userArea");

  if (userArea) {
    if (user) {
      userArea.innerHTML = `
        <span class="mr-3">Welcome, ${user.name}</span>
        <a href="#" onclick="logoutUser()" class="underline">Logout</a>
      `;
    } else {
      userArea.innerHTML = `
        <a href="login.html" class="underline mr-3">Login</a>
        <a href="signup.html" class="underline">Sign Up</a>
      `;
    }
  }
}

// Logout
function logoutUser() {
  localStorage.removeItem("loggedInUser");
  window.location.reload();
}

// Protect Cart / Checkout (Optional)
function protectPage() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    alert("Please login first.");
    window.location.href = "login.html";
  }
}

// Initial Setup on Page Load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  loadCartItems();
  handleOrderForm();
  loadOrderSummary();
  checkLoginStatus();

  
  // 🍕 Mobile Menu Toggle
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
});
