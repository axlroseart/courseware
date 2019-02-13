<template>
  <div class="roulette-index">
    <readyNow></readyNow>
    <div class="logo"></div>
    <div class="game-area">
      <div class="main">
        <div class="cover"></div>
        <div class="children-imgs">
          <div class="avatar-wrap">
            <transition-group enter-active-class="animated zoomIn"  leave-active-class="animated zoomOut">
              <li
                v-for="items, index in children"
                :key="index">
                <img :src="items.avatar" :alt="items.name">
                <img :src="items.avatar" :alt="items.name">
                <img :src="items.avatar" :alt="items.name">
                <span class="high-light-yellow-back" v-show="items.choosed"></span>
                <!-- <span class="high-light-yellow-back" v-show="index === 3"></span> -->
                <i class="halo" v-show="items.choosed"></i>
                <i class="hilit-area" v-show="items.showHilit"></i>
              </li>
              <!-- <li
                v-for="items, index in refillStudents"
                :key="items.id">
                <img :src="items.avatar" :alt="items.name">
              </li> -->
            </transition-group>
          </div>
        </div>
        <div class="bbt"></div>
        <!-- <div class="pan"></div> -->
        <!-- <div class="high-light"></div> -->
      </div>
      <div class="board">
        <div class="avatar">
          <transition-group enter-active-class="animated flash"  leave-active-class="animated zoomOut">
            <i class="update-score" :key="1">+{{ pickStudentStar }}</i>
            <img class="pick-avatar-img pick-student-avatar" :key="2" :src="pickStudentAvatar" alt="" v-show="isShowPickStudentAvatar">
            <img class="pick-avatar-img default-avatar" :key="3" :src="avatarDefault" alt="" v-show="!isShowPickStudentAvatar">
            <div :key="4" class="redhead" v-show="isShowPickStudentAvatar">
              {{ pickStudentName }}
            </div>
          </transition-group>
          <transition enter-active-class="animated zoomIn"  leave-active-class="animated zoomOut">
            <div class="bonus-star" v-show="showScoreStar && pickStudentStar > 0"></div>
          </transition>
        </div>
        <transition-group enter-active-class="animated zoomIn"  leave-active-class="animated zoomOut">
          <div :key="1" class="default-word-area" v-show="!isShowPickStudentAvatar">
            <img class="words-img default-words-img" :src="defaultWordImg" alt="">
          </div>
          <div :key="2" class="show-word-area" v-show="isShowPickStudentAvatar">
            <img class="words-img real-words-img" :src="randomWordImg" alt="">
            <h1>{{ randomWord }}</h1>
          </div>
        </transition-group>
        <transition enter-active-class="animated zoomIn"  leave-active-class="animated zoomOut">
          <div class="clock-count-down" v-show="showVoice">
            <!-- <object width="100%" height="100%" wmode="transparent" type="application/x-shockwave-flash" class="voice-waves-flash">
              <param name="src" :value="voiceWaves" />
              <param name="quality" value="high" />
            </object> -->
            <div class="voice-waves audioGka"></div>
            <el-progress type="circle" :percentage="percentage" status="exception" :stroke-width="8" color="#FF6161"></el-progress>
          </div>
        </transition>
        <transition enter-active-class="animated zoomIn"  leave-active-class="animated zoomOut">
          <div class="show-score" v-show="isReadFinished">
            <!-- <i class="roulette-score-star star-one" v-show="pickStudentStar === 1"></i> -->
            <!-- <i class="roulette-score-star star-two" v-show="pickStudentStar === 2"></i> -->
            <!-- <i class="roulette-score-star star-three" v-show="pickStudentStar === 3"></i> -->
            <i class="roulette-score-star star-none" v-show="pickStudentStar === 0 || pickStudentStar === -1"></i>
            <!-- <span>{{ pickStudentScore }}</span> -->
            <!-- <object width="100%" height="100%" wmode="transparent" type="application/x-shockwave-flash" class="score-back-flash">
              <param name="src" :value="scoreBack" />
              <param name="quality" value="high" />
            </object> -->
          </div>
        </transition>
      </div>
    </div>
    <!-- <div id="motionPath">
      <svg>
        <path 
        fill="none" 
        stroke="currentColor" 
        stroke-width="1" 
        :d="svgPath"
        ></path>
      </svg>
    </div> -->
    <!-- 小星星动画canvas -->
    <canvas id="canvas_a_star" class="canvas-a-star" width="1920" height="1080"></canvas>
    <!-- 小星星动画canvas -->
    <!-- 飞行的小星星动画canvas -->
    <canvas id="canvas_a_star_fly" class="canvas-a-star" width="1920" height="1080"></canvas>
    <!-- 飞行的小星星动画canvas -->
  </div>
</template>

<script>
import '../../../assets/styles/roulette.styl'
import '../../../assets/gka/audio/gka.css'
import { clockCountDown, importAll, preloadImage } from '../../../utils/index'
// import voiceWaves from '../../../assets/flash/voiceWaves.swf'
import defaultAvatar from '../../../assets/images/avatar.png'
import defaultWordImg from '../../../assets/images/default-word-img.png'
import avatarDefault from '../../../assets/images/default-avatar.png'
import anime from 'animejs'
import { mapState, mapGetters } from 'vuex'
import scoreBack from '../../../assets/flash/scoreBack.swf'
import bgm_mp3 from '../../../assets/sounds/roulette/bgm.mp3'
import rolling_mp3 from '../../../assets/sounds/roulette/rolling.mp3'
import answer_mp3 from '../../../assets/sounds/roulette/answer.mp3'
import win_mp3 from '../../../assets/sounds/roulette/win.mp3'
import yourturn_mp3 from '../../../assets/sounds/roulette/yourturn.mp3'
import fly_mp3 from '../../../assets/sounds/roulette/fly.mp3'
import readyNow from '../readyNow'
import MYAIDE from "../../../utils/myaide.js"
const voiceWaveImages = importAll(require.context ('../../../assets/gka/audio/img', false, /\.png$/))
const _ = require('lodash')
export default {
  data() {
    return {
      percentage: 0,
      interval: 10,
      avatarDefault,
      // voiceWaves: voiceWaves,
      scoreBack: scoreBack,
      defaultWordImg: defaultWordImg,
      children: [],
      onlineStudents: [],
      defaultAvatar: defaultAvatar,
      defaultStudent: [],
      // 当前课堂学生数
      totalStudent: 14,
      // 转盘持续时间
      duration: 7,
      // 转动的圈数
      rollTimes: 3,
      // 上榜队列数组
      onBoardStudent: [],
      // 生成的不重复的上榜学生数据数组
      baseBingoArray: [],
      // 转动次数
      rollCount: 1,
      // 中奖头像效果运动轨迹
      svgPath: 'M17.5 321 Q196.5 7 677.5 35',
      // 当前选中单词的读音时间
      currWordShowTime: 0,
      // 单词索引位置
      taskIndex: 0,
      // 随机选出的单词
      randomWord: '',
      // 随机选出的单词对应的图片
      randomWordImg: '',
      // 单词随机显示的定时器
      wordChangeTimer: {},
      // 是否显示收音flash
      showVoice: false,
      // 选中的学生是否已经读完单词
      isReadFinished: false,
      // 选中学生的头像
      pickStudentAvatar: defaultAvatar,
      // 选中学生的名字
      pickStudentName: '',
      // 选中学生的ID
      pickStudentId: 0,
      // 选中学生的分数
      pickStudentScore: 0,
      // 选中学生得到的星星数
      pickStudentStar: 0,
      // 是否显示选中学生的头像
      isShowPickStudentAvatar: false,
      // 是否显示上墙学生的加分星星
      showScoreStar: false,
      // 是否有选中合法学生ID
      isPickRight: false,
      // 当前互动的配置数据
      currConfigData: {},
      // 互动开始时间
      startTime: '',
      // 互动结束时间
      endTime: '',
      // ready-go 执行时间， 单位为秒
      readyGoTime: 2,
      // 延迟进入收音环节的时间
      recordDelayTime: 2000,
      // 不足14人学生填充
      adasd: [],
      refillStudents: [],
      // 音效资源
      bgm_mp3,
      rolling_mp3,
      answer_mp3,
      win_mp3,
      yourturn_mp3,
      fly_mp3,
      // 声音对象
      bgm_sound: {},
      rolling_sound: {},
      answer_sound: {},
      win_sound: {},
      yourturn_sound: {},
      runTimeout: {},
      pickTimeout: {},
      collectionVoiceTimeout: {},
      showScoreTimeout: {},
      txtShowTimeout: {},
      flyToBoardTimeout: {},
      showStarAnimeTimeout: {},
      // 动画目标对象
      animeTargets: [],
      // 指针固定的转动时间
      confirmedRollTime: 2500,
      // 指针最后一圈的固定时间，以动画执行时间为准
      pointerExecuteTime: 10000,
      // 指针转动的度数
      pointerDeg: 0,
      // 指针偏移度数
      currBbtRotate: 0,
      // 头像高亮光晕的下标
      hilitIndex: 0,
      // 渲染器
      renderer: {},
      // 小星星1数据组,
      smallStarArrOne: [],
      // 小星星1动画
      smallStarAnimeOne: {},
      // 小星星2数据组,
      smallStarArrTwo: [],
      // 小星星2动画
      smallStarAnimeTwo: {},
      // 小星星3数据组,
      smallStarArrThree: [],
      // 小星星3动画
      smallStarAnimeThree: {},
      // 飞行的星星渲染器
      renderer_fly: {},
      // 飞行的小星星1数据组,
      flyStarArrOne: [],
      // 飞行的小星星1动画
      flyStarAnimeOne: {},
      // 飞行的小星星2数据组,
      flyStarArrTwo: [],
      // 飞行的小星星2动画
      flyStarAnimeTwo: {},
      // 飞行的小星星3数据组,
      flyStarArrThree: [],
      // 飞行的小星星3动画
      flyStarAnimeThree: {},
      // 单词组
      wordsArray: [],
      // 当前选中的学生头像下标
      currPickedAvatarDomIndex: 0,
      // 每轮开始转的时间戳
      perRollStartTime: 0,
      // 每轮结束时的时间戳
      perRollEndTime: 0
    }
  },
  mounted() {
    this.animeInit()
    document.getElementsByTagName('body')[0].style.background = 'rgba(0, 0, 0, 1)'
    // bgm
    this.bgm_sound = new Howl({
      src: [this.bgm_mp3],
      loop: true,
      volume: 0.5
    })
    // 播放转动音效
    this.rolling_sound = new Howl({
      src: [this.rolling_mp3]
    })
    // 播放到你了音效
    this.yourturn_sound = new Howl({
      src: [this.yourturn_mp3]
    })
    // 播放到回答音效
    this.answer_sound = new Howl({
      src: [this.answer_mp3]
    })
    // 播放得分音效
    this.win_sound = new Howl({
      src: [this.win_mp3]
    })
    // 星星飞上去的音效
    this.fly_sound = new Howl({
      src: [this.fly_mp3]
    })
    this.currConfigData = this.$route.params
    console.log('大转盘从主教端接收到的配置信息：', this.currConfigData)
    // 设置当前组件下的webview背景透明
    document.getElementsByTagName('body')[0].style.background = 'rgba(0, 0, 0, 0)'
    this.fetchOnlineStudends().then(() => {
      // 不够14人，则以默认头像填充
      if (this.onlineStudents.length < this.totalStudent) {
        for (let i = 0; i < this.totalStudent - this.onlineStudents.length; i++) {
          this.refillStudents.push({
            id: i + this.onlineStudents.length,
            name: 'default',
            avatar: defaultAvatar
          })
        }
      }
      this.children = _.shuffle([...this.onlineStudents, ...this.refillStudents])
      // 开始执行游戏逻辑，在XX时间（即准备时间，s）后开转
      if (this.currConfigData) {
        this.runTimeout = setTimeout(() => {
          this.bgm_sound.play()
          this.rollingCover()
        }, this.currConfigData.configuration.prepareTime)
      } else {
        console.log('$$$$$$ 当前互动暂无配置数据 $$$$$$')
      }
    })
  },
  watch: {
    'scoreData': function(val) {
      let me = this
      me.pickStudentStar = val.star
      me.pickStudentScore = val.value
    },
    'pointerDeg': function(val) {
      val = (val + 90) % 360
      // console.log('当前指针转动的度数：', val)
      let area = 360 / 14
      this.hilitIndex = parseInt(val / area)
      if (this.hilitIndex === 0) {
        this.$set(this.children[13], 'showHilit', false)
      } else {
        this.$set(this.children[this.hilitIndex - 1], 'showHilit', false)
      }
      this.$set(this.children[this.hilitIndex], 'showHilit', true)
    }
  },
  filters: {
    // 分数对应星星过滤
    starScore: function(value) {
      if (!value) return ''
      if (value > 90) {
        return 3
      }
      if (value > 80) {
        return 2
      }
      if (value > 60) {
        return 1
      }
      if (value < 60) {
        return 0
      }
    }
  },
  methods: {
    animeInit() {
      let me = this
      // 小星星渲染器
      let canvasItemsStar = document.getElementById("canvas_a_star")
      this.renderer = new MYAIDE.Renderer({ canvas: canvasItemsStar })
      this.renderer.begin()
      preloadImage(voiceWaveImages)
      // A区小星星动画
      // ------ a 1 ------
      MYAIDE.Loader.loadAniImg(
        me.smallStarArrOne,
        "./assets/images/small-star-one/03_000",
        36,
        19
      )
      this.smallStarAnimeOne = new MYAIDE.IntervalAnimation({
        frameArray: me.smallStarArrOne,
        playTime: 1,
        listenerStatus: true,
        cycle: 10
      })
      this.smallStarAnimeOne.scale.set(1.35, 1.35)
      this.smallStarAnimeOne.position.x = 1150
      this.smallStarAnimeOne.position.y = 610
      this.renderer.add(this.smallStarAnimeOne)
      // ------ a 2 ------
      MYAIDE.Loader.loadAniImg(
        me.smallStarArrTwo,
        "./assets/images/small-star-two/02_000",
        52,
        19
      )
      this.smallStarAnimeTwo = new MYAIDE.IntervalAnimation({
        frameArray: me.smallStarArrTwo,
        playTime: 1,
        listenerStatus: true,
        cycle: 10
      })
      this.smallStarAnimeTwo.scale.set(1.25, 1.25)
      this.smallStarAnimeTwo.position.x = 1170
      this.smallStarAnimeTwo.position.y = 612
      this.renderer.add(this.smallStarAnimeTwo)
      // ------ a 3 ------
      MYAIDE.Loader.loadAniImg(
        me.smallStarArrThree,
        "./assets/images/small-star-three/01_000",
        81,
        19
      )
      this.smallStarAnimeThree = new MYAIDE.IntervalAnimation({
        frameArray: me.smallStarArrThree,
        playTime: 1,
        listenerStatus: true,
        cycle: 10
      })
      this.smallStarAnimeThree.scale.set(1.1, 1.1)
      this.smallStarAnimeThree.position.x = 1225
      this.smallStarAnimeThree.position.y = 605
      this.renderer.add(this.smallStarAnimeThree)
      // 飞行的星星
      let canvasItemsFlyStar = document.getElementById("canvas_a_star_fly")
      this.renderer_fly = new MYAIDE.Renderer({ canvas: canvasItemsFlyStar })
      this.renderer_fly.begin()
      // ------ a 1 ------
      MYAIDE.Loader.loadAniImg(
        me.flyStarArrOne,
        "./assets/images/fly-star-one/1xing_",
        23,
        0
      )
      this.flyStarAnimeOne = new MYAIDE.IntervalAnimation({
        frameArray: me.flyStarArrOne,
        playTime: 1,
        listenerStatus: true,
        visible: false,
        cycle: 30
      })
      // this.flyStarAnimeOne.scale.set(1.2, 1.2)
      this.flyStarAnimeOne.position.x = 1190
      this.flyStarAnimeOne.position.y = 250
      this.renderer_fly.add(this.flyStarAnimeOne)
      // ------ a 2 ------
      MYAIDE.Loader.loadAniImg(
        me.flyStarArrTwo,
        "./assets/images/fly-star-two/2xing_",
        23,
        0
      )
      this.flyStarAnimeTwo = new MYAIDE.IntervalAnimation({
        frameArray: me.flyStarArrTwo,
        playTime: 1,
        listenerStatus: true,
        visible: false,
        cycle: 30
      })
      this.flyStarAnimeTwo.position.x = 1230
      this.flyStarAnimeTwo.position.y = 250
      this.renderer_fly.add(this.flyStarAnimeTwo)
      // ------ a 3 ------
      MYAIDE.Loader.loadAniImg(
        me.flyStarArrThree,
        "./assets/images/fly-star-three/3xing_",
        23,
        0
      )
      this.flyStarAnimeThree = new MYAIDE.IntervalAnimation({
        frameArray: me.flyStarArrThree,
        playTime: 1,
        listenerStatus: true,
        visible: false,
        cycle: 30
      })
      this.flyStarAnimeThree.position.x = 1180
      this.flyStarAnimeThree.position.y = 250
      this.renderer_fly.add(this.flyStarAnimeThree)
    },
    showStars() {
      let me = this
      console.log('me.pickStudentStar:', me.pickStudentStar)
      switch (me.pickStudentStar) {
        case 1:
          me.smallStarAnimeOne.visible = true
          me.smallStarAnimeOne.gotoAndPlay(0)
          me.smallStarAnimeOne.addListener('ended', () => {
            me.smallStarAnimeOne.visible = false
            me.flyStarAnimeOne.visible = true
            me.flyStarAnimeOne.gotoAndPlay(0)
            me.fly_sound.play()
            // me.renderer.stop()
            me.flyStarAnimeOne.addListener('ended', () => {
              me.flyStarAnimeOne.visible = false
            })
          })
          break
        case 2:
          me.smallStarAnimeTwo.visible = true
          me.smallStarAnimeTwo.gotoAndPlay(0)
          me.smallStarAnimeTwo.addListener('ended', () => {
            me.smallStarAnimeTwo.visible = false
            me.flyStarAnimeTwo.visible = true
            me.flyStarAnimeTwo.gotoAndPlay(0)
            me.fly_sound.play()
            me.flyStarAnimeTwo.addListener('ended', () => {
              me.flyStarAnimeTwo.visible = false
            })
          })
          break
        case 3:
          me.smallStarAnimeThree.visible = true
          me.smallStarAnimeThree.gotoAndPlay(0)
          me.smallStarAnimeThree.addListener('ended', () => {
            me.smallStarAnimeThree.visible = false
            me.flyStarAnimeThree.visible = true
            me.flyStarAnimeThree.gotoAndPlay(0)
            me.fly_sound.play()
            me.flyStarAnimeThree.addListener('ended', () => {
              me.flyStarAnimeThree.visible = false
            })
          })
          break
      }
      me.showStarAnimeTimeout = setTimeout(() => {
        me.goNext()
      }, me.currWordShowTime - 1000)
    },
    fetchOnlineStudends() {
      return new Promise((resolve, reject) => {
        // 先拿取在线学生数据
        this.Api.fetchStudentData({
          classID: this.classID,
          lessonID: this.lessonID
        }).then(data => {
          this._checkData(data).then(data => {
            data = data.data.students
            if (data) {
              for (let index = 0; index < data.length; index++) {
                const element = data[index]
                if (element.online) {
                  this.onlineStudents.push(element)
                }
              }
              resolve()
            } else {
              reject('null data')
            }
          })
        }).catch(error => {
          this.$message.error(error.message)
          reject(error)
        })
      })
    },
    // 最外层甜甜圈转
    rollingCover() {
      console.log('开始转，当前时间戳为：', new Date().getTime())
      this.perRollStartTime = new Date().getTime()
      this.rolling_sound.play()
      if (this.rollCount === 1) {
        this.startTime = this._getNowFormatDate()
        console.log('当前互动开始执行，开始时间为：', this.startTime)
      }
      console.log('当前转动次数：', this.rollCount)
      let me = this
      // document.querySelector('.bbt').classList.add('animal')
      let randomNum = me._getRd(0, me.currConfigData.configuration.task.length - 1)
      me.randomWord = me.currConfigData.configuration.task[randomNum].text.text
      me.randomWordImg = me.currConfigData.configuration.task[randomNum].text.picture
      // 请求接口，拿选取的学生数据
      if (typeof me.currConfigData.interactionID !== 'undefined') {
        me.Api.pickStudent({
          classID: me.classID,
          lessonID: me.lessonID,
          interactionID: me.currConfigData.interactionID
        }).then(data => {
          me._checkData(data).then(data => {
            // 拿到选中的学生ID
            data = data.data.studentID
            me.pickStudentId = data
            console.log('pick data:', data)
            // 后续操作
            for (let j = 0; j < me.children.length; j++) {
              const element = me.children[j]
              if (data === element.studentID) {
                me.isPickRight = true
                // 指针dom
                let from = document.querySelector('.bbt')
                // 选中的学生头像dom
                let to = document.querySelectorAll('.avatar-wrap li')[j]
                me.currPickedAvatarDomIndex = j
                // 计算指针应该偏移的觉度
                me.currBbtRotate = me.getRotate(from, to)
                // 角度正数化，使指针转动效果总是保持正转
                me.currBbtRotate < 0 ? me.currBbtRotate += 360 : !0
                console.log('指针偏转角度：', me.currBbtRotate)
                let degVal
                if (me.rollCount !== 1) {
                  degVal = (1080 + 360) * me.rollCount + me.currBbtRotate
                } else {
                  degVal = 1080 * me.rollCount + me.currBbtRotate
                }
                console.log('第一次转动，偏转角度为：', degVal)
                me.animeTargets.push(from)
                // anime({
                //   targets: from,
                //   rotate: {
                //     value: degVal,
                //     duration: me.confirmedRollTime,
                //     transformOrigin: '0.69rem 1.17rem 0',
                //     easing: 'easeOutQuad',
                //     // easing: [.3,.92,.43,1]
                //   },
                //   update: function(anim) {
                //     if (from) {
                //       me.pointerDeg = Number(anim.animations[0].currentValue.split('deg')[0])
                //     }
                //   },
                //   complete: function() {
                // 指定指针偏转角度
                anime({
                  targets: from,
                  rotate: {
                    value: degVal + 360,
                    easing: [.07,.18,0,.99],
                    // easing: [0, .1, 0, 1],
                    duration: me.pointerExecuteTime,
                    transformOrigin: '0.69rem 1.17rem 0'
                  },
                  update: function(anim) {
                    if (from) {
                      // me.pointerDeg = Number(from.style.transform.split('rotate(')[1].split('deg')[0])
                      me.pointerDeg = Number(anim.animations[0].currentValue.split('deg')[0])
                    }
                  },
                  complete: function() {
                    // 选中的学生数据
                    me.pickStudentAvatar = element.avatar
                    me.pickStudentName = element.name
                    // ------ 右边业务逻辑 ------
                    me.$set(me.children[j], 'choosed', true)
                    me.$set(me.children[j], 'showHilit', false)
                    // 终止转圈音效
                    me.rolling_sound.stop()
                    me.yourturn_sound.play()
                    me.wordsArray = me.currConfigData.configuration.task
                    // 查找随机出来的单词的索引
                    for (let k = 0; k < me.wordsArray.length; k++) {
                      const element = me.wordsArray[k]
                      if (me.randomWord === element.text.text) {
                        me.currWordShowTime = me.wordsArray[k].quizTime
                        me.taskIndex = k
                      }
                    }
                    let avatarWrapDom = document.querySelectorAll('.avatar-wrap li')
                    let effectDom
                    let fromDom
                    if (avatarWrapDom.length > 0) {
                      effectDom = avatarWrapDom[j].querySelectorAll('img')[0]
                      fromDom = avatarWrapDom[j].querySelectorAll('img')[1]
                      me.animeTargets.push(effectDom, fromDom)
                      anime({
                        targets: effectDom,
                        scale: [
                          {
                            value: 2,
                            duration: 3000
                          },
                          {
                            value: 1,
                            duration: 3000
                          }
                        ],
                        opacity: [
                          {
                            value: 0,
                            duration: 3000
                          }
                        ],
                        begin: function() {
                          let toDomData = document.querySelector('img.default-avatar').getBoundingClientRect()
                          let offsetX = toDomData.left
                          let offsetY = toDomData.top
                          let toWidth = toDomData.width
                          let offsetXOrignal = fromDom.getBoundingClientRect().left
                          let offsetYOrignal = fromDom.getBoundingClientRect().top
                          anime({
                            targets: fromDom,
                            translateX: [
                              {
                                value: offsetX - offsetXOrignal
                              }
                            ],
                            translateY: offsetY - offsetYOrignal - toWidth - (toWidth / 2) + 99,
                            opacity: [
                              {
                                value: 0.8
                              },
                              {
                                value: 0
                              }
                            ],
                            easing: 'easeInOutSine',
                            duration: 1000,
                            loop: false,
                            complete: function() {
                              // document.querySelector('.bbt').classList.remove('animal')
                              fromDom.removeAttribute('style')
                              me.isShowPickStudentAvatar = true
                              // 选出上台的学生，显示收音提示flash，开始倒计时
                              // 播放单词领读mp3
                              // let currWordMp3 = new Howl({
                              //   src: wordsArray[me.taskIndex].text.audio
                              // })
                              // currWordMp3.play()
                              // 延时进入收音环节
                              me.collectionVoiceTimeout = setTimeout(() => {
                                // 请求服务端，告诉服务端相应的数据
                                if (typeof me.currConfigData.interactionID !== 'undefined') {
                                  // me.Api.startInteraction({
                                  //   classID: me.classID,
                                  //   lessonID: me.lessonID,
                                  //   interactionID: me.currConfigData.interactionID,
                                  //   taskID: me.taskIndex,
                                  //   type: me.currConfigData.type,
                                  //   config: 'studentID=' + me.pickStudentId + ''
                                  // }).then(data => {
                                  //   me._checkData(data).then(() => {
                                  //     console.log('======互动请求成功======')
                                  //   })
                                  // })
                                  let query = 'interactionpb.ClasskitStartInteractionRequest'
                                  let url = 'protos/interaction.proto'
                                  let params = {
                                    classID: me.classID,
                                    lessonID: me.lessonID,
                                    interactionID: me.currConfigData.interactionID,
                                    taskID: me.taskIndex,
                                    type: me.currConfigData.type,
                                    config: 'studentID=' + me.pickStudentId + ''
                                  }
                                  // 编码，并发送socket请求
                                  // 6为互动请求类型
                                  global.icsocket.encode(query, url, params, 6, global.icsocket.webskt)
                                } else {
                                  return
                                }
                                me.showVoice = true
                                me.answer_sound.play()
                                // 开始收音提示
                                clockCountDown(me.currWordShowTime / 1000, me, function() {
                                  me.showVoice = false
                                  me.isReadFinished = true
                                  me.answer_sound.stop()
                                  me.win_sound.play()
                                  me.showStars()
                                })
                              }, me.recordDelayTime)
                            }
                          })
                        },
                        complete: function() {
                          anime({
                            targets: effectDom,
                            opacity: 1
                          })
                        }
                      })
                    }
                  }
                })
                  // }
                // })
                me.rollCount ++
              } else {
                me.isPickRight = false
              }
            }
          })
        })
      }
    },
    goNext() {
      let me = this
      me.txtShowTimeout = setTimeout(() => {
        me.showScoreStar = true
        me.scoreUpdate().then(() => {
          me.showScoreStar = false
          if (me.rollCount <= me.currConfigData.configuration.count) {
            this.perRollEndTime = new Date().getTime()
            console.log('当前轮次结束，时间戳为：', new Date().getTime())
            console.log('当前轮次所得星星数为：', this.pickStudentStar)
            console.log('当前轮次总执行了（毫秒）：', this.perRollEndTime - this.perRollStartTime)
            me.triggerRoll(me.currPickedAvatarDomIndex)
          } else {
            me.endTime = me._getNowFormatDate()
            console.log('当前互动结束，时间为：', me.endTime)
            me._timeFn(me.startTime)
            if(window.webviewCallBack) window.webviewCallBack({
              type: 'end',
              start: typeof me.$route.params.from === 'undefined' ? '' : me.$route.params.from,
              courseware: me.$route.params.name
            }) // mark修改的
          }
        })
      }, me.wordsArray[me.taskIndex].showTime - 2000) // 补充动画执行的时间差
    },
    // 分数更新效果
    scoreUpdate() {
      return new Promise((resolve) => {
        if (this.pickStudentStar > 0) {
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
        } else {
          resolve()
        }
      })
    },
    triggerRoll(index) {
      // 重置pick后的各种显示逻辑
      let currLi = document.querySelectorAll('.avatar-wrap li')[index]
      if (currLi) currLi.classList.remove('pickedHighLight')
      this.$set(this.children[index], 'choosed', false)
      // document.querySelector('.bbt').style = ''
      this.percentage = 0
      this.isShowPickStudentAvatar = false
      this.showVoice = false
      this.showScoreStar = false
      this.isReadFinished = false
      this.pickStudentScore = 0
      this.pickStudentStar = -1
      this.animeTargets = []
      this.rollingCover()
    },
    // 相对最外层浏览器窗口的坐标位置
    calcClientXY(dom) {
      return {
        x: dom.getBoundingClientRect().x, // x坐标
        y: dom.getBoundingClientRect().y, // y坐标
        width: dom.getBoundingClientRect().width, // 宽度
        height: dom.getBoundingClientRect().height // 高度
      }
    },
    // 清除动画方法
    clearAnime() {
      console.log('要清除的动画对象：', this.animeTargets)
      let me = this
      return new Promise((resolve) => {
        for (let index = 0; index < me.animeTargets.length; index++) {
          const element = me.animeTargets[index]
          anime.remove(element)
        }
        resolve()
      })
    },
    // 已知两个点坐标，求旋转角度
    getRotate(from, to) {
      let x1 = from.getBoundingClientRect().left
      x1 = x1 + from.getBoundingClientRect().width / 2
      let y1 = from.getBoundingClientRect().top
      y1 = y1 + from.getBoundingClientRect().height / 2 + 24
      // 指针圆心坐标
      x1 = 335
      y1 = 278
      // console.log('x1:', x1)
      // console.log('y1:', y1)
      let x2 = to.getBoundingClientRect().left
      x2 = x2 + to.getBoundingClientRect().width / 2
      let y2 = to.getBoundingClientRect().top
      y2 = y2 + to.getBoundingClientRect().height / 2
      // console.log('x2:', x2)
      // console.log('y2:', y2)
      let z = Math.atan2((x1 - x2), (y1 - y2))
      return -z * (180 / Math.PI)
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log('trigger beforeRouteLeave:', this.$route.name)
    // 导航离开该组件的对应路由时调用
    // this.renderer.remove(this.smallStarAnimeOne, this.smallStarAnimeTwo, this.smallStarAnimeThree, this.flyStarAnimeOne, this.flyStarAnimeTwo, this.flyStarAnimeThree)
    if (this.renderer) this.renderer.stop()
    if (this.renderer_fly) this.renderer_fly.stop()
    // this.renderer.delAllScene()
    // this.renderer.runStatus = false
    // 可以访问组件实例 `this`
    clearTimeout(this.runTimeout)
    clearTimeout(this.pickTimeout)
    clearTimeout(this.collectionVoiceTimeout)
    clearTimeout(this.showScoreTimeout)
    clearTimeout(this.txtShowTimeout)
    clearTimeout(this.flyToBoardTimeout)
    clearTimeout(this.showStarAnimeTimeout)
    // 清除音效
    this.bgm_sound.stop()
    this.bgm_sound.unload()
    this.rolling_sound.unload()
    this.answer_sound.unload()
    this.win_sound.unload()
    this.yourturn_sound.unload()
    this.fly_sound.unload()
    this.rollCount = 1
    // 清除动画
    this.clearAnime().then(() => {
      next()
    })
  },
  computed: {
    ...mapGetters({
      'configData': 'getPronunciationSingleRoulette'
    }),
    ...mapState({
      students: state => state.game.studentsData,
      shuffleStudentData: state => state.game.shuffleStudentData,
      scoreData: state => state.game.scoreData,
      lessonID: state => state.game.lessonID,
      classID: state => state.game.classID,
      courseID: state => state.game.courseID
    })
  },
  components: {
    readyNow
  }
}
</script>

<style>

</style>
