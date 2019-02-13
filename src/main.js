import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Howl from 'howler'
import VueVideoPlayer from 'vue-video-player'
import 'videojs-flash'
import 'video.js/dist/video-js.css'
import Api from './api'
import * as utils from './utils'
import 'whatwg-fetch'
import VueCountdown from '@xkeshi/vue-countdown'
import TeamJsSignal from 'team-js-signals'
Vue.component('countdown', VueCountdown)

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueVideoPlayer)
Vue.prototype.Api = Api
var mySignals = new TeamJsSignal()
global.icsocket = null
global.diff = 'courseware'

Vue.mixin({
  methods: {
    _checkData: utils.checkData,
    _shuffle: utils.shuffle,
    _getRd: utils.getRd,
    _clockCountDown: utils.clockCountDown,
    _getNowFormatDate: utils.getNowFormatDate,
    _timeFn: utils.timeFn,
    _setCookie: utils.setCookie,
    _getCookie: utils.getCookie,
    _delCookie: utils.delCookie
  },
  data:function() {
    return {
      signals: mySignals
    }
  }
})

global.$vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default {
  Howl
}