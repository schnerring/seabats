import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";

const app = createApp(App).use(store).use(router);

// Element Plus
import { ElIcon, ElNotification } from "element-plus";
const components = [ElIcon];
const plugins = [ElNotification];

components.forEach((component) => app.use(component));
plugins.forEach((plugin) => app.use(plugin));

app.mount("#app");
