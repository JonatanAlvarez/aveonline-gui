<template>
  <h1>Medicamentos</h1>
  <div class="tools">
    <button @click="showDialog = true">Nuevo Medicamento</button>
  </div>
  <table v-if="medicamentos.length" class="table-auto">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Ubicacion</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, i) in medicamentos"
        :key="i"
      >
        <td>{{ item.id }}</td>
        <td>{{ item.nombre }}</td>
        <td>{{ item.precio }}</td>
        <td>{{ item.ubicacion }}</td>
      </tr>
    </tbody>
  </table>
  <div v-else>No hay medicamentos registrados.</div>
  <Dialog :visible="showDialog" @close="showDialog = false">
    <h2 class="text-center font-bold mb-6">Crear Nuevo Medicamento</h2>
    <form class="flex flex-col" @submit="submit($event)">
      <input v-model="form.nombre" type="text" placeholder="Nombre" required>
      <input v-model="form.precio" type="number" placeholder="Precio" step="any" required>
      <input v-model="form.ubicacion" type="text" placeholder="Ubicacion" required>
      <button type="submit" :disabled="loading">Guardar</button>
    </form>
  </Dialog>
  <Alert :visible="showAlert" :type="alert.type" @auto-close="showAlert = false">{{ alert.msg }}</Alert>
</template>

<script>
import Dialog from "../components/Dialog.vue"
import Alert from "../components/Alert.vue"

export default {
  name: "Medicamentos",
  components: {
    Dialog,
    Alert
  },
  data: () => ({
    loading: false,
    showDialog: false,
    showAlert: false,
    medicamentos: [],
    alert: {
      type: '',
      msg: ''
    },
    form: {
      nombre: '',
      precio: 0.0,
      ubicacion: ''
    }
  }),
  mounted() {
    this.load()
  },
  methods: {
    load() {
      this.axios.get('/medicamento').then((response) => {
        console.log(response)
        this.medicamentos = response.data
      })
    },
    submit(e) {
      e.preventDefault()
      this.loading = true

      this.axios.post('/medicamento', this.form).then((response) => {
        this.load()
        this.alert.msg = "Success"
        this.alert.type = "success"
        this.showAlert = true
        this.showDialog = false
      }).catch((e) => {
        this.alert.msg = "Error:" + e
        this.alert.type = "error"
        this.showAlert = true
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  table {
    @apply w-full;

    td {
      @apply border px-4 py-2 font-medium;
    }
  }
</style>