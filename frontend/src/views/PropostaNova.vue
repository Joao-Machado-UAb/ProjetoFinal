<template>
  <div>
    <PropostaForm
      title="Nova Proposta"
      primaryLabel="Criar"
      :docentes="docentes"
      :orientador="$store.getters['auth/docente']"
      :alunos="alunos"
      v-model="model"
      :loading="loading"
      :error="error"
      @submit="submit"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import toast from "../services/toastStore";
import api from "../services/api";
import PropostaForm from "../components/PropostaForm.vue";

export default {
  components: { PropostaForm },
  data() {
    return {
      docentes: [],
      alunos: [],
      model: { titulo: "", coorientadorIds: [], palavrasChave: [], alunoIds: [], descricaoObjetivos: "" },
      loading: false,
      error: "",
    };
  },
  mounted() {
    this.loadLists();
  },
  methods: {
    async loadLists() {
      try {
        const [doc, alu] = await Promise.all([api.get("/docentes"), api.get("/alunos")]);
        this.docentes = doc.data;
        this.alunos = alu.data;
      } catch (e) {
        this.error = e?.response?.data?.message || "Erro ao carregar listas (docentes/alunos).";
        toast.error(this.error);
      }
    },
    cancel() {
      this.$router.push("/dashboard");
    },
    async submit(payload) {
      if (payload._clientError) {
        this.error = payload._clientError;
        toast.error(this.error);
        return;
      }
      this.loading = true;
      this.error = "";
      try {
        await api.post("/propostas", payload);
        toast.success("Proposta criada com sucesso.");
        this.$router.push("/dashboard");
      } catch (e) {
        this.error = e?.response?.data?.message || "Erro ao criar proposta.";
        toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
