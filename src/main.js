import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ECharts from 'vue-echarts'
import { use } from "echarts/core"
import {
  LineChart
} from 'echarts/charts'
import "./index.scss"

const app = createApp(App).use(router)

use([
  LineChart
])

axios.defaults.baseURL = 'http://localhost:9092/v1'

app.config.globalProperties.axios = axios

app.component('v-chart', ECharts)
app.mount('#app')
