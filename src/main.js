import Vue from 'vue'
import App from './App.vue'
import '@/assets/css/tailwind.css'
import router from '@/router'
import { dollarFilter, percentFilter } from '@/filters'
import Chartkick from 'vue-chartkick'
import { VueSpinners } from '@saeris/vue-spinners'
import Chart from 'chart.js'

//utilizar la librerias de chartkick y vue-spiners para vue-2
Vue.use(VueSpinners)
Vue.use(Chartkick.use(Chart))

//aplicamos el filtro para la moneda de dollar y el porcentaje
Vue.filter('dollar', dollarFilter)
Vue.filter('percent', percentFilter)
Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
