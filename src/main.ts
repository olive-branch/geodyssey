import Vue from 'vue'
import App from './App.vue'
import router from './router'
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker'
import 'vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css'

import { getOrders } from './api/order'

Vue.config.productionTip = false
Vue.use(AirbnbStyleDatepicker, {})

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')


getOrders({ limit: 2, offset: 0 }).then(console.log).catch(console.error)
