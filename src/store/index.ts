import { State } from "@vue/runtime-core";
import { createStore } from "vuex";
import {
  CHECK_IF_DATA_EXSISTS,
  GET_FLIGHTS,
  GET_INFO_TEXT,
  GET_ZONES,
} from "./types";
import {
  dataExists,
  getFlights,
  getZones,
  getInfoText,
} from "@/shared/DataService";

export const store = createStore<State>({
  state: {
    dataExists: false,
    flights: [],
    zones: [],
    infoText: "",
  },
  mutations: {
    [CHECK_IF_DATA_EXSISTS](state, dataExists) {
      state.dataExists = dataExists;
    },
    [GET_FLIGHTS](state, flights) {
      state.flights = flights;
    },
    [GET_ZONES](state, zones) {
      state.zones = zones;
    },
    [GET_INFO_TEXT](state, infoText) {
      state.infoText = infoText;
    },
  },
  actions: {
    async getInfoText({ commit }) {
      const flightInfos = await getInfoText();
      commit(GET_INFO_TEXT, flightInfos);
    },
    async getFlights({ commit }, payload) {
      const flights = await getFlights(payload.from, payload.to);
      commit(GET_FLIGHTS, flights);
    },
    async getZones({ commit }) {
      const zones = await getZones();
      commit(GET_ZONES, zones);
    },
    async checkIfDataExists({ commit }) {
      commit(CHECK_IF_DATA_EXSISTS, await dataExists());
    },
  },
  modules: {},
});
