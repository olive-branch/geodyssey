import Vue from 'vue'
import App from './App.vue'
import router from './router'
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker'
import 'vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css'

Vue.config.productionTip = false
Vue.use(AirbnbStyleDatepicker, {})

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
