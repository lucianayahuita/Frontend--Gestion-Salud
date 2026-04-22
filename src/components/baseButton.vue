
<template>
  <button :type="type" class="custom-btn" :disabled="disabled">
    <slot></slot> </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false }
});

</script>

<style scoped>
.custom-btn {
  background-color: var(--button1-color);
  color: var(--primary-button-color);
  font-family: var(--font-work);
  font-weight: 600;
  padding: 10px 25px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-btn:hover:not(:disabled) {
  background-color: var(--secondary-color);
  color: white;
  transform: translateY(-2px);
}

.custom-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>