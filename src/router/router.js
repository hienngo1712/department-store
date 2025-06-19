import { createRouter, createWebHistory } from "vue-router";
import ProductList from "../views/ProductList.vue";
import ProductDetail from "../views/ProductDetail.vue";
import Login from "../views/Login.vue";
import Cart from "../views/Cart.vue";
import DashBoard from "../views/DashBoard.vue";
import PostView from "../views/PostView.vue";
const routes = [
  {
    path: "/",
    redirect: "/products",
  },
  {
    path: "/products",
    name: "ProductList",
    component: ProductList,
  },
  {
    path: "/products/:id",
    name: "ProductDetail",
    component: ProductDetail,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
  },
  {
    path: "/admin",
    name: "DashBoard",
    component: DashBoard,
    meta: { requiresAuth: true },
  },
  {
    path: "/post",
    name: "Post",
    component: PostView,
    meta: { requiresAuth: true },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach = (to, from, next) => {
  // Check if the user is authenticated
  const user = JSON.parse(localStorage.getItem("users"));
  if (to.meta.requiresAuth && user?.role !== "admin") {
    return next("/login");
  }
  next();
};
export default router;
