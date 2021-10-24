<template>
  <transition name="fade">
    <div v-if="visible" :class="[type]" class="alert">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: ''
    }
  },
  watch: {
    visible: {
      handler () {
        setTimeout(() => {
          this.$emit('auto-close')
        }, 5000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .alert {
    @apply fixed top-0 bg-gray-300 text-gray-800 rounded w-4/5 py-2 px-4;

    &.success {
      @apply bg-green-300 text-green-800;
    }

    &.error {
      @apply bg-red-300 text-red-800;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-100%);
  }
</style>