<template>
  <div class="faceu-index">
    <readyNow v-if="showReadyGo"></readyNow>
    <div class="top-back" id="faceuTop"></div>
    <div class="leap-ip-jump" id="faceuJump" v-show="step === 1"></div>
    <div class="leap-ip-speak" id="faceuSpeak" v-show="step === 2"></div>
    <div class="leap-ip-wave" id="faceuWave" v-show="step === 3"></div>
    <div class="leap-ip-good-job" id="faceuGoodjob" v-show="step === 4"></div>
    <!-- 要发送的星星 -->
    <div class="throw-stars" id="starsWrap">
      <!-- <img :src="starimg" alt="star" v-for="items, index in starNum" :key="index"> -->
    </div>
    <!-- 要发送的星星 -->
    <div class="bottom-back" id="faceuBottom"></div>
  </div>
</template>

<script>
import readyNow from '../readyNow'
import { mapState } from 'vuex'
import starimg from '../../../assets/images/faceu-star.png'
import '../../../assets/styles/faceu.styl'
import '../../../assets/gka-leap-wave-css/gka.css'
import '../../../assets/gka-leap-good-job-css/gka.css'
import '../../../assets/gka-leap-jump-css/gka.css'
import '../../../assets/gka-leap-speak-css/gka.css'
import '../../../assets/gka-faceu-back-top-css/gka.css'
import '../../../assets/gka-faceu-back-bottom-css/gka.css'
import { importAll, preloadImage } from '../../../utils/index'
import anime from 'animejs'
const goodjobImages = importAll(require.context ('../../../assets/gka-leap-good-job-css/img', false, /\.png$/))
const jumpImages = importAll(require.context ('../../../assets/gka-leap-jump-css/img', false, /\.png$/))
const speakImages = importAll(require.context ('../../../assets/gka-leap-speak-css/img', false, /\.png$/))
const waveImages = importAll(require.context ('../../../assets/gka-leap-wave-css/img', false, /\.png$/))
const topImages = importAll(require.context ('../../../assets/gka-faceu-back-top-css/img', false, /\.png$/))
const bottomImages = importAll(require.context ('../../../assets/gka-faceu-back-bottom-css/img', false, /\.png$/))
import bgm_mp3 from '../../../assets/sounds/faceu/bgm.mp3'
import leap_got_star_mp3 from '../../../assets/sounds/faceu/got-star.mp3'
import leap_speak_mp3 from '../../../assets/sounds/faceu/leap-speak.mp3'
import leap_jump_mp3 from '../../../assets/sounds/faceu/leap-jump.mp3'
import leap_jump2_mp3 from '../../../assets/sounds/faceu/leap-jump2.mp3'
import leap_wave_mp3 from '../../../assets/sounds/faceu/leap-wave.mp3'
import yahoo_mp3 from '../../../assets/sounds/faceu/yahoo.mp3'
export default {
  data() {
    return {
      starNum: 14,
      starimg,
      step: 1,
      coordinate: [],
      leapSpeak: {},
      leapThrow: {},
      leapDone: {},
      faceuDone: {},
      bgm_mp3,
      yahoo_mp3,
      leap_speak_mp3,
      leap_got_star_mp3,
      leap_jump_mp3,
      leap_jump2_mp3,
      leap_wave_mp3,
      bgm_sound: {},
      yahoo_sound: {},
      leap_speak_sound: {},
      leap_got_star_sound: {},
      leap_jump_sound: {},
      leap_jump2_sound: {},
      leap_wave_sound: {},
      showTop: false,
      showBottom: false,
      showJump: false,
      showSpeak: false,
      showWave: false,
      showGoodjob: false,
      // 要签到学生的数据
      currStudents: [],
      // 头顶星星偏移值
      starPositionOffset: 15,
      showReadyGo: false
    }
  },
  mounted() {
    let me = this
    preloadImage(topImages, function() {
      // document.querySelector('.top-back').classList.add('animation-faceu-back-top')
      document.getElementById('faceuTop').className += " animation-faceu-back-top"
      // me.showTop = true
    })
    preloadImage(bottomImages, function() {
      // document.querySelector('.bottom-back').classList.add('animation-faceu-back-bottom')
      document.getElementById('faceuBottom').className += " animation-faceu-back-bottom"
      // me.showBottom = true
    })
    preloadImage(jumpImages, function() {
      // document.querySelector('.leap-ip-jump').classList.add('animation-leap-jump')
      document.getElementById('faceuJump').className += " animation-leap-jump"
      // me.showJump = true
    })
    preloadImage(speakImages, function() {
      // document.querySelector('.leap-ip-speak').classList.add('animation-leap-speak')
      document.getElementById('faceuSpeak').className += " animation-leap-speak"
      // me.showSpeak = true
    })
    preloadImage(waveImages, function() {
      // document.querySelector('.leap-ip-wave').classList.add('animation-leap-wave')
      document.getElementById('faceuWave').className += " animation-leap-wave"
      // me.showWave = true
    })
    preloadImage(goodjobImages, function() {
      // document.querySelector('.leap-ip-good-job').classList.add('animation-good-job')
      document.getElementById('faceuGoodjob').className += " animation-good-job"
      // me.showGoodjob = true
    })
    this.bgm_sound = new Howl({
      src: [this.bgm_mp3],
      loop: true,
      volume: 0.3
    })
    this.bgm_sound.play()
    this.yahoo_sound = new Howl({
      src: [this.yahoo_mp3]
    })
    this.leap_speak_sound = new Howl({
      src: [this.leap_speak_mp3]
    })
    this.leap_got_star_sound = new Howl({
      src: [this.leap_got_star_mp3]
    })
    this.leap_jump_sound = new Howl({
      src: [this.leap_jump_mp3]
    })
    this.leap_jump2_sound = new Howl({
      src: [this.leap_jump2_mp3],
    })
    this.leap_wave_sound = new Howl({
      src: [this.leap_wave_mp3],
      loop: true
    })
    document.getElementsByTagName('body')[0].style.background = 'rgba(0, 0, 0, 0)'
    this.getStudentsData()
    // 展示AR摄像头
    if (window.setAR) window.setAR(true)
    this.leap_jump_sound.play()
    this.leap_jump2_sound.play()
    // 2s 后励步图开始讲话
    this.leapSpeak = setTimeout(() => {
      this.leap_speak_sound.play()
      this.step = 2
      // 4s 后励步兔开始发星星
      this.leapThrow = setTimeout(() => {
        this.showReadyGo = true
        this.readyGoTimeout = setTimeout(() => {
          this.showReadyGo = false
          this.leap_wave_sound.play()
          this.step = 3
          if(window.callClassroom) window.callClassroom({
            type: 'faceu',
            message: 'detectface',
            param: {}
          }, function(data) {
            if (data === 'fail') {
              console.log('>>>>>> 人脸识别失败 <<<<<<')
              return
            } else {
              console.log('接收到的人脸识别坐标数据：', JSON.parse(data))
              me.coordinate = JSON.parse(data).facedetect || []
              for (let index = 0; index < me.coordinate.length; index++) {
                let img = document.createElement('img')
                img.src = starimg
                let starsWrap = document.getElementById('starsWrap')
                if (starsWrap) starsWrap.appendChild(img)
                me.leap_got_star_sound.play()
              }
              me.flyAway(document.querySelectorAll('.throw-stars img'))
            }
          })
          // 10s 星星发放完毕
          this.leapDone = setTimeout(() => {
            this.leap_wave_sound.stop()
            this.yahoo_sound.play()
            this.step = 4
            this.faceuDone = setTimeout(() => {
              if (window.playAR) window.playAR(true)
              if(window.webviewCallBack) window.webviewCallBack({
                type: 'end',
                start: typeof this.$route.params.from === 'undefined' ? '' : this.$route.params.from,
                courseware: this.$route.params.name
              })
            }, 5000)
          }, 10000)
        }, 2000)
      }, 4000)
    }, 2000)
  },
  methods: {
    fillData(data) {
      return new Promise((resolve) => {
        for (let index = 0; index < data.length; index++) {
          const element = data[index]
          this.currStudents.push({
            studentID: element.studentID,
            changeValue: 1
          })
        }
        resolve()
      })
    },
    getStudentsData() {
      // 获取学生数据
      this.Api.fetchStudentData({
        classID: this.classID,
        lessonID: this.lessonID
      }).then(data => {
        this._checkData(data).then(data => {
          data = data.data.students
          this.fillData(data).then(() => {
            this.signin()
          })
        }).catch(error => {
          console.log('获取学生数据失败：', error)
        })
      })
    },
    signin() {
      this.Api.updateStudentsStar({
        lessonID: this.lessonID, //类型：Number  必有字段  备注：课程ID
        classID: this.classID, //类型：Number  必有字段  备注：班级ID
        interactionID: this.$route.params.interactionID, //类型：Number  必有字段  备注：互动ID
        first: true, //类型：Boolean  必有字段  备注：是否为本节课的第一个互动
        updates: this.currStudents
      }).then(data => {
        this._checkData(data).then(data => {
          console.log('====== 人脸识别签到成功！======', data)
        })
      })
    },
    flyAway(target) {
      let me = this
      anime({
        targets: target,
        opacity: {
          value: 1,
          duration: 100
        },
        rotate: 720,
        left: {
          value: function(target, index) {
            if(me.coordinate[index]) {
              return me.coordinate[index].x - document.querySelectorAll('.throw-stars img')[0].width / 2 + me.starPositionOffset + 5
            } else {
              return null
            }
          }
        },
        top: {
          value: function(target, index) {
            if(me.coordinate[index]) {
              return me.coordinate[index].y - document.querySelectorAll('.throw-stars img')[0].height / 2 - me.starPositionOffset
            } else {
              return null
            }
          }
        },
        delay: function() { return anime.random(0, 1000) },
        // duration: 2500,
        // delay: function(target, index) {
        //   return index * me._getRd(500, 3000)
        // },
        easing: 'easeOutCubic'
      })
    }
  },
  computed: {
    ...mapState({
      'students': state => state.game.studentsData,
      'lessonID': state => state.game.lessonID,
      'classID': state => state.game.classID,
      'courseID': state => state.game.courseID
    })
  },
  beforeRouteLeave: function(to, from, next) {
    console.log('======> trigger beforeRouteLeave:', this.$route.name)
    clearTimeout(this.leapSpeak)
    clearTimeout(this.leapThrow)
    clearTimeout(this.leapDone)
    clearTimeout(this.faceuDone)
    this.leap_wave_sound.stop()
    this.bgm_sound.unload()
    this.yahoo_sound.unload()
    this.leap_speak_sound.unload()
    this.leap_got_star_sound.unload()
    this.leap_jump_sound.unload()
    this.leap_wave_sound.unload()
    this.leap_jump2_sound.unload()
    next()
  },
  components: {
    readyNow
  }
}
</script>

<style>

</style>
