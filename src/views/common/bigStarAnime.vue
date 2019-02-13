<template>
  <div class="big-star-anime">
    <!-- 大星星动画canvas -->
    <div class="animation-rank-leap"></div>
    <div class="flow-star-mask"></div>
    <!-- <canvas id="canvas_a_star_big" class="canvas-a-star-big" width="1920" height="1080"></canvas> -->
    <!-- 大星星动画canvas -->
  </div>
</template>

<script>
import '../../assets/gka-starlisty-css/gka.css'
// import MYAIDE from "../../utils/myaide.js"
import wow from '../../assets/sounds/starlist_1.mp3'
import { importAll, preloadImage } from '../../utils/index'
const voiceWaveImages = importAll(require.context ('../../assets/gka-starlisty-css/img', false, /\.png$/))
export default {
  data() {
    return {
      wow,
      // 大星星动画数据组
      bigStarArr: [],
      // 大星星动画
      starAanime: {},
      // 声音
      showSound: {},
      keepAliveTime: 3000
    }
  },
  mounted() {
    preloadImage(voiceWaveImages)
    this.showSound = new Howl({
      src: this.wow
    })
    // this.initAnime()
  },
  methods: {
    // initAnime() {
    //   let me = this
    //   // 大星星渲染器
    //   let canvasItemBigStar = document.getElementById('canvas_a_star_big')
    //   this.renderer_big = new MYAIDE.Renderer({ canvas: canvasItemBigStar })
    //   this.renderer_big.begin()
    //   // 大星星动画
    //   MYAIDE.Loader.loadAniImg(
    //     me.bigStarArr,
    //     "./assets/images/big-star-flash/star_00",
    //     73,
    //     125
    //   )
    //   this.starAanime = new MYAIDE.IntervalAnimation({
    //     frameArray: me.bigStarArr,
    //     playTime: 1,
    //     listenerStatus: true,
    //     cycle: 35
    //   })
    //   // B区闪烁小星星动画
    //   this.renderer_big.add(this.starAanime)
    // }
  },
  beforeDestroy: function() {
    // this.renderer_big.remove(this.starAanime)
    // this.renderer_big.runStatus = false
    // this.renderer_big.stop()
    this.showSound.unload()
  }
}
</script>

<style>

</style>
