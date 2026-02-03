<template>
  <div class="card shadow-sm">
    <div class="card-body p-4">
      <div class="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between mb-3">
        <div>
          <h1 class="h5 mb-1">{{ title }}</h1>
          <div class="text-muted small">
            Preencha os campos com atenção — o orientador é o docente autenticado.
          </div>
        </div>

        <span class="badge text-bg-primary">
          <i class="bi bi-person-badge me-1"></i>Docente autenticado
        </span>
      </div>

      <div v-if="clientError" class="alert alert-warning d-flex align-items-start gap-2" role="alert">
        <i class="bi bi-info-circle"></i>
        <div>{{ clientError }}</div>
      </div>

      <div v-if="error" class="alert alert-danger d-flex align-items-start gap-2" role="alert">
        <i class="bi bi-exclamation-triangle"></i>
        <div>{{ error }}</div>
      </div>

      <!-- Identificação -->
      <div class="mb-4">
        <div class="fw-semibold mb-2">Identificação</div>

      <div class="mb-3">
        <label class="form-label">Orientador</label>
        <div class="form-control bg-light">
          <i class="bi bi-person-badge me-1"></i>
          {{ orientador?.nome || "—" }}
          <span class="text-muted" v-if="orientador?.email"> — {{ orientador.email }}</span>
        </div>
        <div class="form-text">O orientador é automaticamente o docente autenticado.</div>
      </div>

        <div class="mb-3">
          <label class="form-label">Título <span class="text-danger">*</span></label>
          <input
            v-model.trim="form.titulo"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': triedSubmit && !form.titulo }"
            placeholder="Ex.: Sistema de recolha de propostas para Projeto Final"
          />
          <div class="invalid-feedback">O título é obrigatório.</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Palavras-chave</label>
          <input
            v-model="keywordsRaw"
            type="text"
            class="form-control"
            placeholder="ex.: web, bases de dados, segurança"
          />
          <div class="form-text">Separar por vírgulas.</div>
        </div>
      </div>

      <!-- Participantes -->
      <div class="mb-4">
        <div class="fw-semibold mb-2">Participantes (opcional)</div>

        <div class="row g-3">
          <div class="col-12 col-lg-6">
            <label class="form-label">Coorientadores</label>
            <select v-model="form.coorientadorIds" class="form-select" multiple>
              <option v-for="d in docentesParaCoorientadores" :key="d._id" :value="d._id">
                {{ d.nome }} — {{ d.email }}
              </option>

            </select>

            <!-- Coorientadores -->
            <div v-if="selectedCoorientadores.length" class="mt-2 d-flex flex-wrap gap-2">
              <span
                v-for="d in selectedCoorientadores"
                :key="d._id"
                class="badge rounded-pill text-bg-light border"
              >
                <i class="bi bi-person me-1"></i>{{ d.nome }}
                <button
                  type="button"
                  class="btn btn-sm p-0 ms-2"
                  style="line-height: 1;"
                  @click="removeCoorientador(d._id)"
                  title="Remover"
                >
                  <i class="bi bi-x"></i>
                </button>
              </span>
            </div>
          </div>

          <div class="col-12 col-lg-6">
            <label class="form-label">Alunos</label>
            <select v-model="form.alunoIds" class="form-select" multiple>
              <option v-for="a in alunos" :key="a._id" :value="a._id">
                {{ a.nome }} — Nº {{ a.numero }}
              </option>
            </select>

            <!-- Alunos -->
            <div v-if="selectedAlunos.length" class="mt-2 d-flex flex-wrap gap-2">
              <span
                v-for="a in selectedAlunos"
                :key="a._id"
                class="badge rounded-pill text-bg-light border"
              >
                <i class="bi bi-mortarboard me-1"></i>{{ a.nome }} — Nº {{ a.numero }}
                <button
                  type="button"
                  class="btn btn-sm p-0 ms-2"
                  style="line-height: 1;"
                  @click="removeAluno(a._id)"
                  title="Remover"
                >
                  <i class="bi bi-x"></i>
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <div class="fw-semibold mb-2">Descrição</div>

        <div class="mb-3">
          <label class="form-label">
            Descrição e objetivos do trabalho <span class="text-danger">*</span>
          </label>
          <textarea
            v-model.trim="form.descricaoObjetivos"
            rows="7"
            class="form-control"
            :class="{ 'is-invalid': triedSubmit && !form.descricaoObjetivos }"
            placeholder="Descreva o contexto, objetivos e metodologia..."
          ></textarea>
          <div class="invalid-feedback">Este campo é obrigatório.</div>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-primary" @click="onSubmit" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-check2-circle me-1"></i>
          {{ primaryLabel }}
        </button>

        <button class="btn btn-outline-secondary" @click="$emit('cancel')" :disabled="loading">
          <i class="bi bi-x-circle me-1"></i>Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PropostaForm",
  props: {
    title: { type: String, default: "Proposta" },
    primaryLabel: { type: String, default: "Guardar" },
    docentes: { type: Array, default: () => [] },
    orientador: { type: Object, default: null },
    alunos: { type: Array, default: () => [] },
    modelValue: { type: Object, required: true },
    loading: { type: Boolean, default: false },
    error: { type: String, default: "" },
  },
  emits: ["update:modelValue", "submit", "cancel"],
  data() {
    return {
      form: { ...(this.modelValue || {}) },
      keywordsRaw: ((this.modelValue && this.modelValue.palavrasChave) ? this.modelValue.palavrasChave : []).join(", "),
      triedSubmit: false,
      clientError: "",
      syncingFromParent: false,
    };
  },
  computed: {
    selectedCoorientadores() {
      const ids = new Set(this.form.coorientadorIds || []);
      return (this.docentes || []).filter((d) => ids.has(d._id));
    },
    selectedAlunos() {
      const ids = new Set(this.form.alunoIds || []);
      return (this.alunos || []).filter((a) => ids.has(a._id));
    },
    docentesParaCoorientadores() {
      const oid = this.orientador?._id;
      return (this.docentes || []).filter(d => d._id !== oid);
    },

  },
  watch: {
    modelValue: {
      deep: true,
      handler(v) {
        this.syncingFromParent = true;
        this.form = { ...(v || {}) };
        this.keywordsRaw = ((v && v.palavrasChave) ? v.palavrasChave : []).join(", ");
        this.$nextTick(() => (this.syncingFromParent = false));
      },
    },
    form: {
      deep: true,
      handler(v) {
        if (this.syncingFromParent) return;
        this.$emit("update:modelValue", v);
      },
    },
    keywordsRaw(v) {
      this.form.palavrasChave = String(v)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    },
  },
  methods: {
    removeCoorientador(id) {
      this.form.coorientadorIds = (this.form.coorientadorIds || []).filter((x) => x !== id);
    },
    removeAluno(id) {
      this.form.alunoIds = (this.form.alunoIds || []).filter((x) => x !== id);
    },
    onSubmit() {
      this.triedSubmit = true;
      this.clientError = "";

      if (!this.form.titulo || !this.form.descricaoObjetivos) {
        this.clientError = "Preencha os campos obrigatórios.";
        return;
      }

      this.$emit("submit", { ...this.form });
    },
  },
};
</script>
