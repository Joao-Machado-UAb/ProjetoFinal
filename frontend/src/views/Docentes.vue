<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <div class="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between mb-3">
        <div>
          <h1 class="h4 mb-1">Docentes</h1>
          <div class="text-muted">Lista pública de docentes registados.</div>
        </div>

        <div class="d-flex flex-column flex-sm-row gap-2">
          <div class="input-group" style="min-width: 260px;">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input v-model="q" class="form-control" placeholder="Pesquisar por nome/email..." />
          </div>

          <button class="btn btn-outline-secondary" @click="load" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Recarregar
          </button>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger d-flex align-items-start gap-2" role="alert">
        <i class="bi bi-exclamation-triangle"></i>
        <div>{{ error }}</div>
      </div>

      <!-- SKELETON LOADING -->
      <div v-if="loading" class="mt-2">
        <SkeletonLine width="70%" height="14px" class="mb-2" />
        <SkeletonLine width="55%" height="14px" class="mb-2" />
        <SkeletonLine width="80%" height="14px" class="mb-2" />
        <SkeletonLine width="60%" height="14px" class="mb-2" />
      </div>

      <div v-else>
        <div v-if="filtered.length" class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Nome</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in filtered" :key="d._id">
                <td class="fw-semibold">{{ d.nome }}</td>
                <td class="text-muted">{{ d.email }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="border rounded p-4 bg-light">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-people text-muted fs-4"></i>
            <div>
              <div class="fw-semibold">Sem docentes para mostrar</div>
              <div class="text-muted small">Assim que existirem docentes registados, vão aparecer aqui.</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import SkeletonLine from "../components/SkeletonLine.vue";
import api from "../services/api";

export default {
  name: "Docentes",
  components: { SkeletonLine },
  data() {
    return { docentes: [], q: "", loading: false, error: "" };
  },
  computed: {
    filtered() {
      const q = this.q.trim().toLowerCase();
      if (!q) return this.docentes;
      return this.docentes.filter((d) => (d.nome + " " + d.email).toLowerCase().includes(q));
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      this.loading = true;
      this.error = "";
      try {
        const { data } = await api.get("/docentes");
        this.docentes = data;
      } catch (e) {
        this.error = e?.response?.data?.message || "Erro ao carregar docentes.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
