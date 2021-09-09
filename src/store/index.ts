import { State } from "@vue/runtime-core";
import { createStore } from "vuex";
import { checkAppPassword } from "@/shared/Auth";
import {
  LOGOUT,
  UNLOCK_APP,
  GET_FLIGHTS,
  GET_AIRCRAFTS,
  SELECT_AIRCRAFT,
  UNSELECT_AIRCRAFT,
  GET_INFO_TEXT,
} from "./types";
import router from "../router";
import { getAircrafts, getFlights, getInfoText } from "@/shared/DataService";

export const store = createStore<State>({
  state: {
    appPassword: "",
    openSkyUser: {
      username: "",
      password: "",
    },
    aircrafts: [],
    selectedAircraftIcaos: [],
    aircraftStates: [],
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
    [UNLOCK_APP](state, password) {
      state.appPassword = password;
    },
    [LOGOUT](state) {
      state.appPassword = "";
      state.openSkyUser = {
        username: "",
        password: "",
      };
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
    async unlockApp({ commit }, password) {
      if (await checkAppPassword(password)) {
        commit(UNLOCK_APP, password);
        router.push("/");
        return;
      }
      throw "Ah ah ah, you didn't say the magic word!";
    },
    logout({ commit }) {
      commit(LOGOUT);
      router.push("/login");
    },
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
