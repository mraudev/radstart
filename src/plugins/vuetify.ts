import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
   theme: {
      themes: {
         light: {
            primary: colors.grey.lighten2,
         },
         dark: {
            primary: colors.grey.darken3,
         },
      },
      dark: true,
   },
   icons: {
      iconfont: "fa",
   },
});
