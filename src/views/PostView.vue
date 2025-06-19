<template>
  <div class="max-w-[1200px] mx-auto">
    <ul>
      <li v-for="post in posts" :key="post.id">
        <div class="p-5 bg-gray-200 mt-5 rounded-2xl shadow-xl">
          <div>
            <div>
              <router-link to="/" class="inline-flex items-center space-x-2">
                <div class="w-10 h-10 bg-amber-50 block rounded-full"></div>
                <span>Người dùng {{ post.userId }}</span>
              </router-link>
            </div>
            <div class="px-8 py-3">
              <h1 class="text-2xl font-bold mb-2">{{ post.title }}</h1>
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

const posts = ref([]);
const limit = ref(10);
const page = ref(1);
const totalPosts = ref(0);
const isLoading = ref(false);

onMounted(() => {
  fetchAllPost(); // Tải dữ liệu ban đầu
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const fetchAllPost = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  try {
    const params = {
      limit: limit.value,
      skip: (page.value - 1) * limit.value,
    };
    const response = await axios.get("https://dummyjson.com/posts", {
      params: params,
    });

    posts.value = [...posts.value, ...response.data.posts];
    totalPosts.value = response.data.total;
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
