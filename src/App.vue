<template>
  <nav>
    <router-link to="/">MAP</router-link>
    <router-link to="/info">INFO</router-link>
  </nav>
  <main>
    <router-view />
  </main>
  <footer>
    <span>© 2021 Michael Schnerring, Sebastian Deuss</span> |
    <a href="https://github.com/schnerring/seabats">GitHub</a>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
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
  --blue: #4586ff;
  --grey: #e9e9e9;
  --grey2: #acacac;
  --grey3: #707070;
  --white: #ffffff;
  --black: #818181;
}

a {
  color: var(--blue900);
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
  background: var(--blue900);
}
</style>

<style lang="scss" scoped>
nav {
  border-bottom: var(--blue900) solid 1px;
  display: flex;
  font-size: 14pt;
  grid-area: nav;
  justify-content: space-between;
  padding: 5px;

  a {
    color: var(--blue900);
    font-weight: bold;
    color: var(--black);

    &.router-link-exact-active {
      color: var(--blue);
    }
  }
}

main {
  grid-area: main;
  overflow: hidden;
  position: relative;
}

footer {
  // border-top: solid 1px var(--blue900); TODO
  font-size: 8pt;
  grid-area: footer;
  text-align: right;
  padding: 0.3rem;
}
::-webkit-scrollbar {
  height: 5px;
  width: 5px;
  scrollbar-width: auto;
}
::-webkit-scrollbar-thumb {
  background: #262626;
  /* border-radius: 0.2rem; */
}
</style>
