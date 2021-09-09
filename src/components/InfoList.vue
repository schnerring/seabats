<template>
  <div
    v-for="flightInfo of flightInfos"
    :key="flightInfo.meta.key"
    v-html="flightInfo.html"
  ></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";

export default defineComponent({
  computed: {
    ...mapState(["flightInfos"]),
  },
  methods: {
    ...mapActions(["getFlightInfos"]),
  },
  async created() {
    await this.getFlightInfos();
  },
});
</script>

<style lang="scss" scoped></style>
