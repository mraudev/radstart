<template>
   <v-dialog
      flat
      tile
      elevation="0"
      v-model="showDialogInternal"
      max-width="600px"
      persistent
      :retain-focus="false"
   >
      <v-card flat tile>
         <v-card-title>
            <v-icon left>mdi-apps</v-icon>
            {{ title }}
            Apps
         </v-card-title>
         <v-card-text>
            <v-list subheader two-line dense>
               <v-subheader inset>Apps</v-subheader>
               <v-list-item v-for="data in project.apps" :key="data">
                  <v-list-item-avatar>
                     <v-icon>mdi-code-braces</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                     <v-list-item-title>
                        {{ getAppCaption(data) }}
                     </v-list-item-title>
                     <v-list-item-subtitle v-text="data" />
                  </v-list-item-content>
                  <v-list-item-action>
                     <v-btn icon tile v-on:click="removeApp(data)">
                        <v-icon>mdi-minus</v-icon>
                     </v-btn>
                  </v-list-item-action>
               </v-list-item>
            </v-list>
         </v-card-text>
         <v-card-actions>
            <v-btn icon tile v-on:click="openFile()">
               <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn text tile color="red" v-on:click="cancel()">
               Abbrechen
            </v-btn>
            <v-btn text tile color="green" v-on:click="save(project)">
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
import path from "path";

interface IAppDialogData {
   showDialogInternal: boolean;
   project: IProject;
   title: string;
}

export default Vue.extend({
   name: "AppDialog",
   props: ["showDialog", "dialogData"],
   data(): IAppDialogData {
      return {
         showDialogInternal: false,
         project: this.dialogData,
         title: `${this.dialogData.category} ${this.dialogData.version}`,
      };
   },
   created() {
      if (!this.project.apps) {
         this.project.apps = [];
      }
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
   methods: {
      cancel() {
         this.$emit("close-AppDialog");
      },
      save() {
         this.$emit("save-AppDialog", this.project);
      },
      openFile() {
         if (!this.project.apps) {
            this.project.apps = [];
         }
         ipcRenderer
            .invoke("show-file-dialog", this.project.path)
            .then(selectedApp => {
               if (selectedApp !== undefined) {
                  if (!this.project.apps.includes(selectedApp[0])) {
                     this.project.apps.push(selectedApp[0]);
                  }
               }
            });
      },
      getAppCaption: function(file: string) {
         let ext = path.extname(file);
         return path.basename(file, ext);
      },
      removeApp: function(data: string) {
         this.project.apps = this.project.apps.filter(value => {
            return value != data;
         });
      },
   },
});
</script>

<style scoped></style>
