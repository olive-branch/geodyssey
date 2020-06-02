import Vue from 'vue'
import Router from "vue-router"
import CiList from './components/CiList/index.vue'
import CiDetail from './components/CiDetail/index.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { 
      path: '',
      component: CiList,
    },
    {
      path: '/add',
      component: CiDetail
    },
    //https://router.vuejs.org/ru/guide/essentials/named-routes.html
    {
      path: '/:id',
      name: 'detail',
      component: CiDetail
    }
  ]
})