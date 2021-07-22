import { State } from "@vue/runtime-core";
import { createStore } from "vuex";
import { checkPassphrase } from "@/shared/Auth";
import { LOGOUT, UNLOCK_APP } from "./types";
import router from "../router";

export const store = createStore<State>({
  state: {
    passphrase: "",
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
    isLoggedIn: (state) => !!state.passphrase,
  },
  mutations: {
    [UNLOCK_APP](state, passphrase) {
      state.passphrase = passphrase;
    },
    [LOGOUT](state) {
      state.passphrase = "";
      state.openSkyUser = {
        username: "",
        password: "",
      };
    },
  },
  actions: {
    async unlockApp({ commit }, passphrase) {
      if (await checkPassphrase(passphrase)) {
        commit(UNLOCK_APP, passphrase);
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
