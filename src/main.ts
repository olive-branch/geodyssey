import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueToast from 'vue-toast-notification';

import 'vue-toast-notification/dist/theme-default.css';
import 'vue2-datepicker/index.css';

Vue.use(VueToast, { position: "top-right"});
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
