import { State } from "@vue/runtime-core";
import { createStore } from "vuex";
import { checkAppPassword } from "@/shared/Auth";
import { LOGOUT, UNLOCK_APP, GET_FLIGHTS, GET_AIRCRAFTS } from "./types";
import router from "../router";
import { SampleDataService } from "@/shared/adsb/SampleDataService";

const sampleDataService = new SampleDataService();

export const store = createStore<State>({
  state: {
    appPassword: "",
    openSkyUser: {
      username: "",
      password: "",
    },
    aircrafts: [],
    aircraftStates: [],
    flights: [],
    tracks: [],
  },
  getters: {
    isLoggedIn: (state) => !!state.appPassword,
  },
  mutations: {
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
    async getFlights({ commit }) {
      const flights = await sampleDataService.getFlights();
      commit(GET_FLIGHTS, flights);
    },
  },
  modules: {},
});
