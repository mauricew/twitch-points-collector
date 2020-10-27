import Vue from 'vue'
import Quasar from 'quasar/dist/quasar.umd';
import 'quasar/dist/quasar.min.css';

import App from './App.vue'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

Vue.use(Quasar);
