/* eslint-disable */
// Type $store property in Vue component
// See: https://next.vuex.vuejs.org/guide/typescript-support.html#typing-store-property-in-vue-component
import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";
import { Feature } from "geojson";

declare module "@vue/runtime-core" {
  export interface State {
    dataExists: boolean;
    flights: Feature[];
    zones: Feature[];
    aboutText: string;
    storiesText: string;
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
