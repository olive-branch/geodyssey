import Vue from 'vue'
import App from './App.vue'
import 'buefy/dist/buefy.css'
import Buefy from 'buefy'
import router from './router'
import './assets/fonts/FontAwesome/css/all.min.css'

Vue.config.productionTip = false

Vue.use(Buefy, {
  defaultIconPack: 'fa',
})

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')



