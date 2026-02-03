<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <!-- Cabeçalho -->
      <div class="d-flex flex-column flex-lg-row gap-3 justify-content-between mb-3">
        <div>
          <h1 class="h4 mb-1">Minhas Propostas</h1>
          <div class="text-muted">
            Propostas do docente <span class="fw-semibold">{{ docenteNome }}</span>.
          </div>
        </div>

        <div class="d-flex flex-column flex-sm-row gap-2">
          <div class="input-group" style="min-width: 240px;">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input
              v-model="q"
              class="form-control"
              placeholder="Pesquisar por título/palavras-chave..."
            />
          </div>

          <router-link class="btn btn-primary d-inline-flex align-items-center" to="/propostas/nova">
            <i class="bi bi-plus-circle me-1"></i>Nova Proposta
          </router-link>
        </div>
      </div>

      <!-- Erro -->
      <div v-if="error" class="alert alert-danger d-flex gap-2">
        <i class="bi bi-exclamation-triangle"></i>
        <span>{{ error }}</span>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-muted d-flex align-items-center gap-2">
        <span class="spinner-border spinner-border-sm"></span>
        A carregar propostas…
      </div>

      <!-- Lista -->
      <div v-else>
        <div v-if="filtered.length === 0" class="border rounded p-4 bg-light">
          <div class="d-flex gap-3 align-items-center">
            <i class="bi bi-journal-text fs-3 text-muted"></i>
            <div class="flex-grow-1">
              <div class="fw-semibold">Ainda não tens propostas</div>
              <div class="text-muted small">
                Cria a tua primeira proposta para começares.
              </div>
            </div>
            <router-link class="btn btn-primary btn-sm" to="/propostas/nova">
              <i class="bi bi-plus-circle me-1"></i>Criar
            </router-link>
          </div>
        </div>

        <div v-else class="row g-3">
          <div v-for="p in filtered" :key="p._id" class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <!-- Título + ações -->
                <div class="d-flex flex-column flex-md-row justify-content-between gap-2">
                  <div>
                    <h2 class="h6 mb-1">{{ p.titulo }}</h2>
                    <div class="text-muted small">
                      <i class="bi bi-clock me-1"></i>
                      Atualizado: {{ formatDate(p.updatedAt) }}
                    </div>
                  </div>

                  <div class="d-flex gap-2">
                    <!-- Desktop -->
                    <router-link
                      class="btn btn-outline-secondary btn-sm d-none d-sm-inline-flex align-items-center"
                      :to="`/propostas/${p._id}/editar`"
                    >
                      <i class="bi bi-pencil-square me-1"></i>Editar
                    </router-link>

                    <button
                      class="btn btn-outline-danger btn-sm d-none d-sm-inline-flex align-items-center"
                      @click="remove(p)"
                      :disabled="busyId === p._id"
                    >
                      <span v-if="busyId === p._id" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else class="bi bi-trash me-1"></i>
                      Apagar
                    </button>

                    <!-- Mobile -->
                    <router-link
                      class="btn btn-outline-secondary btn-sm d-inline-flex d-sm-none icon-btn"
                      :to="`/propostas/${p._id}/editar`"
                      title="Editar"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </router-link>

                    <button
                      class="btn btn-outline-danger btn-sm d-inline-flex d-sm-none icon-btn"
                      @click="remove(p)"
                      :disabled="busyId === p._id"
                      title="Apagar"
                    >
                      <span v-if="busyId === p._id" class="spinner-border spinner-border-sm"></span>
                      <i v-else class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>

                <!-- Pessoas -->
                <div class="mt-3 row g-2 small">
                  <div class="col-12 col-lg-4">
                    <div class="text-muted">Orientador</div>
                    <div class="fw-semibold">
                      <i class="bi bi-person-badge me-1"></i>
                      {{ p.orientadorId?.nome || "—" }}
                    </div>
                  </div>

                  <div class="col-12 col-lg-4">
                    <div class="text-muted">Coorientadores</div>
                    <div v-if="p.coorientadorIds?.length" class="d-flex flex-wrap gap-1">
                      <span
                        v-for="d in p.coorientadorIds"
                        :key="d._id || d"
                        class="badge rounded-pill text-bg-light border chip"
                      >
                        {{ d.nome || d }}
                      </span>
                    </div>
                    <div v-else class="text-muted">—</div>
                  </div>

                  <div class="col-12 col-lg-4">
                    <div class="text-muted">Alunos</div>
                    <div v-if="p.alunoIds?.length" class="d-flex flex-wrap gap-1">
                      <span
                        v-for="a in p.alunoIds"
                        :key="a._id || a"
                        class="badge rounded-pill text-bg-light border chip"
                      >
                        {{ a.nome ? `${a.nome} — Nº ${a.numero}` : a }}
                      </span>
                    </div>
                    <div v-else class="text-muted">—</div>
                  </div>
                </div>

                <!-- Descrição -->
                <div class="mt-3">
                  <div class="text-muted small mb-1">Descrição e objetivos</div>
                  <div
                    class="small"
                    :class="expanded[p._id] ? 'desc-full' : 'desc-clamp'"
                    style="white-space: pre-wrap;"
                  >
                    {{ p.descricaoObjetivos || "—" }}
                  </div>

                  <button
                    v-if="(p.descricaoObjetivos || '').length > 220"
                    class="btn btn-link btn-sm px-0 mt-1"
                    @click="toggle(p._id)"
                  >
                    {{ expanded[p._id] ? "Ver menos" : "Ver mais" }}
                  </button>
                </div>

                <!-- Palavras-chave -->
                <div v-if="p.palavrasChave?.length" class="mt-3 d-flex flex-wrap gap-1">
                  <span
                    v-for="k in p.palavrasChave"
                    :key="k"
                    class="badge rounded-pill text-bg-light border chip"
                  >
                    {{ k }}
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import api from "../services/api";
import toast from "../services/toastStore";

export default {
  name: "Dashboard",
  data() {
    return {
      propostas: [],
      q: "",
      loading: false,
      error: "",
      busyId: "",
      expanded: {},
    };
  },
  computed: {
    docenteNome() {
      return this.$store.getters["auth/docente"]?.nome || "—";
    },
    filtered() {
      const q = this.q.trim().toLowerCase();
      if (!q) return this.propostas;
      return this.propostas.filter((p) =>
        `${p.titulo} ${(p.palavrasChave || []).join(" ")}`.toLowerCase().includes(q)
      );
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    toggle(id) {
      this.expanded = { ...this.expanded, [id]: !this.expanded[id] };
    },
    formatDate(d) {
      return new Date(d).toLocaleString("pt-PT");
    },
    async load() {
      this.loading = true;
      try {
        const { data } = await api.get("/propostas/minhas");
        this.propostas = data || [];
      } catch (e) {
        this.error = "Erro ao carregar propostas.";
      } finally {
        this.loading = false;
      }
    },
    async remove(p) {
      if (!confirm(`Apagar a proposta "${p.titulo}"?`)) return;
      this.busyId = p._id;
      try {
        await api.delete(`/propostas/${p._id}`);
        toast.success("Proposta apagada.");
        await this.load();
      } catch {
        toast.error("Erro ao apagar.");
      } finally {
        this.busyId = "";
      }
    },
  },
};
</script>

<style scoped>
.desc-clamp{
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.desc-full{
  overflow: visible;
}

.icon-btn{
  width: 38px;
  height: 34px;
  padding: 0;
}

.chip{
  font-size: 0.75rem;
  line-height: 1.1;
  padding: 0.25rem 0.5rem;
  white-space: normal;
  max-width: 100%;
  word-break: break-word;
}
</style>
