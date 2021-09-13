/* eslint-disable */
// Type $store property in Vue component
// See: https://next.vuex.vuejs.org/guide/typescript-support.html#typing-store-property-in-vue-component
import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";
import { Feature, LineString } from "geojson";
import Flight from "@/models/Flight";
import Track from "@/shared/Track";

declare module "@vue/runtime-core" {
  export interface State {
    dataExists: boolean;
    flights: Feature<LineString, Flight>[];
    infoText: string;
    tracks: Track[];
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
