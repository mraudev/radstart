<template>
   <v-row no-gutters>
      <v-col
         cols="12"
         xl="4"
         md="6"
         sm="12"
         v-for="projectObj in projectData"
         :key="projectObj.id"
      >
         <project-tile :project="projectObj"></project-tile>
      </v-col>
   </v-row>
</template>

<script lang="ts">
import ProjectTile from "../components/ProjectTile.vue";
import appSettings from "../classes/appSettings";
import Vue from "vue";

interface IComponentData {
   projectData: Array<any>;
}

export default Vue.extend({
   name: "projectPage",
   props: {
      projectType: {
         type: String,
      },
   },
   components: {
      ProjectTile,
   },
   data(): IComponentData {
      return {
         projectData: [],
      };
   },
   mounted: function(): void {
      const allProjects: any = appSettings.get("projects");
      if (allProjects !== undefined) {
         for (let pr: number = 0; pr < allProjects.length; ++pr) {
            if (allProjects[pr].category === this.projectType) {
               this.projectData.push(allProjects[pr]);
            }
         }
      }
   },
});
</script>

<style></style>
