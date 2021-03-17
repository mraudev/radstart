<template>
   <v-row no-gutters>
      <v-col class="pa-2" v-for="app in project.apps" :key="app">
         <v-btn
            block
            tile
            :color="$store.getters.mainColor"
            v-on:click="open(app)"
         >
            <v-icon left>fal fa-brackets</v-icon> {{ getAppCaption(app) }}
         </v-btn>
      </v-col>
   </v-row>
</template>

<script lang="ts">
import { exec } from "child_process";
import path from "path";

interface IComponentData {}

export default {
   name: "project-rad-actions",
   props: ["project"],
   data(): IComponentData {
      return {};
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
