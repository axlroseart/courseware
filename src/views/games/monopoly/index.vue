<template>
  <div class="monopoly">
    <object width="100%" height="100%" wmode="transparent" type="application/x-shockwave-flash" class="mono-back-flash">
      <param name="src" :value="monoBack" />
      <param name="quality" value="high" />
    </object>
    <div class="logo"></div>
    <!-- 左下角骰子 -->
    <div class="dice-wrap">
      <div class="dice dice-fly">
        <img :src="getDiceImg(currDicePoint)" alt="">
      </div>
      <div class="dice dice-stay" v-show="randomDone">
        <img :src="getDiceImg(currDicePoint)" alt="">
      </div>
      <div class="dice-shadow"></div>
    </div>
    <!-- 左下角骰子 -->
    <!-- 中间部分-格子 -->
    <div class="middle-steps">
      <ul>
        <li
          v-for="items, index in steps"
          :key="index"
          :class="items.style">
          <!-- <span :class="items.name"></span> -->
          <!-- <span :class="items.name"> -->
          <img :class="items.name" :src="items.icon" alt="">
          <!-- </span> -->
          <div class="leap-rabbit-on-steps"></div>
        </li>
      </ul>
    </div>
    <!-- 中间部分-格子 -->
    <!-- 兔子 -->
    <transition enter-active-class="animated bounceIn"  leave-active-class="animated zoomOut">
      <div class="leap-rabbit" v-show="showDefaultRabbit"></div>
    </transition>
    <!-- 兔子 -->
    <!-- 排行榜 -->
    <div class="rank-list">
      <ul>
        <transition-group enter-active-class="animated zoomIn"  leave-active-class="animated zoomOut">
          <li v-for="items, index in students" :key="index">
            <transition-group enter-active-class="animated fadeInDown"  leave-active-class="animated zoomOut">
              <i class="update-score" :key="1">{{ rewardStarNum }}</i>
              <!-- <i class="star" :key="2" v-show="showRewardStar">{{ rewardStarNum }}</i> -->
              <i class="star" :key="3" v-show="typeof items.stars !== 'undefined' && items.stars !== ''">{{ items.stars }}</i>
              <!-- <i class="star" :key="3" v-show="showGotStar">{{ items.stars }}</i> -->
            </transition-group>
            <img :src="items.avatar_url" :alt="items.name">
            <span>{{ items.name }}</span>
          </li>
        </transition-group>
      </ul>
      <!-- <ul v-else>
        <transition-group enter-active-class="animated zoomIn"  leave-active-class="animated zoomOut">
          <li v-for="items, index in studentsData" :key="index">
            <img :src="items.avatar" :alt="items.name">
            <span>{{ items.name }}</span>
          </li>
        </transition-group>
      </ul> -->
    </div>
    <!-- 排行榜 -->
    <!-- 宝藏 -->
    <div class="treasure-close" v-if="!gameDone">
      <span class="final-leap-rabbit"></span>
    </div>
    <div class="treasure-open" v-else>
      <span class="final-happy-leap-rabbit"></span>
      <object width="100%" height="100%" wmode="transparent" type="application/x-shockwave-flash" class="mono-win-flash">
        <param name="src" :value="monoWin" />
        <param name="quality" value="high" />
      </object>
    </div>
    <!-- 宝藏 -->
    <!-- 大骰子遮罩 -->
    <transition enter-active-class="animated fadeIn"  leave-active-class="animated zoomOut">
      <div class="monopoly-mask" v-show="showMask">
        <!-- <div class="dice" :class="'dice-' + showPoint"></div> -->
        <div class="dice">
          <img :src="getDiceImg(showPoint)" alt="" v-show="showBigDice">
        </div>
        <transition enter-active-class="animated zoomIn"  leave-active-class="animated zoomOut">
          <!-- 收音提示 -->
          <div class="clock-count-down" v-show="showVoice">
            <div class="back-circle"></div>
            <object width="100%" height="100%" wmode="transparent" type="application/x-shockwave-flash" class="voice-waves-flash">
              <param name="src" :value="voiceWaves" />
              <param name="quality" value="high" />
            </object>
            <el-progress type="circle" :percentage="percentage" status="exception" :stroke-width="8" color="#FF6161" class="mono-count-down"></el-progress>
          </div>
        </transition>
        <!-- 星星宝箱 -->
        <object v-show="showTreasureStar" width="100%" height="100%" wmode="transparent" type="application/x-shockwave-flash" class="treasure-star-flash">
          <param name="src" :value="treasureStar" />
          <param name="quality" value="high" />
        </object>
        <!-- 炸弹宝箱 -->
        <object v-show="showTreasureBomb" width="100%" height="100%" wmode="transparent" type="application/x-shockwave-flash" class="treasure-bomb-flash">
          <param name="src" :value="treasureBomb" />
          <param name="quality" value="high" />
        </object>
        <!-- 沙漏倒计时，跳转互动前准备 -->
        <div class="jump-to-activity" v-show="isFreeTimeActivity">
          <div class="count-down-board">
            <countdown :time="freeTimeCountDownTime" @countdownend="countdownend">
              <template slot-scope="props">
                {{ props.minutes }}:{{ props.seconds }}
              </template>
            </countdown>
          </div>
        </div>
      </div>
    </transition>
    <!-- 大骰子遮罩 -->
    <!-- 左下角骰子运动轨迹 -->
    <div class="mono-motion-path">
      <svg viewBox='-450 -450 900 900'>
        <path :d='svgPath'/>
      </svg>
    </div>
    <!-- 左下角骰子运动轨迹 -->
  </div>
</template>

<script>
import '../../../assets/styles/monopoly.styl'
import { mapGetters, mapState } from 'vuex'
import voiceWaves from '../../../assets/flash/voiceWaves.swf'
import treasureStar from '../../../assets/flash/mono-star.swf'
import treasureBomb from '../../../assets/flash/mono-bomb.swf'
import monoBack from '../../../assets/flash/mono-back.swf'
import monoWin from '../../../assets/flash/mono-win.swf'
import doActivitySound from '../../../assets/sounds/doWithActivity.mp3'
import doTeacherSound from '../../../assets/sounds/doWithTeacher.mp3'
import bgm_mp3 from '../../../assets/sounds/monopoly/bgm.mp3'
import dice_mp3 from '../../../assets/sounds/monopoly/dice.mp3'
import start_mp3 from '../../../assets/sounds/monopoly/start.mp3'
import treasure_mp3 from '../../../assets/sounds/monopoly/treasure.mp3'
import end_mp3 from '../../../assets/sounds/monopoly/end.mp3'
import win_mp3 from '../../../assets/sounds/monopoly/win.mp3'
import clap_mp3 from '../../../assets/sounds/monopoly/clap.mp3'
import bomb_mp3 from '../../../assets/sounds/monopoly/bomb.mp3'
import testImg from '../../../assets/images/mono-icon-roulette.png'
import anime from 'animejs'
// import { TweenMax } from 'gsap/TweenMax'
export default {
  data() {
    return {
      monoBack,
      monoWin,
      doActivitySound,
      doTeacherSound,
      testImg: testImg,
      voiceWaves: voiceWaves,
      treasureStar: treasureStar,
      treasureBomb: treasureBomb,
      // 倒计时百分比
      percentage: 0,
      // 是否显示收音提示
      showVoice: true,
      // 格子DOM配置数据
      steps: [
        {
          id: 1,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'yellow-big'
        },
        {
          id: 2,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'red'
        },
        {
          id: 3,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'green'
        },
        {
          id: 4,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'yellow-small'
        },
        {
          id: 5,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'yellow-big'
        },
        {
          id: 6,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'red'
        },
        {
          id: 7,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'yellow-big'
        },
        {
          id: 8,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'yellow-small'
        },
        {
          id: 9,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'green'
        },
        {
          id: 10,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'red'
        },
        {
          id: 11,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'yellow-big'
        },
        {
          id: 12,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'green'
        },
        {
          id: 13,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'yellow-small'
        },
        {
          id: 14,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'yellow-big'
        },
        {
          id: 15,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'green'
        },
        {
          id: 16,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'red'
        },
        {
          id: 17,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'green'
        },
        {
          id: 18,
          icon: '',
          showRabbit: false,
          style: 'yellow-big'
        },
        {
          id: 19,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'yellow-big'
        },
        {
          id: 20,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'yellow-small'
        },{
          id: 21,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'yellow-big'
        },
        {
          id: 22,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'yellow-small'
        },
        {
          id: 23,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'yellow-big'
        },
        {
          id: 24,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'red'
        },
        {
          id: 25,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'green'
        },
        {
          id: 26,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'yellow-small'
        },
        {
          id: 27,
          icon: '',
          name: '',
          showRabbit: false,
          style: 'yellow-big'
        }
      ],
      // 配置的所有点数数据
      point: [],
      // 转出来的点数
      showPoint: 1,
      // 当前互动的所有配置数据
      currConfigData: {},
      // 骰子运动轨迹
      svgPath: 'M0,0 C-23,-151 170,-358 500,-270',
      // 是否显示遮罩
      showMask: false,
      // 骰子是否掷完一轮
      randomDone: false,
      // 掷骰子轮数
      // diceIndex: 0,
      // 当前轮次掷出的骰子点数
      // currDicePoint: 1,
      // 左下角骰子X轴坐标
      defaultDiceX: 0,
      // 左下角骰子Y轴坐标
      defaultDiceY: 0,
      // 骰子持续显示时间
      closeMaskTime: 3000,
      // 上一步掷出的骰子点数，默认为0
      // prevPoint: 0,
      // X轴偏移量
      offsetX: 10,
      // Y轴偏移量
      offsetY: 110,
      // 骰子随机时间，单位秒
      rollTime: 3,
      // 奖励的星星显示与否
      showRewardStar: false,
      // 奖励的星星数量
      rewardStarNum: 0,
      // 各配置好的事件数据
      events: [],
      // 当前随机事件的配置数据
      currEvtData: [],
      // 是否显示屏幕中间的大筛子
      showBigDice: false,
      // 箱子里面是星星
      showTreasureStar: false,
      // 箱子里面是炸弹
      showTreasureBomb: false,
      // 当前随机事件的类型
      currEventType: 0,
      // 游戏是否结束
      gameDone: false,
      // 跳转回来后再次投掷的间隔时间，单位为秒
      subTime: 8,
      // 是否是线下活动
      isFreeTimeActivity: false,
      // 线下活动倒计时
      freeTimeCountDownTime: 0,
      // 是否显示返回之后，学生上次互动得到的分数
      showGotStar: false,
      // 加减分变量
      gameChangeValue: 0,
      // 是否显示默认位置兔子
      showDefaultRabbit: false,
      // 是否拿到大富翁学生数据
      isGotMonoStudentsScore: false,
      // 语音播放完之后，一定延迟时间内跳转
      soundNextDelay: 0,
      // 音效资源
      bgm_mp3,
      dice_mp3,
      start_mp3,
      win_mp3,
      treasure_mp3,
      end_mp3,
      clap_mp3,
      bomb_mp3,
      // 声音对象
      bgm_sound: {},
      dice_sound: {},
      start_sound: {},
      win_sound: {},
      treasure_sound: {},
      end_sound: {},
      clap_sound: {},
      bomb_sound: {},
      runTimeout: {},
      // 互动开始时间
      startTime: '',
      // 互动结束时间
      endTime: ''
      // lessonID: 221,
      // classID: 1
      // 当前跳至的格子数
      // currStepIndex: 0
    }
  },
  mounted() {
    // 播放bgm
    this.bgm_sound = new Howl({
      src: [this.bgm_mp3],
      loop: true,
      volume: 0.2
    })
    // 播放骰子滚动音效
    this.dice_sound = new Howl({
      src: [this.dice_mp3]
    })
    // 播放start音效
    this.start_sound = new Howl({
      src: [this.start_mp3]
    })
    // 播放宝箱音效
    this.bomb_sound = new Howl({
      src: [this.bomb_mp3]
    })
    // 播放星星奖励音效
    this.win_sound = new Howl({
      src: [this.win_mp3]
    })
    // 播放星星奖励音效
    this.clap_sound = new Howl({
      src: [this.clap_mp3]
    })
    // 最终宝箱音效
    this.treasure_sound = new Howl({
      src: [this.treasure_mp3]
    })
    this.showDefaultRabbit = true
    this.getInterfaceScore()
    // 重写语音提示倒计时到宽度
    let progressCircle = document.querySelector('.el-progress-circle')
    if (progressCircle) {
      progressCircle.style.width = '0.91rem'
      progressCircle.style.height = '0.91rem'
    }
    // document.querySelector('.el-progress-circle').style.width = '0.91rem'
    // document.querySelector('.el-progress-circle').style.height = '0.91rem'
    this.defaultDiceX = document.querySelector('.dice-fly').getBoundingClientRect().left
    this.defaultDiceY = document.querySelector('.dice-fly').getBoundingClientRect().top
    this.currConfigData = this.$route.params
    typeof this.currConfigData.template === 'undefined' ? this.currConfigData = this.configData : !0
    if (this.currConfigData) {
      this.bgm_sound.play()
      // 所有的事件类型及对应的配置数据
      this.events = this.currConfigData.configuration.events
      // 将要掷出的所有点数信息
      this.point = this.currConfigData.configuration.steps
      // 如果不是第一轮，则是从其他互动跳转回来的，需要读取之前玩过的大富翁游戏的进度
      if (this.diceIndex > 0) {
        let me = this
        me.showDefaultRabbit = false
        let stepsDom = document.querySelectorAll('.middle-steps li img')
        // 让之前格子上的物品消失
        for (let index = 0; index < me.jumpedArray.length; index++) {
          const element = me.jumpedArray[index]
          if (stepsDom[element]) {
            stepsDom[element].style.display = 'none'
          }
        }
        // 兔子位置重定位
        let lastAddr = me.jumpedArray[me.jumpedArray.length - 1]
        let stepsLeapRabbitDom = document.querySelectorAll('.leap-rabbit-on-steps')
        console.log('上一个兔子所在的格子数：', lastAddr)
        // console.log(stepsLeapRabbitDom[lastAddr])
        if (stepsLeapRabbitDom[lastAddr]) {
          // stepsLeapRabbitDom[lastAddr].style.opacity = 1
          anime({
            targets: stepsLeapRabbitDom[lastAddr],
            opacity: 1,
            duration: 500,
            easing: 'easeInQuad'
          })
        }
        // 显示加星星动画
        me.getInterfaceScore()
        // 跳转回来后一定时间之后再次投掷
        setTimeout(() => {
          // me.showRewardStar = false
          me.diceRandom()
        }, me.subTime * 1000)
      } else {
        // 准备时间过后，开始掷骰子
        this.runTimeout = setTimeout(() => {
          console.log('****** 游戏开始 ******')
          this.startTime = this._getNowFormatDate()
          console.log('当前互动开始执行，开始时间为：', this.startTime)
          this.diceRandom()
        }, this.currConfigData.configuration.prepareTime)
        // }, 1000)
      }
      // 27格对应的随机物品
      let stepsThings = this.currConfigData.configuration.ways
      for (let i = 0; i < stepsThings.length; i++) {
        const element = stepsThings[i]
        if (typeof this.steps[i] !== 'undefined') {
          this.steps[i].name = element.name
          this.steps[i].icon = element.icon
        }
      }
    }
  },
  methods: {
    // 兔子闪现
    flashShow(stepNum, evtType) {
      console.log('evtType:', evtType)
      let me = this
      return new Promise((resolve) => {
        let stepsArr = []
        let rabArr = []
        let steps = document.querySelectorAll('.middle-steps li')
        // 上一格子位数
        let prevStepNum = this.jumpedArray[this.diceIndex - 1]
        // 当前格子位数
        let CurrStepNum = this.jumpedArray[this.diceIndex]
        // 如果是第一次，则 prevStepNum 指定为 0
        typeof prevStepNum === 'undefined' ? prevStepNum = 0 : !0
        console.log('prev:', prevStepNum)
        console.log('curr:', CurrStepNum)
        // 要跳动的dom数据整理合并
        for (let index = prevStepNum; index <= CurrStepNum; index++) {
          if (steps[index]) {
            stepsArr.push(steps[index])
            rabArr.push(steps[index].querySelector('.leap-rabbit-on-steps'))
          }
        }
        let currStepDom
        if (me.diceIndex !== me.events.length - 1) {
          currStepDom = rabArr[rabArr.length - 1]
        } else {
          currStepDom = document.querySelector('.treasure-close span')
        }
        // console.log(currStepDom)
        // 如果是互动返回的，则需要删除第一位
        if (evtType === 3) {
          // 第一位格子上的兔子消失
          rabArr[0].style.opacity = 0
          stepsArr = stepsArr.slice(1)
          rabArr = rabArr.slice(1)
        }
        // console.log('要跳的格子：', stepsArr)
        // console.log('要闪现的兔子：', rabArr)
        // 格子下沉
        anime({
          targets: stepsArr,
          translateY: [15],
          duration: 800,
          easing: 'easeOutElastic',
          delay: function(target, index) {
            return index * 800
          },
          complete: function() {
            console.log(me.jumpedArray)
          }
        })
        // 闪现
        let stepTimeLine = anime.timeline()
        stepTimeLine.add({
          targets: rabArr,
          opacity: [
            {
              value: 1,
            },
            {
              value: 0
            }
          ],
          duration: 800,
          delay: function(target, index) {
            return index * 800
          }
        }).add({
          targets: currStepDom,
          opacity: 1,
          scale: [2, 1],
          easing: 'easeOutElastic',
          complete: function() {
            console.log('====== 格子跳完了 ======')
            resolve()
          }
        })
      })
    },
    // 从接口拿星星分数
    getInterfaceScore() {
      this.Api.monopolyGetScore({
        lessonID: this.lessonID,
        classID: this.classID,
      }).then(data => {
        this._checkData(data).then(data => {
          // this.isGotMonoStudentsScore = true
          this.$store.dispatch('fetchStudentsScoreData', data.data)
        })
      })
    },
    // 滚骰子
    diceRandom() {
      this.dice_sound.play()
      console.log('当前掷第 ' + (this.diceIndex + 1) + ' 轮骰子')
      console.log('当前骰子在第 ' + (this.currStepIndex) + ' 格')
      let me = this
      var path = anime.path('.mono-motion-path path')
      anime({
        targets: '.dice-fly',
        translateX: path('x'),
        translateY: path('y'),
        rotate: path('angle'),
        opacity: 0,
        easing: 'linear',
        // rotate: '2turn',
        duration: 500,
        complete: function() {
          // document.querySelector('.dice-fly').removeAttribute('style')
          let diceRandom = setInterval(() => {
            me.showPoint = me._getRd(1, 6)
          }, 100)
          // 显示遮罩，屏幕中间骰子开始滚动
          me.showVoice = true
          me.showMask = true
          me.showBigDice = true
          // 开始收音，执行倒计时，及倒计时完毕回调方法
          me._clockCountDown(me.rollTime, me, function() {
            // 当前点数
            // me.currDicePoint = me.point[me.diceIndex]
            me.$store.dispatch('setMonoCurrentPoint', me.point[me.diceIndex])
            // 清除骰子滚动事件
            clearInterval(diceRandom)
            me.showPoint = me.currDicePoint
            // 关闭遮罩，及收音提示，骰子返回左下角位置
            setTimeout(() => {
              me.bolleanReset()
              anime({
                targets: '.dice-fly',
                opacity: 1,
                translateX: 0,
                translateY: 0,
                rotate: '2turn',
                easing: 'easeInQuart',
                duration: 500,
                complete: function() {
                  me.start_sound.play()
                  // 设置左下角骰子点数为掷出的点数
                  let diceFlyDom = document.querySelector('.dice-fly')
                  if (diceFlyDom) {
                    diceFlyDom.style.background = `./assets/images/dices/mono-dice-${me.currDicePoint}.png`
                  }
                  // 跳格子事件
                  me.jumpTo()
                }
              })
            }, me.closeMaskTime)
          })
        }
      })
    },
    // 跳格子逻辑方法
    jumpTo() {
      let me = this
      // 当前要跳至的格子的下标位
      // me.currStepIndex = me.currDicePoint + me.prevPoint
      console.log('当前点数：', me.currDicePoint)
      // 执行跳格子动画
      me.$store.dispatch('setMonoCurrentIndex', me.currDicePoint + me.prevPoint)
      console.log(`当前跳至第${me.currStepIndex}格`)
      me.$store.dispatch('setMonoJumpedArray', me.currStepIndex - 1)
      me.$store.dispatch('setMonoPrevPoint', me.prevPoint + me.currDicePoint)
      console.log('目前为止累计的点数：', me.prevPoint)
      let rabbit = document.querySelector('.leap-rabbit')
      if (rabbit) {
        me.showDefaultRabbit = false
      }
      // 如果最后一格为大宝箱
      let jumpToStepDom
      if (me.currStepIndex === me.currConfigData.configuration.ways.length) {
        jumpToStepDom = document.querySelector('.treasure-close')
      } else {
        jumpToStepDom = document.querySelectorAll('.middle-steps li')[me.currStepIndex - 1]
      }
      // 根据轮次拿当前轮的数据
      me.currEventType = me.events[me.diceIndex].eventType
      me.flashShow(me.currStepIndex, me.currEventType).then(() => {
        // 根据下标匹配当前跳到的格子的事件
        me.randomEvent(jumpToStepDom, me.currEventType)
      })
      // me.flashShow(me.currStepIndex, me.currEventType)
    },
    // 随机事件
    randomEvent(icon, type) {
      // 如果当前步数小于28
      let me = this
      if (me.currStepIndex < me.currConfigData.configuration.ways.length) {
        icon = icon.querySelector('img')
      }
      console.log('当前随机事件类型：', type)
      console.log('当前游戏轮次下标为：', me.diceIndex)
      // 从接口获取的值变量
      let baseValue = me.currEvtData.template.baseEventConfig.changeValue
      let updateScore = me.events[me.diceIndex].template.changeValue
      let doTeacherSound = new Howl({
        src: [me.doTeacherSound]
      })
      let doActivitySound = new Howl({
        src: [me.doActivitySound]
      })
      // 根据type值触发不同的事件逻辑
      switch (type) {
        case 1:
          console.log('====== 当前是随机宝藏游戏 ======')
          for (let i = 0; i < me.events.length; i++) {
            const element = me.events[i]
            // 如果事件类型是1，并且事件数据数组的下标跟当前轮次一致
            if (1 === element.eventType && i === me.diceIndex) {
              me.currEvtData = element
            }
          }
          // 奖励或者惩罚的基数值
          console.log('当前事件数据：', me.currEvtData)
          // 格子上的宝箱飞往屏幕中间
          me.iconFadeInDown(icon).then(() => {
            me.showMask = true
            // 1 是加星星， 2 是炸弹，即减星星
            if (me.currEvtData.template.showEvent === 1) {
              console.log('宝箱里面是奖励星星！ 全体 +2 颗星星')
              me.showTreasureStar = true
              me.showTreasureBomb = false
              me.rewardStarNum = '+' + baseValue + ''
              // 延迟1s播放音效
              setTimeout(() => {
                me.win_sound.play()
              }, 1000)
            } else {
              me.showTreasureStar = false
              me.showTreasureBomb = true
              console.log('宝箱里面是炸弹！全体 -2 颗星星')
              me.rewardStarNum = baseValue
              // 延迟1s播放音效
              setTimeout(() => {
                me.bomb_sound.play()
              }, 1000)
            }
            // 关闭遮罩，加减分动画
            setTimeout(() => {
              me.bolleanReset()
              // let updateScore = me.currEvtData.showEvent === 1 ? baseValue : -baseValue
              me.postAndUpdate(baseValue).then(() => {
                me.scoreUpdate().then(() => {
                  // 递增骰子轮次
                  me.$store.dispatch('setMonoTurnIndex', me.diceIndex + 1)
                  setTimeout(() => {
                    me.diceRandom()
                  }, 6000)
                })
              })
            }, 2000)
          })
          // anime({
          //   targets: icon,
          //   left: '0.52rem',
          //   top: '0.73rem',
          //   opacity: 0,
          //   duration: 1000,
          //   complete: function() {
              
          //   }
          // })
          break
        case 2:
          console.log('====== 当前是奖励星星游戏 ======')
          me.iconFadeInDown(icon).then(() => {
            me.rewardStarNum = '+' + updateScore + ''
            me.postAndUpdate(updateScore).then(() => {
              me.scoreUpdate().then(() => {
                // 递增骰子轮次
                me.$store.dispatch('setMonoTurnIndex', me.diceIndex + 1)
                setTimeout(() => {
                  this.diceRandom()
                }, 7000)
              })
            })
          })
          break
        case 3:
          console.log('====== 当前是触发随机互动游戏 ======')
          for (let i = 0; i < me.events.length; i++) {
            const element = me.events[i]
            // 如果事件类型是3，并且事件数据数组的下标跟当前轮次一致
            if (3 === element.eventType && i === me.diceIndex) {
              me.currEvtData = element
            }
          }
          // 保存大富翁游戏当前的状态
          // me.$store.dispatch('setMonoTurnIndex', me.diceIndex)
          me.$store.dispatch('setMonoCurrentIndex', me.currStepIndex)
          // 根据配置时间判定什么时候跳转互动
          console.log(me.currEvtData)
          // 当前格子上的图标消失
          me.iconFadeInDown(icon).then(() => {
            // 线下活动
            if (me.currEvtData.template.name === 'free_time') {
              doTeacherSound.play()
              doTeacherSound.on('end', () => {
                // 出现跳转互动前倒计时界面
                me.showMask = true
                me.$route.query.fromMonopoly = 'yes'
                me.isFreeTimeActivity = true
                anime({
                  targets: '.count-down-board',
                  translateY: '1.5rem',
                  easing: 'easeOutElastic',
                  duration: 1000,
                  complete: function() {
                    me.$router.push({
                      name: 'monopoly',
                      query: {
                        fromMonopoly: 'yes'
                      }
                    })
                    me.freeTimeCountDownTime = me.currEvtData.template.configuration.totalTime
                  }
                })
              })
            } else {
              doActivitySound.play()
              doActivitySound.on('end', () => {
                // 通知服务端开启某个互动
                me.Api.coursewareStart({
                  classID: me.classID,
                  lessonID: me.lessonID,
                  interactionID: me.currEvtData.template.interactionID
                }).then(data => {
                  me._checkData(data).then(() => {
                    console.log('======开启互动请求成功======')
                    me.$router.push({
                      name: me.currEvtData.template.name,
                      params: me.currEvtData.template,
                      query: {
                        fromMonopoly: 'yes'
                      }
                    })
                  })
                }).catch(() => {
                  me.$message.error('互动请求失败，请检查接口访问情况')
                })
              })
            }
          })
          // 递增骰子轮次
          me.$store.dispatch('setMonoTurnIndex', me.diceIndex + 1)
          // }, 1000)
          break
        case 4:
          console.log('====== 当前是奖励大宝藏游戏 ======')
          me.treasure_sound.play()
          me.clap_sound.play()
          me.gameDone = true
          me.rewardStarNum = '+' + me.events[me.events.length - 1].template.changeValue + ''
          // me.showRewardStar = true
          me.postAndUpdate(me.events[me.diceIndex].template.changeValue).then(() => {
            me.scoreUpdate()
          })
          setTimeout(() => {
            me.endTime = me._getNowFormatDate()
            console.log('当前互动结束，时间为：', me.endTime)
            console.log('****** 大富翁游戏结束 ******')
          }, 5000)
          break
      }
    },
    scoreUpdate() {
      return new Promise((resolve) => {
        this.win_sound.play()
        // 分值变化动画
        let updateTimeline = anime.timeline()
        updateTimeline.add({
          targets: '.update-score',
          opacity: 1,
          scale: [
            {
              value: 2,
              duration: 300
            },
            {
              value: 1,
              duration: 300
            }
          ],
          easing: 'easeOutBack'
        }).add({
          targets: '.update-score',
          translateY: [0, -20],
          opacity: 0,
          easing: 'linear',
          duration: 2000,
          complete: function() {
            resolve()
          }
        })
      })
    },
    // 分数上报及更新当前分数
    postAndUpdate(value) {
      return new Promise((resolve) => {
        let me = this
        // 分数加减上报
        me.Api.monopolyUpdateScore({
          lessonID: me.lessonID,
          interactionID: me.currConfigData.interactionID,
          classID: me.classID,
          changeValue: value
        }).then(data => {
          this._checkData(data).then(() => {
            me.getInterfaceScore()
            resolve()
          })
        })
      })
    },
    // 格子上的东西消失的动画
    iconFadeInDown(icon) {
      return new Promise((resolve) => {
        // 格子上的东西消失
        anime({
          targets: icon,
          translateY: {
            value: -200,
            duration: 1000
          },
          opacity: {
            value: 0,
            duration: 1000
          },
          easing: 'linear',
          complete: function() {
            resolve()
          }
        })
      })
    },
    // 右边学生列表的星星出现与隐藏
    changeStarStatus() {
      // 一定时间之后奖励的星星出现
      setTimeout(() => {
        this.showRewardStar = true
        // 一定时间之后奖励的星星消失
        setTimeout(() => {
          // this.showRewardStar = false
          this.diceRandom()
        }, 2000)
      }, 1000)
    },
    // 线下活动倒计时完毕
    countdownend() {
      this.bolleanReset()
      setTimeout(() => {
        this.diceRandom()
      }, 6000)
    },
    // 所有布尔变量reset false
    bolleanReset() {
      this.showVoice = false
      this.showMask = false
      this.showBigDice = false
      this.showTreasureStar = false
      this.showTreasureBomb = false
      this.isFreeTimeActivity = false
    },
    getDiceImg(num) {
      if(num !== '' && typeof num !== 'undefined' && num !== null) {
        return `./assets/images/dices/mono-dice-${num}.png`
      }
    }
  },
  beforeDestroy: function() {
    clearTimeout(this.runTimeout)
    this.bgm_sound.stop()
    this.dice_sound.stop()
    this.start_sound.stop()
    this.win_sound.stop()
    this.bomb_sound.stop()
    this.clap_sound.stop()
    this.treasure_sound.stop()
  },
  computed: {
    ...mapState({
      'studentsData': state => state.game.studentsData,
      'students': state => state.game.studentsScoreData,
      'diceIndex': state => state.game.monopolyTurnIndex,
      'currStepIndex': state => state.game.monopolyCurrentIndex,
      'prevPoint': state => state.game.monopolyPrevPoint,
      'currDicePoint': state => state.game.monopolyCurrentPoint,
      'rabbitPointX': state => state.game.rabbitPointX,
      'rabbitPointY': state => state.game.rabbitPointY,
      'jumpedArray': state => state.game.jumpedArray,
      'lessonID': state => state.game.lessonID,
      'classID': state => state.game.classID,
      'courseID': state => state.game.courseID
    }),
    ...mapGetters({
      'configData': 'getMonopoly'
    })
  }
}
</script>

<style>

</style>
