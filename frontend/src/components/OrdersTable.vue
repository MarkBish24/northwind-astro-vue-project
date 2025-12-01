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
  <div>
    <div class="header">
      <h1 v-if="employeeInfo">
        Welcome, {{ employeeInfo.FirstName }} {{ employeeInfo.LastName }}!
      </h1>
      <button class="logout-btn" @click="handleLogout">Logout</button>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th colspan="6">Orders</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th colspan="2">Order ID</th>
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
          <td>></td>
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
                  <th colspan="5">Products</th>
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
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  padding-bottom: 60px;
}
.logout-btn {
  padding: 10px;
  background-color: #cacaca;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease;
}
.logout-btn:hover {
  background-color: #b0b0b0;
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
  border: 2px solid #ddd;
}
td {
  padding: 5px 10px;
  border-bottom: 1px solid #eee;
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
