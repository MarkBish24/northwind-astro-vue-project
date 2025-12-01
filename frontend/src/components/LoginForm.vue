<script setup>
import { ref } from "vue";

const employeeId = ref("");
const password = ref("");
const isError = ref(false);

async function handleLogin() {
  const isValid = await CheckLogin(employeeId.value, password.value);
  if (isValid) {
    localStorage.setItem("employeeId", employeeId.value);
    window.location.href = "/dashboard";
  } else {
    isError.value = true;
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
  <div class="background"></div>
  <form
    @submit.prevent="handleLogin"
    class="login-form"
    :class="{ error: isError }"
  >
    <div v-if="isError" class="error-message">
      Invalid Employee ID or Password
    </div>
    <div class="login-input" :class="{ error: isError }">
      <label for="employeeId">Employee ID</label>
      <input id="employeeId" v-model="employeeId" required />
    </div>
    <div class="login-input" :class="{ error: isError }">
      <label for="password">Password</label>
      <input id="password" type="password" v-model="password" required />
    </div>
    <button type="submit" class="submit-btn">Login</button>
  </form>
</template>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url("/images/Login-Image-Background.png");
  background-size: cover;
  background-position: center;
  z-index: -1;
}
.login-form {
  max-width: 320px;
  margin: 80px auto;
  padding: 30px;
  background-color: rgba(250, 250, 250, 0.85);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.login-form.error {
  background: linear-gradient(
    to bottom,
    rgba(255, 234, 234, 0.85),
    rgba(247, 247, 247, 0.85)
  );
}

.error-message {
  color: #ff4d4f;
  text-align: center;
}

.login-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.login-input label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
}

.login-input input {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

/* Nice active/focus effect */
.login-input input:focus {
  border-color: #559bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(85, 155, 255, 0.3);
}

.login-input.error input {
  border-color: #ff4d4f;
  background-color: #fff1f0;
}
.login-input.error label {
  color: #ff4d4f;
}

.submit-btn {
  padding: 12px 0;
  background-color: #559bff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease;
}

.submit-btn:hover {
  background-color: #3c83e8;
}

.submit-btn:active {
  transform: scale(0.97);
}
</style>
