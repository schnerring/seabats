import { State } from "@vue/runtime-core";
import { createStore } from "vuex";
import { CHECK_IF_DATA_EXSISTS, GET_FLIGHTS, GET_INFO_TEXT } from "./types";
import { dataExists, getFlights, getInfoText } from "@/shared/DataService";

export const store = createStore<State>({
  state: {
    dataExists: false,
    flights: [],
    infoText: "",
    tracks: [],
  },
  mutations: {
    [CHECK_IF_DATA_EXSISTS](state, dataExists) {
      state.dataExists = dataExists;
    },
    [GET_FLIGHTS](state, flights) {
      state.flights = flights;
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
    async checkIfDataExists({ commit }) {
      commit(CHECK_IF_DATA_EXSISTS, await dataExists());
    },
  },
  modules: {},
});
