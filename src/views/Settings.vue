<template>
   <div class="pa-2">
      <v-row no-gutters>
         <v-col cols="12">
            <AppDialog
               :showDialog="appDialog"
               :dialogData="appDialogData"
               @close-AppDialog="closeAppDialog"
               @save-AppDialog="saveAppDialog"
            />
            <v-dialog
               flat
               tile
               elevation="0"
               v-model="dialog"
               v-if="dialog"
               max-width="600px"
               :retain-focus="false"
            >
               <v-card flat tile>
                  <v-card-title>
                     {{ dialogData.category }}
                     {{ dialogData.version }}
                  </v-card-title>
                  <v-card-text>
                     <v-select
                        :items="categories"
                        label="Kategorie"
                        v-model="dialogData.category"
                     ></v-select>
                     <v-text-field
                        type="number"
                        class="centered-input"
                        v-model="dialogData.version"
                        :prepend-icon="'fal fa-minus'"
                        :append-outer-icon="'fal fa-plus'"
                        @click:append-outer="dialogData.version += 1"
                        @click:prepend="dialogData.version -= 1"
                     ></v-text-field>
                     <v-text-field
                        v-model="dialogData.path"
                        :append-icon="'fal fa-folder-open'"
                        @click:append="changePath(dialogData)"
                     ></v-text-field>
                  </v-card-text>
                  <v-card-actions>
                     <v-spacer></v-spacer>
                     <v-btn text tile color="red" v-on:click="dialog = false">
                        <v-icon left>fal fa-times-circle</v-icon>
                        Abbrechen
                     </v-btn>
                     <v-btn
                        text
                        tile
                        color="green"
                        v-on:click="saveProject(dialogData)"
                     >
                        <v-icon left>fal fa-save</v-icon>
                        Speichern
                     </v-btn>
                  </v-card-actions>
               </v-card>
            </v-dialog>
            <v-simple-table tile dense>
               <thead>
                  <tr>
                     <th width="20%" class="text-left">Kategorie</th>
                     <th width="45%" class="text-left">Pfad</th>
                     <th width="10%" class="text-center">Version</th>
                     <th width="5%" class="text-center">Apps</th>
                     <th width="20%" class="text-center">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="project in projectData" :key="project.id">
                     <td :class="project.category">{{ project.category }}</td>
                     <td>{{ project.path }}</td>
                     <td class="text-center">{{ project.version }}</td>
                     <td class="text-center">
                        <v-btn text tile v-on:click="showAppDialog(project)">
                           <v-icon>fal fa-edit</v-icon>
                        </v-btn>
                     </td>
                     <td class="text-center">
                        <v-btn text tile v-on:click="showDialog(project)">
                           <v-icon>fal fa-edit</v-icon>
                        </v-btn>
                        <v-btn text tile v-on:click="deleteProject(project)">
                           <v-icon>fal fa-trash-alt</v-icon>
                        </v-btn>
                     </td>
                  </tr>
               </tbody>
            </v-simple-table>
         </v-col>
      </v-row>
      <v-row no-gutters>
         <v-col class="text-right">
            <v-btn v-on:click="reloadSettings()" tile>
               <v-icon>fal fa-redo</v-icon>
            </v-btn>
            <v-btn v-on:click="newProject()" tile>
               <v-icon>fal fa-plus</v-icon>
            </v-btn>
         </v-col>
      </v-row>
      <v-row no-gutters>
         <v-col>
            <v-text-field label="Merge Verzeichnis" v-model="mergePath">
               <template v-slot:append>
                  <v-icon :disabled="checkMergePath()" @click="saveMergePath()">
                     fal fa-check
                  </v-icon>
               </template>
            </v-text-field>
         </v-col>
      </v-row>
      <v-row no-gutters>
         <v-col>
            <v-switch
               color="amber"
               label="Icon in Taskbar anzeigen"
               v-model="showIconInTaskbar"
            ></v-switch>
         </v-col>
      </v-row>
   </div>
</template>

<script lang="ts">
import appSettings from "../classes/appSettings";
import { ipcRenderer } from "electron";
import { IProject } from "@/types";
import Vue from "vue";
import path from "path";
import fs from "fs";
import AppDialog from "../components/dialogs/AppDialog.vue";

interface IComponentData {
   projectData: any;
   dialog: boolean;
   dialogData: any;
   categories: Array<string>;
   mergePath: string;
   overlay: boolean;
   overlayColor: string;
   openColor: string;
   allComponentsColor: string;
   showIconInTaskbar: boolean;
   appDialog: boolean;
   appDialogData: IProject;
}
export default Vue.extend({
   components: { AppDialog },
   data(): IComponentData {
      return {
         projectData: [],
         dialog: false,
         dialogData: null,
         categories: ["development", "hotfix", "release", "feature"],
         mergePath: "",
         overlay: false,
         overlayColor: "",
         openColor: "red",
         allComponentsColor: "blue",
         showIconInTaskbar: true,
         appDialog: false,
         appDialogData: {
            id: -1,
            category: "",
            path: "",
            version: 500,
            overlay: false,
            dialog: false,
            apps: [],
         },
      };
   },
   watch: {
      showIconInTaskbar: function(state: boolean) {
         appSettings.set("skipIconInTaskbar", !state);
         ipcRenderer.invoke("setShowIconInTaskbar", state);
      },
   },
   methods: {
      checkMergePath: function(): boolean {
         const setting: any = appSettings.get("settings");
         if (
            setting &&
            setting.mergePath &&
            setting.mergePath === this.mergePath
         ) {
            return true;
         }
         return false;
      },
      saveMergePath: async function(): Promise<void> {
         appSettings.set("settings", { mergePath: this.mergePath });
      },
      reloadSettings: async function(): Promise<void> {
         this.projectData = [];
         const allProjects: any = appSettings.get("projects");
         if (allProjects !== undefined) {
            for (let i: number = 0; i < allProjects.length; ++i) {
               this.projectData.push(allProjects[i]);
            }
         }
         const setting: any = appSettings.get("settings");
         if (setting) {
            if (setting.mergePath) {
               this.mergePath = setting.mergePath;
            }
         }
         const skipIcon: boolean = appSettings.get("skipIconInTaskbar");
         this.showIconInTaskbar = !skipIcon;
      },
      deleteProject: function(project: IProject): void {
         let removeIndex: any = this.projectData
            .map(function(obj: IProject): number {
               return obj.id;
            })
            .indexOf(project.id);
         this.projectData.splice(removeIndex, 1);
         this.saveProjects();
      },
      changePath: function(project: IProject): void {
         ipcRenderer
            .invoke("show-directory-dialog", project.path)
            .then(newPath => {
               if (newPath !== undefined) {
                  project.path = newPath[0];
               }
            });
      },
      saveProject(project: IProject): void {
         let found: boolean = false;
         if (this.projectData !== undefined) {
            for (let i: number = 0; i < this.projectData.length; ++i) {
               if (project.id === this.projectData[i].id) {
                  this.projectData[i] = project;
                  found = true;
               }
            }
         }

         if (!found) {
            const allPath = path.join(project.path, "All.groupproj");
            if (!project.apps.includes(allPath) && fs.existsSync(allPath)) {
               project.apps.push(allPath);
            }
            const allComp = path.join(project.path, "AllComponents.groupproj");
            if (!project.apps.includes(allComp) && fs.existsSync(allComp)) {
               project.apps.push(allComp);
            }
            this.projectData.push(project);
         }
         this.saveProjects();
         this.dialog = false;
      },
      getCategoryForSort: function(project: IProject): string {
         let append: string = "";
         if (project.category === "development") {
            append = "1";
         } else if (project.category === "hotfix") {
            append = "2";
         } else if (project.category === "release") {
            append = "3";
         } else if (project.category === "feature") {
            append = "4";
         }
         return append + project.category;
      },
      sortProjects: function(left: IProject, right: IProject): number {
         const leftCat: string = this.getCategoryForSort(left);
         const rightCat: string = this.getCategoryForSort(right);

         if (leftCat > rightCat) {
            return 1;
         } else if (leftCat < rightCat) {
            return -1;
         } else if (leftCat === rightCat) {
            if (left.version < right.version) {
               return 1;
            } else if (left.version > right.version) {
               return -1;
            }
         }
         return 0;
      },
      saveProjects: function(): void {
         this.projectData.sort(this.sortProjects);
         appSettings.set("projects", this.projectData);
      },
      getEmptyProject: function(): IProject {
         return {
            id: -1,
            category: "",
            path: "",
            version: 500,
            overlay: false,
            dialog: false,
            apps: [],
         };
      },
      showDialog: function(project: IProject): void {
         this.dialogData = this.getEmptyProject();
         this.dialogData = Object.assign(this.dialogData, project);
         this.dialog = true;
      },
      showAppDialog: function(project: IProject): void {
         this.appDialogData = project;
         this.appDialog = true;
      },
      closeAppDialog: function(): void {
         this.appDialog = false;
      },
      saveAppDialog: function(project: IProject): void {
         this.saveProject(project);
         this.appDialog = false;
      },
      newProject: function(): void {
         let idMax: number = 0;
         const allProjects: any = appSettings.get("projects");
         if (allProjects !== undefined) {
            for (let i: number = 0; i < allProjects.length; ++i) {
               if (idMax < allProjects[i].id) {
                  idMax = allProjects[i].id;
               }
            }
         }
         let newId: number = idMax + 1;

         const project: IProject = {
            id: newId,
            category: "",
            path: "",
            version: 500,
            overlay: false,
            dialog: false,
            apps: [],
         };
         this.dialogData = project;
         this.dialog = true;
      },
   },
   created: function(): void {
      this.reloadSettings();
   },
});
</script>

<style>
.development {
   color: rgb(255, 86, 86);
}
.hotfix {
   color: rgb(255, 255, 109);
}
.release {
   color: rgb(74, 74, 255);
}
.feature {
   color: rgb(94, 255, 94);
}
.centered-input input {
   text-align: center;
}
</style>
