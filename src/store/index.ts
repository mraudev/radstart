import Vue from "vue";
import Vuex from "vuex";
import appSettings from "../classes/appSettings";
Vue.use(Vuex);

export default new Vuex.Store({
   state: {
      appKeyPressEnabled: true,
      mainColor: appSettings.get("mainColor"),
   },
   mutations: {
      EnableAppKeyPress(state) {
         state.appKeyPressEnabled = true;
      },
      DisableAppKeyPress(state) {
         state.appKeyPressEnabled = false;
      },
      SetMainColor(state, color) {
         state.mainColor = color;
      },
   },
   getters: {
      mainColor: state => state.mainColor,
   },
   actions: {},
   modules: {},
});
