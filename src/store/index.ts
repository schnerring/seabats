import { State } from "@vue/runtime-core";
import { createStore } from "vuex";
import {
  GET_FLIGHTS,
  GET_AIRCRAFTS,
  SELECT_AIRCRAFT,
  UNSELECT_AIRCRAFT,
  GET_INFO_TEXT,
} from "./types";
import { getAircrafts, getFlights, getInfoText } from "@/shared/DataService";

export const store = createStore<State>({
  state: {
    appPassword: "",
    aircrafts: [],
    selectedAircraftIcaos: [],
    flights: [],
    infoText: "",
    selectedFlights: [],
    tracks: [],
  },
  getters: {
    isLoggedIn: (state) => !!state.appPassword,
  },
  mutations: {
    [SELECT_AIRCRAFT](state, icao) {
      state.selectedAircraftIcaos.push(icao);
    },
    [UNSELECT_AIRCRAFT](state, icao) {
      state.selectedAircraftIcaos = state.selectedAircraftIcaos.filter(
        (i) => i !== icao
      );
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
    async selectAircraft({ commit, dispatch }, payload) {
      commit(SELECT_AIRCRAFT, payload.icao);
      await dispatch("getFlights");
    },
    async unselectAircraft({ commit, dispatch }, payload) {
      commit(UNSELECT_AIRCRAFT, payload.icao);
      await dispatch("getFlights");
    },
  },
  modules: {},
});
