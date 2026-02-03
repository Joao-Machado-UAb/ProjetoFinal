import { reactive } from "vue";

const state = reactive({
  toasts: [],
});

function addToast({ title = "", message = "", variant = "primary", timeout = 3000 }) {
  const id = Date.now() + Math.random();
  state.toasts.push({ id, title, message, variant });

  if (timeout && timeout > 0) {
    setTimeout(() => removeToast(id), timeout);
  }
}

function success(message, title = "Sucesso") {
  addToast({ title, message, variant: "success" });
}

function error(message, title = "Erro") {
  addToast({ title, message, variant: "danger", timeout: 4500 });
}

function info(message, title = "Info") {
  addToast({ title, message, variant: "primary" });
}

function removeToast(id) {
  const i = state.toasts.findIndex((t) => t.id === id);
  if (i >= 0) state.toasts.splice(i, 1);
}

export default { state, success, error, info, removeToast };
