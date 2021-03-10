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
         <v-img class="subtitle-gradient pa-0">
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
.subtitle-gradient {
   background: repeating-linear-gradient(
      45deg,
      #ffa000,
      #ffa000 10px,
      #ff9900 10px,
      #ff9900 20px
   );
}
</style>
