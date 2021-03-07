<template>
   <v-app v-cloak>
      <SystemBar />

      <AppBar />

      <v-main app class="background-gradient" v-on:keyup="handleKey">
         <v-container fluid id="mainContainer" class="pa-1">
            <router-view></router-view>
         </v-container>
      </v-main>

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
                  <!-- <v-icon left>mdi-folder-open</v-icon> Merge -->
                  <v-icon left large color="amber darken-1">
                     mdi-alpha-m-box-outline </v-icon
                  >erge
               </v-btn>
            </v-card-actions>
         </v-card>
      </v-footer>
   </v-app>
</template>

<script lang="ts">
import SystemBar from "./components/window/SystemBar.vue";
import AppBar from "./components/window/AppBar.vue";
import { exec } from "child_process";
import appSettings from "./classes/appSettings";
import Vue from "vue";
import router from "./router";
import store from "./store";
interface IComponentData {
   mergePath: string;
}
export default Vue.extend({
   name: "App",

   components: { SystemBar, AppBar },

   data: (): IComponentData => ({
      mergePath: "",
   }),
   methods: {
      checkMergePathDisabled: function(): boolean {
         if (this.mergePath) {
            return false;
         }
         return true;
      },
      openMergePath: function(): void {
         exec(`start "" "${this.mergePath}"`).unref();
      },
      setKeyHandler: function(): void {
         document.addEventListener("keypress", this.handleKey);
      },
      handleKey: function(key: any): void {
         if (store.state.appKeyPressEnabled) {
            if (key.code === "KeyD") {
               this.routeTo("Development");
            } else if (key.code === "KeyH") {
               this.routeTo("Hotfix");
            } else if (key.code === "KeyR") {
               this.routeTo("Release");
            } else if (key.code === "KeyF") {
               this.routeTo("Feature");
            } else if (key.code === "KeyB") {
               this.routeTo("Bender");
            } else if (key.code === "KeyE") {
               this.routeTo("Settings");
            } else if (key.code === "KeyM") {
               if (!this.checkMergePathDisabled()) {
                  this.openMergePath();
               }
            }
         }
      },
      routeTo: function(routeName: string): void {
         if (router.currentRoute.name !== routeName) {
            router.push({ name: routeName });
         }
      },
   },
   mounted: function(): void {
      const setting: any = appSettings.get("settings");
      if (setting && setting.mergePath) {
         this.mergePath = setting.mergePath;
      }
   },
   created(): void {
      this.setKeyHandler();
      // this.$router.push("/");
   },
   destroyed(): void {
      document.removeEventListener("keypress", this.handleKey);
   },
});
</script>

<style>
html,
body {
   overflow: hidden !important;
}
main.v-main {
   width: 100vw !important;
   height: calc(100vh - 64px - 500px) !important;
   flex-direction: column !important;
   margin-top: 96px !important;
   margin-bottom: 50px !important;
   padding-top: 0 !important;
   padding-bottom: 0 !important;
}
::-webkit-scrollbar {
   width: 15px;
}

::-webkit-scrollbar-track {
   background: #202020;
   border-left: 1px solid #2c2c2c;
}

::-webkit-scrollbar-thumb {
   background: #3e3e3e;
   border: solid 3px #202020;
}

::-webkit-scrollbar-thumb:hover {
   background: #303030;
}

#mainContainer {
   overflow: auto !important;
}
</style>
