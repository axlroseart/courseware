<template>
  <div class="grab-back">
    <div class="static-area">
      <div class="mic-man">
        <object class="flash-clap hand" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        :width="flashW" :height="flashH" >
        <param :value="micMan">
        <param value="high">
        <embed :src="micMan" wmode="transparent" quality=high :WIDTH="flashW" :HEIGHT="flashH" NAME="myMovieName" ALIGN="" TYPE="application/x-shockwave-flash"></embed>  
        </object>
      </div>
      <!-- <div class="title">{{ currWord }}</div> -->
      <div class="title title-words">
        <el-progress :text-inside="true" :stroke-width="12" :percentage="wordsSwitchCountDownPercent" class="words-switch-count-down">
          <div class="progress-star"></div>
        </el-progress>
        <transition-group name="slide-fade" enter-active-class="animated shake" leave-active-class="animated zoomOut">
          <!-- <div class="loader" v-for="items, index in wordArr" v-if="items.value === currWord" :key="index">
            <div class="loader__mask">
              <div class="loader__text loader__text--progress">{{ items.value }}</div>
            </div>
            <div class="loader__text loader__text--preload">{{ items.value }}</div>
          </div> -->
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
      <!-- 录音麦克风 -->
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
    <div class="flow-stars" 
      :class="{ shape: shape }"
      v-for="items, index in stars" 
      :style="'top: ' + items.top + '; left: ' + items.left + ';'"
      :key="index">
      <transition name="slide-fade" enter-active-class="animated shake" leave-active-class="animated zoomOut">
        <img class="star-img star" :src="starImg" :alt="currWord" :style="'transform: scale(' + items.scale + ')'" v-show="items.showStar">
      </transition>
      <div class="halo">
        <!-- 高分效果 -->
        <transition-group mode="out-in" enter-active-class="animated zoomIn"  leave-active-class="animated zoomOut" v-if="items.value === 2">
          <div :key="index">
            <div class="score-star score-star-gold">+2</div>
            <div :class="'back-light back-light-gold ' + items.name"></div>
            <div class="border-two-gold"></div>
            <div class="border-one-gold">
              <img :src="items.avatar_url" alt="">
            </div>
            <span class="name name-gold">{{ items.name }}</span>
          </div>
        </transition-group>
        <!-- 高分效果 -->

        <!-- 中等效果 -->
        <transition-group mode="out-in" enter-active-class="animated zoomIn" leave-active-class="animated zoomOut" v-else-if="items.value === 3">
          <div :key="index">
            <div class="score-star score-star-silver"></div>
            <div :class="'back-light back-light-silver' + items.name"></div>
            <div class="border-two-silver"></div>
            <div class="border-one-silver">
              <img :src="items.avatar_url" alt="">
            </div>
            <span class="name name-silver">{{ items.name }}</span>
          </div>
        </transition-group>
        <!-- 中等效果 -->
        
        <!-- 普通效果 -->
        <transition-group mode="out-in" enter-active-class="animated zoomIn" leave-active-class="animated zoomOut" v-else-if="items.value === 1">
          <div :key="index">
            <div class="score-star score-star-normal">+1</div>
            <!-- <div class="border-two-normal"></div> -->
            <div class="border-one-normal">
              <img :src="items.avatar_url" alt="">
            </div>
            <span class="name name-normal">{{ items.name }}</span>
          </div>
        </transition-group>
        <!-- 普通效果 -->
        <div v-show="items.value === 2">
          <i class="icon-white-star" data-x="5" style="top: 0; left: 10%; transform: scale(0.3)"></i>
          <i class="icon-white-star" data-x="10" style="top: 80px; left: 20%; transform: scale(0.5)"></i>
          <i class="icon-white-star" data-x="6" style="top: -30px; left: 50%; transform: scale(0.7)"></i>
          <i class="icon-white-star" data-x="2" style="top: -10px; left: 70%; transform: scale(0.9)"></i>
          <i class="icon-white-star" data-x="4" style="top: -50px; left: 62%; transform: scale(0.8)"></i>
          <i class="icon-white-star" data-x="7" style="top: 90px; left: 70%; transform: scale(0.4)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import anime from 'animejs'
// import starHappy from '../../../assets/images/happystar.png'
// import starFine from '../../../assets/images/finestar.png'
// import starSoso from '../../../assets/images/sosostar.png'
// import starSad from '../../../assets/images/sadstar.png'
import standardStar from '../../../assets/images/grab-stars.png'
import avatar from '../../../assets/images/avatar.png'
import gamebgm from '../../../assets/sounds/grabstarbgm.mp3'
import countdownbgm from '../../../assets/sounds/countdown.mp3'
import showAvatarbgm from '../../../assets/sounds/showAvatar.mp3'
import showAvatarbgmAmazing from '../../../assets/sounds/amazing.mp3'
import micMan from '../../../assets/flash/micMan.swf'
import switchWord from '../../../assets/flash/switch.swf'
import happySound from '../../../assets/sounds/happy.mp3'
import sadSound from '../../../assets/sounds/sad.mp3'
import fineSound from '../../../assets/sounds/fine.mp3'
import sosoSound from '../../../assets/sounds/so-so.mp3'
import { getRd, getRandom } from '../../../utils/index'
export default {
  data() {
    return {
      shape: false,
      avatar: avatar,
      gamebgm: gamebgm,
      micMan: micMan,
      countdownbgm: countdownbgm,
      showAvatarbgm: showAvatarbgm,
      showAvatarbgmAmazing: showAvatarbgmAmazing,
      switchWord: switchWord,
      happySound: happySound,
      sadSound: sadSound,
      fineSound: fineSound,
      sosoSound: sosoSound,
      flashW: 400,
      flashH: 300,
      // 是否开始收集语音
      startRecord: true,
      // 14位数组
      arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      // 数组操作后返回的新数组
      currArr: [],
      recordDataSingle: {
        id: 9,
        name: 'Lucas',
        value: 88
      },
      // 飘落的星星
      stars: [],
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
      randomStarNum: 0,
      randomNumArr: [],
      wordsSwitchCountDownPercent: 0,
      countDownClock: 0,
      thisBgm: {}
    }
  },
  mounted() {
    // // 背景音乐
    this.thisBgm = new Audio(gamebgm)
    this.thisBgm.play()
    this.setCurrWord()
    this.createStars()
    // this.runProgress()
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
    resetDataArr() {
      // for (let index = 0; index < this.stars.length; index++) {
      //   const element = this.stars[index]
      //   element.value = 0
      //   element.name = ''
      //   element.avatar_url = ''
      //   element.showStar = false
      // }
      // let stars = document.querySelectorAll('.star-img')
      // for (let index = 0; index < stars.length; index++) {
      //   const element = stars[index]
      //   element.style.opacity = 0
      // }
      // this.starsMovement()
    },
    createStars() {
      this.stars = []
      let starNum = 27
      setTimeout(() => {
        for (let index = 0; index < starNum; index++) {
          this.stars.push({
            id: index,
            value: 0,
            name: '',
            avatar_url: '',
            showStar: true
            // scale: '0.' + Math.floor(Math.random() * 4 + 3) + ''
          })
          switch (index) {
            case 0:
              this.stars[index].top = '15%'
              this.stars[index].left = '5%'
              break
            case 1:
              this.stars[index].top = '57%'
              this.stars[index].left = '7%'
              break
            case 2:
              this.stars[index].top = '10%'
              this.stars[index].left = '13%'
              break
            case 3:
              this.stars[index].top = '40%'
              this.stars[index].left = '6%'
              break
            case 4:
              this.stars[index].top = '33%'
              this.stars[index].left = '20%'
              break
            case 5:
              this.stars[index].top = '55%'
              this.stars[index].left = '24%'
              break
            case 6:
              this.stars[index].top = '32%'
              this.stars[index].left = '30%'
              break
            case 7:
              this.stars[index].top = '69%'
              this.stars[index].left = '24%'
              break
            case 8:
              this.stars[index].top = '30%'
              this.stars[index].left = '40%'
              break
            case 9:
              this.stars[index].top = '70%'
              this.stars[index].left = '0'
              break
            case 10:
              this.stars[index].top = '47%'
              this.stars[index].left = '44%'
              break
            case 11:
              this.stars[index].top = '38%'
              this.stars[index].left = '48%'
              break
            case 12:
              this.stars[index].top = '59%'
              this.stars[index].left = '52%'
              break
            case 13:
              this.stars[index].top = '65%'
              this.stars[index].left = '60%'
              break
            case 14:
              this.stars[index].top = '45%'
              this.stars[index].left = '59%'
              break
            case 15:
              this.stars[index].top = '10%'
              this.stars[index].left = '73%'
              break
            case 16:
              this.stars[index].top = '30%'
              this.stars[index].left = '67%'
              break
            case 17:
              this.stars[index].top = '0'
              this.stars[index].left = '83'
              break
            case 18:
              this.stars[index].top = '76%'
              this.stars[index].left = '53%'
              break
            case 19:
              this.stars[index].top = '71%'
              this.stars[index].left = '10%'
              break
            case 20:
              this.stars[index].top = '70%'
              this.stars[index].left = '86%'
              break
            case 21:
              this.stars[index].top = '17%'
              this.stars[index].left = '86%'
              break
            case 22:
              this.stars[index].top = '53%'
              this.stars[index].left = '70%'
              break
            case 23:
              this.stars[index].top = '36%'
              this.stars[index].left = '84%'
              break
            case 24:
              this.stars[index].top = '70%'
              this.stars[index].left = '78%'
              break
            case 25:
              this.stars[index].top = '58%'
              this.stars[index].left = '37%'
              break
            case 26:
              this.stars[index].top = '53%'
              this.stars[index].left = '80%'
              break
            case 27:
              this.stars[index].top = '77%'
              this.stars[index].left = '56%'
              break
          }
        }
      }, 500)
      this.starsMovement()
    },
    // 语音收集数据，并根据分数分别投屏（单个数据收集）
    // showToScreen_single() {
    //   this.$store.dispatch('fetchUserScoreData')
    // },
    // 根据课件内容和Hirender事件指令做当前单词内容设置
    starsMovement() {
      setTimeout(() => {
        // 满屏星星动态效果
        anime({
          targets: 'img.star-img',
          opacity: 1,
          translateY: 15,
          scale: [
            { value: 0.5, duration: 500 },
            { value: 0.5, duration: 50, delay: 1000, easing: 'easeOutExpo' },
            { value: 0.5, duration: 450 },
            { value: 0.5, duration: 50, delay: 1000, easing: 'easeOutExpo' },
            { value: 0.5, duration: 450 }
          ],
          duration: function() { return anime.random(800, 1600) },
          delay: function() { return anime.random(0, 1000) }
        })
      }, 500)
    },
    setCurrWord() {
      this.stars = []
      // 如果是前两个词
      if (this.eventCommand === 'grabstars1') {
        return new Promise((resolve, reject) => {
          this.$store.dispatch('connecttoend', {
            type: 2,
            name: 'happy',
            index: 1
          })
          this.$store.dispatch('setCurrGameWord', 'happy').then(() => {
            // document.querySelector('.loader').classList.add('loader-go')
            this.runProgress()
            this.playSounds(happySound)
            setTimeout(() => {
              this.createStars()
              this.$store.dispatch('setCurrGameWord', 'fine')
              clearInterval(this.countDownClock)
              this.runProgress()
              this.playSounds(fineSound)
              this.$store.dispatch('connecttoend', {
                type: 2,
                name: 'fine',
                index: 1
              })
              // 待数据更新后，添加动画样式
              // setTimeout(() => {
              // document.querySelector('.loader').classList.add('loader-go')
              // }, 500)
              resolve()
            }, this.gameCountdown)
          })
        }).then(() => {
          setTimeout(() => {
            this.$store.dispatch('endthisshit', {
              index: 1
            })
            this.thisBgm.pause()
            this.thisBgm.currentTime = 0.0
            clearInterval(this.countDownClock)
            this.$store.dispatch('setStarsGameStep', 'rank')
          }, this.gameCountdown)
        })
        // 如果是后两个词
      } else if (this.eventCommand === 'grabstars2') {
        return new Promise((resolve, reject) => {
          this.$store.dispatch('connecttoend', {
            type: 2,
            name: 'sad',
            index: 2
          })
          this.$store.dispatch('setCurrGameWord', 'sad').then(() => {
            // document.querySelector('.loader').classList.add('loader-go')
            this.runProgress()
            this.playSounds(sadSound)
            setTimeout(() => {
              this.createStars()
              this.$store.dispatch('setCurrGameWord', 'so-so')
              clearInterval(this.countDownClock)
              this.runProgress()
              this.playSounds(sosoSound)
              this.$store.dispatch('connecttoend', {
                type: 2,
                name: 'so-so',
                index: 2
              })
              // 待数据更新后，添加动画样式
              // setTimeout(() => {
              // document.querySelector('.loader').classList.add('loader-go')
              // }, 500)
              resolve()
            }, this.gameCountdown)
          })
        }).then(() => {
          setTimeout(() => {
            this.$store.dispatch('endthisshit', {
              index: 2
            })
            this.thisBgm.pause()
            this.thisBgm.currentTime = 0.0
            clearInterval(this.countDownClock)
            this.$store.dispatch('setStarsGameStep', 'rank')
          }, this.gameCountdown)
        })
        // 如果是抢星星最后一轮，即四个词汇总
      } else if (this.eventCommand === 'grabstars3') {
        return new Promise((resolve, reject) => {
          this.$store.dispatch('setCurrGameWord', 'happy')
          this.runProgress()
          this.playSounds(happySound)
          this.$store.dispatch('connecttoend', {
            type: 2,
            name: 'happy',
            index: 3
          })
          // 待数据更新后，添加动画样式
          // setTimeout(() => {
          // document.querySelector('.loader').classList.add('loader-go')
          // }, 500)
          resolve()
        }).then(() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              this.createStars()
              this.$store.dispatch('setCurrGameWord', 'fine')
              clearInterval(this.countDownClock)
              this.runProgress()
              this.playSounds(fineSound)
              this.$store.dispatch('connecttoend', {
                type: 2,
                name: 'fine',
                index: 3
              })
              // 待数据更新后，添加动画样式
              // setTimeout(() => {
              // document.querySelector('.loader').classList.add('loader-go')
              // }, 500)
              resolve()
            }, this.gameCountdown)
          })
        }).then(() => {
          return new Promise((resolve) => {
            // document.querySelector('.loader').classList.add('loader-go')
            setTimeout(() => {
              this.createStars()
              this.$store.dispatch('setCurrGameWord', 'sad')
              clearInterval(this.countDownClock)
              this.runProgress()
              this.playSounds(sadSound)
              this.$store.dispatch('connecttoend', {
                type: 2,
                name: 'sad',
                index: 3
              })
              // 待数据更新后，添加动画样式
              // setTimeout(() => {
              // document.querySelector('.loader').classList.add('loader-go')
              // }, 500)
              resolve()
            }, this.gameCountdown)
          })
        }).then(() => {
          return new Promise((resolve) => {
            // document.querySelector('.loader').classList.add('loader-go')
            setTimeout(() => {
              this.createStars()
              this.$store.dispatch('setCurrGameWord', 'so-so')
              clearInterval(this.countDownClock)
              this.runProgress()
              this.playSounds(sosoSound)
              this.$store.dispatch('connecttoend', {
                type: 2,
                name: 'so-so',
                index: 3
              })
              // 待数据更新后，添加动画样式
              // setTimeout(() => {
              // document.querySelector('.loader').classList.add('loader-go')
              // }, 500)
              resolve()
            }, this.gameCountdown)
          })
        }).then(() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              this.$store.dispatch('endthisshit', {
                index: 3
              })
              this.thisBgm.pause()
              this.thisBgm.currentTime = 0.0
              clearInterval(this.countDownClock)
              this.$store.dispatch('setStarsGameStep', 'rank')
              resolve()
            }, this.gameCountdown)
          })
        })
      }
    },
    // 简单去重方法，但是在高并发情况下，效果不是很好
    randomNumFilter(newVal, oldVal) {
      let RandomArr = getRandom(28, 0, 27)
      let currRandomNum = RandomArr[getRd(0, 27)]
      if (this.stars[currRandomNum].name !== '') {
        this.randomNumFilter()
      } else {
        this.randomStarNum = currRandomNum
      }
    }
  },
  watch: {
    'scoreData': function(val, newVal) {
      if (typeof val.value !== 'undefined') {
        this.randomNumFilter()
        if (typeof val !== 'undefined') {
          console.log(this.randomStarNum)
          // setTimeout(() => {
          if (typeof this.stars[this.randomStarNum] !== 'undefined') {
            if (val.value === 2) {
              this.playSounds(this.showAvatarbgmAmazing)
            } else if (val.value === 1) {
              this.playSounds(this.showAvatarbgm)
            }
            // 得分0-40分不上屏，40-70小头像+1分，70以上大头像+2分
            this.$set(this.stars[this.randomStarNum], 'value', val.value)
            this.$set(this.stars[this.randomStarNum], 'name', val.name)
            this.$set(this.stars[this.randomStarNum], 'avatar_url', val.avatar_url)
            this.$set(this.stars[this.randomStarNum], 'showStar', false)
          }
          // }, 500)
        }
        this.$nextTick(() => {
          // 背景光晕效果
          anime({
            targets: '.back-light.' + val.name + '',
            rotate: {
              value: 360,
              duration: 6000,
              easing: 'linear'
            },
            loop: true
          })
        })
      }
    }
  },
  computed: {
    // 星星表情图片
    starImg: function() {
      switch (this.currWord) {
        case 'happy':
          return standardStar
        case 'fine':
          return standardStar
        case 'so-so':
          return standardStar
        case 'sad':
          return standardStar
      }
    },
    ...mapState({
      // 当前进入的步骤，即显示哪个界面
      step: state => state.game.starsGameStep,
      // 当前设定的语音匹配单词
      currWord: state => state.game.currWord,
      // 语音数据
      scoreData: state => state.game.scoreData,
      eventCommand: state => state.game.command
    })
  }
}
</script>

<style>

</style>
