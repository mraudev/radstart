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
               <v-icon left large color="amber darken-1">
                  mdi-alpha-m-box-outline
               </v-icon>
               erge
            </v-btn>
            <v-spacer />
            <v-tooltip color="error" top v-if="updateAvailable">
               <template v-slot:activator="{ on, attrs }">
                  <v-btn color="error" v-bind="attrs" v-on="on" text tile>
                     <v-icon>fal fa-comment-alt-exclamation</v-icon>
                  </v-btn>
               </template>
               <span>Update verfügbar!</span>
            </v-tooltip>
            <v-tooltip color="success" top v-else>
               <template v-slot:activator="{ on, attrs }">
                  <v-icon color="success" v-bind="attrs" v-on="on" text tile>
                     fal fa-comment-alt-check
                  </v-icon>
               </template>
               <span>Die App ist auf dem neuesten Stand</span>
            </v-tooltip>
            <v-spacer />
            <v-btn tile text color="amber" v-on:click="switchTheme()">
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

interface IComponentData {
   mergePath: string;
}

export default Vue.extend({
   props: {
      updateAvailable: {
         type: Boolean,
         default: false,
      },
   },
   data(): IComponentData {
      return {
         mergePath: "",
      };
   },
   watch: {
      updateAvilable: {
         immediate: false,
         deep: true,
         handler(newValue) {
            if (newValue) {
               console.log(newValue);
            }
         },
      },
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
   },
   mounted: function(): void {
      const setting: any = appSettings.get("settings");
      if (setting && setting.mergePath) {
         this.mergePath = setting.mergePath;
      }
   },
});
</script>

<style scoped></style>
