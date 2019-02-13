<template>
  <div class="body-sense">
    <div class="top-part">
      <div class="count-down-clock"></div>
      <div class="title">
        <label class="Sassoon">{{ typeof title !== 'undefined' ? title : 'Choose the word.' }}</label>
      </div>
      <el-progress type="circle" :percentage="percentage" status="exception" :width="120" :stroke-width="14" color="#FF6161"></el-progress>
    </div>

    <div class="choose-area clearfix">
      <ul>
        <li :class="'birdie float-left ' + wordsArray[0]">
          <div class="inside">
            <img :src="getBodySenseImg(wordsArray[0])" :alt="wordsArray[0]">
            <transition enter-active-class="animated bounceIn"  leave-active-class="animated zoomOut">
              <object class="flash-clap leg" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" v-show="showFlash">
              <param :value="clapleg">
              <param value="high">
              <embed :src="clapleg" wmode="transparent" quality=high :WIDTH="flashPx" :HEIGHT="flashPx" NAME="myMovieName" ALIGN="" TYPE="application/x-shockwave-flash"></embed>  
              </object>
            </transition>
            <p v-show="wordsArray[0] === 'birdie_sad'">{{ wordsArray[0].split('_')[1] }}</p>
          </div>
          <i class="icon-checkmark" v-show="answer === wordsArray[0]"></i>
        </li>
        <li :class="'ben float-right ' + wordsArray[1]">
          <div class="inside">
            <img :src="getBodySenseImg(wordsArray[1])" :alt="wordsArray[1]">
            <transition mode="out-in" enter-active-class="animated bounceIn"  leave-active-class="animated zoomOut">
              <object class="flash-clap hand" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" v-show="showFlash">
              <param :value="claphand">
              <param value="high">
              <embed :src="claphand" wmode="transparent" quality=high :WIDTH="flashPx" :HEIGHT="flashPx" NAME="myMovieName" ALIGN="" TYPE="application/x-shockwave-flash"></embed>  
              </object>
            </transition>
            <p v-show="wordsArray[1] === 'birdie_fine'">{{ wordsArray[1].split('_')[1] }}</p>
          </div>
          <i class="icon-checkmark" v-show="answer === wordsArray[1]"></i>
        </li>
      </ul>
    </div>

    <div class="result-area">
      <ul>
        <li class="result-list float-left">
          <div class="result">
            <ul>
              <transition-group mode="out-in" enter-active-class="animated bounceIn"  leave-active-class="animated zoomOut">
                <li v-for="items, index in childs_left" :class="items.name + ' left'" :key="index">
                  <img :src="items.avatar_url" :alt="items.name">
                  <p>{{ items.name }}</p>
                  <transition mode="out-in" enter-active-class="animated shake"  leave-active-class="animated zoomOut">
                    <i class="icon-star" v-show="showLeftStar"></i>
                  </transition>
                  <!-- <span>+ 1</span> -->
                </li>
              </transition-group>
            </ul>
          </div>
        </li>
        <li class="result-list float-right">
          <div class="result">
            <ul>
              <transition-group mode="out-in" enter-active-class="animated bounceIn"  leave-active-class="animated zoomOut">
                <li v-for="items, index in childs_right" :class="items.name + 'right'" :key="index">
                  <img :src="items.avatar_url" :alt="items.name">
                  <p>{{ items.name }}</p>
                  <transition mode="out-in" enter-active-class="animated shake"  leave-active-class="animated zoomOut">
                    <i class="icon-star" v-show="showRightStar"></i>
                  </transition>
                  <!-- <span>+ 1</span> -->
                </li>
              </transition-group>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import anime from 'animejs'
import '../../../assets/styles/bodysense.styl'
import birdie from '../../../assets/images/birdie.png'
import ben from '../../../assets/images/ben.png'
import avatar from '../../../assets/images/avatar.png'
import happy from '../../../assets/images/happy.png'
import fine from '../../../assets/images/fine.png'
import sad from '../../../assets/images/sad.png'
import birdieFine from '../../../assets/images/birdie_fine.png'
import birdieSad from '../../../assets/images/birdie_sad.png'
import yesImg from '../../../assets/images/yes.png'
import noImg from '../../../assets/images/no.png'
import soso from '../../../assets/images/so-so.png'
import clapleg from '../../../assets/flash/clapleg.swf'
import claphand from '../../../assets/flash/claphand.swf'
import countdownbgm from '../../../assets/sounds/countdown.mp3'
import showAnswers from '../../../assets/sounds/showAnswers.mp3'
import correctSound from '../../../assets/sounds/correct.mp3'
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      birdie: birdie,
      ben: ben,
      happy: happy,
      fine: fine,
      sad: sad,
      soso: soso,
      birdieFine: birdieFine,
      birdieSad: birdieSad,
      countdownbgm: countdownbgm,
      showAnswers: showAnswers,
      correctSound: correctSound,
      yesImg: yesImg,
      noImg: noImg,
      clapleg: clapleg,
      claphand: claphand,
      percentage: 0,
      flashPx: 110,
      // title: 'Choose the word.',
      avatar: avatar,
      childs: [],
      chooseArray: [],
      protoUrl: 'static/assets/protos/teacher.proto',
      protoQuery: 'cspb.StartInteractionReq',
      // 是否显示引导动作flash
      showFlash: false,
      showLeftStar: false,
      showRightStar: false,
      countDownClock: 0
    }
  },
  mounted() {
    // 重置抢星星游戏的步骤
    this.$store.dispatch('setStarsGameStep', 'ready')
    this.$store.dispatch('setExcutedCommand', 'standby')
    // this.$store.dispatch('setExcutedCommand', 'go')
    // setTimeout(() => {
    //   this.$store.dispatch('fetchUserScoreData', {
    //     name: 'Carl',
    //     value: 1
    //   })
    // }, 1300)
    // setTimeout(() => {
    //   this.$store.dispatch('fetchUserScoreData', {
    //     name: 'Carl',
    //     value: 2
    //   })
    // }, 1010)
    // setTimeout(() => {
    //   this.$store.dispatch('fetchUserScoreData', {
    //     name: 'Trah',
    //     value: 2
    //   })
    // }, 1010)
    // setTimeout(() => {
    //   this.$store.dispatch('fetchUserScoreData', {
    //     name: 'Ted',
    //     value: 1
    //   })
    // }, 1600)
    // setTimeout(() => {
    //   this.clockCountDown()
    // }, 6000)
    // setTimeout(() => {
    //   this.$store.dispatch('fetchUserScoreData', {
    //     name: 'Luca',
    //     value: 1
    //   })
    // }, 1300)
    console.log('bodysense title: ', this.title)
    anime({
      targets: '.title label',
      translateY: 200,
      duration: 1001
    })
  },
  methods: {
    playSounds: function(sound) {
      let audio = new Audio(sound)
      audio.play()
    },
    clockCountDown() {
      this.percentage = 0
      this.countDownClock = setInterval(() => {
        if (this.percentage !== 100) {
          this.playSounds(this.countdownbgm)
        } else if (this.percentage === 100) {
          this.percentage = 100
          clearInterval(this.countDownClock)
          this.showFlash = false
          if (this.answer === this.wordsArray[0]) {
            this.showLeftStar = true
          } else if (this.answer === this.wordsArray[1]) {
            this.showRightStar = true
          }
          return
        }
        this.percentage = this.percentage + 10
      }, 1000)
    },
    getBodySenseImg(code) {
      switch (code) {
        case 'happy':
          return this.happy
        case 'fine':
          return this.fine
        case 'sad':
          return this.sad
        case 'so-so':
          return this.soso
        case 'birdie':
          return this.birdie
        case 'ben':
          return this.ben
        case 'birdie_fine':
          return this.birdieFine
        case 'birdie_sad':
          return this.birdieSad
        case 'yes':
          return this.yesImg
        case 'no':
          return this.noImg
      }
    }
  },
  watch: {
    'scoreData': function(val, newVal) {
      this.playSounds(this.correctSound)
      // 去重
      for (let index = 0; index < this.childs.length; index++) {
        const element = this.childs[index]
        if (val.name === element.name) {
          this.childs.splice(this.childs.indexOf(index), 1)
        }
      }
      this.childs.push(val)
      this.$nextTick(() => {
        // 下方小朋友得分情况动画
        anime({
          targets: '.result li.' + val.name + '',
          opacity: 1,
          duration: 1000,
          delay: function(target, index) {
            return index * 100
          }
        })
      })
    },
    'percentage': function(val, newVal) {
      if (val === 100) {
        this.playSounds(this.showAnswers)
        // 正确答案背景色变化
        anime({
          targets: '.body-sense .choose-area li.' + this.answer + ' .inside',
          // backgroundColor: '#28D775',
          borderColor: '#28D775',
          easing: 'easeInOutQuad',
          duration: 1500
        })
        // 对号出现动画
        anime({
          targets: 'i.icon-checkmark',
          opacity: 1,
          translateY: 250,
          duration: 888
        })
      }
    },
    'wordsArray': function(val, newVal) {
      if (val !== newVal) {
        // 词组变了，清空得分情况数组，清空倒计时
        this.childs = []
        this.percentage = 0
        // 对号出现动画
        anime({
          targets: 'i.icon-checkmark',
          translateY: -250,
          opacity: 0,
          duration: 300
        })
        // 正确答案背景色变化
        anime({
          targets: '.body-sense .choose-area li',
          backgroundColor: '#FFF',
          easing: 'easeInOutQuad',
          duration: 1500
        })
        // setTimeout(() => {
        //   this.clockCountDown()
        // }, 6000)
      }
    },
    'go': function(val, newVal) {
      if (val === 'go') {
        this.showFlash = true
        let me = this
        this.clockCountDown()
        this.$store.dispatch('connecttoend', {
          // 1为体感游戏
          type: 1,
          name: me.eventName,
          index: 4
        })
      } else if (val === 'exit') {
        clearInterval(this.countDownClock)
        this.$store.dispatch('endthisshit', {
          index: 4
        })
        this.$store.dispatch('resetUserCommand', '')
        // 对号出现动画
        anime({
          targets: 'i.icon-checkmark',
          translateY: -250,
          opacity: 0,
          duration: 300
        })
        // 正确答案背景色变化
        anime({
          targets: '.body-sense .choose-area li',
          backgroundColor: '#FFF',
          easing: 'easeInOutQuad',
          duration: 1500
        })
      }
    }
  },
  computed: {
    childs_left: function() {
      return this.childs.filter(function(data) {
        return data.value === 2
      })
    },
    childs_right: function() {
      return this.childs.filter(function(data) {
        return data.value === 1
      })
    },
    ...mapState({
      scoreData: state => state.game.scoreData,
      eventCommand: state => state.game.command,
      go: state => state.game.excuted
    }),
    ...mapGetters({
      wordsArray: 'getBodySenseWords',
      answer: 'getAnswer',
      eventName: 'getHirenderEvent',
      title: 'getBodySenseTitle'
    })
  }
}
</script>

<style>

</style>
