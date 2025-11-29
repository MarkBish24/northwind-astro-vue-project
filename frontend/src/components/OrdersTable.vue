<script setup>
function handleLogout() {
  window.location.href = "/";
}
</script>

<template>
  <h1>Welcome to your dashboard!</h1>
  <p>You’ve successfully logged in.</p>
  <button @click="handleLogout">Logout</button>
</template>

<style scoped></style>
