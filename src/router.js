import { createRouter, createWebHashHistory } from "vue-router";
import Main from "./components/main.vue";
import Register from "./components/register.vue";
import Signin from "./components/signin.vue";
import PetAdoption from "./components/PetAdoption.vue";
import PublishAdoption from "./components/PublishAdoption.vue";
import EditAdoption from "./components/EditAdoption.vue";
import Friends from "./components/Friends.vue";
import Chat from "./components/Chat.vue";
import EditProfile from "./components/EditProfile.vue";
import File from "./components/file.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: Main,
    },
    {
      path: "/register",
      component: Register,
    },
    {
      path: "/signin",
      component: Signin,
    },
    {
      path: "/adoption",
      component: PetAdoption,
    },
    {
      path: "/publish",
      component: PublishAdoption,
    },
    {
      path: "/edit/:id",
      component: EditAdoption,
    },
    {
      path: "/friends",
      component: Friends,
    },
    {
      path: "/chat/:friendId",
      component: Chat,
    },
    {
      path: "/editProfile",
      component: EditProfile,
    },
    {
      path: "/file",
      component: File,
    },
  ],
});

export default router;
