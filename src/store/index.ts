import { State } from "@vue/runtime-core";
import { createStore } from "vuex";
import {
  CHECK_IF_DATA_EXSISTS,
  GET_AIRCRAFTS,
  GET_FLIGHTS,
  GET_INFO_TEXT,
} from "./types";
import {
  dataExists,
  getAircrafts,
  getFlights,
  getInfoText,
} from "@/shared/DataService";

export const store = createStore<State>({
  state: {
    aircrafts: [],
    dataExists: false,
    flights: [],
    infoText: "",
    selectedFlights: [],
    tracks: [],
  },
  mutations: {
    [CHECK_IF_DATA_EXSISTS](state, dataExists) {
      state.dataExists = dataExists;
    },
    [GET_AIRCRAFTS](state, aircrafts) {
      state.aircrafts = aircrafts;
    },
    [GET_FLIGHTS](state, flights) {
      state.flights = flights;
    },
    [GET_INFO_TEXT](state, infoText) {
      state.infoText = infoText;
    },
  },
  actions: {
    // Data
    async getAircrafts({ commit }) {
      const aircrafts = await getAircrafts();
      commit(GET_AIRCRAFTS, aircrafts);
    },
    async getInfoText({ commit }) {
      const flightInfos = await getInfoText();
      commit(GET_INFO_TEXT, flightInfos);
    },
    async getFlights({ commit }, payload) {
      const flights = await getFlights(payload.from, payload.to);
      commit(GET_FLIGHTS, flights);
    },
    async checkIfDataExists({ commit }) {
      commit(CHECK_IF_DATA_EXSISTS, await dataExists());
    },
  },
  modules: {},
});
