import { State } from "@vue/runtime-core";
import { createStore } from "vuex";
import { checkAppPassword } from "@/shared/Auth";
import {
  LOGOUT,
  UNLOCK_APP,
  GET_FLIGHTS,
  GET_AIRCRAFTS,
  AIRCRAFT_SELECTION_CHANGE,
} from "./types";
import router from "../router";
import { SampleDataService } from "@/shared/adsb/SampleDataService";

export const sampleDataService = new SampleDataService();

export const store = createStore<State>({
  state: {
    appPassword: "",
    openSkyUser: {
      username: "",
      password: "",
    },
    aircrafts: [],
    selectedAircrafts: [],
    aircraftStates: [],
    flights: [],
    selectedFlights: [],
    tracks: [],
  },
  getters: {
    isLoggedIn: (state) => !!state.appPassword,
  },
  mutations: {
    [AIRCRAFT_SELECTION_CHANGE](state, payload) {
      const i = state.selectedAircrafts.indexOf(payload.aircraft);
      if (i < 0) {
        state.selectedAircrafts.push(payload.aircraft);
      } else {
        state.selectedAircrafts.splice(i, 1);
      }
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
      const aircrafts = await sampleDataService.getAircrafts();
      commit(GET_AIRCRAFTS, aircrafts);
    },
    async getFlights({ commit, state }) {
      const icaos = state.selectedAircrafts.map((a) => a.icao);
      const flights = await sampleDataService.getFlights(icaos);
      commit(GET_FLIGHTS, flights);
    },
    [AIRCRAFT_SELECTION_CHANGE]({ commit, dispatch }, payload) {
      commit(AIRCRAFT_SELECTION_CHANGE, payload);
      dispatch("getFlights");
    },
  },
  modules: {},
});
