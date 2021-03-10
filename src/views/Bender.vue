<template>
   <!-- <v-container fluid fill-height> -->
   <v-row no-gutters style="height: 100%">
      <v-col>
         <iframe
            width="100%"
            class="pa-0 ma-0"
            id="benderframe"
            fill-height
            src="http://bender.crossbase.net"
            frameborder="0"
         ></iframe>
      </v-col>
   </v-row>
   <!-- </v-container> -->
</template>

<script lang="ts">
export default {};
</script>

<style scoped>
#benderframe {
   height: calc(100%) !important;
}
#maincontainer {
   overflow: hidden imp !important;
}
</style>
