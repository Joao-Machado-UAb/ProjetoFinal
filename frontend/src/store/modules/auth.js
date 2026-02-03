import api from "../../services/api";

const KEY = "pf_token";

export default {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem(KEY) || "",
    docente: null,
  }),
  getters: {
    token: (s) => s.token,
    isAuthenticated: (s) => Boolean(s.token),
    docente: (s) => s.docente,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      if (token) localStorage.setItem(KEY, token);
      else localStorage.removeItem(KEY);
    },
    setDocente(state, docente) {
      state.docente = docente;
    },
  },
  actions: {
    async init({ state, commit }) {
      if (!state.token) return;

      try {
        const { data } = await api.get("/auth/me");
        commit("setDocente", data.docente);
      } catch (e) {
        // token inválido → limpar tudo
        commit("setToken", "");
        commit("setDocente", null);
      }
    },

    async login({ commit }, { email, password }) {
      const { data } = await api.post("/auth/login", { email, password });
      commit("setToken", data.token);
      commit("setDocente", data.docente);
      return data;
    },
    logout({ commit }) {
      commit("setToken", "");
      commit("setDocente", null);
    },
  },
};
