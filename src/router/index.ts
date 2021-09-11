import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import TheTimeline from "@/views/timeline/TheTimeline.vue";
import Setup from "@/views/Setup.vue";
import Info from "@/views/Info.vue";
import { store } from "../store/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/setup",
    name: "Setup",
    component: Setup,
  },
  {
    path: "/",
    alias: "/map",
    name: "Map",
    component: TheTimeline,
    meta: {
      requireData: true,
    },
  },
  {
    path: "/info",
    name: "Info",
    component: Info,
    meta: {
      requireData: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (!store.state.dataExists) {
    await store.dispatch("checkIfDataExists");
  }

  if (
    to.matched.some((record) => record.meta.requireData) &&
    !store.state.dataExists
  ) {
    next("/setup");
  } else if (
    to.matched.some((record) => record.name === "Setup") &&
    store.state.dataExists
  ) {
    next(from);
  } else next();
});

export default router;
