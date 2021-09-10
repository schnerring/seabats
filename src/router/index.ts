import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Timeline from "@/views/Timeline.vue";
import Setup from "@/views/Setup.vue";
import { store } from "../store/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    alias: "/map",
    name: "Map",
    component: Timeline,
    meta: {
      requireData: true,
    },
  },
  {
    path: "/hi",
    name: "Setup",
    component: Setup,
  },
  {
    path: "/info",
    name: "Info",
    // Lazy loading
    component: () => import(/* webpackChunkName: "info" */ "../views/Info.vue"),
  },
  {
    path: "/info",
    name: "Archive",
    component: () =>
      import(/* webpackChunkName: "archive" */ "../views/Info.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (
    to.matched.some((record) => record.meta.requireData) &&
    !store.getters.isLoggedIn
  ) {
    next("/hi");
    return;
  }
  next();
});

export default router;
