<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const products = ref([]);
const search = ref("");
const page = ref(1);
const limit = ref(12);
const total = ref(0);
const totalPage = ref(0);

const fetchProducts = async () => {
  try {
    // const skip = (page.value - 1) * limit;
    // const query = search.value.trim();
    // const payload = {
    //   limit,
    //   skip,
    // };
    // if (query) {
    //   payload.q = query;
    // }
    // const params = new URLSearchParams(payload).toString();
    // const url = `https://dummyjson.com/products/search?${params}`;

    // const res = await axios.get(url);
    // console.log(res.data);
    const query = search.value.trim();
    const payload = {
      limit: limit.value,
      skip: (page.value - 1) * limit.value,
    };
    if (query) {
      payload.q = query;
    }
    const res = await axios.get("https://dummyjson.com/products/search", {
      params: payload,
    });

    products.value = res.data.products;
    total.value = res.data?.total;
    totalPage.value = Math.ceil(total.value / limit.value);
  } catch (error) {
    console.error("Lỗi khi lấy products:", error);
  }
};
onMounted(() => {
  fetchProducts();
});
const nextPage = () => {
  if (page.value * limit.value < total.value) {
    page.value++;
    fetchProducts();
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    fetchProducts();
  }
};
</script>
<template>
  <div class="p-6 bg-gray-100">
    <h1 class="text-4xl font-bold mb-6 text-center">Danh sách sản phẩm</h1>
    <div class="flex justify-center">
      <input
        v-model="search"
        @keyup.enter="fetchProducts"
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        class="border border-gray-400 rounded p-2 w-1/2 transition-transform duration-300 hover:scale-105 mb-6"
      />
    </div>
    <div v-if="products.length" class="grid grid-cols-6 gap-6 gap-y-10">
      <router-link
        v-for="product in products"
        :key="product.id"
        :to="`products/${product.id}`"
        class="border p-4 rounded-4xl shadow transition transform duration-300 hover:scale-105 hover:bg-gray-400 hover:text-white"
      >
        <img
          :src="product.thumbnail"
          alt=""
          class="h-40 w-full object-cover mb-4"
        />
        <h2 class="text-xl font-semibold text-center mb-4 line-clamp-1">
          {{ product.title }}
        </h2>
        <p class="text-sm text-center mb-2 line-clamp-2">
          {{ product.description }}
        </p>
        <p class="text-lg font-bold text-center">${{ product.price }}</p>
      </router-link>
    </div>
    <div v-else class="text-center text-gray-500">
      Không có sản phẩm nào được tìm thấy.
    </div>

    <div class="flex justify-center space-x-4 p-8">
      <button
        @click="prevPage"
        :disabled="page === 1"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Prev
      </button>
      <span class="px-4 py-2 font-semibold">{{ page }} / {{ totalPage }}</span>
      <button
        @click="nextPage"
        :disabled="page * limit >= total"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>
