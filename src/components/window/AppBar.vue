<template>
   <v-app-bar app flat height="64px">
      <v-btn to="/" width="150" text tile>
         <v-icon left large color="amber darken-1">
            mdi-alpha-d-box-outline
         </v-icon>
         evelopment
      </v-btn>
      <v-btn to="hotfix" width="150" text tile>
         <v-icon left large color="amber darken-1">
            mdi-alpha-h-box-outline
         </v-icon>
         otfix
      </v-btn>
      <v-btn to="release" width="150" text tile>
         <v-icon left large color="amber darken-1">
            mdi-alpha-r-box-outline
         </v-icon>
         elease
      </v-btn>
      <v-btn to="feature" width="150" text tile>
         <v-icon left large color="amber darken-1">
            mdi-alpha-f-box-outline
         </v-icon>
         eature
      </v-btn>

      <v-spacer></v-spacer>
      <v-btn to="bender" text tile>
         <v-icon left large color="amber darken-1">
            mdi-alpha-b-box-outline
         </v-icon>
         ender
      </v-btn>
      <v-btn to="settings" text tile>
         <v-icon left large color="amber darken-1">
            mdi-alpha-e-box-outline
         </v-icon>
         instellungen
      </v-btn>
   </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
   name: "AppBar",
});
</script>

<style scoped></style>
