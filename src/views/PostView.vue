<template>
  <div class="max-w-[1200px] mx-auto">
    <ul>
      <li v-for="post in posts" :key="post.id">
        <div class="p-5 bg-gray-200 mt-5 mb-5 rounded-2xl shadow-xl">
          <div>
            <div>
              <router-link to="/" class="inline-flex items-center space-x-2">
                <div class="w-10 h-10 bg-amber-50 block rounded-full"></div>
                <span>Người dùng {{ post.userId }}</span>
              </router-link>
            </div>
            <div class="px-8 py-3">
              <div class="flex flex-wrap gap-4 mb-4">
                <h1 class="text-2xl font-bold mb-2">{{ post.title }}</h1>
                <span
                  v-for="tag in post.tags"
                  :key="tag"
                  class="bg-blue-100 text-blue-800 px-3 py-3 rounded-full text-xs hover:bg-blue-200 transition-colors duration-300"
                  >#{{ tag }}</span
                >
              </div>
              <p>{{ post.body }}</p>
              <div class="flex gap-10 mt-5">
                <div class="text-gray-500 font-bold">
                  View: {{ post.views }}
                </div>
                <div class="text-gray-500 font-bold">
                  Like: {{ post.reactions.likes }}
                </div>
                <div class="text-gray-500 font-bold">
                  Dislike: {{ post.reactions.dislikes }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";

const posts = ref([]); // Danh sách các bài viết hiển thị
const limit = ref(10); // Số lượng bài viết mỗi lần tải
const page = ref(1); // Trang hiện tại
const totalPosts = ref(0); // Tổng số bài viết (lấy từ API)
const isLoading = ref(false); // Trạng thái đang tải (ngăn gọi API trùng lặp)

onMounted(() => {
  fetchAllPost(); // Tải dữ liệu ban đầu
  window.addEventListener("scroll", handleScroll); // Lắng nghe sự kiện scroll
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll); // Dọn sạch listener khi component bị hủy
});

const fetchAllPost = async () => {
  if (isLoading.value) return; // Tránh gọi API khi đang tải dữ liệu

  isLoading.value = true;
  try {
    const params = {
      limit: limit.value,
      skip: (page.value - 1) * limit.value,
    };
    const response = await axios.get("https://dummyjson.com/posts", {
      params: params,
    });

    posts.value = [...posts.value, ...response.data.posts]; // Nối bài mới vào bài cũ
    totalPosts.value = response.data.total; // Tổng số bài viết
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching posts:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (documentHeight - scrollTop - windowHeight < 200) {
    if (posts.value.length < totalPosts.value) {
      page.value += 1;
      fetchAllPost();
    }
  }
};
</script>
