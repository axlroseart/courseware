<template>
    <div class="posi studentVideoBox"  >
        <!--<arVideo  class="posi studentCon studentMin"  :width="videoWidth" :height="videoHeight" :videoSrc="videoSrc" :muted="true"></arVideo>-->
        <!--<object class="all posi warmup"   >-->
            <!--<param :value="warmup">-->
            <!--<param value="high">-->
            <!--<embed class="all" :src="warmup" wmode="transparent" quality=high  ALIGN="" TYPE="application/x-shockwave-flash"></embed>-->
        <!--</object>-->
        <!--<object class="all posi showittome"  >-->
            <!--<param :value="showittome">-->
            <!--<param value="high">-->
            <!--<embed class="all" :src="showittome" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>-->
        <!--</object>-->
        <video id="video" :src="videoPath" style="width: 100%;height: 100%" width="100%" height="100%" loop autoplay>
        </video>
        <!--<canvas id="buffer" width="1920" height="1080" class="none"></canvas>-->
        <!--<canvas id="output" width="1920" height="1080" style=""></canvas>-->
        <!--<canvas style="" id="canvas"/>-->
        <img :src="arBg" alt="" class="arBg">
        <img v-show="cameraImgShow" :src="cameraImg" alt="" class="cameraImg">
        <img v-show="cameraJieShow" :src="jieImg" alt="" class="cameraJie">
        <!--<button @click="jietu" style="position: absolute;z-index: 1;">截图</button>-->
        <!--<button @click="gameOver" style="position: absolute;z-index: 1;">结束互动</button>-->
    </div>
</template>

<script>
  import arVideo from './arVideo'
  import warmup from '../../../assets/flash/warmup.swf'
  import showittome from '../../../assets/flash/showittome.swf'
  import camera from '../../../assets/sounds/camera.mp3'
  import cameraImg from '../../../assets/images/camera.png'
  import Velocity from 'velocity-animate'
  import 'velocity-animate/velocity.ui.js'
  import '../../../assets/styles/ar.styl'
  import MYAIDE from "../../../utils/myaide.js"
  // import arCar from '../../../assets/sounds/arCar.mp3'
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        videoWidth: '100%',
        videoHeight: '100%',
        videoSrc: localStorage.getItem('videoSrc'),
        warmup: warmup,
        showittome: showittome,
        cameraImg: cameraImg,
        arBg: '',
        audio: new Audio(camera),
        cameraImgShow: false,
        cameraJieShow: false,
        player: '',
        jieImg: '',
        configData: {},
        totalTime: 0,
        videoPath:'',
        music:'',
        bgm_sound:'',
        video: '',
        interval: '',
        smallStarArrOne: []
      }
    },
    watch: {
      'coursewareEventEnd': function() {
      }
    },
    computed: {
      ...mapState({
        coursewareEventEnd: state => state.game.coursewareEventEndData
      })
    },
    mounted() {
      document.getElementsByTagName('body')[0].style.background = 'rgba(0, 0, 0, 0)'
      this.bgm_sound = ''
      this.configData = this.$route.params
      console.log('ar.configData', this.configData)
      if (!this.configData.name) return console.log('ar没有拿到配置信息，不执行后面的逻辑！！！！！！！！！！！！')
      this.videoPath = this.configData.configuration.video
      console.log('videoPath', this.videoPath)
      this.music = this.configData.configuration.music
      if (this.music) {
        this.bgm_sound = new Howl({
          src: [this.music]
        })
        this.bgm_sound.play()
      }
      let foreground = this.configData.configuration.foreground
      if (foreground) this.arBg = foreground
      this.totalTime = this.configData.configuration.totalTime
      this.interactionID = this.configData.interactionID
      if (this.totalTime > 0) {
        this.totalClock = setTimeout(() => {
          this.gameOver()
        }, this.totalTime)
      }
      // 有视频地址则启动序列帧
      if (this.videoPath) {
        // this.animeInit()
        // this.car_sound = new Howl({
        //   src: [arCar],
        //   loop: true
        // })
        // this.car_sound.play()

        // let that = this
        // var outputCanvas = document.getElementById('output')
        // var output = outputCanvas.getContext('2d')
        // var bufferCanvas = document.getElementById('buffer')
        // var buffer = bufferCanvas.getContext('2d')
        // this.video = document.getElementById('video')
        // var width = outputCanvas.width
        // var height = outputCanvas.height

        // var processFrame= function() {
          // output.drawImage(that.video, 0, 0)// drawImage(要绘画的元素, x轴, y轴)
          // console.log('output', output)
          // getImageData 复制画布上指定图像的像素数据
          // var bounce = 40
          // var img = buffer.getImageData(0, 0, width, height)
          // for (var i = 0, len = img.data.length; i < len / 4; i++) {
          //   // if (img.data[i * 4] <= 100 && img.data[i * 4 + 1] >= 200 && img.data[i * 4 + 1] <= 255 && img.data[i * 4 + 2] <= 100) {
          //   if (img.data[i * 4] < bounce && img.data[i * 4 + 1] < bounce && img.data[i * 4 + 2] < bounce) {
          //     img.data[i * 4 + 3] = 0 // if color is black, set alpha to 0
          //   }
          // }
          // putImageData() 将图像数据放回画布：
          // output.putImageData(img, 0, 0, 0, 0, width, height)
        // }
        // that.video.addEventListener('play', function() {
        //   console.log('ar视频开始播放')
        //   clearInterval(that.interval)
        //   that.interval = setInterval(processFrame, 150)
        // }, false)
        // that.video.addEventListener('ended', function() {
        //   that.video.play()
        // }, false)
      }
    },
    beforeRouteLeave: function(to, from, next) {
      console.log('ar触发beforeRouteLeave')
      // 清除renderer add by ryan
      if (this.renderer) {
        this.renderer.remove(this.smallStarAnimeOne)
        this.renderer.runStatus = false
      }
      if(this.bgm_sound) {
        console.log('ar课件关闭背景音乐')
        this.bgm_sound.stop()
      }
      if(this.car_sound) {
        this.car_sound.stop()
      }
      if (this.video) this.video.pause()
      if (this.interval) clearInterval(this.interval)
      if (this.imgClock) clearTimeout(this.imgClock)
      if (this.jieClock) clearTimeout(this.jieClock)
      if (this.totalClock) clearTimeout(this.totalClock)
      next()
    },
    methods: {
      // 使用序列帧
      animeInit() {
        let me = this
        // 序列帧渲染器
        let canvasItemsStar = document.getElementById("output")
        this.renderer = new MYAIDE.Renderer({ canvas: canvasItemsStar })
        this.renderer.begin()
        // 序列帧动画
        MYAIDE.Loader.loadAniImg(
          me.smallStarArrOne,
          "./assets/images/arCar/ar",
          483,
          1
        )
        this.smallStarAnimeOne = new MYAIDE.IntervalAnimation({
          frameArray: me.smallStarArrOne,
          intervalStatus: true, // 循环
          listenerStatus: true,
          autoPlay: true,
          cycle: 83 // 毫秒，多久渲染一次图片
        })
        this.renderer.add(this.smallStarAnimeOne) // 启动
      },
      gameOver() {
        console.log('结束ar互动')
        if(this.bgm_sound) {
          console.log('ar课件关闭背景音乐')
          this.bgm_sound.stop()
        }
        if (this.video) this.video.pause()
        if (this.smallStarAnimeOne) this.smallStarAnimeOne.stop()
        if (this.interval) clearInterval(this.interval)
        if (this.imgClock) clearTimeout(this.imgClock)
        if (this.jieClock) clearTimeout(this.jieClock)
        if (this.totalClock) clearTimeout(this.totalClock)
        if(window.webviewCallBack) window.webviewCallBack({
          type: 'end',
          start: typeof this.$route.params.from === 'undefined' ? '' : this.$route.params.from,
          courseware: this.$route.params.name
        })
        // this.player.stop()
        // this.Api.coursewareEnd({
        //   lessonID: 221,
        //   interactionID: this.interactionID,
        //   classID: 1
        // }).then(data => {
        //   this._checkData(data).then(data => {
        //     console.log('========= 结束ar，教室端收到消息隐藏回显 =========')
        //     this.$store.dispatch('fetchCoursewareEventEndData', this.interactionID)
        //   }).catch(error => {
        //   })
        // })
      },
      getNowFormatDate() {
        var date = new Date()
        var seperator1 = '-'
        var month = date.getMonth() + 1
        var strDate = date.getDate()
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        if (month >= 1 && month <= 9) {
          month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
        }
        if (hours >= 0 && hours <= 9) {
          hours = '0' + hours
        }
        if (minutes >= 0 && minutes <= 9) {
          minutes = '0' + minutes
        }
        if (seconds >= 0 && seconds <= 9) {
          seconds = '0' + seconds
        }
        var currentdate =
            date.getFullYear() +
            seperator1 +
            month +
            seperator1 +
            strDate +
            '_' +
            hours +
            seperator1 +
            minutes +
            seperator1 +
            seconds
        return currentdate
      },
      jietu() {
        let that =this
        this.cameraImgShow = true
        let currentdate = this.getNowFormatDate()+'.bmp'
        let localData = 'http://localhost/ScreenShot/'+currentdate
        this.jieImg = localData
        console.log(currentdate)
        this.player.ScreenShot('.\\ScreenShot', currentdate)
        this.audio.play()
        let studentVideo = document.getElementsByClassName('studentVideoBox')[0]
        let cameraImg= document.getElementsByClassName('cameraImg')[0]
        let cameraJie= document.getElementsByClassName('cameraJie')[0]
        Velocity(studentVideo, {
          opacity: 0.5
        }, {
          complete: function() {
            Velocity(studentVideo, {
              opacity: 1
            })
        }})
        Velocity(cameraImg, 'transition.bounceIn', {
          complete: function() {
            that.imgClock = setTimeout(() => {
              that.cameraImgShow = false
            }, 100)
            Velocity(cameraJie, 'transition.swoopIn', {
              complete: () => {
                that.jieClock = setTimeout(() => {
                  Velocity(cameraJie, 'transition.fadeOut')
                }, 1000)
              }
            })
          }
        })
      },
    },
    components: {
      arVideo
    }
  }
</script>

<style>

</style>
