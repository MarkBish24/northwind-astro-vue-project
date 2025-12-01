<script setup>
import { ref, onMounted } from "vue";

const employeeId = ref(null);
const employeeInfo = ref(null);
const orders = ref(null);

const selectedOrderProducts = ref([]);
const selectedOrderId = ref(null);
const activeOrder = ref(null);

onMounted(async () => {
  employeeId.value = localStorage.getItem("employeeId");

  employeeInfo.value = await getUserInfo();
  orders.value = await getOrders();
  console.log(orders.value);
});

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
    selectedOrderProducts.value = [];
    return;
  }

  selectedOrderId.value = OrderId;
  activeOrder.value = OrderId;

  const res = await fetch(
    `http://localhost:4000/api/v1/get-products-by-order/${OrderId}`
  );
  const data = await res.json();
  selectedOrderProducts.value = data;
}

function handleLogout() {
  window.location.href = "/";
}
</script>

<template>
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
      <template v-for="order in orders" :key="order.OrderID">
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
          v-if="activeOrder === order.OrderID"
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

tr.order-row:nth-child(even) {
  background-color: #b4b4b4;
}
</style>
