<script setup>
import { ref, onMounted, computed } from "vue";

// Basic Info that is involved with base set up
const employeeId = ref(null);
const employeeInfo = ref(null);
const orders = ref([]);

// for selecting the Active Order Row
const selectedOrderProducts = ref([]);
const selectedOrderId = ref(null);
const activeOrder = ref(null);

// Caching Products so I don't have to do repeated api calls
const productsCache = ref({});

// Creating Pagination so that way the table doesn't have to re-update 10,000 lines every click
const currentPage = ref(1);
const pageSize = 25;

// Immediately gets employee info and orders at start
onMounted(async () => {
  employeeId.value = localStorage.getItem("employeeId");

  employeeInfo.value = await getUserInfo();
  orders.value = await getOrders();
  console.log(orders.value);
});

//Start of Pagination
const totalPages = computed(() => Math.ceil(orders.value.length / pageSize));

//gets the position of the start of the orders (1-25, 26-50 ...)
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return orders.value.slice(start, end);
});

// Function changes the current page
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

//Gets Basic Info
async function getUserInfo() {
  const res = await fetch(
    `http://localhost:4000/api/v1/get-employee-info/${employeeId.value}`,
    {
      method: "GET",
    }
  );
  const data = await res.json();
  return data;
}

async function getOrders() {
  const res = await fetch(
    `http://localhost:4000/api/v1/get-orders/${employeeId.value}`
  );
  const data = await res.json();
  return data;
}

async function getProducts(OrderId) {
  // Collapse if the Same order is Clicked
  if (activeOrder.value === OrderId) {
    activeOrder.value = null;
    selectedOrderId.value = null;
    return;
  }

  // Setting Active Table
  selectedOrderId.value = OrderId;
  activeOrder.value = OrderId;

  // Use cached data if available
  if (productsCache.value[OrderId]) {
    selectedOrderProducts.value = productsCache.value[OrderId];
  } else {
    const res = await fetch(
      `http://localhost:4000/api/v1/get-products-by-order/${OrderId}`
    );
    const data = await res.json();

    // Save to cache
    productsCache.value[OrderId] = data;
    selectedOrderProducts.value = data;
  }
}

// sets back to index.astro
function handleLogout() {
  window.location.href = "/";
}
</script>

<template>
  <!-- Dashboard -->
  <div class="app-header">
    <div class="app-header-left">
      <h1 class="app-title">Rockliffe Systems</h1>
      <span class="app-subtitle" v-if="employeeInfo"> Orders Dashboard </span>
    </div>

    <div class="app-header-right" v-if="employeeInfo">
      <span class="app-user">
        Signed in as
        <strong
          >{{ employeeInfo.FirstName }} {{ employeeInfo.LastName }}</strong
        >
      </span>
      <button class="logout-btn" @click="handleLogout">Logout</button>
    </div>
  </div>

  <!-- Pagination -->

  <div class="pagination" v-if="totalPages > 1">
    <button @click="prevPage" :class="{ disabled: currentPage === 1 }">
      ◀
    </button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="nextPage" :class="{ disabled: currentPage === totalPages }">
      ▶
    </button>
  </div>

  <!-- Orders Table -->

  <table>
    <thead>
      <tr>
        <th class="table-title" colspan="6">Orders</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th></th>
        <th>Order ID</th>
        <th>Customer ID</th>
        <th>Order Date</th>
        <th>Total Quantity</th>
        <th>Total Amount</th>
      </tr>
      <template v-for="order in paginatedOrders" :key="order.OrderID">
        <!-- Order row -->
        <tr
          :class="{ active: activeOrder === order.OrderID }"
          @click="getProducts(order.OrderID)"
        >
          <td>{{ activeOrder === order.OrderID ? "▾" : "▸" }}</td>
          <td>{{ order.OrderID }}</td>
          <td>{{ order.CustomerID }}</td>
          <td>{{ order.OrderDate }}</td>
          <td>{{ order.TotalQuantity }}</td>
          <td>${{ order.TotalAmount }}</td>
        </tr>

        <!-- Expandable products row -->
        <tr
          class="unhighlightable"
          colspan="6"
          v-show="activeOrder === order.OrderID"
        >
          <td colspan="6">
            <table style="width: 100%">
              <thead>
                <tr>
                  <th class="table-title" colspan="5">Products</th>
                </tr>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Line Total</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="product in selectedOrderProducts"
                  :key="product.ProductID"
                >
                  <td>{{ product.ProductID }}</td>
                  <td>{{ product.ProductName }}</td>
                  <td>{{ product.Quantity }}</td>
                  <td>${{ product.UnitPrice }}</td>
                  <td>${{ product.LineTotal }}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 3rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
}

.app-header-left {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.app-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
}

.app-subtitle {
  font-size: 0.9rem;
  color: #64748b;
}

.app-header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #475569;
}

.app-user strong {
  font-weight: 600;
}

.logout-btn {
  padding: 0.45rem 1.1rem;
  background-color: #559bff;
  border: none;
  border-radius: 999px;
  font-size: 0.85rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease;
}

.logout-btn:hover {
  background-color: #2563eb;
}
.logout-btn:active {
  transform: scale(0.97);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem;
}

.pagination button {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  background: #f5f5f5;
  cursor: pointer;
  transition: background 0.2s;
}

.pagination button:hover:not(:disabled) {
  background: #e0e7ff;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  width: 80%;
  margin: 0 auto;
}

th {
  background: #f5f5f5;
  padding: 10px;
  font-weight: bold;
  border-bottom: 2px solid #e2e8f0;
  text-align: left;
}

th.table-title {
  text-align: center;
}
td {
  padding: 5px 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

tr {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

tr:hover {
  background-color: #dbf4ff;
}

tr.unhighlightable:hover {
  background-color: inherit;
  cursor: default;
}
</style>
