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
         <v-card-title class="headline">
            <v-icon left color="amber">fal fa-home</v-icon>
            Update verfügbar
         </v-card-title>
         <v-card-text>
            <v-row no-gutters>
               <v-col>
                  <v-simple-table dense>
                     <thead>
                        <tr>
                           <th width="90%"></th>
                           <th>Version</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td>Aktuell</td>
                           <td>
                              <h3 class="amber--text">{{ currentVersion }}</h3>
                           </td>
                        </tr>
                        <tr>
                           <td>Verf&uuml;gbar</td>
                           <td>
                              <h3 class="green--text">{{ newVersion }}</h3>
                           </td>
                        </tr>
                     </tbody>
                  </v-simple-table>
               </v-col>
            </v-row>
            <v-row no-gutters>
               <v-col>
                  <v-progress-linear
                     v-model="progress"
                     height="25"
                     color="amber"
                  >
                     <template v-slot:default="{ value }">
                        <strong>{{ Math.ceil(value) }} %</strong>
                     </template>
                  </v-progress-linear>
                  <!-- <v-progress-circular
                     size="100"
                     rotate="-90"
                     width="15"
                     color="amber"
                     :value="progress"
                  >
                     {{ progress }} %
                  </v-progress-circular> -->
               </v-col>
            </v-row>
         </v-card-text>
         <v-card-actions>
            <v-btn text tile color="red" v-on:click="cancel()">
               <v-icon left>fal fa-times-circle</v-icon>
               Schließen
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn text tile color="blue" v-on:click="update()">
               <v-icon left>fal fa-download</v-icon>
               Herunterladen
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
               text
               tile
               color="green"
               v-on:click="install()"
               :disabled="progress !== 100"
            >
               <v-icon left>fal fa-download</v-icon>
               Neustarten
            </v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import Vue from "vue";

interface IUpdateDialogData {
   showDialogInternal: boolean;
   currentVersion: string;
   newVersion: string;
   progress: number;
}

export default Vue.extend({
   name: "UpdateDialog",
   props: ["showDialog", "dialogData"],
   data(): IUpdateDialogData {
      return {
         showDialogInternal: false,
         currentVersion: "",
         newVersion: "",
         progress: 0,
      };
   },
   watch: {
      showDialog: {
         immediate: false,
         deep: true,
         handler(newValue) {
            this.showDialogInternal = newValue;
         },
      },
   },
   methods: {
      update: async function() {
         ipcRenderer.invoke("download-update");
         async function getProgress(all: any) {
            let finished: boolean = false;
            await ipcRenderer
               .invoke("get-download-percent")
               .then((percent: number) => {
                  // all.progress = Math.ceil(percent * 100) / 100;
                  all.progress = percent;
                  console.log(percent);
                  if (percent === 100.0) {
                     finished = true;
                  }
               });
            if (!finished) {
               setTimeout(() => getProgress(all), 2000);
            }
         }
         return new Promise(() => getProgress(this));
      },
      install() {
         ipcRenderer.invoke("install-update");
      },
      cancel() {
         this.$emit("close-Update-Dialog");
      },
   },
   async mounted() {
      await ipcRenderer.invoke("get-current-version").then(version => {
         this.currentVersion = version;
      });

      await ipcRenderer.invoke("get-new-version").then(version => {
         this.newVersion = version;
      });
   },
});
</script>

<style scoped></style>
