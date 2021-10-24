<template>
  <h1>Promociones</h1>
  <div class="tools">
    <button @click="showDialog = true">Nuevo promocion</button>
  </div>
  <table v-if="promocions.length" class="table-auto">
    <thead>
      <tr>
        <th>ID</th>
        <th>Descripcion</th>
        <th>Porcentaje</th>
        <th>Fecha</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, i) in promocions"
        :key="i"
      >
        <td>{{ item.id }}</td>
        <td>{{ item.descripcion }}</td>
        <td>{{ item.porcentaje * 100 }} %</td>
        <td>{{ new Date(item.fecha_inicio).toLocaleDateString() }} - {{ new Date(item.fecha_fin).toLocaleDateString() }}</td>
      </tr>
    </tbody>
  </table>
  <div v-else>No hay promocions registrados.</div>
  <Dialog :visible="showDialog" @close="showDialog = false">
    <h2 class="text-center font-bold mb-6">Crear Nuevo promocion</h2>
    <form class="flex flex-col" @submit="submit($event)">
      <input v-model="form.descripcion" type="text" placeholder="Descripcion" required>
      <input v-model="form.porcentaje" type="number" placeholder="Porcentaje" step="0.1" max="0.7" required>
      <input v-model="form.fecha_inicio" type="date" :min="new Date().toISOString().split('T')[0]" required>
      <input v-model="form.fecha_fin" type="date" :min="form.fecha_inicio" required>
      <button type="submit" :disabled="loading">Guardar</button>
    </form>
  </Dialog>
  <Alert :visible="showAlert" :type="alert.type" @auto-close="showAlert = false">{{ alert.msg }}</Alert>
</template>

<script>
import Dialog from "../components/Dialog.vue"
import Alert from "../components/Alert.vue"

export default {
  name: "Promociones",
  components: {
    Dialog,
    Alert
  },
  data: () => ({
    loading: false,
    showDialog: false,
    showAlert: false,
    promocions: [],
    alert: {
      type: '',
      msg: ''
    },
    form: {
      descripcion: '',
      porcentaje: 0.0,
      fecha_inicio: null,
      fecha_fin: null
    }
  }),
  mounted() {
    this.load()
  },
  methods: {
    load() {
      this.axios.get('/promocion').then((response) => {
        console.log(response)
        this.promocions = response.data
      })
    },
    submit(e) {
      e.preventDefault()
      this.loading = true
      let data = { ...this.form }

      if(data.fecha_inicio) {
        data.fecha_inicio = new Date(data.fecha_inicio)
      }
      if(data.fecha_fin) {
        data.fecha_fin = new Date(data.fecha_fin)
      }

      this.axios.post('/promocion', data).then((response) => {
        this.load()
        this.alert.msg = "Success"
        this.alert.type = "success"
        this.showAlert = true
        this.showDialog = false
      }).catch((e) => {
        this.alert.msg = "Error:" + e.response.data
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