<template>
  <div class="row justify-content-center">
    <div class="col-12 col-lg-8 col-xl-7">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <div class="d-flex align-items-center gap-3 mb-3">
            <img
              v-if="docenteEmail"
              :src="avatarUrl"
              class="rounded-circle border"
              style="width: 64px; height: 64px; object-fit: cover;"
              alt="Avatar"
            />
            <div>
              <h1 class="h4 mb-0">Perfil do Docente</h1>
              <div class="text-muted small">Informação do utilizador autenticado.</div>
            </div>
          </div>

          <div class="row g-3 mt-2">
            <div class="col-12 col-md-6">
              <div class="border rounded p-3 bg-light">
                <div class="text-muted small">Nome</div>
                <div class="fw-semibold">{{ docenteNome }}</div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="border rounded p-3 bg-light">
                <div class="text-muted small">Email</div>
                <div class="fw-semibold">{{ docenteEmail }}</div>
              </div>
            </div>

            <div class="col-12">
              <div class="border rounded p-3">
                <div class="fw-semibold mb-2">Avatar</div>
                <div class="text-muted small">
                  Gerado automaticamente via Gravatar (identicon) com base no email.
                </div>
                <div class="mt-3 d-flex gap-2">
                  <a
                    class="btn btn-outline-secondary btn-sm"
                    href="https://gravatar.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i class="bi bi-link-45deg me-1"></i>Gerir Gravatar
                  </a>
                  <button class="btn btn-outline-secondary btn-sm" @click="refresh">
                    <i class="bi bi-arrow-clockwise me-1"></i>Atualizar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end mt-4">
            <router-link class="btn btn-primary" to="/dashboard">
              <i class="bi bi-speedometer2 me-1"></i>Voltar ao Dashboard
            </router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import md5 from "blueimp-md5";

export default {
  name: "Perfil",
  setup() {
    const store = useStore();

    const docente = computed(() => store.getters["auth/docente"]);
    const docenteNome = computed(() => docente.value?.nome || "Docente");
    const docenteEmail = computed(() => (docente.value?.email || "").trim().toLowerCase());

    const avatarUrl = computed(() => {
      if (!docenteEmail.value) return "";
      const hash = md5(docenteEmail.value);
      return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=256`;
    });

    const refresh = () => {
      store.commit("auth/setDocente", { ...docente.value });
    };

    return { docenteNome, docenteEmail, avatarUrl, refresh };
  },
};
</script>
