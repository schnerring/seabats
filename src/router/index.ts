import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import TimelineMap from "@/views/TimelineMap.vue";
import UnlockApp from "@/views/UnlockApp.vue";
import { store } from "../store/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    alias: "/map",
    name: "Map",
    component: TimelineMap,
    meta: {
      // requireAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: UnlockApp,
  },
  {
    path: "/admin",
    name: "Admin",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Admin.vue"),
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
    to.matched.some((record) => record.meta.requireAuth) &&
    !store.getters.isLoggedIn
  ) {
    next("/login");
    return;
  }
  next();
});

export default router;
