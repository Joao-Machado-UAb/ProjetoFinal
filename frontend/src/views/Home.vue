<template>
  <div class="p-4 p-md-5 rounded-3 bg-white border shadow-sm">
    <div class="row align-items-center g-4">
      <div class="col-12 col-lg-7">
        <h1 class="display-6 fw-semibold mb-2">
          Plataforma de recolha de propostas
        </h1>

        <p class="text-muted mb-4">
          Aplicação Web para docentes do curso submeterem e gerirem propostas de temas de Projeto Final.
          Utilizadores anónimos podem consultar a lista de docentes registados.
        </p>

        <div class="d-flex flex-column flex-sm-row gap-2">
          <router-link class="btn btn-primary" to="/docentes">
            <i class="bi bi-people me-1"></i>Ver Docentes
          </router-link>

          <router-link v-if="!isAuth" class="btn btn-outline-secondary" to="/login">
            <i class="bi bi-box-arrow-in-right me-1"></i>Entrar
          </router-link>

          <router-link v-else class="btn btn-outline-secondary" to="/dashboard">
            <i class="bi bi-speedometer2 me-1"></i>Minhas Propostas
          </router-link>
        </div>

        <div class="mt-4 small text-muted">
          <i class="bi bi-info-circle me-1"></i>
          Docentes autenticados: criar/editar/apagar as suas propostas.
        </div>
      </div>

      <div class="col-12 col-lg-5">
        <div class="border rounded-3 bg-light p-4">
          <div class="d-flex align-items-center gap-3 mb-3">
            <i class="bi bi-journal-text fs-3 text-muted"></i>
            <div>
              <div class="fw-semibold">Funcionalidades</div>
              <div class="text-muted small">Protótipo demonstrador</div>
            </div>
          </div>

          <ul class="list-unstyled mb-0">
            <li class="d-flex gap-2 mb-2">
              <i class="bi bi-check2-circle text-muted"></i>
              <span>Lista pública de docentes</span>
            </li>
            <li class="d-flex gap-2 mb-2">
              <i class="bi bi-check2-circle text-muted"></i>
              <span>Login docente (JWT)</span>
            </li>
            <li class="d-flex gap-2 mb-2">
              <i class="bi bi-check2-circle text-muted"></i>
              <span>CRUD de propostas do docente</span>
            </li>
            <li class="d-flex gap-2">
              <i class="bi bi-check2-circle text-muted"></i>
              <span>Formulários intuitivos</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "Home",
  setup() {
    const store = useStore();
    const isAuth = computed(() => store.getters["auth/isAuthenticated"]);
    return { isAuth };
  },
};
</script>
