const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('pizza') || 'Custom Pizza';
    const price = parseInt(urlParams.get('price')) || 100;
    const image = urlParams.get('image') || 'https://via.placeholder.com/300x200';

    let selected = { toppings: [], dips: [], crust: null, spice: null, size: null };
    let extraPrice = 0;
    let basePrice = price;

    document.getElementById("pizzaImageContainer").innerHTML = `<img src="${image}" class="w-full h-56 object-cover rounded-lg shadow-md">`;
    document.getElementById("pizzaName").innerText = name;
    document.getElementById("basePrice").innerText = `Base Price: ₹${price}`;
    document.getElementById("finalPrice").innerText = price;

    function toggleOption(btn, type, value, priceAddon) {
      btn.classList.toggle('selected');
      if (btn.classList.contains('selected')) {
        selected[type].push(value);
        extraPrice += priceAddon;
      } else {
        selected[type] = selected[type].filter(v => v !== value);
        extraPrice -= priceAddon;
      }
      updateFinalPrice();
    }

    function selectOption(btn, type, value) {
      document.querySelectorAll(`.optionBtn[data-type="${type}"]`).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      btn.setAttribute('data-type', type);
      selected[type] = value;
      if (type === 'crust') {
        document.querySelectorAll('.optionBtn[data-type="crust"]').forEach(b => extraPrice -= parseInt(b.getAttribute('data-price') || 0));
        extraPrice += parseInt(btn.getAttribute('data-price') || 0);
      }
      updateFinalPrice();
    }

    function selectSize(btn, sizeLabel, sizePrice) {
      document.querySelectorAll('.optionBtn[data-type="size"]').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      btn.setAttribute('data-type', 'size');
      selected.size = sizeLabel;
      basePrice = sizePrice;
      updateFinalPrice();
    }

    function adjustQuantity(change) {
      const qtyInput = document.getElementById("quantity");
      let currentQty = parseInt(qtyInput.value);
      currentQty += change;
      if (currentQty < 1) currentQty = 1;
      qtyInput.value = currentQty;
      updateFinalPrice();
    }

    function updateFinalPrice() {
      const quantity = parseInt(document.getElementById("quantity").value) || 1;
      document.getElementById("finalPrice").innerText = (basePrice + extraPrice) * quantity;
    }

    function addCustomizedPizza() {
      const quantity = parseInt(document.getElementById("quantity").value) || 1;
      const finalPrice = (basePrice + extraPrice) * quantity;
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const itemName = `${name} ${selected.size ? '(' + selected.size + ')' : ''}${selected.toppings.length ? ' + ' + selected.toppings.join(', ') : ''}${selected.crust ? ' | ' + selected.crust : ''}${selected.spice ? ' | ' + selected.spice : ''}${selected.dips.length ? ' | Dips: ' + selected.dips.join(', ') : ''}`;
      cart.push({ name: itemName, price: finalPrice, image, quantity });
      localStorage.setItem("cart", JSON.stringify(cart));
      window.location.href = "cart.html";
    }
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
      document.getElementById("cart-count").innerText = count;
      document.getElementById("cart-count-mobile").innerText = count;
    }
    
    document.addEventListener('DOMContentLoaded', updateCartCount);

    document.getElementById("menuToggle").addEventListener("click", () => {
      document.getElementById("mobileMenu").classList.toggle("hidden");
    });
    document.getElementById("menuClose").addEventListener("click", () => {
      document.getElementById("mobileMenu").classList.add("hidden");
    });
  