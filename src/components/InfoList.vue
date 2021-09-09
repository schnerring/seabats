<template>
  <div>
    <markdown
      v-for="flightInfo of flightInfos"
      :key="flightInfo.flightId"
      :markdown="flightInfo.markdown"
    ></markdown>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import Markdown from "@/components/Markdown.vue";

export default defineComponent({
  components: {
    Markdown,
  },
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
