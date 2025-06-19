<script setup>
import { reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
//Giỏ hàng lưu trong localStorage
const cart = reactive(JSON.parse(localStorage.getItem("cart")) || []);
//nếu chưa login -> rediect về login
onMounted(() => {
  const user = JSON.parse(localStorage.getItem("users"));
  if (!user) {
    router.push("/login");
  }
});

//xóa sản phẩm trong giỏ hàng
const removeFromCart = (index) => {
  cart.splice(index, 1); // Xóa sản phẩm tại vị trí index, chỉ xóa 1 phần tử
  localStorage.setItem("cart", JSON.stringify(cart));
};

const totalPrice = computed(() => {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

function checkout() {
  // Thực hiện thanh toán hoặc xử lý giỏ hàng ở đây
  alert("Thanh toán thành công!");
  cart.splice(0); // Xóa giỏ hàng sau khi thanh toán
  localStorage.setItem("cart", JSON.stringify([]));
  router.push("/products");
}
</script>
<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-4xl font-bold mb-6 text-center">Giỏ hàng của bạn</h1>
    <div v-if="cart.length > 0" class="bg-gray-100 shadow-lg rounded-lg p-6">
      <table class="w-full text-left">
        <thead>
          <tr>
            <th class="px-4 py-2 border">Sản phẩm</th>
            <th class="px-4 py-2 border">Giá</th>
            <th class="px-4 py-2 border">Số lượng</th>
            <th class="px-4 py-2 border">Tổng</th>
            <th class="px-4 py-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in cart" :key="index">
            <td class="px-4 py-2 border">{{ item.title }}</td>
            <td class="px-4 py-2 border">${{ item.price }}</td>
            <td class="px-4 py-2 border">{{ item.quantity }}</td>
            <td class="px-4 py-2 border">${{ item.price * item.quantity }}</td>
            <td class="px-4 py-2 border">
              <button
                @click="removeFromCart(index)"
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="mt-6 text-right">
        <h2 class="text-xl font-bold">Tổng tiền: ${{ totalPrice }}</h2>
      </div>
      <div class="mt-6 text-center">
        <button
          @click="checkout"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 hover:scale-105 transition-transform duration-300"
        >
          Thanh toán
        </button>
      </div>
    </div>
    <div v-else class="text-center text-gray-500">
      Giỏ hàng của bạn đang trống.
      <router-link to="/" class="text-blue-500 underline"
        >Quay lại mua sắm</router-link
      >
    </div>
  </div>
</template>
