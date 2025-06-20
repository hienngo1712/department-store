<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();
const cartItems = ref([]);

// Lấy dữ liệu từ giỏ hàng
const fetchCart = async () => {
  try {
    // Gửi yêu cầu GET đến endpoint /cart (json-server)
    const res = await axios.get("http://localhost:3000/cart");
    cartItems.value = res.data;
  } catch (error) {
    console.error("Lấy dữ liệu từ giỏ hàng bị lỗi", error);
  }
};
onMounted(fetchCart);
// Xóa dữ liệu từ giỏ hàng theo id
const removeFromCart = async (id) => {
  try {
    // Gửi yêu cầu DELETE đến endpoint /cart/:id
    await axios.delete(`http://localhost:3000/cart/${id}`);
    //Sau khi xóa xong gọi lại fetch để update list cart
    fetchCart();
  } catch (error) {
    console.error("Xóa dữ liệu từ giỏ hàng bị lỗi", error);
    alert("Xóa giỏ hàng thất bại");
  }
};

const totalPrice = computed(() => {
  return cartItems.value
    .reduce(
      (sum, item) =>
        sum +
        (item.price * item.quantity * (100 - item.discountPercentage)) / 100,
      0
    )
    .toFixed(2);
});
const user = ref(JSON.parse(localStorage.getItem("users")));
const isAuthenticated = computed(() => !!user.value);
const orderItems = async () => {
  if (cartItems.value.length === 0) return;
  try {
    const username = JSON.parse(localStorage.getItem("users")).username;
    const cartSnapshot = [...cartItems.value];
    // phải dùng [...cartItem.value] để lấy tất cả dữ liệu trong giỏ hàng -> đơn hàng
    const newOrder = {
      username: username,
      products: cartSnapshot,
    };
    //Gửi đơn hàng mới vào order
    await axios.post("http://localhost:3000/order", newOrder);
    //Xóa toàn bộ cart
    const deletePromises = cartSnapshot.map(
      // map duyệt qua từng item trong giỏ hàng
      (item) => axios.delete(`http://localhost:3000/cart/${item.id}`)
    );
    await Promise.all(deletePromises);
    // Clear UI ngay lập tức
    cartItems.value = [];

    // Đợi một chút rồi fetch lại để chắc chắn server đã cập nhật
    await fetchCart();
    router.push("/");
  } catch (error) {
    console.error("Lỗi khi xác nhận đơn hàng");
  }
};
</script>
<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-4xl font-bold mb-6 text-center">Giỏ hàng của bạn</h1>
    <div v-if="cartItems.length === 0" class="text-center text-gray-500">
      Giỏ hàng của bạn đang trống.
      <router-link to="/" class="text-blue-500 underline"
        >Quay lại mua sắm</router-link
      >
    </div>
    <div v-else class="bg-gray-100 shadow-lg rounded-lg p-6">
      <table class="w-full text-left">
        <thead>
          <tr class="text-center bg-gray-200">
            <th class="px-4 py-2 border">Sản phẩm</th>
            <th class="px-4 py-2 border">Giá</th>
            <th class="px-4 py-2 border">Số lượng</th>
            <th class="px-4 py-2 border">Tổng</th>
            <th class="px-4 py-2 border">Discount</th>
            <th class="px-4 py-2 border">Tổng tiền sau giảm giá</th>
            <th class="px-4 py-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.id" class="text-center">
            <td class="px-4 py-2 border">{{ item.title }}</td>
            <td class="px-4 py-2 border">${{ item.price }}</td>
            <td class="px-4 py-2 border">{{ item.quantity }}</td>
            <td class="px-4 py-2 border">${{ item.price * item.quantity }}</td>
            <td class="px-4 py-2 border">{{ item.discountPercentage }}%</td>
            <td class="px-4 py-2 border">
              ${{
                (
                  (item.price *
                    item.quantity *
                    (100 - item.discountPercentage)) /
                  100
                ).toFixed(2)
              }}
            </td>
            <td class="px-4 py-2 border">
              <button
                @click="removeFromCart(item.id)"
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
      <div v-if="!isAuthenticated" class="text-right text-xl mt-5 mr-2">
        <button
          class="bg-cyan-500 text-white px-2 py-1 rounded hover:bg-cyan-600"
        >
          <router-link to="/login">Vui lòng đăng nhập</router-link>
        </button>
      </div>
      <div v-else class="text-center text-xl mt-5">
        <button
          @click="orderItems"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 hover:scale-105 transition-transform duration-300"
        >
          Xác nhận đơn hàng
        </button>
      </div>
      <!-- <div class="mt-6 text-center">
        <button
          @click="checkout"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 hover:scale-105 transition-transform duration-300"
        >
          Thanh toán
        </button>
      </div> -->
    </div>
  </div>
</template>
