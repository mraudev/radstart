<template>
   <v-footer padless app height="50px">
      <v-card width="100%">
         <v-card-actions>
            <v-btn
               tile
               right
               text
               :disabled="checkMergePathDisabled()"
               @click="openMergePath()"
            >
               <v-icon left large :color="$store.getters.mainColor">
                  mdi-alpha-m-box-outline
               </v-icon>
               erge
            </v-btn>
            <v-spacer />
            <v-tooltip :color="updateAvailable ? 'error' : 'success'" top>
               <template v-slot:activator="{ on, attrs }">
                  <v-btn
                     color="error"
                     v-bind="attrs"
                     v-on="on"
                     text
                     tile
                     plain
                     v-if="updateAvailable"
                     v-on:click="showUpdate()"
                  >
                     <v-icon>fal fa-comment-alt-exclamation</v-icon>
                  </v-btn>
                  <v-btn
                     color="success"
                     v-bind="attrs"
                     v-on="on"
                     text
                     tile
                     plain
                     v-else
                  >
                     <v-icon>fal fa-comment-alt-check</v-icon>
                  </v-btn>
               </template>
               <span v-if="updateAvailable">Update verfügbar!</span>
               <span v-else>Die App ist auf dem neuesten Stand</span>
            </v-tooltip>

            <v-spacer />
            <v-btn
               tile
               text
               plain
               :color="$store.getters.mainColor"
               v-on:click="switchTheme()"
            >
               <v-icon>
                  far fa-adjust
               </v-icon>
            </v-btn>
         </v-card-actions>
      </v-card>
   </v-footer>
</template>

<script lang="ts">
import Vue from "vue";
import { exec } from "child_process";
import appSettings from "../../classes/appSettings";
import { ipcRenderer } from "electron";

interface IComponentData {
   mergePath: string;
   updateAvailable: boolean;
}

export default Vue.extend({
   data(): IComponentData {
      return {
         mergePath: "",
         updateAvailable: false,
      };
   },
   methods: {
      switchTheme: function() {
         this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      },
      checkMergePathDisabled: function(): boolean {
         if (this.mergePath) {
            return false;
         }
         return true;
      },
      openMergePath: function(): void {
         exec(`start "" "${this.mergePath}"`).unref();
      },
      showUpdate: function(): void {
         this.$emit("show-Update");
      },
   },
   mounted: function(): void {
      const setting: any = appSettings.get("settings");
      if (setting && setting.mergePath) {
         this.mergePath = setting.mergePath;
      }
   },
   created() {
      ipcRenderer.invoke("check-for-update").then(result => {
         console.log("check-for-update", result);
         this.updateAvailable = result;
      });
   },
});
</script>

<style scoped></style>
