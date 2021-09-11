<template>
  <nav>
    <router-link to="/">MAP</router-link>
    <router-link to="/info">INFO</router-link>
  </nav>
  <main>
    <router-view />
  </main>
  <footer>
    <span>© Michael Schnerring, Sebastian Deuss</span> | Source code
    <a href="https://github.com/schnerring/seabats/blob/main/LICENSE"
      >licensed under MIT</a
    >
    | <a href="https://github.com/schnerring/seabats">GitHub</a>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";

export default defineComponent({
  methods: {
    ...mapActions(["getAircrafts"]),
  },
  async created() {
    await this.getAircrafts();
  },
});
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
:root {
  /* Material Blue */
  --blue50: #e3f2fd;
  --blue100: #bbdefb;
  --blue200: #90caf9;
  --blue300: #64b5f6;
  --blue400: #42a5f5;
  --blue500: #2196f3;
  --blue600: #1e88e5;
  --blue700: #1976d2;
  --blue800: #1565c0;
  --blue900: #0d47a1;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: grid;
  grid-template-areas:
    "nav"
    "main"
    "footer";
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  overflow-y: hidden;
}

::-webkit-scrollbar {
  height: 5px;
  width: 5px;
  scrollbar-width: auto;
}
::-webkit-scrollbar-thumb {
  background: black;
}
</style>

<style lang="scss" scoped>
nav {
  display: flex;
  font-size: 14pt;
  grid-area: nav;
  justify-content: space-between;
  padding: 5px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

main {
  grid-area: main;
  overflow: hidden;
  position: relative;
}
footer {
  grid-area: footer;
}
</style>
