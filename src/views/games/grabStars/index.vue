<template>
  <div class="grab-stars">
    <transition-group enter-active-class="animated zoomIn"  leave-active-class="animated zoomOut" mode="in-out">
      <!-- 抢星星-欢迎界面 -->
      <div v-if="step === 'ready'" :key="1" class="grab-stars-ready-index">
        <readyGo></readyGo>
      </div>
      <!-- 抢星星-欢迎界面 -->

      <!-- 抢星星-游戏界面 -->
      <div v-else-if="step === 'game'" :key="2" class="grab-stars-game-index">
        <grab></grab>
      </div>
      <!-- 抢星星-游戏界面 -->

      <!-- 抢星星-排行界面 -->
      <div v-else-if="step === 'rank'" :key="3" class="rank-index">
        <rank></rank>
      </div>
      <!-- 抢星星-排行界面 -->
    </transition-group>
  </div>
</template>

<script>
import readyGo from '../readyGo'
import grab from './grab'
import rank from '../rank'
import { mapState } from 'vuex'
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      // 当前进入的步骤，即显示哪个界面
      step: state => state.game.starsGameStep,
      // 当前设定的语音匹配单词
      currWord: state => state.game.currWord
    })
  },
  components: {
    readyGo,
    grab,
    rank
  }
}
</script>

<style>

</style>
