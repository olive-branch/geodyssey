import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { getOrders } from './api/order'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')



getOrders({}).then(console.log).catch(console.error)
