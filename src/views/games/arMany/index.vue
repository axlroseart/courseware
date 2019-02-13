<template>
    <div class="posi studentVideoBox"  >
        <video id="video" :src="video" style="width: 100%;height: 100%" width="100%" height="100%" loop autoplay>
        </video>
        <audio :src='music' style="display:none" loop autoplay>
        </audio>
        <img :src="arBg" alt="" class="arBg">
        <img v-show="cameraImgShow" :src="cameraImg" alt="" class="cameraImg">
        <img v-show="cameraJieShow" :src="jieImg" alt="" class="cameraJie">
        <!--<button @click="jietu" style="position: absolute;z-index: 1;">截图</button>-->
        <!--<button @click="gameOver" style="position: absolute;z-index: 1;">结束互动</button>-->
    </div>
</template>

<script>
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
        video:'',
        music:'',
        bgm_sound:'',
        interval: '',
        smallStarArrOne: []
      }
    },
    mounted() {
      document.getElementsByTagName('body')[0].style.background = 'rgba(0, 0, 0, 0)'
      this.configData = this.$route.params
      console.log('arMany.configData', this.configData)
      if (!this.configData.name) return console.log('ar没有拿到配置信息，不执行后面的逻辑！！！！！！！！！！！！')
      this.totalTime = this.configData.configuration.totalTime
      this.interactionID = this.configData.interactionID
      this.videoEle = document.querySelector('video')
      this.audioEle = document.querySelector('audio')
      this.task = this.configData.configuration.task
      this.loadData(this.task[0])
      this.totalClock = setTimeout(() => {
          this.gameOver()
      }, this.totalTime)
    },
    beforeRouteLeave: function(to, from, next) {
      console.log('ar触发beforeRouteLeave')
      // 清除renderer add by ryan
      if (this.renderer) {
        this.renderer.remove(this.smallStarAnimeOne)
        this.renderer.runStatus = false
      }
      if(this.audioEle) {
        console.log('ar课件关闭背景音乐，视频等')
        this.audioEle.pause()
      }
      if (this.videoEle) this.videoEle.pause()
      if (this.interval) clearInterval(this.interval)
      if (this.imgClock) clearTimeout(this.imgClock)
      if (this.jieClock) clearTimeout(this.jieClock)
      if (this.totalClock) clearTimeout(this.totalClock)
      next()
    },
    methods: {
      loadData(data) {
        console.log('ar多场景socket拿到的数据loadData:', data)
        this.arBg = data.foreground
        this.video = data.video
        this.music = data.music
      },
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
        if(this.audioEle) {
          console.log('ar课件关闭背景音乐，视频等')
          this.audioEle.pause()
        }
        if (this.videoEle) this.videoEle.pause()
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
    },
    watch: {
      'arData': function(data) {
        let curData = this.task[data.task_id]
        this.loadData(curData)
      }
    },
    computed: {
      ...mapState({
        // 当前进入的步骤，即显示哪个界面
        step: state => state.game.starsGameStep,
        // 语音数据
        scoreData: state => state.game.scoreData,
        lessonID: state => state.game.lessonID,
        classID: state => state.game.classID,
        courseID: state => state.game.courseID,
        arData: state => state.game.arData
      })
    }
  }
</script>

<style>

</style>
