<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref(JSON.parse(localStorage.getItem("users")));
const isAuthenticated = computed(() => !!user.value);

const logout = () => {
  localStorage.clear();
  router.push("/login");
};
</script>
<template>
  <nav class="bg-gray-500 p-4 text-white">
    <div class="max-w-6xl mx-auto flex justify-between items-center">
      <router-link to="/" class="text-xl font-bold">My Shop</router-link>
      <div class="space-x-4">
        <router-link to="/post" class="hover:underline">Posts</router-link>
        <router-link to="/" class="hover:underline">Products</router-link>
        <router-link to="/cart" class="hover:underline">Cart</router-link>
        <router-link to="/order" class="hover:underline">Order</router-link>
        <router-link to="/admin" class="hover:underline">Admin</router-link>
        <button @click="logout" class="hover:underline">Logout</button>
      </div>
    </div>
  </nav>
</template>
