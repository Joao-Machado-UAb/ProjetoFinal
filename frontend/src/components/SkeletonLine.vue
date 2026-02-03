<template>
  <div class="placeholder-glow">
    <span class="placeholder rounded" :style="{ width, height }"></span>
  </div>
</template>

<script>
export default {
  name: "SkeletonLine",
  props: {
    width: { type: String, default: "100%" },
    height: { type: String, default: "12px" },
  },
};
</script>
