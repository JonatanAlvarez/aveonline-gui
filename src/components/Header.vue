<template>
  <header>
    <nav>
      <router-link to="/medicamentos">Medicamentos</router-link>
      <router-link to="/promociones">Promociones</router-link>
      <router-link to="/facturas">Facturas</router-link>
      <router-link to="/reporte">Reporte</router-link>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
  header {
    @apply flex justify-between py-6 px-20 place-items-center text-white bg-gray-200;

    nav {
      @apply ml-auto;

      a {
        @apply text-gray-700 font-bold mx-6;

        &:hover {
          @apply text-red-800;
        }
      }
    }
  }
</style>