<template>
    <div class="cosplayBox">
        <arTem v-if="step === 1 || step === 2"></arTem>
        <!--<button v-if="step === 1" @click="toTwo" style="position:absolute;z-index: 99">test</button>-->
        <object class="sahua" v-if="step === 2">
            <param :value="sahua">
            <param value="high">
            <embed class="" :src="sahua" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>
        <div v-if="step === 3" class="cosplayTou">
            <div class="logo"></div>
            <!--<img :src="caidai" alt="" class="caidai">-->
            <object class="caidai">
                <param :value="caidai">
                <param value="high">
                <embed class="" :src="caidai" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
            </object>
            <div class="cosplayCon">
                <div class="left">
                    <div class="aixin">
                        <img class="loveGrounp" :src="loveGrounp" v-show="loveGrounpShow" alt="">
                        <transition-group  name="staggered-fade"
                                           tag="ul" v-on:enter="enter">
                            <img v-for="item,index in arr" v-bind:key="index"  class="angel"  :src="angel" alt="" >
                        </transition-group>
                    </div>
                    <div class="boxCon">
                        <img class="box" :src="box" alt="">
                        <div class="numCon">{{angelNum}}</div>
                    </div>
                </div>
                <div class="center">
                    <div class="photo">
                        <img class="jietu" :src="jieImg" alt="">
                        <img class="love" :src="love" alt="">
                    </div>
                </div>
                <div class="right">
                    <div class="quan">
                        <img class="circle" :src="circle" alt="">
                        <img class="loveBig" :src="loveBig" alt="">
                        <div class="senseLeft">
                            <object >
                                <param :value="paishou">
                                <param value="high">
                                <embed class="" :src="paishou" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
                            </object>
                        </div>


                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
  import jiet from '../../../assets/images/zongbangBg.png'
  import love from '../../../assets/images/arCosplay/love.png'
  import circle from '../../../assets/images/arCosplay/circle.png'
  import loveBig from '../../../assets/images/arCosplay/loveBig.png'
  import senseLeft from '../../../assets/images/senseLeft.png'
  import angel from '../../../assets/images/arCosplay/angel.png'
  import box from '../../../assets/images/arCosplay/box.png'
  import caidai from '../../../assets/flash/caidai.swf'
  import loveGrounp from '../../../assets/images/arCosplay/loveGrounp.png'
  import sahua from '../../../assets/flash/sahua.swf'
  import '../../../assets/styles/arCosplay.styl'
  import paishou from '../../../assets/flash/paishou.swf'
  import arTem from './arTem'
  import Velocity from 'velocity-animate'
  import 'velocity-animate/velocity.ui.js'
  import { mapState } from 'vuex'
  const path = require('path')
  export default {
    data() {
      return {
        paishou,
        jiet,
        love,
        circle,
        loveBig,
        senseLeft,
        box,
        angel,
        caidai,
        sahua,
        loveGrounp,
        arr: [],
        angelNum: 0,
        step: 1,
        jieImg:'',
        loveGrounpShow: false,
        music: '',
        bgm_sound: ''
      }
    },
    beforeRouteLeave: function(to, from, next) {
      console.log('arcosplay触发beforeRouteLeave')
      if(this.bgm_sound) {
        this.bgm_sound.stop()
      }
      if (this.beginClock) clearTimeout(this.beginClock)
      if (this.twoClock) clearTimeout(this.twoClock)
      if (this.time) clearInterval(this.time)
      if (this.timeStar) clearInterval(this.timeStar)
      if (this.zanTime) clearInterval(this.zanTime)
      next()
    },
    mounted() {
      let that = this
      document.getElementsByTagName('body')[0].style.background = 'rgba(0, 0, 0, 0)'
      // setTimeout(() => {
      //   that.jietu()
      // }, 10000)
      if (that.$route.params.name) {
        that.curConfigData = this.$route.params
        console.log('arCosplay.curConfigData', this.$route.params)
        that.interactionID = that.curConfigData.interactionID
        this.music = this.curConfigData.configuration.music
        if (this.music) {
          this.bgm_sound = new Howl({
            src: [this.music],
            loop: true
          })
          this.bgm_sound.play()
        }
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
        //         break
        //       }
        //     }
        //     that.interactionID = that.curConfigData.interactionID
        //   })
        // })
      }
    },
    components: {
      arTem
    },
    watch: {
      'stepData': function(val) {
        console.log('获得去第二步的数据stepData', val.interaction_id)
        if (val.interaction_id === this.interactionID) this.toTwo()
      }
    },
    computed: {
      ...mapState({
        // 进入第二步
        stepData: state => state.game.stepData,
        lessonID: state => state.game.lessonID,
        classID: state => state.game.classID,
        courseID: state => state.game.courseID
      })
    },
    methods: {
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
        let player = window.webjs.createPlayer()
        let currentdate = this.getNowFormatDate()+'.bmp'
        let localData = 'http://localhost/ScreenShot/'+currentdate
        this.jieImg = localData
        player.ScreenShot('.\\ScreenShot', currentdate)
      },
      toTwo() {
        this.step = 2
        this.beginClock = setTimeout(() => {
          this.jieImg = `file://${path.resolve(__dirname, './ScreenShot')}`+'/'+window.ScreenShotData.fileName+'.bmp'
          console.log(this.jieImg)
          this.step = 3
          this.twoClock = setTimeout(() => {
            Velocity(document.getElementsByClassName('jietu')[0], 'transition.bounceIn')
            this.beginTou()
          }, 20)
        }, 3000)
      },
      beginTou() {
        let that = this
        let jiange = 400
        let allNum = 6000 / jiange
        let num = 0
        this.time = setInterval(() => {
          this.Api.fetchArZan({
            classID: that.classID,
            lessonID: that.lessonID,
            interactionID: that.interactionID
          }).then(data => {
            that._checkData(data).then(data => {
              this.suanZan(data.data.star)
            })
          })
          num++
          if (num >= allNum){
            clearInterval(this.time)
            this.beginTouFlag = true
          }
        }, jiange)
      },
      suanZan(star) {
        let allStar = star
        let nowStar = 0
        this.timeStar = setInterval(() => {
          this.chuZan()
          nowStar++
          if (nowStar >= allStar) {
            clearInterval(this.timeStar)
            this.suanZanFlag = true
          }
        }, 100)
      },
      chuZan() {
        this.angelNum++
        let num = 0
        let allNum = 5
        this.zanTime = setInterval(() => {
          this.arr.push(1)
          num++
          if (num >= allNum) {
            clearInterval(this.zanTime)
            this.chuZanFlag = true
          }
        }, 100)
      },
      test(index) {
        if(index % 4 === 0){
          return 'angelFour'
        } else if (index % 4 === 1) {
          return 'angelOne'
        } else if (index % 4 === 2) {
          return 'angelTwo'
        } else if (index % 4 === 3) {
          return 'angelThree'
        }
      },
      enter(el) {
        let that = this
        var left = Math.random()*1.26 +'rem'
        var width = Math.random()*0.3+0.3 +'rem'
        el.style.width = width
        el.style.left = left
        Velocity(el, {bottom: '2.8rem'}, { duration: 2000, complete: function() {
          setTimeout(() => {
            if (that.chuZanFlag && that.suanZanFlag && that.beginTouFlag) {
              // let ele = document.getElementsByClassName('numCon')[0]
              // Velocity(ele, 'transition.bounceIn', { duration: 1000, loop: true })
            }
          }, 2000)
        }})
      }
    }
  }
</script>

<style>

</style>