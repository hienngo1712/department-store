<script setup>
import { ref, onMounted } from "vue";
import AdminChart from "../components/AdminChart.vue";
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();
const users = ref([]);
const products = ref([]);
const carts = ref([]);

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem("users"));
  if (!user) {
    router.push("/login");
  } else {
    users.value = (
      await axios.get("https://dummyjson.com/users?limit=1000")
    ).data.users;
    products.value = (
      await axios.get("https://dummyjson.com/products?limit=1000")
    ).data.products;
    carts.value = (
      await axios.get("https://dummyjson.com/carts?limit=1000")
    ).data.carts;
  }
});
</script>
<template>
  <div class="p-8 max-w-6xl mx-auto">
    <aside class="w-64 bg-white"></aside>
    <h1 class="text-3xl text-center font-bold uppercase mb-4">
      Admin Dashboard
    </h1>
    <AdminChart />
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div class="bg-blue-100 text-blue-800 p-4 rounded shadow">
        <h2 class="font-semibold">Users</h2>
        <p class="text-3xl">{{ users.length }}</p>
      </div>
      <div class="bg-yellow-100 text-yellow-900 p-4 rounded shadow">
        <h2 class="font-semibold">Orders</h2>
        <p class="text-3xl">{{ carts.length }}</p>
      </div>
      <div class="bg-green-100 text-green-800 p-4 rounded shadow">
        <h2 class="font-semibold">Products</h2>
        <p class="text-3xl">{{ products.length }}</p>
      </div>
    </div>
    <div class="mt-8">
      <h2 class="text-2xl font-semibold text-center mb-2">User List</h2>
      <table class="w-full border table-auto">
        <thead class="bg-gray-100">
          <tr>
            <th class="border p-2">ID</th>
            <th class="border p-2">Name</th>
            <th class="border p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border text-center bg-purple-100 hover:bg-purple-200 transition duration-200"
          >
            <td class="border p-2">{{ user.id }}</td>
            <td class="border p-2">{{ user.firstName }} {{ user.lastName }}</td>
            <td class="border p-2">{{ user.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
