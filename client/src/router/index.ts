import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import BlokusPage from "@/views/BlokusPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/blokus",
      name: "blokus",
      component: BlokusPage,
    },
  ],
});

export default router;
