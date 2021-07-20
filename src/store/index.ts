import { createStore } from 'vuex'

import { Aircraft } from '@/models/Aircraft';
import json from '@/assets/aircrafts.json';

export default createStore({
  state: {
    aircrafts: json as unknown as Aircraft[]
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
