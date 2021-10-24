import { createRouter, createWebHistory } from "vue-router";
import Index from "./pages/index.vue";
import Medicamentos from "./pages/medicamentos.vue";
import Promociones from "./pages/promociones.vue";
import Facturas from "./pages/facturas.vue";
import Reporte from "./pages/reporte.vue";

const routes = [
  { path: "/", component: Index },
  { path: "/medicamentos", component: Medicamentos },
  { path: "/promociones", component: Promociones },
  { path: "/facturas", component: Facturas },
  { path: "/reporte", component: Reporte },
];

const history = createWebHistory();

const router = createRouter({
  history,
  routes,
});

export default router;