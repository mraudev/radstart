import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
      appKeyPressEnabled: true,
   },
   mutations: {
      EnableAppKeyPress(state) {
         state.appKeyPressEnabled = true;
      },
      DisableAppKeyPress(state) {
         state.appKeyPressEnabled = false;
      },
   },
   getters: {},
   actions: {},
   modules: {},
});
