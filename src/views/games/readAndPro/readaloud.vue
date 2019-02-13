<template>
  <div class="read-pro">
    <div class="title">
      <!-- <label>{{ currWord }}</label>
      <img :src="titleBack" alt=""> -->
      <div class="static-area">
      <div class="mic-man">
        <object class="" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        :width="flashW" :height="flashH" >
        <param :value="micMan">
        <param value="high">
        <embed :src="micMan" wmode="transparent" quality=high :WIDTH="flashW" :HEIGHT="flashH" NAME="myMovieName" ALIGN="" TYPE="application/x-shockwave-flash"></embed>  
        </object>
      </div>
      <div class="title title-words">
        <el-progress :text-inside="true" :stroke-width="12" :percentage="wordsSwitchCountDownPercent" class="words-switch-count-down">
          <div class="progress-star"></div>
        </el-progress>
        <transition-group name="slide-fade" enter-active-class="animated shake" leave-active-class="animated zoomOut">
          <span v-for="items, index in wordArr" v-show="items.value === currWord" :key="index">
            <object class="title-words-switch" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">
            <param :value="switchWord">
            <param value="high">
            <embed :src="switchWord" wmode="transparent" quality=high WIDTH="700" HEIGHT="400" NAME="myMovieName" ALIGN="" TYPE="application/x-shockwave-flash"></embed>  
            </object>
            {{ items.value }}
          </span>
        </transition-group>
      </div>
    </div>
      <i class="icon-star-face">
        <img :src="starImg" :alt="starImg">
      </i>
      <!-- <div class="icon-record">
        <div v-show="startRecord">
          <svg class="equilizer wave-left" viewBox="0 0 128 128">
            <g>
              <title>Audio Equilizer</title>
              <rect class="bar" transform="translate(0,0)" y="15"></rect>
              <rect class="bar" transform="translate(25,0)" y="15"></rect>
              <rect class="bar" transform="translate(50,0)" y="15"></rect>
            </g>
          </svg>
          <svg class="equilizer wave-right" viewBox="0 0 128 128">
            <g>
              <title>Audio Equilizer</title>
              <rect class="bar" transform="translate(0,0)" y="15"></rect>
              <rect class="bar" transform="translate(25,0)" y="15"></rect>
              <rect class="bar" transform="translate(50,0)" y="15"></rect>
            </g>
          </svg>
        </div>
      </div> -->
    </div>

    <div class="score-area">
      <div class="avatar-list">
        <ul>
            <transition-group mode="out-in" enter-active-class="animated bounceIn"  leave-active-class="animated zoomOut">
              <li v-for="items, index in dataArr" :key="index" :class="'score-data-li-' + items.value">
                <transition mode="out-in" enter-active-class="animated shake"  leave-active-class="animated zoomOut">
                  <span :class="'score-number score-number-gold ' + items.name" v-if="items.value === 3">+3</span>
                  <span :class="'score-number score-number-silver ' + items.name" v-else-if="items.value === 2">+2</span>
                  <span :class="'score-number score-number-normal ' + items.name" v-else-if="items.value === 1">+1</span>
                </transition>
                <!-- 得分展示 Perfect Great Cool -->
                <!-- <transition mode="out-in" enter-active-class="animated shake"  leave-active-class="animated zoomOut"> -->
                  <!-- <span :class="'perfect showoff ' + items.name" v-if="items.value === 3"></span>
                  <span :class="'great showoff ' + items.name" v-else-if="items.value === 2"></span>
                  <span :class="'cool showoff ' + items.name" v-else-if="items.value ===1"></span> -->
                  <span class="perfect showoff" v-if="items.value === 3"></span>
                  <span class="great showoff" v-else-if="items.value === 2"></span>
                  <span class="cool showoff" v-else-if="items.value ===1"></span>
                <!-- </transition> -->
                <!-- 得分展示 perfect Great -->
                <!-- 头像 -->
                <!-- <transition mode="out-in" enter-active-class="animated bounceIn"  leave-active-class="animated zoomOut"> -->
                  <div class="avatar">
                    <div class="wrap"></div>
                    <div class="inside">
                      <img :src="items.avatar_url" alt="">
                    </div>
                    <span>{{ items.name }}</span>
                  </div>
                <!-- </transition> -->
                <!-- 头像 -->
              </li>
            </transition-group>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import anime from 'animejs'
import titleBack from '../../../assets/images/title-back.png'
import starHappy from '../../../assets/images/happystar.png'
import starFine from '../../../assets/images/finestar.png'
import starSoso from '../../../assets/images/sosostar.png'
import starSad from '../../../assets/images/sadstar.png'
import gamebgm from '../../../assets/sounds/grabstarbgm.mp3'
import countdownbgm from '../../../assets/sounds/countdown.mp3'
import showAvatarbgm from '../../../assets/sounds/cool.mp3'
import showAvatarbgmAmazing from '../../../assets/sounds/great.mp3'
import showAvatarbgmPerfect from '../../../assets/sounds/perfect.mp3'
import micMan from '../../../assets/flash/micMan.swf'
import switchWord from '../../../assets/flash/switch.swf'
import happySound from '../../../assets/sounds/happy.mp3'
import sadSound from '../../../assets/sounds/sad.mp3'
import fineSound from '../../../assets/sounds/fine.mp3'
import sosoSound from '../../../assets/sounds/so-so.mp3'
import '../../../assets/styles/readandpro.styl'
import avatar from '../../../assets/images/avatar.png'
export default {
  data() {
    return {
      titleBack: titleBack,
      micMan: micMan,
      avatar: avatar,
      startRecord: true,
      gamebgm: gamebgm,
      countdownbgm: countdownbgm,
      showAvatarbgm: showAvatarbgm,
      showAvatarbgmPerfect: showAvatarbgmPerfect,
      showAvatarbgmAmazing: showAvatarbgmAmazing,
      switchWord: switchWord,
      happySound: happySound,
      sadSound: sadSound,
      fineSound: fineSound,
      sosoSound: sosoSound,
      flashW: 400,
      flashH: 300,
      dataArr: [],
      wordArr: [
        {
          value: 'happy'
        },
        {
          value: 'fine'
        },
        {
          value: 'sad'
        },
        {
          value: 'so-so'
        }
      ],
      // 游戏倒计时
      gameCountdown: 8000,
      wordsSwitchCountDownPercent: 0,
      countDownClock: 0,
      thisBgm: {}
    }
  },
  mounted() {
    // // 背景音乐
    this.thisBgm = new Audio(gamebgm)
    this.thisBgm.play()
    this.loops()
  },
  methods: {
    // 8s 倒计时
    runProgress: function() {
      this.wordsSwitchCountDownPercent = 0
      this.countDownClock = setInterval(() => {
        this.playSounds(this.countdownbgm)
        if (this.wordsSwitchCountDownPercent === 100) {
          this.wordsSwitchCountDownPercent = 100
          clearInterval(this.countDownClock)
          return
        }
        this.wordsSwitchCountDownPercent = this.wordsSwitchCountDownPercent + 12.5
      }, 1000)
    },
    playSounds: function(sound) {
      let audio = new Audio(sound)
      audio.play()
    },
    loops: function() {
      return new Promise((resolve, reject) => {
        this.showSwitcFlash = true
        this.$store.dispatch('setCurrGameWord', 'happy')
        this.runProgress()
        // this.playSounds(this.happySound)
        this.$store.dispatch('connecttoend', {
          type: 3,
          name: 'happy',
          index: 5
        })
        this.dataArr = []
        resolve()
      }).then(() => {
        return new Promise((resolve) => {
          this.showSwitcFlash = false
          setTimeout(() => {
            this.$store.dispatch('setCurrGameWord', 'fine')
            clearInterval(this.countDownClock)
            this.runProgress()
            // this.playSounds(this.fineSound)
            this.showSwitcFlash = true
            this.$store.dispatch('connecttoend', {
              type: 3,
              name: 'fine',
              index: 5
            })
            this.dataArr = []
            resolve()
          }, this.gameCountdown)
        })
      }).then(() => {
        return new Promise((resolve) => {
          this.showSwitcFlash = false
          setTimeout(() => {
            this.$store.dispatch('setCurrGameWord', 'sad')
            clearInterval(this.countDownClock)
            this.runProgress()
            // this.playSounds(this.sadSound)
            this.showSwitcFlash = true
            this.$store.dispatch('connecttoend', {
              type: 3,
              name: 'sad',
              index: 5
            })
            this.dataArr = []
            resolve()
          }, this.gameCountdown)
        })
      }).then(() => {
        return new Promise((resolve) => {
          this.showSwitcFlash = false
          setTimeout(() => {
            this.$store.dispatch('setCurrGameWord', 'so-so')
            clearInterval(this.countDownClock)
            this.runProgress()
            // this.playSounds(this.sosoSound)
            this.showSwitcFlash = true
            this.$store.dispatch('connecttoend', {
              type: 3,
              name: 'so-so',
              index: 5
            })
            this.dataArr = []
            resolve()
          }, this.gameCountdown)
        })
      }).then(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.$store.dispatch('endthisshit', {
              index: 5
            })
            this.thisBgm.pause()
            this.thisBgm.currentTime = 0.0
            this.$store.dispatch('setStarsGameStep', 'rank')
            resolve()
          }, this.gameCountdown)
        })
      })
    }
  },
  watch: {
    // 'dataArr': function(val, newVal) {
    //   // 数据都更新完毕后，执行最后数组最后一位的动画
    //   if (typeof newVal[newVal.length - 1] !== 'undefined') {
    //     this.$nextTick(function() {
    //       anime({
    //         targets: '.avatar-list li span.' + newVal[newVal.length - 1].name + '',
    //         translateY: -120,
    //         scale: [0.5, 1],
    //         duration: 1000
    //       })
    //     })
    //   }
    // },
    'scoreData': function(val, newVal) {
      if (typeof val.value !== 'undefined') {
        // 普通上墙音效
        if (val.value === 1) {
          this.playSounds(this.showAvatarbgm)
        // 2级音效
        } else if (val.value === 2) {
          this.playSounds(this.showAvatarbgmAmazing)
        // 3级音效
        } else if (val.value === 3) {
          this.playSounds(this.showAvatarbgmPerfect)
        }
        for (let index = 0; index < this.dataArr.length; index++) {
          const element = this.dataArr[index]
          if (val.name === element.name) {
            this.dataArr.splice(this.dataArr.indexOf(element), 1)
          }
        }
        this.dataArr.push(val)
        // 数据更新后，执行动画
        this.$nextTick(function() {
          anime({
            targets: '.avatar-list li span.' + val.name + '',
            opacity: 1,
            duration: 1400
          })
        })
        // return finalArr
      }
    }
  },
  computed: {
    // 星星表情图片
    starImg: function() {
      switch (this.currWord) {
        case 'happy':
          return starHappy
        case 'fine':
          return starFine
        case 'so-so':
          return starSoso
        case 'sad':
          return starSad
      }
    },
    ...mapState({
      // 当前进入的步骤，即显示哪个界面
      step: state => state.game.starsGameStep,
      currWord: state => state.game.currWord,
      // 语音数据
      scoreData: state => state.game.scoreData
    })
  }
}
</script>

<style>

</style>
