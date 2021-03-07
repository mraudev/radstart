<template>
   <div>
      <v-row no-gutters>
         <v-col class="pa-2">
            <v-btn
               block
               tile
               color="amber darken-2"
               v-on:click="fetch(project)"
            >
               <v-icon left>mdi-download-multiple</v-icon>Fetch
            </v-btn>
         </v-col>
         <v-col class="pa-2">
            <v-btn block tile color="amber darken-2" v-on:click="mod(project)">
               <v-icon left>mdi-clipboard-check</v-icon>Mod
            </v-btn>
         </v-col>
         <v-col class="pa-2">
            <v-btn block tile color="amber darken-2" v-on:click="log(project)">
               <v-icon left>mdi-format-align-justify</v-icon>Log
            </v-btn>
         </v-col>
         <v-col class="pa-2">
            <v-btn block tile color="amber darken-2" v-on:click="push(project)">
               <v-icon left>mdi-upload-multiple</v-icon>Push
            </v-btn>
         </v-col>
         <!-- </v-row>
      <v-row v-if="project.category === 'hotfix'" no-gutters> -->
         <v-col class="pa-2" cols="12" v-if="project.category === 'hotfix'">
            <v-btn
               block
               tile
               color="amber darken-2"
               v-on:click="merge(project)"
               :disabled="getMergeDisabled()"
            >
               <v-icon left>mdi-merge</v-icon>&nbsp;Merge
            </v-btn>
         </v-col>
      </v-row>
      <v-dialog
         :persistent="!overlayCanClose"
         v-model="project.overlay"
         scrollable
         max-width="90%"
         flat
         elevation="0"
      >
         <v-card flat tile>
            <v-card-title>{{ overlaytitle }}</v-card-title>
            <v-divider></v-divider>
            <v-card-text
               style="height: 50vh"
               class="pa-0"
               :id="'dialog_' + project.id"
            >
               <template v-for="om in overlaymessage">
                  <v-alert
                     v-if="om.type === 'err'"
                     type="error"
                     tile
                     :key="om.id"
                     dense
                     >{{ om.message }}</v-alert
                  >
                  <v-alert
                     v-else
                     tile
                     flat
                     dense
                     :key="om.id"
                     colored-border
                     border="left"
                     elevation="2"
                     :color="om.color"
                     class="mb-0 output"
                  >
                     <span v-html="om.message"></span>
                  </v-alert>
               </template>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
               <v-btn
                  color="green darken-2"
                  text
                  tile
                  @click="mod(project)"
                  :disabled="getModOverlayDisabled()"
               >
                  <v-icon>mdi-clipboard-check</v-icon>
                  Check for modifikations
               </v-btn>
               <v-spacer></v-spacer>
               <v-btn
                  color="amber darken-2"
                  text
                  tile
                  @click="closeDialog(project)"
                  :disabled="!overlayCanClose"
               >
                  <v-icon>mdi-check</v-icon>
                  Ok
               </v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </div>
</template>

<script lang="ts">
import appSettings from "../classes/appSettings";
import { spawn, ChildProcess } from "child_process";
import Vue from "vue";

import { IReplaceColor, IProject, IOverlayMessage } from "../types";
import path from "path";
interface IComponentData {
   overlaytitle: string;
   overlaymessage: IOverlayMessage[];
   overlaytext: string;
   overlayerror: string;
   overlayCanClose: boolean;
   mergeActive: boolean;
}
// const Git = require("nodegit");
export default Vue.extend({
   name: "project-git-actions",
   props: ["project"],
   components: {},
   data(): IComponentData {
      return {
         overlaytitle: "",
         overlaymessage: [],
         overlaytext: "",
         overlayerror: "",
         overlayCanClose: false,
         mergeActive: false,
      };
   },
   computed: {
      overlay: function() {
         return this.project.overlay;
      },
   },
   watch: {
      overlay: function(val) {
         if (!val) {
            this.mergeActive = false;
         }
      },
   },
   updated: function(): void {
      if (this.project.overlay) {
         let dialogText: any = document.getElementById(
            "dialog_" + this.project.id,
         );
         if (dialogText) {
            dialogText.scrollTop = dialogText.scrollHeight;
         }
      }
   },
   methods: {
      closeDialog: function(project: IProject): void {
         project.overlay = false;
         this.overlayCanClose = true;
         this.mergeActive = false;
      },
      getMergeDisabled: function(): boolean {
         return this.getMergePath() === "";
      },
      getModOverlayDisabled: function(): boolean {
         if (this.overlayCanClose) {
            if (!this.mergeActive || this.getMergePath() !== "") {
               return false;
            }
         }
         return true;
      },
      fetch: function(project: IProject): void {
         this.callGitAction(
            project,
            "git fetch --progress && git rebase --rebase-merges --autostash",
            "fetch",
            "amber",
         );
      },
      push: function(project: IProject): void {
         this.callGitAction(
            project,
            "git fetch --progress && git rebase --rebase-merges --autostash && git push --porcelain --progress",
            "push",
            "red",
         );
      },
      getMergePath: function(): string {
         const setting: any = appSettings.get("settings");
         if (setting && setting.mergePath) {
            return setting.mergePath;
         }
         return "";
      },
      merge: function(project: IProject): void {
         const mergePath = this.getMergePath();
         if (mergePath !== "") {
            this.mergeActive = true;
            var command: string = `"${path.join(mergePath, "merge.sh")}"`;
            var args: Array<string> = [`"${project.version}"`];

            var childProcess: ChildProcess = spawn(command, args, {
               cwd: mergePath,
               env: process.env,
               stdio: ["ignore", "pipe", "pipe"],
               shell: "C:\\Program Files\\Git\\bin\\bash.exe",
            });

            this.overlayCanClose = false;
            this.overlaytitle = "merge";
            project.overlay = true;
            this.overlaymessage = [];
            let id: number = 1;
            const color: string = "green";
            childProcess.stdout?.on("data", data => {
               this.overlaymessage.push({
                  id: ++id,
                  type: "out",
                  message: this.formatoutput(data),
                  color: color,
               });
            });
            childProcess.stderr?.on("data", data => {
               this.overlaymessage.push({
                  id: ++id,
                  type: "out",
                  message: this.formatoutput(data),
                  color: color,
               });
            });
            childProcess.on("close", code => {
               console.log(`closed with code ${code}`);
               this.overlaymessage.push({
                  id: ++id,
                  type: "out",
                  message: `<span style="color: gray;">ENDE</span>`,
                  color: color,
               });
               this.overlayCanClose = true;
            });
         }
      },
      getCols: function(): number {
         if (this.project.category === "hotfix") {
            return 4;
         }
         return 6;
      },
      callGitAction: function(
         project: IProject,
         action: string,
         title: string,
         color: string,
      ): void {
         var command: string = `"C:\\Program Files\\Git\\bin\\sh.exe"`;
         var args: Array<string> = [
            "-c",
            `"cd '${project.path}' && ${action}"`,
         ];

         var childProcess: ChildProcess = spawn(command, args, {
            cwd: process.cwd(),
            env: process.env,
            stdio: ["pipe", "pipe", "pipe"],
            shell: true,
         });

         this.overlayCanClose = false;
         this.overlaytitle = title;
         project.overlay = true;
         this.overlaymessage = [];
         let id: number = 1;
         if (childProcess) {
            childProcess.stdout?.on("data", data => {
               this.overlaymessage.push({
                  id: ++id,
                  type: "out",
                  message: this.formatoutput(data),
                  color: color,
               });
            });
            childProcess.stderr?.on("data", data => {
               this.overlaymessage.push({
                  id: ++id,
                  type: "out",
                  message: this.formatoutput(data),
                  color: color,
               });
            });
            childProcess.on("close", code => {
               console.log(`closed with code ${code}`);
               this.overlaymessage.push({
                  id: ++id,
                  type: "out",
                  message: `<span style="color: gray;">ENDE</span>`,
                  color: color,
               });
               this.overlayCanClose = true;
            });
         }
      },
      formatoutput: function(out: string): string {
         let replaceArray: Array<IReplaceColor> = [
            { searchString: "modified", color: "red" },
            { searchString: "up to date", color: "green" },
            { searchString: "Done", color: "green" },
            { searchString: "success", color: "green" },
            { searchString: "Applied autostash", color: "orange" },
            { searchString: "NEW", color: "green" },
            { searchString: "MODIFIED", color: "orange" },
            { searchString: "DELETED", color: "red" },
            { searchString: "CONFLICT", color: "red" },
            { searchString: "failed", color: "red" },
            { searchString: "+", color: "green" },
            { searchString: "-", color: "red" },
            { searchString: "autostash", color: "orange" },
            { searchString: "Could not", color: "red" },
         ];
         let output: string = this.colorizeOutputByArray(
            out,
            replaceArray,
         ).toString();
         output = this.formatDefaults(output);
         return output;
      },
      formatDefaults: function(output: string): string {
         output = output
            .toString()
            .replace(`[5;104;97m`, `<span style="color: amber;">`);
         output = output.toString().replace(`[49;33m`, `</span>`);
         output = output.toString().replace(`[0m`, ``);
         output = output
            .toString()
            .replace(
               `[KSuccessfully`,
               `<span style="color: green;">Successfully</span>`,
            );
         return output;
      },
      colorizeOutputByArray: function(
         output: string,
         arr: Array<IReplaceColor>,
      ): string {
         let ret: string = output;
         for (let i: number = 0; i < arr.length; i++) {
            ret = this.colorizeOutput(ret, arr[i].searchString, arr[i].color);
         }
         return ret;
      },
      colorizeOutput: function(
         output: string,
         searchString: string,
         color: string,
      ): string {
         if (output.includes(searchString)) {
            output = output
               .toString()
               .replace(
                  new RegExp(searchString, "gi"),
                  `<span style="color:${color};">${searchString}</span>`,
               );
         }
         return output;
      },
      mod: function(project: IProject): void {
         var command: string = `"C:\\Program Files\\TortoiseGit\\bin\\TortoiseGitProc.exe"`;
         var args: Array<string> = ["/command:repostatus"];
         let modePath = project.path;
         if (this.mergeActive) {
            const mergePath = this.getMergePath();
            if (mergePath !== "") {
               modePath = path.join(mergePath, "polycode_to_merge");
            }
         }
         args.push(`/path:"${modePath}"`);

         spawn(command, args, {
            cwd: process.cwd(),
            env: process.env,
            stdio: "pipe",
            // encoding: "utf-8",
            shell: true,
         });
      },
      log: function(project: IProject): void {
         var command: string = `"C:\\Program Files\\TortoiseGit\\bin\\TortoiseGitProc.exe"`;
         var args: Array<string> = ["/command:log", `/path:"${project.path}"`];

         spawn(command, args, {
            cwd: process.cwd(),
            env: process.env,
            stdio: "pipe",
            // encoding: "utf-8",
            shell: true,
         });
      },
   },
});
</script>

<style>
.output {
   white-space: pre-wrap;
}
</style>
