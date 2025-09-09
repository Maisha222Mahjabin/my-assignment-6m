
const API_BASE = "https://openapi.programming-hero.com/api";
const PLANTS_API = `${API_BASE}/plants`;
const CATEGORY_PLANTS_API = id => `${API_BASE}/category/${id}`;
const PLANT_DETAIL_API = id => `${API_BASE}/plant/${id}`;

// DOM Elements
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

function loadCategories() {
  categoryList.innerHTML = "";

  customCategories.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat.label;
    li.className =
      "px-3 py-1 rounded cursor-pointer hover:bg-green-100 transition";

    if (activeCategory === cat.id) {
      li.classList.add("bg-green-600", "text-white", "font-semibold");
    }

    li.addEventListener("click", () => {
      activeCategory = cat.id;
      loadCategories();
      if (cat.id === null) {
        loadPlants(); // load all
      } else {
        loadPlantsByCategory(cat.id);
      }
    });

    categoryList.appendChild(li);
  });
}

// Load All Plants
async function loadPlants() {
  spinner.classList.remove("hidden");
  try {
    const res = await fetch(PLANTS_API);
    const data = await res.json();
    renderPlants(data.plants);
  } catch (err) {
    console.error("Error loading plants:", err);
  } finally {
    spinner.classList.add("hidden");
  }
}

// Load Plants by Category
async function loadPlantsByCategory(catId) {
  spinner.classList.remove("hidden");
  try {
    const res = await fetch(CATEGORY_PLANTS_API(catId));
    const data = await res.json();
    if (data.data && data.data.length > 0) {
      renderPlants(data.data);
    } else {
      treeList.innerHTML = `<p class="col-span-3 text-center text-gray-500">No plants found in this category.</p>`;
    }
  } catch (err) {
    console.error("Error loading category plants:", err);
  } finally {
    spinner.classList.add("hidden");
  }
}

// Render Plants
function renderPlants(plants) {
  treeList.innerHTML = "";
  plants.forEach(plant => {
    const div = document.createElement("div");
    div.className =
      "bg-white p-4 rounded-lg shadow text-center flex flex-col items-center";
    div.innerHTML = `
  <img src="${plant.image}" alt="${plant.name}" 
       class="w-full h-40 object-cover rounded mb-3">

  <h3 class="tree-name font-bold text-xl text-black cursor-pointer mb-2" 
      data-id="${plant.id}">
      ${plant.name}
  </h3>

  <p class="text-sm text-gray-600 mb-2">
    ${plant.shortDescription || "A fast-growing tropical tree that produces delicious, juicy mangoes during summer. Its dense green."}
  </p>

  <p class="text-sm font-medium text-gray-500 mb-1">
    ${plant.category || "Tree"}
  </p>

  <p class="font-semibold ] text-lg mb-2">
    ৳${plant.price}
  </p>

  <button class="w-full px-4 py-2 bg-[#15803D] text-white rounded-2xl
                 hover:bg-[#15803D] transition">
    Add to Cart
  </button>

    `;
    treeList.appendChild(div);

    // Modal trigger
    div.querySelector(".tree-name").addEventListener("click", () =>
      showModal(plant.id)
    );
  });
}

// Add to Cart
function addToCart(id, name, price) {
  cart.push({ id, name, price });
  renderCart();
}

// Render Cart
function renderCart() {
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center bg-gray-100 px-2 py-1 rounded";
    li.innerHTML = `
      <span>${item.name} - $${item.price}</span>
      <span class="cursor-pointer text-red-600" onclick="removeFromCart(${index})">❌</span>
    `;
    cartList.appendChild(li);
  });
  cartTotal.textContent = total;
}

// Remove from Cart
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// Show Modal with Plant Details
async function showModal(id) {
  try {
    const res = await fetch(PLANT_DETAIL_API(id));
    const data = await res.json();
    const plant = data.data;

    modal.classList.remove("hidden");
    modalTitle.textContent = plant.name;
    modalImg.src = plant.image;
    modalDesc.textContent = plant.description;
    modalCategory.textContent = plant.category;
    modalPrice.textContent = plant.price;
  } catch (err) {
    console.error("Error loading plant detail:", err);
  }
}

// Close Modal
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Init
loadCategories();
loadPlants();
