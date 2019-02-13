<template>
  <div class="do-and-say">
    <div class="logo"></div>
    <readyNow v-if="showReadyGo"></readyNow>
    <!-- <readyNow></readyNow> -->
    <transition enter-active-class="animated zoomIn" leave-active-class="animated fadeOut">
      <div class="title-area" v-show="isGameStart">
        <!-- <el-progress type="circle" :percentage="percentage" status="exception" :stroke-width="8" color="#FF6161"></el-progress> -->
        <div class="rabbit-count-down-wrap">
          <canvas id="horn_game_canvas" width="379" height="409"></canvas>
        </div>
        <!-- <div class="middle-horn-content">
          <canvas id="horn_game_canvas" width="379" height="409"></canvas>
        </div> -->
        <div class="active-img" v-show="currWordImg !== ''">
          <img :src="currWordImg" :alt="currWord">
        </div>
        <h1>{{ currWord }}</h1>
      </div>
    </transition>
    <!-- 单词浮动动画 -->
    <transition enter-active-class="animated fadeInUp">
      <div class="word-float-anime" v-show="isCountDownDone">{{ currWord }}</div>
    </transition>
    <!-- 撒花动画 -->
    <div class="float-flowers animation-flowers" v-show="showYohoo"></div>
    <!-- <object width="100%" height="100%" type="application/x-shockwave-flash" class="seabubble-back-flash">
      <param name="src" :value="bubbleBack" />
      <param name="quality" value="high" />
    </object> -->
    <div class="bubble-area">
      <transition-group enter-active-class="animated fadeIn"  leave-active-class="animated zoomOut">
        <div
          v-for="items, index in onlineStudents"
          class="bubble"
          :key="index"
          :data-id="index"
          :style="'top: ' + items.top + '; left: ' + items.left + ';'">
          <div class="scale-area" :class="{ bubbleBorder: items.showNormalStars }">
          <!-- <div class="scale-area"> -->
            <!-- 泡泡图片 -->
            <img class="bubble-img" :src="bubbleImg" alt="" width="100%" height="100%">
            <!-- <div class="avatar" :data-value="items.studentID"> -->
            <!-- 学生头像 -->
            <img class="students-avatar" :src="items.online ? items.avatar : avatar" alt="">
            <!-- </div> -->
          </div>
          <!-- <div class="mid-award-part">
            <img v-if="items.tier === 3" class="mid-award-theaf" :src="midAward" alt="">
          </div> -->
          <!-- 1颗星 -->
          <!-- <transition enter-active-class="animated zoomIn" leave-active-class="animated fadeOut"> -->
          <div class="stars-part-1" v-show="items.tier === 3">
            <ul>
              <li></li>
            </ul>
          </div>
          <!-- </transition> -->
          <!-- 2颗星 -->
          <!-- <transition enter-active-class="animated zoomIn" leave-active-class="animated fadeOut"> -->
          <div class="stars-part-2" v-show="items.tier === 5">
            <ul>
              <li></li>
              <li></li>
            </ul>
          </div>
          <!-- </transition> -->
          <!-- 3颗星 -->
          <!-- <transition enter-active-class="animated zoomIn" leave-active-class="animated fadeOut">
            <div class="stars-part-3" v-show="items.tier === 6">
              <ul>
                <li v-for="items, index in starsNum" :key="index"></li>
              </ul>
            </div>
          </transition> -->
          <div class="mvp-part" v-show="items.tier === 6">
            <div class="stars-part-3">
              <ul>
                <li v-for="items, index in starsNum" :key="index"></li>
              </ul>
            </div>
            <!-- MVP - 装饰元素 - 光晕 -->
            <img class="mvp-avatar-halo" :src="mvpHalo" alt="">
            <!-- MVP - 装饰元素 - 背景 -->
            <img class="mvp-avatar-back" :src="mvpBack" alt="">
            <!-- MVP - 装饰元素 - 星星 -->
            <img class="mvp-avatar-star-big" :src="mvpStarBig" alt="">
            <img class="mvp-avatar-star-small" :src="mvpStarSmall" alt="">
            <!-- MVP - 装饰元素 - 王冠 -->
            <!-- <img v-if="items.tier === 6" class="mvp-avatar-head" :src="mvpHead" alt=""> -->
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import '../../../assets/styles/seaBubble.styl'
import '../../../assets/gka-flowers-css/gka.css'
import bubbleBack from '../../../assets/flash/bubbleBack.swf'
import activeImgJump from '../../../assets/images/active_jump.png'
import bubbleImg from '../../../assets/images/bubble.png'
import avatar from '../../../assets/images/avatar.png'
import midAward from '../../../assets/images/mid-award-theaf.png'
import mvpHalo from '../../../assets/images/bubble-mvp-halo.png'
import mvpBack from '../../../assets/images/bubble-mvp-back.png'
import mvpStarBig from '../../../assets/images/bubble-mvp-star-big.png'
import mvpStarSmall from '../../../assets/images/bubble-mvp-star-small.png'
import mvpHead from '../../../assets/images/bubble-mvp-head.png'
import bgm_mp3 from '../../../assets/sounds/bubble/bgm.mp3'
import bubble_normal_mp3 from '../../../assets/sounds/bubble/plus_normal.mp3'
import bubble_final_mp3 from '../../../assets/sounds/bubble/plus_final.mp3'
import bubble_yahoo_mp3 from '../../../assets/sounds/bubble/yahoo.mp3'
import bubble_ca_mp3 from '../../../assets/sounds/bubble/ca.mp3'
import countdown_mp3 from '../../../assets/sounds/countdown.mp3'
import anime from 'animejs'
import { TweenMax } from 'gsap/TweenMax'
import { mapState, mapGetters } from 'vuex'
import { clockCountDown } from '../../../utils/index'
import readyNow from '../../../components/readyGo'
// import global_ from '../../../components/global'
import MYAIDE from "../../../utils/myaide.js"
export default {
  data() {
    return {
      bubbleBack: bubbleBack,
      percentage: 0,
      wordsImg: activeImgJump,
      bubbles: [],
      mvpHead,
      midAward,
      mvpHalo,
      mvpBack,
      mvpStarBig,
      mvpStarSmall,
      // 泡泡数
      maxBubble: 14,
      avatar: avatar,
      bubbleImg: bubbleImg,
      // 互动执行时间
      interval: 12,
      // 单词轮次索引
      turnIndex: 1,
      // 单词数据数组
      tasks: [],
      // 当前单词
      currWord: '',
      // 当前单词对应的图片
      currWordImg: '',
      // 当前互动的配置数据
      currConfigData: {},
      // 互动开始时间
      startTime: '',
      // 互动结束时间
      endTime: '',
      // 是否开始游戏，即开始收音
      isGameStart: false,
      // 倒计时组件持续时间，单位为毫秒
      readyGoTime: 3000,
      // 每一轮次收集的奖品的数据数组
      singleRoundBonusCollect: [],
      // 奖品是否重置
      isReset: false,
      // 读秒定时器
      countdownTimer: {},
      // 音效资源
      bgm_mp3,
      bubble_normal_mp3,
      bubble_final_mp3,
      countdown_mp3,
      bubble_yahoo_mp3,
      bubble_ca_mp3,
      // 声音对象
      bgm_sound: {},
      bubble_sound_normal: {},
      bubble_sound_final: {},
      countdown_sound: {},
      currWordMp3: {},
      runTimeout: {},
      startTimeout: {},
      collectTimeout: {},
      readyGoTimeout: {},
      wordFloatTimeout: {},
      showFlowersTimeout: {},
      // 在线的学生数据
      onlineStudents: [],
      // ready-go组件的显示状态
      showReadyGo: false,
      // 泡泡变大的普通效果呈现
      showNormalPlusEffect: false,
      // 倒计时是否执行完毕
      isCountDownDone: false,
      // 动画浮动对象
      wordAnime: {},
      // 欢呼动画
      showYohoo: false,
      // 欢呼持续时间
      yohooTime: 2000,
      starsNum: 3,
      canvasItem: null,
      renderer: null,
      timeAni: null
    }
  },
  components: {
    readyNow
  },
  mounted() {
    document.getElementsByTagName('body')[0].style.background = 'rgba(0, 0, 0, 1)'
    // bgm
    this.bgm_sound = new Howl({
      src: [this.bgm_mp3],
      loop: true,
      volume: 0.5
    })
    this.bubble_sound_normal = new Howl({
      src: [this.bubble_normal_mp3]
    })
    this.bubble_sound_final = new Howl({
      src: [this.bubble_final_mp3]
    })
    this.countdown_sound = new Howl({
      src: [this.countdown_mp3]
    })
    this.ca_sound = new Howl({
      src: [this.bubble_ca_mp3]
    })
    this.yahoo_sound = new Howl({
      src: [this.bubble_yahoo_mp3]
    })
    this.bgm_sound.play()
    this.currConfigData = this.$route.params
    typeof this.currConfigData.configuration === 'undefined' ? this.currConfigData = this.configData : !0
    // this.currConfigData = this.configData.template
    // 设置tasks内容为configData里的配置项
    this.tasks = this.currConfigData.configuration.task
    this.createBubble()
    // 重写语音提示倒计时到宽度
    // document.querySelector('.el-progress-circle').style.width = '0.65rem'
    // document.querySelector('.el-progress-circle').style.height = '0.65rem'
    // 如果是第一次执行，则需要等待时间，即游戏介绍时间
    if (this.tasks) {
      if (this.turnIndex === 1) {
        // 然后执行准备时间，之后执行互动逻辑
        this.runTimeout = setTimeout(() => {
          // ready-go 动画为2s，结束开始执行互动逻辑
          // this.startTimeout = setTimeout(() => {
          // this.isGameStart = true
          // 向后端发起开启一个互动的请求
          let query = 'interactionpb.InteractionBeginNotify'
          let url = 'protos/interaction.proto'
          let params = {
            classID: this.classID,
            lessonID: this.lessonID,
            interactionID: this.currConfigData.interactionID,
            config: this.currConfigData
          }
          // 编码，并发送socket请求
          // 6为互动请求类型
          global.icsocket.encode(query, url, params, 6, global.icsocket.webskt)
          // 开始执行游戏过程
          this.startAction()
          this.startTime = this._getNowFormatDate()
          console.log('当前互动开始执行，开始时间为：', this.startTime)
          // }, 2000)
        }, this.currConfigData.configuration.prepareTime)
        // }, 4000)
      // 否则则立即执行游戏
      } else {
        this.startAction()
      }
    } else {
      console.log('$$$$$$ 当前互动暂无配置数据 $$$$$$')
    }
    setTimeout(() => {
      this.rabbitCountDown()
      this.titleYoyo()
    }, 1000)
  },
  methods: {
    // title 浮动动画
    titleYoyo() {
      TweenMax.to('.title-area', 2, {
        y: 10,
        ease: 'SlowMo.easeOut',
        repeat: -1,
        yoyo: true,
        yoyoEase: true
      })
    },
    // 每个单词收音之前，先向后端发送请求
    startAction() {
      if (this.turnIndex > 1 && this.turnIndex < this.tasks.length + 1) {
        this.dataReset()
      }
      console.log(this.turnIndex)
      if (this.turnIndex <= this.tasks.length) {
        console.log('======互动请求成功======')
        this.currWord = this.tasks[this.turnIndex - 1].text.text
        this.currWordImg = this.tasks[this.turnIndex - 1].text.picture
        // 播放文字上浮动画的同时，播放单词领读mp3
        let currLeadReader = this.tasks[this.turnIndex - 1].text.audio
        this.percentage = 0
        if (currLeadReader && currLeadReader !== '') {
          var currWordMp3 = new Howl({
            src: currLeadReader
          })
        }
        console.log('开始收集语音，执行动画逻辑')
        if (this.turnIndex === 1) {
          // 准备倒计时动画
          this.showReadyGo = true
          this.readyGoTimeout = setTimeout(() => {
            this.showReadyGo = false
            this.isCountDownDone = true
            if (currWordMp3) currWordMp3.play()
            this.wordFloat()
          }, this.readyGoTime)
        } else {
          this.isCountDownDone = true
          document.querySelector('.word-float-anime').style.transform = ''
          if (currWordMp3) currWordMp3.play()
          this.wordFloat()
        }
      } else {
        this.endTime = this._getNowFormatDate()
        console.log('当前互动结束，时间为：', this.endTime)
        this._timeFn(this.startTime)
        // 跳转至排行榜界面
        this.$router.push({
          name: 'rank',
          params: {
            classID: this.classID,
            lessonID: this.lessonID,
            interactionID: this.currConfigData.interactionID,
            from: this.$route.params.from,
            name: this.$route.params.name
          },
          query: this.$route.query
        })
      }
    },
    // 单词浮动动画方法
    wordFloat() {
      let me = this
      let floatDom = document.querySelector('.word-float-anime')
      // 1s之后执行向上浮动动画
      this.wordFloatTimeout = setTimeout(() => {
        this.wordAnime = anime({
          targets: floatDom,
          translateY: {
            value: '-2.34rem',
          },
          scale: {
            value: 0.3
          },
          // opacity: [1, 0],
          duration: 500,
          easing: 'linear',
          begin: function() {
            me.ca_sound.play()
          },
          complete: function() {
            me.isCountDownDone = false
            // 画完毕后，出现title区域
            me.isGameStart = true
            // 此定时器与领读音音频时长匹配
            me.collectTimeout = setTimeout(() => {
              // 开始收音
              me.shouyinPart()
            }, me.tasks[me.turnIndex - 1].prepareTime - 1000)
          }
        })
      }, 1000)
    },
    shouyinPart() {
      // 向后端发起开启一个互动的请求
      let query = 'interactionpb.ClasskitStartInteractionRequest'
      let url = 'protos/interaction.proto'
      let params = {
        classID: this.classID,
        lessonID: this.lessonID,
        interactionID: this.currConfigData.interactionID,
        taskID: this.turnIndex - 1,
        type: this.currConfigData.type,
        config: ''
      }
      // 编码，并发送socket请求
      // 6为互动请求类型
      global.icsocket.encode(query, url, params, 6, global.icsocket.webskt)
      // 执行收音倒数逻辑
      this.timeAni.visible = true
      this.timeAni.gotoAndStop(0)
      clockCountDown(this.tasks[this.turnIndex - 1].quizTime / 1000, this, () => {
        clearInterval(this.countdownTimer)
        // 重制倒计时动画
        this.timeAni.gotoAndPlay(0)
        // 隐藏标题栏
        this.isGameStart = false
        // 显示欢呼动画
        this.yahoo_sound.play()
        this.showYohoo = true
        this.showFlowersTimeout = setTimeout(() => {
          this.showYohoo = false
          this.queupCallBack(this.turnIndex, this.tasks)
        }, this.yohooTime)
      })
    },
    // 队列回调函数
    queupCallBack(index, tasks) {
      // 如果当前执行次数小于或者等于最大的配置执行次数，则继续执行
      this.turnIndex ++
      if (index <= tasks.length) {
        this.startAction()
        return
      }
    },
    // 生成泡泡
    createBubble() {
      // 获取学生数据
      this.Api.fetchStudentData({
        classID: this.classID,
        lessonID: this.lessonID
      }).then(data => {
        this._checkData(data).then(data => {
          this.onlineStudents = data.data.students
          this.createPosition().then(() => {
            console.log('==> 泡泡已创建完毕')
            // 头像变大出现
            anime({
              targets: ['img.students-avatar'],
              width: '85%',
              height: '85%',
              delay: function(target, index) {
                // 头像出现延迟速率
                return index * 150
              }
            })
            // 泡泡动画
            TweenMax.staggerTo('.bubble', 1.5, {
              y: 10,
              repeat: -1,
              yoyo: true,
              yoyoEase: true
            }, 0.4)
          })
        })
      })
    },
    createPosition() {
      return new Promise((resolve) => {
        for (let index = 0; index < this.onlineStudents.length; index++) {
          let element = this.onlineStudents[index]
          element.tier = 1
        }
        resolve()
      })
    },
    // 参数为，放大等倍数，放大的目标dom，鱼群dom
    bubbleScale(times, target) {
      // 泡泡变化音效
      // 如果达到最后一阶，则播放最后一阶的音效，否则只播放普通音效
      times === 1.9 ? this.bubble_sound_final.play() : this.bubble_sound_normal.play()
      // 泡泡放大
      anime({
        targets: target,
        scale: times,
        // width: `${times}px`,
        // height: `${times}px`,
        duration: 1000,
        elasticity: 500,
        complete: function() {
          console.log('bubble change anime completed.')
          // this.showNormalPlusEffect = false
        }
      })
    },
    // 数据重置
    dataReset() {
      // 重置泡泡数据
      for (let o = 0; o < this.onlineStudents.length; o++) {
        const element = this.onlineStudents[o]
        this.$set(element, 'tier', 1)
        this.$set(element, 'showNormalStars', false)
        // this.$set(element, 'name', '')
      }
      // 重置泡泡大小
      let bubblesDom = document.querySelectorAll('.bubble .scale-area')
      anime({
        targets: bubblesDom,
        scale: 1
      })
    },
    // 泡泡阶梯对应的变大倍数匹配
    bubbleTier(num) {
      let tierMap = {
        1: 1,
        2: 1 + 1.5 / 5,
        // 3: 1 + (1.5 / 5) * 2,
        3: 1.3,
        // 4: 1 + (1.5 / 5) * 3,
        4: 1.5,
        // 5: 1 + (1.5 / 5) * 4,
        5: 1.6,
        6: 1.9
      }
      return tierMap[num]
    },
    // 兔子倒计时动画
    rabbitCountDown() {
      this.canvasItem = document.getElementById('horn_game_canvas')
      this.renderer = new MYAIDE.Renderer({ canvas: this.canvasItem })
      this.renderer.begin()
      // 倒计时
      var timeAniArr = []
      MYAIDE.Loader.loadAniImg(
        timeAniArr,
        "./assets/images/smallHorn/timeAni/time_00",
        40,
        305
      )
      this.timeAni = new MYAIDE.IntervalAnimation({
        frameArray: timeAniArr,
        direction: false,
        cycle: 50,
        zIndex: 50,
        x: 0,
        y: 0
      })
      this.renderer.add(this.timeAni)
      this.timeAni.gotoAndStop(0)
    }
  },
  beforeRouteLeave: function(to, from, next) {
    console.log('trigger beforeRouteLeave:', this.$route.name)
    if (this.renderer) {
      this.renderer.stop()
    }
    this.turnIndex = 1
    clearTimeout(this.runTimeout)
    // clearTimeout(this.startTimeout)
    clearTimeout(this.collectTimeout)
    clearTimeout(this.readyGoTimeout)
    clearTimeout(this.wordFloatTimeout)
    clearTimeout(this.showFlowersTimeout)
    clearInterval(this.countdownTimer)
    clearInterval(this.countDownClock)
    this.bgm_sound.unload()
    this.countdown_sound.unload()
    // this.currWordMp3.unload()
    next()
  },
  watch: {
    'scoreData': function(val) {
      for (let i = 0; i < this.onlineStudents.length; i++) {
        const element = this.onlineStudents[i]
        let currBubble = document.querySelectorAll('.bubble .scale-area')[i]
        if (val.name === element.name) {
          console.log('发现了一样的数据，执行分数比较操作')
          // console.log('新收到的值:', val)
          // console.log('匹配到的当前元素:', element)
          if (val.star > element.tier) {
            // 设置阶梯
            this.$set(element, 'tier', val.star)
            // 设置效果显示状态
            if (val.star < 6) {
              this.$set(element, 'showNormalStars', true)
              setTimeout(() => {
                this.$set(element, 'showNormalStars', false)
              }, 1000)
            }
            console.log('放大' + this.bubbleTier(val.star) + '倍')
            this.bubbleScale(this.bubbleTier(val.star), currBubble)
          } else if (val.star < element.star) {
            console.log('新数据比现有数据值低，暂无后续操作')
          } else {
            console.log('同样的数据，分数阶无变化，暂无后续操作')
          }
          // 如果接收到数据是相同到，则跳出后续操作
          return
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      'configData': 'getPronunciationAllBubble'
    }),
    ...mapState({
      'students': state => state.game.studentsData,
      // 当前进入的步骤，即显示哪个界面
      'step': state => state.game.starsGameStep,
      // 语音数据
      'scoreData': state => state.game.scoreData,
      'lessonID': state => state.game.lessonID,
      'classID': state => state.game.classID,
      'courseID': state => state.game.courseID
    })
  }
}
</script>
