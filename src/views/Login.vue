<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl text-center font-bold mb-4">Đăng nhập</h1>
      <input
        v-model="username"
        type="text"
        placeholder="Tên đăng nhập"
        class="border border-gray-400 rounded p-2 w-full mb-4"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Mật khẩu"
        class="border border-gray-400 rounded p-2 w-full mb-4"
      />
      <div class="flex justify-center">
        <button
          @click="login"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Đăng nhập
        </button>
      </div>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const username = ref("");
const password = ref("");

const router = useRouter();
const login = async () => {
  try {
    const res = await axios.post("https://dummyjson.com/auth/login", {
      username: username.value,
      password: password.value,
    });
    localStorage.setItem("users", JSON.stringify(res.data));
    router.push("/");
  } catch (err) {
    console.error("Lỗi đăng nhập", err);
  }
};
</script>
