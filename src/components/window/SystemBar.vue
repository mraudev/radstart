<template>
   <v-system-bar window app class="draggable pr-0" color="primary">
      <div class="topdiv"></div>
      <img src="icon.png" height="20px" width="20px" class="mr-3" />
      <span>{{ wintitle }}</span>
      <v-spacer></v-spacer>
      <v-btn tile text class="appButton nondraggable px-0" @click="minimize()">
         <v-icon class="mr-0">fal fa-window-minimize</v-icon>
      </v-btn>
      <v-btn text tile class="appButton nondraggable px-0" @click="maximize()">
         <v-icon class="mr-0">{{ `${maxIcon}` }}</v-icon>
      </v-btn>
      <v-btn
         tile
         class="appButton nondraggable px-0"
         color="red darken-5"
         @click="close()"
      >
         <v-icon class="mr-0">fal fa-times</v-icon>
      </v-btn>
   </v-system-bar>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import Vue from "vue";

interface IComponentData {
   wintitle: string;
   maxIcon: string;
   appIconPath: string;
   hasUpdate: boolean;
}

export default Vue.extend({
   name: "SystemBar",
   data(): IComponentData {
      return {
         wintitle: "",
         maxIcon: "fal fa-window-maximize",
         appIconPath: "",
         hasUpdate: false,
      };
   },
   methods: {
      close: () => {
         ipcRenderer.invoke("close-window");
      },
      maximize: function(): void {
         ipcRenderer.invoke("maximize-window");
      },
      setMaximizeIcon: async function(): Promise<void> {
         await ipcRenderer.invoke("get-window-maximized").then(result => {
            let ico: string = "fal fa-window-maximize";
            if (result) {
               ico = "fal fa-window-restore";
            }
            this.maxIcon = ico;
         });
      },
      minimize: (): void => {
         ipcRenderer.invoke("minimize-window");
      },
   },
   mounted() {
      ipcRenderer.invoke("get-window-title").then(result => {
         this.wintitle = result;
      });
      ipcRenderer.invoke("get-window-icon").then(result => {
         this.appIconPath = result;
      });
      this.setMaximizeIcon();
   },
   created(): void {
      window.addEventListener("resize", this.setMaximizeIcon);
   },
   destroyed(): void {
      window.removeEventListener("resize", this.setMaximizeIcon);
   },
});
</script>

<style scoped>
.draggable {
   -webkit-app-region: drag;
}
.nondraggable {
   -webkit-app-region: no-drag;
}
.appButton {
   min-width: 40px !important;
}

.topdiv {
   height: 5px;
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   background-color: #00000000;
   z-index: 99;
   -webkit-app-region: no-drag;
}

.background-gradient {
   background: linear-gradient(to right, #101010, #050505);
}
</style>
