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
            <ProjectDialog
               :showDialog="projectDialog"
               :dialogData="projectDialogData"
               @close-ProjectDialog="closeProjectDialog"
               @save-ProjectDialog="saveProject"
            />
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
                        <v-btn
                           text
                           tile
                           v-on:click="showProjectDialog(project)"
                        >
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
            <v-card>
               <v-card-title>Ansicht</v-card-title>
               <v-card-text>
                  <v-switch
                     color="amber"
                     label="Icon in Taskbar anzeigen"
                     v-model="showIconInTaskbar"
                     :disabled="!showIconInTray"
                  />
                  <v-switch
                     color="amber"
                     label="Icon in Tray anzeigen"
                     v-model="showIconInTray"
                  />
               </v-card-text>
            </v-card>
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
import ProjectDialog from "@/components/dialogs/ProjectDialog.vue";

interface IComponentData {
   projectData: any;
   mergePath: string;
   overlay: boolean;
   overlayColor: string;
   openColor: string;
   allComponentsColor: string;
   showIconInTaskbar: boolean;
   showIconInTray: boolean;
   appDialog: boolean;
   appDialogData: IProject;
   projectDialog: boolean;
   projectDialogData: IProject;
}
export default Vue.extend({
   components: { AppDialog, ProjectDialog },
   data(): IComponentData {
      return {
         projectData: [],
         mergePath: "",
         overlay: false,
         overlayColor: "",
         openColor: "red",
         allComponentsColor: "blue",
         showIconInTaskbar: true,
         showIconInTray: true,
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
         projectDialog: false,
         projectDialogData: {
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
      showIconInTray: function(state: boolean) {
         if (!state && !this.showIconInTaskbar) {
            this.showIconInTaskbar = true;
         }
         appSettings.set("showIconInTray", state);
         ipcRenderer.invoke("setShowIconInTray", state);
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

         const showTray: boolean = appSettings.get("showIconInTray");
         this.showIconInTray = showTray;
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
         this.projectDialog = false;
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
      showProjectDialog: function(project: IProject): void {
         // this.dialogData = this.getEmptyProject();
         this.projectDialogData = Object.assign(
            this.projectDialogData,
            project,
         );
         this.projectDialog = true;
      },
      closeProjectDialog: function(): void {
         this.projectDialog = false;
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
         this.projectDialogData = project;
         this.projectDialog = true;
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
