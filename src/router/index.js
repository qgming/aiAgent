import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      props: true,
    },
    {
      path: "/about",
      name: "about",
      props: true,
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/tool",
      name: "tool",
      props: true,
      component: () => import("../views/ToolView.vue"),
    },
    {
      path: "/setting",
      name: "setting",
      props: true,
      component: () => import("../views/SettingView.vue"),
    },
  ],
});

export default router;
