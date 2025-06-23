<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const product = ref(null);

onMounted(async () => {
  try {
    const id = route.params.id;
    const res = await axios.get(`https://dummyjson.com/products/${id}`);
    product.value = res.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu product:", error);
  }
});

const addToCart = async (item) => {
  // const cart = JSON.parse(localStorage.getItem("cart")) || [];
  // const index = cart.findIndex((item) => item.id === product.value.id);
  // if (index !== -1) {
  //   cart[index].quantity++; // Tăng số lượng nếu sản phẩm đã có trong giỏ
  // } else {
  //   cart.push({ ...product.value, quantity: 1 }); // Thêm sản phẩm mới vào giỏ
  // }
  // localStorage.setItem("cart", JSON.stringify(cart));
  // alert("Sản phẩm đã được thêm vào giỏ hàng!");
  try {
    // Bảo đảm id là số nếu bạn dùng số làm id (nếu là string thì bỏ dòng này)
    const id = String(item.id);

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng hay chưa dựa theo id
    const res = await axios.get(`http://localhost:3000/cart?id=${id}`);

    if (res.data.length > 0) {
      // Nếu sản phẩm đã có → cập nhật số lượng bằng PATCH
      const existingItem = res.data[0];
      const newQuantity = (existingItem.quantity || 1) + 1;

      await axios.patch(`http://localhost:3000/cart/${existingItem.id}`, {
        quantity: newQuantity,
      });

      console.log("Đã cập nhật số lượng sản phẩm:", newQuantity);
    } else {
      // Nếu sản phẩm chưa có → thêm mới với quantity = 1
      const newItem = {
        id: id,
        title: item.title,
        price: item.price,
        discountPercentage: item.discountPercentage,
        quantity: 1,
      };

      await axios.post("http://localhost:3000/cart", newItem);

      console.log("Đã thêm sản phẩm mới vào giỏ hàng.");
    }
  } catch (error) {
    console.error("Lỗi khi thêm/cập nhật giỏ hàng:", error);
    alert("Thêm vào giỏ hàng thất bại");
  }
};
</script>
<template>
  <div class="max-w-6xl mx-auto p-6">
    <div
      v-if="product"
      class="bg-gray-100 shadow-2xl rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      <div>
        <img
          :src="product.thumbnail"
          alt="Product Image"
          class="w-full h-auto rounded-xl shadow-md"
        />
        <div class="flex mt-4 overflow-x-auto space-x-2">
          <img
            v-for="(img, index) in product.images"
            :key="index"
            :src="img"
            class="h-24 w-24 object-cover rounded-lg shadow-md m-2 cursor-pointer"
          />
        </div>
      </div>
      <div>
        <h1 class="text-3xl text-center font-bold mb-2">{{ product.title }}</h1>
        <p class="text-gray-600 mb-4">{{ product.description }}</p>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <p><strong>Brand:</strong> {{ product.brand }}</p>
            <p><strong>Category:</strong> {{ product.category }}</p>
            <p><strong>SKU:</strong> {{ product.sku }}</p>
            <p><strong>Price:</strong> ${{ product.price }}</p>
            <p><strong>Discount:</strong> {{ product.discountPercentage }}%</p>
            <p><strong>Rating:</strong> {{ product.rating }} / 5</p>
            <p><strong>Stock:</strong> {{ product.stock }}</p>
          </div>
          <div class="space-y-1">
            <p><strong>Dimension:</strong></p>
            <ul class="list-disc ml-4">
              <li>Width: {{ product.dimensions.width }}</li>
              <li>Height: {{ product.dimensions.height }}</li>
              <li>Depth: {{ product.dimensions.depth }}</li>
            </ul>
            <p class="mt-2"><strong>Weight:</strong> {{ product.weight }}g</p>
            <p>
              <strong>Availability:</strong> {{ product.availabilityStatus }}
            </p>
            <p><strong>Warranty:</strong> {{ product.warrantyInformation }}</p>
            <p><strong>Shipping:</strong> {{ product.shippingInformation }}</p>
            <p><strong>Return Policy:</strong> {{ product.returnPolicy }}</p>
            <p>
              <strong>Min Order:</strong> {{ product.minimumOrderQuantity }}
            </p>
          </div>
        </div>
        <div class="mt-6">
          <h2 class="text-xl font-semibold mb-2">Tags</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in product.tags"
              :key="tag"
              class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs hover:bg-blue-200 transition-colors duration-300"
              >#{{ tag }}</span
            >
          </div>
          <div class="flex justify-around">
            <button
              @click="addToCart(product)"
              class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200 shadow-lg transform hover:scale-105"
            >
              Thêm vào giỏ hàng
            </button>
            <button
              class="mt-4 bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-700 transition duration-200 shadow-lg transform hover:scale-105"
            >
              <router-link to="/">Trở về trang chủ</router-link>
            </button>
          </div>
        </div>
        <div class="mt-6">
          <h2 class="text-xl font-semibold mb-2">Reviews</h2>
          <div
            v-for="review in product.reviews"
            :key="review.date"
            class="bg-gray-50 p-4 rounded-xl mb-2"
          >
            <p class="font-semibold">
              {{ review.reviewerName }}
              <span class="text-sm text-gray-500">{{
                review.reviewerEmail
              }}</span>
            </p>
            <p class="text-yellow-600">Rating: {{ review.rating }}/5</p>
            <p class="text-sm italic">Comment: {{ review.comment }}</p>
          </div>
        </div>
        <div class="mt-6">
          <h2 class="text-xl font-semibold mb-2">Meta Infomation</h2>
          <p><strong>Created At: </strong>{{ product.meta.createdAt }}</p>
          <p><strong>Updated At: </strong>{{ product.meta.updatedAt }}</p>
          <p><strong>Barcode: </strong>{{ product.meta.barcode }}</p>
          <img
            :src="product.meta.qrCode"
            alt="QR Code"
            class="w-24 h-24 mt-2"
          />
        </div>
      </div>
    </div>
    <div v-else class="bg-gray-600 text-center">
      Đang tải dữ liệu sản phẩm...
    </div>
  </div>
</template>
