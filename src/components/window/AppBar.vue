<template>
   <v-app-bar app flat height="64px">
      <v-btn
         v-for="item in projectItems"
         :key="item.key"
         :to="item.target"
         width="150"
         text
         tile
         class="appButton"
      >
         <v-avatar left tile size="36" :color="$store.getters.mainColor">
            <h3>{{ item.caption[0] }}</h3>
         </v-avatar>
         {{ item.caption.substring(1) }}
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
         v-for="item in rightItems"
         :key="item.key"
         :to="item.target"
         text
         tile
         class="appButton"
      >
         <v-avatar left tile size="36" :color="$store.getters.mainColor">
            <h3>{{ item.caption[0] }}</h3>
         </v-avatar>
         {{ item.caption.substring(1) }}
      </v-btn>
   </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";

interface IMenuItem {
   key: string;
   caption: string;
   target: string;
}
interface IComponentData {
   projectItems: Array<IMenuItem>;
   rightItems: Array<IMenuItem>;
}
export default Vue.extend({
   name: "AppBar",
   data(): IComponentData {
      return {
         projectItems: [
            {
               key: "D",
               caption: "Development",
               target: "/",
            },
            {
               key: "H",
               caption: "hotfix",
               target: "hotfix",
            },
            {
               key: "R",
               caption: "release",
               target: "release",
            },
            {
               key: "F",
               caption: "feature",
               target: "feature",
            },
         ],
         rightItems: [
            {
               key: "B",
               caption: "bender",
               target: "bender",
            },
            {
               key: "E",
               caption: "einstellungen",
               target: "settings",
            },
         ],
      };
   },
});
</script>

<style scoped></style>
