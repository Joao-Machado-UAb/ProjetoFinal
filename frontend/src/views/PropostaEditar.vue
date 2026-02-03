<template>
  <div>
    <PropostaForm
      title="Editar Proposta"
      primaryLabel="Guardar alterações"
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
import api from "../services/api";
import toast from "../services/toastStore";
import PropostaForm from "../components/PropostaForm.vue";

export default {
  name: "PropostaEditar",
  components: { PropostaForm },

  data() {
    return {
      docentes: [],
      alunos: [],
      model: {
        titulo: "",
        coorientadorIds: [],
        palavrasChave: [],
        alunoIds: [],
        descricaoObjetivos: ""
      },
      loading: false,
      error: ""
    };
  },

  async mounted() {
    await this.loadLists();
    await this.loadPropostaFromMinhas();
  },

  methods: {
    cancel() {
      this.$router.push("/dashboard");
    },

    async loadLists() {
      try {
        const [docRes, aluRes] = await Promise.all([
          api.get("/docentes"),
          api.get("/alunos")
        ]);
        this.docentes = docRes.data || [];
        this.alunos = aluRes.data || [];
      } catch (e) {
        this.error = e?.response?.data?.message || "Erro ao carregar listas (docentes/alunos).";
        toast.error(this.error);
      }
    },

    async loadPropostaFromMinhas() {
      this.loading = true;
      this.error = "";
      try {
        const { data } = await api.get("/propostas/minhas");
        const id = this.$route.params.id;

        const p = (data || []).find((x) => x._id === id);
        if (!p) {
          this.error = "Proposta não encontrada (ou não pertence ao docente autenticado).";
          toast.error(this.error);
          return;
        }

        this.model = {
          titulo: p.titulo || "",
          coorientadorIds: (p.coorientadorIds || []).map((d) => d?._id || d),
          palavrasChave: p.palavrasChave || [],
          alunoIds: (p.alunoIds || []).map((a) => a?._id || a),
          descricaoObjetivos: p.descricaoObjetivos || ""
        };
      } catch (e) {
        this.error = e?.response?.data?.message || "Erro ao carregar proposta.";
        toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async submit(payload) {
      this.loading = true;
      this.error = "";
      try {
        await api.put(`/propostas/${this.$route.params.id}`, payload);
        toast.success("Alterações guardadas com sucesso.");
        this.$router.push("/dashboard");
      } catch (e) {
        this.error = e?.response?.data?.message || "Erro ao atualizar proposta.";
        toast.error(this.error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
