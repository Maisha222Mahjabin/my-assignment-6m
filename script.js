
const categoryList = document.getElementById("category-list");
const treeList = document.getElementById("tree-list");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");
const spinner = document.getElementById("spinner");

// Modal Elements
const modal = document.getElementById("tree-modal");
const modalTitle = document.getElementById("modal-title");
const modalImg = document.getElementById("modal-img");
const modalDesc = document.getElementById("modal-desc");
const modalCategory = document.getElementById("modal-category");
const modalPrice = document.getElementById("modal-price");
const closeModal = document.getElementById("close-modal");

let cart = [];
let activeCategory = null;

// API Base
const API_BASE = "https://openapi.programming-hero.com/api";

// ✅ Fixed Categories
const customCategories = [
  { id: null, label: "All Trees" },
  { id: 1, label: "Fruit Trees" },
  { id: 2, label: "Flowering Trees" },
  { id: 3, label: "Shade Trees" },
  { id: 4, label: "Medicinal Trees" },
  { id: 5, label: "Timber Trees" },
  { id: 6, label: "Evergreen Trees" },
  { id: 7, label: "Ornamental Plants" },
  { id: 8, label: "Bamboo" },
  { id: 9, label: "Climbers" },
  { id: 10, label: "Aquatic Plants" }
];

// ✅ Load Categories (Fixed)
function loadCategories() {
  categoryList.innerHTML = "";
  customCategories.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat.label;
    li.className = "px-3 py-1 rounded cursor-pointer hover:bg-green-100 transition";

    if (activeCategory === cat.id) {
      li.classList.add("bg-green-600", "text-white", "font-semibold");
    }

    li.addEventListener("click", () => {
      activeCategory = cat.id;
      loadCategories(); // Refresh active state
      if (cat.id === null) {
        loadPlants();
      } else {
        loadPlantsByCategory(cat.id);
      }
    });

    categoryList.appendChild(li);
  });
}

// ✅ Load All Plants
async function loadPlants() {
  spinner.classList.remove("hidden");
  try {
    const res = await fetch(`${API_BASE}/plants`);
    const data = await res.json();
    renderPlants(data.plants || []);
  } catch (err) {
    treeList.innerHTML = `<p class="col-span-3 text-center text-red-500">Failed to load plants.</p>`;
    console.error("Error loading plants:", err);
  }
  spinner.classList.add("hidden");
}

// ✅ Load Plants by Category
async function loadPlantsByCategory(catId) {
  spinner.classList.remove("hidden");
  try {
    const res = await fetch(`${API_BASE}/category/${catId}`);
    const data = await res.json();
    if (data.plants && data.plants.length > 0) {
      renderPlants(data.plants);
    } else {
      treeList.innerHTML = `<p class="col-span-3 text-center text-gray-500">No plants found in this category.</p>`;
    }
  } catch (err) {
    treeList.innerHTML = `<p class="col-span-3 text-center text-red-500">Failed to load category plants.</p>`;
    console.error("Error loading category plants:", err);
  }
  spinner.classList.add("hidden");
}

// ✅ Render Plants
function renderPlants(plantsToRender) {
  treeList.innerHTML = "";
  plantsToRender.forEach(plant => {
    // Add default description if missing
    const description =
      plant.description ||
      "A fast-growing tropical tree that produces delicious, juicy mangoes during summer. Its dense green foliage provides excellent shade.";

    const div = document.createElement("div");
    div.className =
      "bg-white p-4 rounded-xl shadow-md flex flex-col items-center border border-purple-300";
    div.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}" class="w-full h-40 object-cover rounded-lg mb-3 bg-gray-100" />
      
      <h3 class="tree-name font-bold text-lg text-black cursor-pointer mb-1" data-id="${plant.id}">${plant.name}</h3>
      <p class="text-sm text-gray-600 mb-2 text-left w-full">${description}</p>
      
      <!-- Category badge + Price -->
      <div class="flex justify-between items-center w-full mb-3">
        <span class="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">${plant.category || "Tree"}</span>
        <span class="font-semibold text-lg text-black">৳${plant.price}</span>
      </div>

      <!-- Add to Cart Button -->
      <button class="add-to-cart w-full px-4 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition">Add to Cart</button>
    `;
    treeList.appendChild(div);

    div.querySelector(".tree-name").addEventListener("click", () =>
      showModal(plant.id)
    );
    div
      .querySelector(".add-to-cart")
      .addEventListener("click", () =>
        addToCart(plant.id, plant.name, plant.price, description, plant.category)
      );
  });
}

// ✅ Add to Cart
function addToCart(id, name, price, description, category) {
  cart.push({
    id,
    name,
    price,
    description:
      description ||
      "A fast-growing tropical tree that produces delicious, juicy mangoes during summer. Its dense green.",
    category: category || "Tree"
  });
  renderCart();
}

// ✅ Render Cart + Total (clean design like screenshot)
function renderCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const li = document.createElement("li");
    li.className =
      "bg-green-50 p-3 rounded-lg flex flex-col mb-2 shadow-sm border border-green-100";

    li.innerHTML = `
      <div class="flex justify-between items-center mb-1">
        <span class="font-semibold text-gray-800">${item.name}</span>
        <span class="cursor-pointer text-gray-400 hover:text-gray-600" onclick="removeFromCart(${index})">✕</span>
      </div>
      <div class="text-sm text-gray-600">৳${item.price} × 1</div>
    `;

    cartList.appendChild(li);
  });

  // Update total
  cartTotal.textContent = total;
}


// ✅ Remove from Cart
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// ✅ Show Modal
async function showModal(id) {
  try {
    const res = await fetch(`${API_BASE}/plant/${id}`);
    const data = await res.json();
    const plant = data.plant;
    if (plant) {
      modal.classList.remove("hidden");
      modalTitle.textContent = plant.name;
      modalImg.src = plant.image;
      modalDesc.textContent =
        plant.description ||
        "A fast-growing tropical tree that produces delicious, juicy mangoes during summer. Its dense green .";
      modalCategory.textContent = plant.category || "Tree";
      modalPrice.textContent = plant.price;
    }
  } catch (err) {
    console.error("Error loading plant details:", err);
  }
}

// Close Modal
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// ✅ Initialize App
loadCategories();
loadPlants();
