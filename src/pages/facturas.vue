<template>
  <h1>Facturas</h1>
  <div class="tools">
    <button @click="showDialog = true; simular = false">Nueva factura</button>
    <button @click="showDialog = true; simular = true">Simular factura</button>
  </div>
  <table v-if="facturas.length" class="table-auto">
    <thead>
      <tr>
        <th>ID</th>
        <th>Fecha</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, i) in facturas"
        :key="i"
      >
        <td>{{ item.id }}</td>
        <td>{{ new Date(item.fecha_crear).toLocaleDateString() }}</td>
        <td>${{ item.pago_total }}</td>
      </tr>
    </tbody>
  </table>
  <div v-else>No hay facturas registrados.</div>
  <Dialog :visible="showDialog" @close="showDialog = false">
    <h2 class="text-center font-bold mb-6">Crear Nuevo factura</h2>
    <form class="flex flex-col" @submit="submit($event)">
      <input v-model="form.fecha_crear" type="date" :min="new Date().toISOString().split('T')[0]" required>
      <select key="selectPromo" v-model="form.promocion">
        <option value="" disabled selected hidden>Seleccione una Promocion</option>
        <option
          v-for="(item, index) in validPromotions"
          :key="index"
          :value="item.id"
        >
          {{ item.descripcion }} - {{ item.porcentaje * 100 }}%
        </option>
      </select>
      <fieldset>
        Medicamentos:<br>
        <select key="selectMedic" v-model="select" class="medicamentos">
          <option value="" disabled selected hidden>Seleccione un Medicamento</option>
          <option
            v-for="(item, index) in medicamentos"
            :key="index"
            :value="item.id"
          >
            {{ item.nombre }} - ${{ item.precio }}
          </option>
        </select>
        <button type="button" @click="addMedicamento()">Agregar</button>
      </fieldset>
      <ul>
        <li v-for="(item, index) in form.medicamentos" :key="index">{{ item.nombre }} - ${{ item.precio }}</li>
      </ul><br><hr /><br>
      <div>TOTAL A PAGAR: $<strong>{{ totalPagar }}</strong></div><br>
      <button type="submit" :disabled="loading">Guardar</button>
    </form>
  </Dialog>
  <Alert :visible="showAlert" :type="alert.type" @auto-close="showAlert = false">{{ alert.msg }}</Alert>
</template>

<script>
import Dialog from "../components/Dialog.vue"
import Alert from "../components/Alert.vue"

export default {
  name: "Facturas",
  components: {
    Dialog,
    Alert
  },
  data: () => ({
    loading: false,
    showDialog: false,
    showAlert: false,
    simular: false,
    facturas: [],
    medicamentos: [],
    promociones: [],
    alert: {
      type: '',
      msg: ''
    },
    select: '',
    form: {
      fecha_crear: '',
      pago_total: 0.0,
      promocion: '',
      medicamentos: []
    }
  }),
  computed: {
    validPromotions() {
      return this.promociones.filter((item) => {
        const create = new Date(this.form.fecha_crear).getTime()
        return (new Date(item.fecha_inicio).getTime() <= create) && (new Date(item.fecha_fin).getTime() >= create)
      })
    },
    totalPagar() {
      let total = 0
      this.form.medicamentos.forEach((item) => {
        total += item.precio
      })
      if (this.form.promocion) {
        const promo = this.promociones.find((item) => {
          return item.id === this.form.promocion
        })
        
        return total - (total * promo.porcentaje)
      }
      return total
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      this.axios.get('/factura').then((response) => {
        this.facturas = response.data
      })

      this.axios.get('/medicamento').then((response) => {
        this.medicamentos = response.data
      })

      this.axios.get('/promocion').then((response) => {
        this.promociones = response.data
      })
    },
    addMedicamento() {
      const item = this.medicamentos.find((item) => {
        return item.id === this.select
      })
      if(item) {
        this.form.medicamentos.push(item);
      }
    },
    submit(e) {
      e.preventDefault()
      this.loading = true
      let data = { ...this.form }

      if(data.fecha_crear) {
        data.fecha_crear = new Date(data.fecha_crear)
      }

      if(data.promocion) {
        data.promocion = this.promociones.find((item) => {
          return item.id === data.promocion
        })
      } else {
        data.promocion = undefined
      }

      data.pago_total = this.totalPagar

      if(this.simular) {
        this.axios.post('/factura/simular', data).then((response) => {
          this.load()
          this.alert.msg = "Success - TOTAL A PAGAR: $" + response.data
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
      } else {
        this.axios.post('/factura', data).then((response) => {
          this.form = {
            fecha_crear: '',
            pago_total: 0.0,
            promocion: '',
            medicamentos: []
          }
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
}
</script>

<style lang="scss" scoped>
  table {
    @apply w-full;

    td {
      @apply border px-4 py-2 font-medium;
    }
  }

  .medicamentos {
    @apply w-60 mr-2;
  }
</style>