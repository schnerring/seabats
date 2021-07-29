<template>
  <nav>
    <router-link to="/">Map</router-link> |
    <router-link to="/about">About</router-link
    ><span v-if="isLoggedIn"> | <a @click="logout">Logout</a></span>
  </nav>
  <main>
    <div id="map">
      <router-view />
    </div>
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
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    ...mapActions(["logout"]),
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

nav {
  grid-area: nav;
  padding: 30px;

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
}

footer {
  grid-area: footer;
}

#flights {
  grid-area: flights;
}

#aircrafts {
  grid-area: aircrafts;
}

#map {
  grid-area: map;
  height: 100%;
  position: relative;
}
</style>
