<template>
    <div class="arTemBox"  >
        <div class="logo"></div>
        <!--<canvas style="" id="canvas"/>-->
        <img class="arBg" :src="arBg" alt="">
    </div>
</template>

<script>
  import bg from '../../../assets/images/arCosplay/qianjing.png'
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        arBg: '',
        bg,
        player: ''
      }
    },
    computed: {
      ...mapState({
        lessonID: state => state.game.lessonID,
        classID: state => state.game.classID,
        courseID: state => state.game.courseID
      })
    },
    mounted() {
      let that = this
      if (that.$route.params.name) {
        that.curConfigData = this.$route.params
        that.arBg = that.curConfigData.configuration.foreground
      } else {
        return console.log('ar角色扮演没有拿到配置信息，不执行后面的逻辑！！！！！！！！！！！！')
        // this.$store.dispatch('fetchConfigData', {
        //   courseID: that.courseID
        // }).then(data => {
        //   this._checkData(data).then(data => {
        //     let configData = data.data.interactions
        //     for (let i = 0; i < configData.length; i++) {
        //       const element = configData[i]
        //       if (element.template.name === 'roleplay_vr') {
        //         that.curConfigData = configData[i].template
        //         that.arBg = that.curConfigData.configuration.foreground
        //         break
        //       }
        //     }
        //     // that.arBg = that.curConfigData.configuration.foreground
        //   })
        // })
      }
      // that.arBg = bg
      // var canvas = document.getElementById('canvas')
      // var renderContext = window.renderCont.setupCanvas(canvas)
      // var player = window.webjs.createPlayer()
      // this.player = player
      // console.log('player', player)
      // player.onLogMessage = function(level, message, format) {
      //   console.log(message)
      // }
      // player.setcapture('./models/M_SenseME_Face_Video_5.3.3.model', './stickers', '1920x1080', 30)
      // player.onFrameReady = function(frame) {
      //   renderContext.render(frame, frame.width, frame.height, frame.uOffset, frame.vOffset)
      // }
      // // var index =0;
      // player.setAR(true)
      // player.play('hello')
    },
    methods: {
    },
    components: {
    }
  }
</script>

<style scoped>
    .arBg,#canvas{
        position: absolute;
        width: 100%;
    }
    .arTemBox{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
