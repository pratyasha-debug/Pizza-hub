// =================== Session Handling ===================

function checkUserSession() {
  const user = JSON.parse(localStorage.getItem('sessionUser'));
  const guest = localStorage.getItem('guestSession');
  toggleSignupModal(!user && !guest);
  updateUserDisplay();
  toggleLoginButton(!user);
}

function toggleSignupModal(show) {
  const signupModal = document.getElementById('signupModal');
  if (signupModal) signupModal.style.display = show ? 'flex' : 'none';
}

function toggleLoginButton(show) {
  const loginBtn = document.querySelector('#sidebar a[href="login.html"]');
  if (loginBtn) loginBtn.style.display = show ? 'block' : 'none';
}

function updateUserDisplay() {
  const user = JSON.parse(localStorage.getItem('sessionUser'));
  if (!user) return;
  const locEl = document.getElementById('userLocation');
  const sideEl = document.getElementById('sidebarUserName');
  const locationText = user.location ? ` 📍 ${user.location}` : '';
  if (locEl) locEl.innerText = `👤 ${user.name}${locationText}`;
  if (sideEl) sideEl.innerHTML = `<i class="fas fa-user-circle"></i> ${user.name}`;
}

// =================== Cart ===================

function addToCart(name, price, image) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push({ name, price, image });
  localStorage.setItem('cart', JSON.stringify(cart));
  showToast(`🛒 ${name} added to cart!`);
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.length;
  if (document.getElementById("cart-count")) {
    document.getElementById("cart-count").innerText = count;
  }
  if (document.getElementById("cart-count-mobile")) {
    document.getElementById("cart-count-mobile").innerText = count;
  }
}


// =================== Mobile Menu ===================

document.getElementById("menuToggle")?.addEventListener('click', () => {
  document.getElementById("mobileMenu")?.classList.toggle("hidden");
});

document.getElementById("menuClose")?.addEventListener('click', () => {
  document.getElementById("mobileMenu")?.classList.add("hidden");
});

function toggleSidebar() {
  document.getElementById("sidebar")?.classList.toggle("hidden");
}

// =================== Category Filter ===================

function selectCategory(categoryName) {
  document.querySelectorAll('[data-category]').forEach(card => {
    card.style.display = (categoryName === 'all' || card.dataset.category === categoryName) ? 'block' : 'none';
  });
}

function showAllCategoryPizzas() {
  document.querySelectorAll('[data-category]').forEach(card => card.style.display = 'block');
}

// =================== Service Filter ===================

function selectService(serviceType) {
  document.querySelectorAll('[data-service]').forEach(card => {
    card.style.display = (card.dataset.service === serviceType) ? 'block' : 'none';
  });
  showToast(`${serviceType} selected!`);
}

function showAllServicePizzas() {
  document.querySelectorAll('[data-service]').forEach(card => card.style.display = 'block');
}

// =================== UI Helpers ===================

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded shadow-lg z-50';
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

function showAlert(message) {
  const alertBox = document.getElementById('locationAlert');
  if (alertBox) {
    alertBox.innerText = message;
    alertBox.classList.add('show');
    setTimeout(() => alertBox.classList.remove('show'), 3000);
  } else {
    alert(message);
  }
}

// =================== Mapbox API ===================

const mapboxToken = 'pk.eyJ1IjoicHJhdHlhc2hhcHJpeWEiLCJhIjoiY201cjJtcWx5MDZmeDJsc2U5MmJ1cGJwYyJ9.KGW8blaBqPAOHSOjynk3Xw';

function getLocation() {
  if (!navigator.geolocation) return showAlert("⚠️ Geolocation not supported.");
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`)
      .then(res => res.json())
      .then(data => {
        if (data.features.length) {
          document.getElementById('userLocation').innerText = `📍 ${data.features[0].place_name}`;
          showToast("📍 Location Detected!");
        } else showToast("⚠️ Location not found.");
      })
      .catch(() => showToast("⚠️ Error contacting Mapbox."));
  }, err => showToast("⚠️ " + err.message));
}

function autoDetectLocation() {
  if (!navigator.geolocation) return showAlert("⚠️ Geolocation not supported.");
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`)
      .then(res => res.json())
      .then(data => {
        if (data.features.length) {
          document.getElementById('signupLocation').value = data.features[0].place_name;
          showToast("📍 Location Auto-filled!");
        } else showToast("⚠️ Location not found.");
      })
      .catch(() => showToast("⚠️ Error contacting Mapbox."));
  }, err => showToast("⚠️ " + err.message));
}

// =================== Auth ===================

function createAccount() {
  const name = document.getElementById('signupName').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  let location = document.getElementById('signupLocation').value.trim();

  if (!name || !password) {
    alert("Please enter both name and password!");
    return;
  }

  if (!location) location = 'Not Provided';

  let users = JSON.parse(localStorage.getItem('users')) || [];

  if (users.find(u => u.name === name)) {
    alert("Username already exists!");
    return;
  }

  users.push({ name, password, location });
  localStorage.setItem('users', JSON.stringify(users));

  showToast(`🍕 Account created, ${name}!`);
  setTimeout(() => window.location.href = 'login.html', 1200);
}

function loginUser() {
  const name = document.getElementById('loginName').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  let users = JSON.parse(localStorage.getItem('users')) || [];
  const matchedUser = users.find(u => u.name === name && u.password === password);

  if (matchedUser) {
    localStorage.setItem('sessionUser', JSON.stringify(matchedUser));
    showToast(`🍕 Welcome, ${name}!`);
    setTimeout(() => window.location.href = 'index.html', 1000);
  } else {
    alert("Invalid name or password.");
  }
}

function logoutUser() {
  localStorage.removeItem('sessionUser');
  localStorage.removeItem('cart');
  localStorage.removeItem('guestSession');
  localStorage.setItem('logoutSuccess', '1');
  window.location.href = 'index.html';
}

function skipSignup() {
  document.getElementById('signupModal').style.display = 'none';
  localStorage.setItem('guestSession', '1');
  showToast("👤 Continuing as Guest");
}

// =================== On Page Load ===================

document.addEventListener('DOMContentLoaded', () => {
  checkUserSession();
  updateCartCount();
  
  const category = new URLSearchParams(window.location.search).get('category');
  category ? selectCategory(category) : showAllCategoryPizzas();

  if (localStorage.getItem('logoutSuccess')) {
    showToast("👋 Logged out successfully!");
    localStorage.removeItem('logoutSuccess');
  }

});
