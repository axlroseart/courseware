<template>
  <div class="read-aloud">
    <transition-group enter-active-class="animated bounceIn"  leave-active-class="animated bounceOut" mode="in-out">
      <!-- 看词读音-ready-go -->
      <div v-if="step === 'ready'" :key="1" class="game-ready-index">
        <readyGo></readyGo>
      </div>
      <!-- 看词读音-ready-go -->

      <!-- 看词读音-游戏界面 -->
      <div v-if="step === 'game'" :key="2" class="game-ready-index">
        <readaloud></readaloud>
      </div>
      <!-- 看词读音-游戏界面 -->

      <!-- 看词读音-排行界面 -->
      <div v-if="step === 'rank'" :key="3" class="game-ready-index">
        <rank></rank>
      </div>
      <!-- 看词读音-排行界面 -->
    </transition-group>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import readaloud from './readaloud.vue'
import rank from '../rank.vue'
import readyGo from '../readyGo.vue'
export default {
  data() {
    return {
    }
  },
  mounted() {
    console.log('看词读音.')
    this.$store.dispatch('setStarsGameStep', 'ready')
    console.log(this.step)
  },
  computed: {
    ...mapState({
      // 当前进入的步骤，即显示哪个界面
      step: state => state.game.starsGameStep,
      // 当前设定的语音匹配单词
      currWord: state => state.game.currWord,
      // 语音数据
      scoreData: state => state.game.scoreData
    })
  },
  components: {
    readaloud: readaloud,
    rank: rank,
    readyGo: readyGo
  }
}
</script>

<style>

</style>
