<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
const chartRef = ref(null);
onMounted(async () => {
  const res = await axios.get("https://dummyjson.com/products?limit=1000");
  const products = res.data.products;

  const categoryCount = {};
  products.forEach((p) => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
  });

  new Chart(chartRef.value, {
    type: "bar",
    data: {
      labels: Object.keys(categoryCount),
      datasets: [
        {
          label: "Số lượng sản phẩm theo danh mục",
          data: Object.values(categoryCount),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#F87171",
            "#60A5FA",
            "#FACC15",
            "#34D399",
            "#C084FC",
            "#FB923C",
            "#10B981",
            "#3B82F6",
            "#FBBF24",
            "#8B5CF6",
            "#EC4899",
            "#EF4444",
            "#22D3EE",
            "#A78BFA",
            "#F472B6",
            "#E879F9",
            "#84CC16",
            "#FCD34D",
            "#0EA5E9",
            "#F43F5E",
            "#38BDF8",
            "#A3E635",
            "#EAB308",
            "#D946EF",
            "#14B8A6",
            "#F59E0B",
            "#6366F1",
            "#E11D48",
            "#BE185D",
            "#7C3AED",
            "#059669",
            "#2563EB",
            "#EA580C",
            "#9333EA",
          ],
        },
      ],
    },
  });
});
</script>
<template>
  <div class="bg-white p-6 rounded shadow">
    <h2 class="uppercase font-semibold text-xl text-center mb-4">
      Danh mục sản phẩm
    </h2>
    <div class="w-[800px] h-[400px] mx-auto">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>
