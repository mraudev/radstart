<template>
   <projectPage :projectType="projectType"></projectPage>
</template>

<script lang="ts">
import ProjectPage from "../components/ProjectPage.vue";
export default {
   components: {
      ProjectPage,
   },
   data: () => ({
      projectType: "release",
   }),
};
</script>

<style></style>
