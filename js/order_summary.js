
function displayOrderSummary() {
  const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));

  const detailsEl = document.getElementById("customerDetails");
  const summaryEl = document.getElementById("orderSummary");
  const totalAmountEl = document.getElementById("totalAmount");

  if (!orderDetails) {
    if (summaryEl) {
      summaryEl.innerHTML = `<p class="text-center text-gray-600">No order found!</p>`;
    }
    return;
  }

  // Display customer details
  if (detailsEl) {
    detailsEl.innerHTML = `
      <p><strong>Name:</strong> ${orderDetails.name}</p>
      <p><strong>Mobile:</strong> ${orderDetails.mobile}</p>
      <p><strong>Address:</strong> ${orderDetails.address}</p>
      <p><strong>City:</strong> ${orderDetails.city}</p>
    `;
  }

  // Display order summary items
  if (summaryEl) {
    summaryEl.innerHTML = ""; // Clear previous content
    let total = 0;

    orderDetails.items.forEach(item => {
      total += item.price;

      const itemCard = document.createElement("div");
      itemCard.className = "flex items-center justify-between p-4 bg-white rounded shadow animate-fadeIn";
      itemCard.innerHTML = `
        <div class="flex items-center space-x-4">
          <img src="${item.image}" alt="${item.name}" class="w-14 h-14 rounded object-cover" />
          <div>
            <p class="font-semibold">${item.name}</p>
            <p class="text-gray-500">₹${item.price}</p>
          </div>
        </div>
      `;

      summaryEl.appendChild(itemCard);
    });

    // Update total amount
    if (totalAmountEl) {
      totalAmountEl.innerText = `Total: ₹${total}`;
    }
  }
}

// Run function on page load
document.addEventListener("DOMContentLoaded", displayOrderSummary);
 
document.getElementById("menuToggle")?.addEventListener('click', () => {
    document.getElementById("mobileMenu")?.classList.toggle("hidden");
  });
  
  document.getElementById("menuClose")?.addEventListener('click', () => {
    document.getElementById("mobileMenu")?.classList.add("hidden");
  });
  
  function toggleSidebar() {
    document.getElementById("sidebar")?.classList.toggle("hidden");
  }