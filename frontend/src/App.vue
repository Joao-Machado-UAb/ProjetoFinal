<template>
  <div class="app-shell d-flex flex-column min-vh-100">
    <AppNavbar />
    <ToastHost />

    <main class="bg-light flex-grow-1">
      <div class="container py-3 py-md-4">
        <router-view />
      </div>
    </main>

    <footer class="border-top bg-dark text-white">
      <div class="container py-3 small d-flex flex-column flex-md-row gap-1 justify-content-between">
        <span>Plataforma de Propostas — Projeto Final de PWA</span>
        <span>João Machado - 1300213</span>
      </div>
    </footer>
  </div>
</template>

<script>
import AppNavbar from "@/components/AppNavbar.vue";
import ToastHost from "@/components/ToastHost.vue";

export default {
  name: "App",
  components: { AppNavbar, ToastHost },
};
</script>

<style>
html, body, #app {
  height: 100%;
}

@media (max-width: 576px) {
  footer .container {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
}
</style>

