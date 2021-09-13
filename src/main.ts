import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";

// Element Plus
import { ElIcon, ElNotification } from "element-plus";
const components = [ElIcon];
const plugins = [ElNotification];

import "@/assets/element-variables.scss";
import "leaflet/dist/leaflet.css";

const app = createApp(App).use(store).use(router);

components.forEach((component) => app.use(component));
plugins.forEach((plugin) => app.use(plugin));

app.mount("#app");
