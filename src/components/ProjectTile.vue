<template>
   <v-card tile flat class="ma-2">
      <v-img :class="gradientCss">
         <v-card-title class="justify-center py-2">
            <v-icon left>fal fa-code</v-icon>
            {{ project.category }}
            <template v-if="project.version">
               {{ project.version }}
            </template>
         </v-card-title>
         <v-img class="pa-0" :style="gradientMain">
            <v-card-subtitle class="py-0 px-0">
               <v-btn
                  block
                  tile
                  text
                  v-on:click="openInExplorer(project)"
                  color="grey darken-4"
               >
                  <v-icon left>fal fa-folder-open</v-icon>
                  &nbsp;
                  {{ project.path }}
               </v-btn>
            </v-card-subtitle>
         </v-img>
         <v-card-text class="pa-1">
            <project-app-actions :project="project"></project-app-actions>
            <project-git-actions :project="project"></project-git-actions>
         </v-card-text>
      </v-img>
   </v-card>
</template>

<script lang="ts">
import { exec } from "child_process";
import ProjectAppActions from "./ProjectAppActions.vue";
import ProjectGitActions from "./ProjectGitActions.vue";
import { IProject } from "@/types";
import Vue from "vue";
import store from "@/store";
function shade(color: string, amount: number) {
   return (
      "#" +
      color
         .replace(/^#/, "")
         .replace(/../g, color =>
            (
               "0" +
               Math.min(
                  255,
                  Math.max(0, parseInt(color, 16) + amount),
               ).toString(16)
            ).substr(-2),
         )
   );
}
export default Vue.extend({
   props: ["project"],
   components: {
      ProjectAppActions,
      ProjectGitActions,
   },
   data() {
      return {
         gradientCss: "tile-gradient",
      };
   },
   methods: {
      openInExplorer: function(project: IProject): void {
         exec(`start "" "${project.path}"`).unref();
      },
   },
   mounted() {
      if (this.$vuetify.theme.dark) {
         this.gradientCss = "tile-gradient";
      } else {
         this.gradientCss = "tile-gradient-light";
      }
   },
   watch: {
      "$vuetify.theme.dark"() {
         if (this.$vuetify.theme.dark) {
            this.gradientCss = "tile-gradient";
         } else {
            this.gradientCss = "tile-gradient-light";
         }
      },
   },
   computed: {
      gradientMain() {
         return {
            background: `repeating-linear-gradient(
               45deg,
               ${store.getters.mainColor},
               ${store.getters.mainColor} 10px,
               ${shade(store.getters.mainColor, -20)} 10px,
               ${shade(store.getters.mainColor, -20)} 20px)`,
         };
      },
   },
});
</script>

<style scoped>
.tile-gradient-light {
   background: repeating-linear-gradient(
      45deg,
      #d7d7d7,
      #d7d7d7 10px,
      #dadada 10px,
      #dadada 20px
   );
}
.tile-gradient {
   background: repeating-linear-gradient(
      45deg,
      #282828,
      #282828 10px,
      #252525 10px,
      #252525 20px
   );
}
</style>
