/* eslint-disable */
// Type $store property in Vue component
// See: https://next.vuex.vuejs.org/guide/typescript-support.html#typing-store-property-in-vue-component
import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";
import Aircraft from "@/shared/Aircraft";
import Flight from "@/shared/Flight";
import Track from "@/shared/Track";

declare module "@vue/runtime-core" {
  export interface State {
    appPassword: string;
    aircrafts: Aircraft[];
    selectedAircraftIcaos: string[];
    flights: Flight[];
    infoText: string;
    selectedFlights: Flight[];
    tracks: Track[];
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
