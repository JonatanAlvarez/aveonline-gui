<template>
  <div class="w-screen h-screen">
    <v-chart class="chart" :option="option" />
  </div>
</template>

<script>
import "echarts";

export default {
  data: () => ({
    facturas: [],
    chartOption: {
      xAxis: {
        type: 'category',
        data: []
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [
        {
          data: [0, 0],
          type: 'line'
        }
      ]
    }
  }),
  computed: {
    option() {
      return this.chartOption
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      this.axios.get('/factura').then((response) => {
        this.facturas = response.data

        const data = []

        this.facturas.forEach((item) => {
          const fecha = new Date(item.fecha_crear).toISOString().split('T')[0]
          if (data[fecha]) {
            data[fecha] += item.pago_total
          } else {
            data[fecha] = item.pago_total
          }
        })
        const xAxis = []
        let iterator = Object.keys(data)
        for(const item of iterator) {
          xAxis.push(item)
        }

        const yAxis = []
        iterator = Object.values(data)
        for(const item of iterator) {
          yAxis.push(item)
        }
        this.chartOption.series.data = yAxis

        this.chartOption = { 
          ...this.chartOption,
          xAxis: {
            data: xAxis
          },
          series: {
            data: yAxis
          }
        }
      })
    }
  }
}
</script>