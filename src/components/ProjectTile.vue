<template>
   <v-card tile flat class="ma-2">
      <v-img class="striped-gradient">
         <v-card-title class="justify-center pa-2">
            <v-icon left>fal fa-code</v-icon>
            {{ project.category }}
            <template v-if="project.version">
               {{ project.version }}
            </template>
         </v-card-title>
         <v-card-subtitle class="py-0 px-0 ma-0">
            <v-btn
               block
               tile
               class="striped-gradient"
               v-on:click="openInExplorer(project)"
               :color="$store.getters.mainColor"
            >
               <v-icon left>fal fa-folder-open</v-icon>
               &nbsp;
               {{ project.path }}
            </v-btn>
         </v-card-subtitle>
         <v-card-text class="pa-1">
            <project-app-actions :project="project"></project-app-actions>
            <project-git-actions
               v-if="hasGit(project.path)"
               :project="project"
            ></project-git-actions>
         </v-card-text>
      </v-img>
   </v-card>
</template>

<script lang="ts">
import { exec } from "child_process";
import ProjectAppActions from "./ProjectAppActions.vue";
import ProjectGitActions from "./ProjectGitActions.vue";
import { IProject } from "@/types";
import path from "path";
import fs from "fs";
import Vue from "vue";

export default Vue.extend({
   props: ["project"],
   components: {
      ProjectAppActions,
      ProjectGitActions,
   },
   methods: {
      openInExplorer: function(project: IProject): void {
         exec(`start "" "${project.path}"`).unref();
      },
      hasGit(projectPath: string) {
         return fs.existsSync(path.join(projectPath, ".git"));
      },
   },
});
</script>

<style scoped></style>
