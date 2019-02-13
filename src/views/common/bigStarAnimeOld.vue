<template>
  <div class="big-star-anime">
    <!-- 大星星动画canvas -->
    <canvas id="canvas_a_star_big" class="canvas-a-star-big" width="1920" height="1080"></canvas>
    <!-- 大星星动画canvas -->
  </div>
</template>

<script>
import MYAIDE from "../../utils/myaide.js"
import wow from '../../assets/sounds/bigStarBgm.mp3'
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
    this.showSound = new Howl({
      src: this.wow
    })
    // this.showSound.play()
    let me = this
    // 大星星渲染器
    let canvasItemBigStar = document.getElementById('canvas_a_star_big')
    this.renderer_big = new MYAIDE.Renderer({ canvas: canvasItemBigStar })
    this.renderer_big.begin()
    // 大星星动画
    MYAIDE.Loader.loadAniImg(
      me.bigStarArr,
      "./assets/images/big-star-flash/star_00",
      73,
      125
    )
    this.starAanime = new MYAIDE.IntervalAnimation({
      frameArray: me.bigStarArr,
      // intervalStatus: true,
      playTime: 1,
      listenerStatus: true,
      cycle: 35
    })
    // this.starAanime.addListener('end', () => {
    // })
    // B区闪烁小星星动画
    this.renderer_big.add(this.starAanime)
    // this.starAanime.play()
    // setTimeout(() => {
    //   this.renderer_big.remove(this.starAanime)
    // }, this.keepAliveTime)
  },
  beforeDestroy: function() {
    this.renderer_big.remove(this.starAanime)
    this.renderer_big.runStatus = false
    this.showSound.unload()
  }
}
</script>

<style>

</style>
