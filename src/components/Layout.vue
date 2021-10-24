<template>
  <Header />
  <main class="container flex-grow px-4 mx-auto my-12">
    <router-view />
  </main>
</template>

<script>
import Header from "./Header.vue"

export default {
  components: {
    Header,
  },
}
</script>