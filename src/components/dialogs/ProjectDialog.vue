<template>
   <v-dialog
      flat
      tile
      elevation="0"
      v-model="showDialogInternal"
      max-width="600px"
      :retain-focus="false"
   >
      <v-card flat tile>
         <v-card-title>
            {{ project.category }}
            {{ project.version }}
         </v-card-title>
         <v-card-text>
            <v-select
               :items="categories"
               label="Kategorie"
               v-model="project.category"
            ></v-select>
            <v-text-field
               type="number"
               class="centered-input"
               v-model="project.version"
               :prepend-icon="'fal fa-minus'"
               :append-outer-icon="'fal fa-plus'"
               @click:append-outer="project.version += 1"
               @click:prepend="project.version -= 1"
            ></v-text-field>
            <v-text-field
               v-model="project.path"
               :append-icon="'fal fa-folder-open'"
               @click:append="changePath(project)"
            ></v-text-field>
         </v-card-text>
         <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text tile color="red" v-on:click="cancel()">
               <v-icon left>fal fa-times-circle</v-icon>
               Abbrechen
            </v-btn>
            <v-btn text tile color="green" v-on:click="save(project)">
               <v-icon left>fal fa-save</v-icon>
               Speichern
            </v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>
</template>

<script lang="ts">
import { IProject } from "@/types";
import { ipcRenderer } from "electron";
import Vue from "vue";

interface IProjectDialogData {
   showDialogInternal: boolean;
   project: IProject;
   title: string;
   categories: Array<string>;
}
export default Vue.extend({
   name: "ProjectDialog",
   props: ["showDialog", "dialogData"],
   data(): IProjectDialogData {
      return {
         showDialogInternal: false,
         project: this.dialogData,
         title: `${this.dialogData.category} ${this.dialogData.version}`,
         categories: ["development", "hotfix", "release", "feature"],
      };
   },
   methods: {
      changePath: function() {
         ipcRenderer
            .invoke("show-directory-dialog", this.project.path)
            .then(newPath => {
               if (newPath !== undefined) {
                  this.project.path = newPath[0];
               }
            });
      },
      cancel() {
         this.$emit("close-ProjectDialog");
      },
      save: function() {
         this.$emit("save-ProjectDialog", this.project);
      },
   },
   watch: {
      showDialog: {
         immediate: false,
         deep: true,
         handler(newValue) {
            this.showDialogInternal = newValue;
         },
      },
      dialogData: {
         immediate: false,
         deep: true,
         handler(newValue) {
            if (newValue) {
               this.project = newValue;
               this.title = `${this.dialogData.category} ${this.dialogData.version}`;
            }
         },
      },
   },
});
</script>

<style scoped></style>
