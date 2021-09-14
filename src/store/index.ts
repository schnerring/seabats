import { State } from "@vue/runtime-core";
import { createStore } from "vuex";
import {
  CHECK_IF_DATA_EXSISTS,
  GET_FLIGHTS,
  GET_ABOUT_TEXT,
  GET_STORIES_TEXT,
  GET_ZONES,
} from "./types";
import {
  dataExists,
  getFlights,
  getZones,
  getArticle,
} from "@/shared/DataService";

export const store = createStore<State>({
  state: {
    dataExists: false,
    flights: [],
    zones: [],
    aboutText: "",
    storiesText: "",
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
    [GET_ABOUT_TEXT](state, aboutText) {
      state.aboutText = aboutText;
    },
    [GET_STORIES_TEXT](state, storiesText) {
      state.storiesText = storiesText;
    },
  },
  actions: {
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
    async getAboutText({ commit }) {
      const text = await getArticle("about");
      commit(GET_ABOUT_TEXT, text);
    },
    async getStoriesText({ commit }) {
      const text = await getArticle("stories");
      commit(GET_STORIES_TEXT, text);
    },
  },
  modules: {},
});
