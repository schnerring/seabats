import { State } from "@vue/runtime-core";
import { createStore } from "vuex";
import { checkAppPassword } from "@/shared/Auth";
import { LOGOUT, UNLOCK_APP } from "./types";
import router from "../router";

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
  },
  modules: {},
});
