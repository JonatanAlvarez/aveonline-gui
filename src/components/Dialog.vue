<template>
  <transition name="fade">
    <div v-if="visible" class="dialog" @click="$emit('close')">
      <div class="box" @click.stop>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .dialog {
    @apply fixed top-0 left-0 flex justify-center items-center w-screen h-screen bg-gray-800 bg-opacity-90 cursor-pointer;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 25px;
      right: 25px;
      height: 1px;
      width: 30px;
      background-color: #fff;
      transform-origin: center;
      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }

    .box {
      @apply bg-white p-6 rounded cursor-default;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>