import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

import Home from "../views/Home.vue";
import Docentes from "../views/Docentes.vue";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import PropostaNova from "../views/PropostaNova.vue";
import PropostaEditar from "../views/PropostaEditar.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/docentes", name: "Docentes", component: Docentes },
  { path: "/login", name: "Login", component: Login },
  { path: "/dashboard", name: "Dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/propostas/nova", name: "PropostaNova", component: PropostaNova, meta: { requiresAuth: true } },
  { path: "/propostas/:id/editar", name: "PropostaEditar", component: PropostaEditar, meta: { requiresAuth: true } },
  { path: "/perfil", name: "Perfil", component: () => import("../views/Perfil.vue"), meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const isAuth = store.getters["auth/isAuthenticated"];

  // Se estiver autenticado e tentar ir à Home, envia para Minhas Propostas
  if (to.path === "/" && isAuth) {
    return { path: "/dashboard" };
  }

  // Proteção de rotas privadas
  if (to.meta.requiresAuth && !isAuth) {
    return { path: "/login", query: { next: to.fullPath } };
  }

  // Se já estiver autenticado, não vai ao login
  if (to.path === "/login" && isAuth) {
    return { path: "/dashboard" };
  }
});

export default router;
