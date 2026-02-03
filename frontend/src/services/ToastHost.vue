<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1080;">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="toast show align-items-center border-0 mb-2"
      :class="toastClass(t.variant)"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">
          <div class="fw-semibold" v-if="t.title">{{ t.title }}</div>
          <div>{{ t.message }}</div>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close" @click="close(t.id)"></button>
      </div>
    </div>
  </div>
</template>

<script>
import toastStore from "../services/toastStore";

export default {
  name: "ToastHost",
  computed: {
    toasts() {
      return toastStore.state.toasts;
    },
  },
  methods: {
    close(id) {
      toastStore.removeToast(id);
    },
    toastClass(variant) {
      // Bootstrap
      return {
        "text-bg-success": variant === "success",
        "text-bg-danger": variant === "danger",
        "text-bg-primary": variant === "primary",
        "text-bg-secondary": variant === "secondary",
        "text-bg-warning": variant === "warning",
      };
    },
  },
};
</script>
