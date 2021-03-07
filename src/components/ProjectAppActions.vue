<template>
   <v-row no-gutters>
      <v-col class="pa-2" v-for="app in project.apps" :key="app">
         <v-btn block tile color="amber" v-on:click="open(app)">
            <v-icon left>mdi-code-braces</v-icon>&nbsp;{{ getAppCaption(app) }}
         </v-btn>
      </v-col>
   </v-row>
</template>

<script lang="ts">
import { exec } from "child_process";
import path from "path";

interface IComponentData {
   openColor: string;
   allComponentsColor: string;
}

export default {
   name: "project-rad-actions",
   props: ["project"],
   data(): IComponentData {
      return {
         openColor: "amber darken-1",
         allComponentsColor: "amber darken-1",
      };
   },
   methods: {
      open: function(file: string) {
         exec(file).unref();
      },
      getAppCaption: function(file: string) {
         let ext = path.extname(file);
         return path.basename(file, ext);
      },
   },
};
</script>

<style scoped></style>
