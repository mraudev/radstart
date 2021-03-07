import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
   {
      path: "/",
      name: "Development",
      component: () => import("../views/Development.vue"),
   },
   {
      path: "/hotfix",
      name: "Hotfix",
      component: () => import("../views/Hotfix.vue"),
   },
   {
      path: "/release",
      name: "Release",
      component: () => import("../views/Release.vue"),
   },
   {
      path: "/feature",
      name: "Feature",
      component: () => import("../views/Feature.vue"),
   },
   {
      path: "/settings",
      name: "Settings",
      component: () => import("../views/Settings.vue"),
   },
   {
      path: "/bender",
      name: "Bender",
      component: () => import("../views/Bender.vue"),
   },
];

const router = new VueRouter({
   routes,
});

export default router;
