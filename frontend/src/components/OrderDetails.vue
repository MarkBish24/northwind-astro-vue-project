<script setup>
import { defineProps } from "vue";

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});
</script>

<template>
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
      <tr v-for="product in products" :key="product.ProductID">
        <td>{{ product.ProductID }}</td>
        <td>{{ product.ProductName }}</td>
        <td>{{ product.Quantity }}</td>
        <td>${{ product.UnitPrice }}</td>
        <td>${{ product.LineTotal }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style></style>
