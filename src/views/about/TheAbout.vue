<template>
  <div class="the-about">
    <leaflet-map />
    <div class="about-text">
      <div v-html="aboutText"></div>
      <div>
        <router-link to="/stories"
          >You can read more about this here.</router-link
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";

import LeafletMap from "@/views/about/Leaflet.vue"; // TODO fix code duplication

export default defineComponent({
  computed: {
    ...mapState(["aboutText"]),
  },
  methods: {
    ...mapActions(["getAboutText"]),
  },
  components: {
    LeafletMap,
  },
  async mounted() {
    await this.getAboutText();
  },
});
</script>
<style>
.the-about a {
  text-decoration: none;
}
</style>
<style scoped>
.the-about {
  display: flex;
  flex-direction: row;
  height: 100%;
}
.about-text {
  box-sizing: border-box;
  overflow-y: scroll;
  padding: 5px 30px;
  margin-bottom: 100px;
  width: 100%;
}
</style>
