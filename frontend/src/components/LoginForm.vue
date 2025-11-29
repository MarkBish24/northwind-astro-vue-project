<script setup>
import { ref } from "vue";

const employeeId = ref("");
const password = ref("");

async function handleLogin() {
  const isValid = await CheckLogin(employeeId.value, password.value);
  if (isValid) {
    window.location.href = "/dashboard";
  } else {
    error.value = "Invalid username or password";
  }
}

async function CheckLogin(employeeId, password) {
  const res = await fetch(
    `http://localhost:4000/api/v1/check-employee-login/${employeeId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    }
  );
  const data = await res.json();
  return data.valid;
}
</script>

<template>
  <form @submit.prevent="handleLogin" class="login-form">
    <div>
      <label for="employeeId">Employee ID:</label>
      <input id="employeeId" v-model="employeeId" required />
    </div>
    <div>
      <label for="password">Password:</label>
      <input id="password" type="password" v-model="password" required />
    </div>
    <button type="submit">Login</button>
  </form>
</template>

<style scoped></style>
