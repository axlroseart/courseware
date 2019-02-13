import Vue from 'vue'
import Vuex from 'vuex'

import game from './game/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    game
  },
  strict: process.env.NODE_ENV !== 'production'
})
