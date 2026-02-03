<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <div class="container">
      <!-- vai para dashboard se autenticado, senão vai para home -->
      <router-link class="navbar-brand fw-semibold" :to="isAuth ? '/dashboard' : '/'">
        <i class="bi bi-mortarboard-fill me-2"></i>Propostas de Projeto
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#nav"
        aria-controls="nav"
        aria-expanded="false"
        aria-label="Menu"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav me-auto mt-2 mt-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/docentes" active-class="active">Docentes</router-link>
          </li>
        </ul>

        <!-- Mobile -->
        <div class="d-grid d-lg-flex gap-2 mt-3 mt-lg-0">
          <router-link
            v-if="!isAuth"
            class="btn btn-outline-light btn-sm d-inline-flex align-items-center justify-content-center"
            to="/login"
          >
            <i class="bi bi-box-arrow-in-right me-1"></i>Entrar
          </router-link>

          <div v-else class="dropdown">
            <button
              class="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center gap-2"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                v-if="docenteEmail"
                :src="avatarUrl"
                class="rounded-circle border"
                style="width: 28px; height: 28px; object-fit: cover;"
                alt="Avatar"
              />
              <span class="d-none d-md-inline">{{ docenteNome }}</span>
              <span class="d-inline d-md-none">Conta</span>
            </button>

            <ul class="dropdown-menu dropdown-menu-end">
              <li class="px-3 py-2 small text-muted" v-if="docenteEmail">
                {{ docenteEmail }}
              </li>
              <li v-if="docenteEmail"><hr class="dropdown-divider" /></li>

              <li>
                <router-link class="dropdown-item" to="/perfil">
                  <i class="bi bi-person-circle me-2"></i>Perfil
                </router-link>
              </li>

              <li><hr class="dropdown-divider" /></li>

              <li>
                <button class="dropdown-item text-danger" @click="logout">
                  <i class="bi bi-box-arrow-right me-2"></i>Sair
                </button>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import md5 from "blueimp-md5";

export default {
  name: "AppNavbar",
  setup() {
    const store = useStore();

    const isAuth = computed(() => store.getters["auth/isAuthenticated"]);
    const docente = computed(() => store.getters["auth/docente"]);

    const docenteNome = computed(() => docente.value?.nome || "Docente");
    const docenteEmail = computed(() => (docente.value?.email || "").trim().toLowerCase());

    const avatarUrl = computed(() => {
      if (!docenteEmail.value) return "";
      const hash = md5(docenteEmail.value);
      return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=128`;
    });

    const logout = () => {
      store.dispatch("auth/logout");
      window.location.hash = "#/login";
    };

    return { isAuth, docenteNome, docenteEmail, avatarUrl, logout };
  },
};
</script>
