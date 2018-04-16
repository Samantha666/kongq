// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueDND from 'awe-dnd'

Vue.use(VueDND)
Vue.use(ElementUI)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    if ( (to.path == '/login') || (to.path == '/') ) {
        sessionStorage.removeItem('user');
    }
    if (to.matched.some(res => res.meta.requireAuth)) {
        if(sessionStorage.getItem('user')) {
            next();
        }else{
            next({path: '/login'});
        }
    } else {
        next();
    }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
