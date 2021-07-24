<template>
  <nav>
    <router-link to="/">Trace</router-link> |
    <router-link to="/about">About</router-link
    ><span v-if="isLoggedIn"> | <a @click="logout">Logout</a></span>
  </nav>
  <main>
    <div id="map">
      <router-view />
    </div>
    <div id="aircrafts">
      <aircraft-list />
    </div>
    <div id="flights">
      <flight-list />
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
import AircraftList from "@/components/AircraftList.vue";
import FlightList from "@/components/FlightList.vue";
import { sampleDataService } from "@/store";

export default defineComponent({
  components: {
    AircraftList,
    FlightList,
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    ...mapActions(["logout"]),
  },
  async created() {
    await sampleDataService.init();
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
  display: grid;
  grid-area: main;
  grid-template-areas:
    "aircrafts flights"
    "map flights";
  grid-template-columns: 1fr 30%;
  grid-template-rows: auto 1fr;
  overflow-y: hidden;
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
  display: flex;
}
</style>
