// Load cart total
const cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
document.getElementById("cartTotal").innerText = total;
let discount = 0;

// Apply Coupon
function applyCoupon() {
  const coupon = document.getElementById("couponInput").value.trim();
  if (coupon === "PIZZA50") {
    discount = 50;
    document.getElementById("discountMsg").classList.remove("hidden");
    document.getElementById("cartTotal").innerText = total - discount;
  } else {
    alert("❌ Invalid coupon. Try PIZZA50");
  }
}

// Payment method details display
function handlePaymentDetails() {
  const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  const paymentDetails = document.getElementById("paymentDetails");

  // Reset content
  paymentDetails.innerHTML = '';

  if (selectedMethod === 'UPI / Wallet') {
    paymentDetails.classList.remove("hidden");
    paymentDetails.innerHTML = `
      <input type="text" id="upiId" placeholder="Enter your UPI ID"
        class="border border-gray-300 p-3 w-full rounded focus:ring-2 focus:ring-yellow-400 outline-none" required>
    `;
  } else if (selectedMethod === 'Credit / Debit Card') {
    paymentDetails.classList.remove("hidden");
    paymentDetails.innerHTML = `
      <input type="text" id="cardNumber" placeholder="Card Number"
        class="border border-gray-300 p-3 w-full rounded focus:ring-2 focus:ring-yellow-400 outline-none" maxlength="16" required>
      <div class="flex gap-4 mt-3">
        <input type="text" id="cardExpiry" placeholder="MM/YY"
          class="border border-gray-300 p-3 w-1/2 rounded focus:ring-2 focus:ring-yellow-400 outline-none" required>
        <input type="password" id="cardCVV" placeholder="CVV"
          class="border border-gray-300 p-3 w-1/2 rounded focus:ring-2 focus:ring-yellow-400 outline-none" maxlength="3" required>
      </div>
    `;
  } else {
    paymentDetails.classList.add("hidden");
  }
}

// Attach payment method change listener
document.querySelectorAll('input[name="paymentMethod"]').forEach(input => {
  input.addEventListener('change', handlePaymentDetails);
});

// Update cart badge counts
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.length;
  const desktopBadge = document.getElementById("cart-count");
  const mobileBadge = document.getElementById("cart-count-mobile");

  if (count > 0) {
    desktopBadge.innerText = count;
    desktopBadge.classList.remove("hidden");
    mobileBadge.innerText = count;
    mobileBadge.classList.remove("hidden");
  } else {
    desktopBadge.classList.add("hidden");
    mobileBadge.classList.add("hidden");
  }
}

updateCartCount();

// Order form submission handler
document.getElementById("orderForm").onsubmit = (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("🛑 Your cart is empty! Please add some items.");
    return;
  }

  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

  // Validate payment details if needed
  if (paymentMethod === 'UPI / Wallet') {
    const upiId = document.getElementById("upiId")?.value.trim();
    if (!upiId) {
      alert("Please enter your UPI ID.");
      return;
    }
  }

  if (paymentMethod === 'Credit / Debit Card') {
    const cardNumber = document.getElementById("cardNumber")?.value.trim();
    const cardExpiry = document.getElementById("cardExpiry")?.value.trim();
    const cardCVV = document.getElementById("cardCVV")?.value.trim();

    if (!cardNumber || !cardExpiry || !cardCVV) {
      alert("Please fill in all card details.");
      return;
    }
  }

  // Collect order details
  const name = document.getElementById("name").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();

  if (!name || !mobile || !address || !city) {
    alert("Please fill in all delivery details.");
    return;
  }

  // Build order object
  const orderDetails = {
    name,
    mobile,
    address,
    city,
    items: cart,
    paymentMethod,
    discount: discount,
    totalAmount: total - discount
  };

  // Save to localStorage
  localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
  localStorage.removeItem("cart");

  // Final confirmation & redirect
  alert(`✅ Your order via ${paymentMethod} has been placed successfully! 🍕🎉\nEstimated Delivery: 30-40 mins`);
  window.location.href = "order_summary.html";
};

// Mobile menu toggle
document.getElementById("menuToggle").onclick = () => {
  document.getElementById("mobileMenu").classList.toggle("hidden");
};
document.getElementById("menuClose").onclick = () => {
  document.getElementById("mobileMenu").classList.add("hidden");
};
