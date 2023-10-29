import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.md")
    },
    {
      path: "/sandbox",
      name: "sandbox",
      component: () => import("@/views/Sandbox.vue"),
      children: [
        {
          path: "",
          name: "sandbox-spawn",
          component: () => import("@/views/sandbox/SandboxSpawn.vue")
        },
        {
          path: "settings",
          name: "sandbox-settings",
          component: () => import("@/views/sandbox/SandboxSettings.vue")
        }
      ]
    }
  ]
});