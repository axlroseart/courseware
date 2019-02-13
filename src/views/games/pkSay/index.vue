<template>
  <div class="pk-say">
    <transition  enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div class="pk-say-background" v-show="showBackground"></div>
    </transition>
    <div class="ready-go-area" v-if="afterPrepareTime">
      <readyNow></readyNow>
    </div>
    <div class="ready-go-area" v-else></div>
    <div class="logo"></div>
    <div class="big-title">
      <div class="title-back">
        <i class="black-mic"></i>
        <label>Role play.</label>
      </div>
      <img :src="defaultAvatar" alt="">
    </div>
    <div class="avatar-panel avatar-left border-left">
      <div class="title green">team 1</div>
      <div class="avatar-panel-list">
        <transition-group enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown">
          <li v-for="items, index in group1" :key="index">
            <img :src="items.avatar" :alt="items.name">
            <label>{{ items.name }}</label>
          </li>
        </transition-group>
      </div>
    </div>
    <div class="avatar-panel avatar-right border-right">
      <div class="title blue">team 2</div>
      <div class="avatar-panel-list">
        <transition-group enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown">
          <li v-for="items, index in group2" :key="index">
            <img :src="items.avatar" :alt="items.name">
            <label>{{ items.name }}</label>
          </li>
        </transition-group>
      </div>
    </div>
    <div class="little-girl role role-left">
      <object width="120%" height="100%" wmode="transparent" type="application/x-shockwave-flash" class="role-flash role-flash-lina-stop">
        <param name="src" :value="linaStop" />
        <param name="quality" value="high" />
      </object>
      <object width="140%" height="100%" wmode="transparent" type="application/x-shockwave-flash" class="role-flash role-flash-lina-action">
        <param name="src" :value="linaAction" />
        <param name="quality" value="high" />
      </object>
      <!-- <embed :src="linaStop" width="100%" height="100%" type="application/x-shockwave-flash" wmode="transparent" class="role-flash-girl"> -->
    </div>
    <div class="little-boy role role-right">
      <object width="100%" height="100%" wmode="transparent" type="application/x-shockwave-flash" class="role-flash role-flash-joe-stop">
        <param name="src" :value="joeStop" />
        <param name="quality" value="high" />
      </object>
      <object width="100%" height="100%" wmode="transparent" type="application/x-shockwave-flash" class="role-flash role-flash-joe-action">
        <param name="src" :value="joeAction" />
        <param name="quality" value="high" />
      </object>
      <!-- <embed :src="joeStop" width="100%" height="100%" type="application/x-shockwave-flash" wmode="transparent" class="role-flash-boy"> -->
    </div>
    <!-- <transition enter-active-class="animated zoomIn"  leave-active-class="animated fadeOut"> -->
      <div class="dialog-left dialog loader">
        <div class="loader__mask">
          <div class="loader__text loader__text--progress">{{ groupOneText }}</div>
        </div>
        <div class="loader__text loader__text--preload">{{ groupOneText }}</div>
        <!-- <label>{{ groupOneText }}</label> -->
        <span class="arrow"></span>
      </div>
    <!-- </transition> -->
    <!-- <transition enter-active-class="animated zoomIn"  leave-active-class="animated fadeOut"> -->
      <div class="dialog-right dialog loader">
        <!-- <label>{{ groupTwoText }}</label> -->
        <div class="loader__mask">
          <div class="loader__text loader__text--progress">{{ groupTwoText }}</div>
        </div>
        <div class="loader__text loader__text--preload">{{ groupTwoText }}</div>
        <span class="arrow"></span>
      </div>
    <!-- </transition> -->
    <transition enter-active-class="animated fadeIn"  leave-active-class="animated fadeOut">
      <div class="clock-count-down" v-show="showVoice">
        <div class="back-circle"></div>
        <object width="100%" height="100%" wmode="transparent" type="application/x-shockwave-flash" class="voice-waves-flash">
          <param name="src" :value="voiceWaves" />
          <param name="quality" value="high" />
        </object>
        <!-- <el-progress type="circle" :percentage="percentage" status="exception" :stroke-width="8" :width="170" color="#FF6161" v-show="isMicAva"></el-progress> -->
      </div>
    </transition>
    <!-- 排行榜组件 -->
    <transition enter-active-class="animated fadeInDown"  leave-active-class="animated fadeOutDown">
      <result v-if="showResult"></result>
    </transition>
  </div>
</template>

<script>
import '../../../assets/styles/pkSay.styl'
import defaultAvatar from '../../../assets/images/avatar.png'
import voiceWaves from '../../../assets/flash/voiceWaves.swf'
import joeStop from '../../../assets/flash/joe-stop.swf'
import joeAction from '../../../assets/flash/joe-action.swf'
import linaStop from '../../../assets/flash/lina-stop.swf'
import linaAction from '../../../assets/flash/lina-action.swf'
import bgm_mp3 from '../../../assets/sounds/pksay/bgm.mp3'
import result_mp3 from '../../../assets/sounds/pksay/result.mp3'
import { TweenMax } from 'gsap/TweenMax'
import anime from 'animejs'
import result from './result'
import { mapGetters, mapState } from 'vuex'
import readyNow from '../readyNow'
export default {
  data() {
    return {
      // percentage: 0,
      defaultAvatar: defaultAvatar,
      voiceWaves: voiceWaves,
      joeStop: linaStop,
      joeAction: linaAction,
      linaStop: joeStop ,
      linaAction: joeAction,
      linaOpenMouth: false,
      joeOpenMouth: false,
      // 组1对话文字
      groupOneText: '',
      // 组2对话文字
      groupTwoText: '',
      // 语音倒计时显示与否
      showVoice: false,
      // pk结果显示与否
      showResult: false,
      // 对话框默认高度
      defaultDialogHeight: 80,
      // 左边对话框默认y轴位置
      leftDefaultDialogY: 0,
      // 右边对话框默认y轴位置
      rightDefaultDialogY: 0,
      // 收音时间
      interval: 0,
      // 读句子任务词组
      tasks: [],
      // 读句子的顺位
      turnIndex: 0,
      // 第几轮PK
      currRound: 1,
      // 要PK几轮,
      round: 2,
      // PK结果数据
      resultData: [],
      // 组是否调换
      isGroupChanged: false,
      // 要不要显示倒计时框
      isMicAva: false,
      // 当前互动的配置数据
      currConfigData: {},
      // 互动开始时间
      startTime: '',
      // 互动结束时间
      endTime: '',
      // ready-go 执行时间， 单位为秒
      readyGoTime: 2,
      // 是否走完准备时间
      afterPrepareTime: false,
      // 是否显示背景图片
      showBackground: false,
      // 音效资源
      bgm_mp3,
      result_mp3,
      // 声音对象
      bgm_sound: {},
      result_sound: {},
      // 第一个定时器对象
      runTimeout: {},
      moveTimeout: {},
      secondPartTimeout: {},
      secondPartStartTimeout: {}
      // lessonID: 221,
      // classID: 1
    }
  },
  mounted() {
    // bgm
    this.bgm_sound = new Howl({
      src: [this.bgm_mp3],
      loop: true,
      volume: 0.1
    })
    // 结果音效
    this.result_sound = new Howl({
      src: [this.result_mp3]
    })
    this.currConfigData = this.$route.params
    typeof this.currConfigData.configuration === 'undefined' ? this.currConfigData = this.configData : !0
    // this.currConfigData = this.configData.template
    document.getElementsByTagName('body')[0].style.background = 'rgba(0, 0, 0, 0)'
    this.leftDefaultDialogY = document.querySelector('.dialog-left').offsetTop
    this.rightDefaultDialogY = document.querySelector('.dialog-right').offsetTop
    // 通过configData数据开始执行互动逻辑
    if (this.currConfigData) {
      this.runTimeout = setTimeout(() => {
        this.afterPrepareTime = true
        this.showBackground = true
        this.bgm_sound.play()
        this.moveTimeout = setTimeout(() => {
          this.showVoice = true
          this.afterPrepareTime = false
          this.startTime = this._getNowFormatDate()
          console.log('当前互动开始执行，开始时间为：', this.startTime)
          // 重写语音提示倒计时到宽度
          // document.querySelector('.el-progress-circle').style.width = '0.89rem'
          // document.querySelector('.el-progress-circle').style.height = '0.89rem'
          this.roleMove()
          // 多长时间后开始角色扮演语音pk
        }, this.readyGoTime * 1000)
      }, this.currConfigData.configuration.prepareTime)
    } else {
      console.log('$$$$$$ 当前互动暂无配置数据 $$$$$$')
    }
  },
  methods: {
    // 对话框队列执行回调
    queupCallBack(index, tasks) {
      let me = this
      // 如果当前执行次数小于或者等于最大的配置执行次数，则继续执行
      if (index <= this.currConfigData.configuration.task.length - 1) {
        this.showDialog(index, tasks[index].index, tasks[index].quizTime, tasks[index].text)
        return
      }
      me.currRound ++
      if (me.currRound <= me.round) {
        // 开始之前先清除上一轮的执行状态
        TweenMax.to(['.dialog-right', '.dialog-left', '.role-flash-joe-action', '.role-flash-lina-action'], 0, {
          opacity: 0
        })
        TweenMax.to(['.role-flash-lina-stop', '.role-flash-joe-stop'], 0, {
          opacity: 1
        })
        let leftPanel = document.querySelector('.avatar-left')
        let rightPanel = document.querySelector('.avatar-right')
        // rightX 为左右两panel要位移的位置
        let rightX = rightPanel.getBoundingClientRect().left
        me.isGroupChanged = false
        // 空出准备时间，即下一轮的游戏介绍时间，老师出现
        this.showBackground = false
        // 交换分组位置
        anime({
          targets: leftPanel,
          left: rightX,
          duration: 3000,
          ease: 'easeOutCubic'
        })
        anime({
          targets: rightPanel,
          right: rightX,
          duration: 3000,
          ease: 'easeOutCubic'
        })
        me.endTime = me._getNowFormatDate()
        console.log('分组配音第一轮结束，时间为：', me.endTime)
        me._timeFn(me.startTime)
        // 第二次准备时间后，开始执行下一轮逻辑
        this.secondPartTimeout = setTimeout(() => {
          this.showBackground = true
          me.isGroupChanged = true
          me.turnIndex = 0
          // 下一轮PK开始，开始读第一个句子
          me.afterPrepareTime = true
          this.secondPartStartTimeout = setTimeout(() => {
            this.startTime = this._getNowFormatDate()
            console.log('分组配音第二轮开始执行，开始时间为：', this.startTime)
            me.showDialog(me.turnIndex, me.tasks[0].index, me.tasks[0].quizTime, me.tasks[0].text)
          }, me.readyGoTime * 1000)
        }, me.currConfigData.configuration.prepareTime2)
      } else {
        // PK完了，跳转排行界面
        this.showResult = true
        this.result_sound.play()
        me.endTime = me._getNowFormatDate()
        console.log('当前互动结束，时间为：', me.endTime)
        me._timeFn(me.startTime)
      }
    },
    // 文字变色
    txtKaraok(dom, time) {
      console.log(time)
      // dom.classList.add('loader-go')
      let mask = dom.querySelector('.loader__mask')
      let textProgress = mask.querySelector('.loader__text--progress')
      anime({
        targets: mask,
        translateX: ['-100%', 0],
        easing: [0.39, 0.575, 0.565, 1],
        duration: time
      })
      anime({
        targets: textProgress,
        translateX: ['100%', 0],
        easing: [0.39, 0.575, 0.565, 1],
        duration: time,
        complete: function() {
          // textProgress.removeAttribute('style')
          // document.querySelectorAll('.loader__text--progress')[0].removeAttribute('style')
          // document.querySelectorAll('.loader__text--progress')[1].removeAttribute('style')
        }
      })
    },
    // 根据不同组显示对应组对话框的方法
    showDialog(index, group, time, text) {
      this.afterPrepareTime = false
      let leftDialog = document.querySelector('.dialog-left')
      let rightDialog = document.querySelector('.dialog-right')
      if (leftDialog && rightDialog) {
        leftDialog.classList.remove('loader-go')
        rightDialog.classList.remove('loader-go')
      }
      switch (group) {
        case 1:
          TweenMax.to(['.dialog-right', '.role-flash-lina-stop', '.role-flash-joe-action'], 0, {
            opacity: 0
          })
          TweenMax.to(['.dialog-left', '.role-flash-lina-action', '.role-flash-joe-stop'], 0, {
            opacity: 1
          })
          this.groupOneText = text
          // let dialogLeft = document.querySelector('.dialog-left')
          this.txtKaraok(leftDialog, time)
          this.resetDialog(leftDialog, this.leftDefaultDialogY)
          break
        case 2:
          TweenMax.to(['.dialog-left', '.role-flash-joe-stop', '.role-flash-lina-action'], 0, {
            opacity: 0
          })
          TweenMax.to(['.dialog-right', '.role-flash-joe-action', '.role-flash-lina-stop'], 0, {
            opacity: 1
          })
          this.groupTwoText = text
          // let dialogRight = document.querySelector('.dialog-right')
          this.txtKaraok(rightDialog, time)
          this.resetDialog(rightDialog, this.rightDefaultDialogY)
          break
      }
      // 请求服务端，告诉服务端相应的数据
      let currGroup
      // 如果是偶数局，则根据默认规则重跑
      if (this.currRound % 2 === 0) {
        if (this.isGroupChanged) {
          group === 1 ? currGroup = 2 : currGroup = 1
        } else {
          currGroup = group
        }
      } else {
        currGroup = group
      }
      this.Api.startInteraction({
        classID: this.classID,
        lessonID: this.lessonID,
        interactionID: this.currConfigData.interactionID,
        taskID: index,
        type: this.currConfigData.type,
        config: 'group=' + currGroup + ''
      }).then(data => {
        this._checkData(data).then(() => {
          console.log('======互动请求成功======')
        })
      })
      this._clockCountDown(time / 1000, this, () => {
        this.turnIndex ++
        this.queupCallBack(this.turnIndex, this.tasks)
      })
    },
    // 调整对话框y轴位置
    resetDialog(dom, y) {
      let me = this
      TweenMax.to(dom, 0.5, {
        opacity: 1,
        onComplete: function() {
          let dialogH = dom.clientHeight
          if (dialogH > me.defaultDialogHeight) {
            TweenMax.to(dom, 0.5, {
              top: y - dialogH + me.defaultDialogHeight
            }, 0.5)
          }
        }
      }, 0.5)
    },
    // 两组角色移动，准备开始怼
    roleMove() {
      let leftRole = document.querySelector('.little-girl')
      let rightRole = document.querySelector('.little-boy')
      let me = this
      TweenMax.to(leftRole, 1, {
        x: 100,
        ease: 'Quad.easeOut',
        onComplete: function() {
          TweenMax.to('.dialog-left', 0.5, {
            opacity: 1,
            onComplete: function() {
              // 对话框事件
              me.tasks = me.currConfigData.configuration.task
              // me.isGroupChanged = false
              // 开始读第一个句子
              me.showDialog(me.turnIndex, me.tasks[0].index, me.tasks[0].quizTime, me.tasks[0].text)
            }
          }, 0.5)
        }
      }, 0.5)
      TweenMax.to(rightRole, 1, {
        x: -100,
        ease: 'Quad.easeOut'
      }, 0.5)
    }
  },
  beforeRouteLeave: function(to, from, next) {
    clearTimeout(this.runTimeout)
    clearTimeout(this.moveTimeout)
    clearTimeout(this.secondPartTimeout)
    clearTimeout(this.secondPartStartTimeout)
    clearInterval(this.countDownClock)
    this.bgm_sound.unload()
    this.result_sound.unload()
    next()
  },
  computed: {
    ...mapGetters({
      'configData': 'getDubGroupDefault'
    }),
    ...mapState({
      studentsData: state => state.game.studentsData,
      lessonID: state => state.game.lessonID,
      classID: state => state.game.classID,
      courseID: state => state.game.courseID
    }),
    // 左边组
    group1: function() {
      return this.studentsData.filter(function(data) {
        return data.group === 1
      })
    },
    // 右边组
    group2: function() {
      return this.studentsData.filter(function(data) {
        return data.group === 2
      })
    }
  },
  components: {
    result,
    readyNow
  }
}
</script>

<style>

</style>
