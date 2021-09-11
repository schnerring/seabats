<template>
  <div class="info-map">
    <div class="info" v-html="infoText"></div>
    <info-map :flights="flights" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import InfoMap from "@/components/InfoMap.vue";
import { getFlightsByIds } from "@/shared/DataService";
import { Flight } from "@/shared/Flight";

export default defineComponent({
  computed: {
    ...mapState(["infoText"]),
  },
  methods: {
    ...mapActions(["getInfoText"]),
  },
  components: {
    InfoMap,
  },
  data(): { flights: Flight[] } {
    return {
      flights: [],
    };
  },
  async mounted() {
    await this.getInfoText();
    const buttons = document.getElementsByClassName("data-link");
    for (const button of buttons) {
      const flightIds = button.getAttribute("data")?.split(",");
      if (!flightIds) throw "data-link requires data attribute";
      button.addEventListener("click", async () => {
        this.flights = await getFlightsByIds(flightIds);
        console.log(this.flights);
      });
    }
  },
});
</script>
<style>
.data-link {
  border: none;
  background: none;
  padding: 0;
  color: blue;
  cursor: pointer;
  font-size: inherit;
}
.data-link::before {
  content: "✈";
}
</style>
<style scoped>
.opensky-attribution {
  font-style: italic;
}
.info-map {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100vw;
}
.info {
  width: 50vw;
  padding: 5px 30px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: scroll;
}
div#leaflet {
  height: 100%;
  width: 50vw;
}
</style>
