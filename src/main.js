// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(Vuex)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  VueResource,
  components: { App },
  template: '<App/>'
})

//router.push('/goods')   //页面一刷新自动跳转seller路由
