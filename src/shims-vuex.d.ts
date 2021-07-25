/* eslint-disable */
// Type $store property in Vue component
// See: https://next.vuex.vuejs.org/guide/typescript-support.html#typing-store-property-in-vue-component
import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";
import { User } from "./shared/User";

declare module "@vue/runtime-core" {
  export interface State {
    appPassword: string;
    openSkyUser: User;
    aircrafts: Aircraft[];
    selectedAircraftIcaos: string[];
    aircraftStates: AircraftState[];
    flights: Flight[];
    selectedFlights: Flight[];
    tracks: Track[];
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
