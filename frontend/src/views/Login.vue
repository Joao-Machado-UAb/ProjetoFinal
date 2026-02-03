<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-6 col-xl-5">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <div class="d-flex align-items-center gap-2 mb-3">
            <i class="bi bi-shield-lock fs-4"></i>
            <div>
              <h1 class="h4 mb-0">Login Docente</h1>
              <div class="text-muted small">Aceda ao painel para gerir as suas propostas.</div>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger d-flex align-items-start gap-2" role="alert">
            <i class="bi bi-exclamation-triangle"></i>
            <div>{{ error }}</div>
          </div>

          <form @submit.prevent="submit" class="mt-3">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model.trim="email" type="email" class="form-control" autocomplete="email" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" autocomplete="current-password" required />
            </div>

            <button class="btn btn-primary w-100" type="submit" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Entrar
            </button>
          </form>

          <hr class="my-4" />

          <div class="small text-muted">
            Nota: este protótipo usa autenticação JWT no backend.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return { email: "", password: "", loading: false, error: "" };
  },
  methods: {
    async submit() {
      this.loading = true;
      this.error = "";
      try {
        await this.$store.dispatch("auth/login", { email: this.email, password: this.password });
        const next = this.$route.query.next || "/dashboard";
        this.$router.push(next);
      } catch (e) {
        this.error = e?.response?.data?.message || "Erro no login.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
