<template>
    <div>
        <div class="senseBox">
            <!--最头部的闹钟-->
            <div class="clockBox">
                <div class="clockText">
                    {{title}}
                </div>
                <div class="clock">
                    <img src="../../../assets/images/count-down-clock.png">
                    <el-progress class="chooseProgress"  type="circle" :percentage="percentage"  :width="40" :stroke-width="5" color="#FF6161" :show-text='false'></el-progress>
                </div>
            </div>
            <!--第一个场景-->
            <!--第二个场景-->
            <div class="senseTotal" v-show="!senseShow">
                <!--最上边的team-->
                <div class="senseTeam1">
                    <div class="senseLeft">
                        <div class="senseTeach">
                            <object type="application/x-shockwave-flash" wmode="transparent">
                                <param name="src" :value="leftSwf">
                                <param name="quality" value="high">
                            </object>
                        </div>
                        <div class="sahuaObj judgeObj" :class="win === 'left'?'visi':'hidd'">
                            <object type="application/x-shockwave-flash" wmode="transparent">
                                <param name="src" :value="sahua">
                                <param name="quality" value="high">
                            </object>
                        </div>
                        <ul class="bodyJudge">
                            <li v-for="item in leftArr" :key="item.name">
                                <transition  enter-active-class="animated bounceIn">
                                    <img v-show="win === 'left'" :src="rankStar" class="senseStar">
                                </transition>
                                <img :src="item.avatar_url" class="sensePer">
                                <p>{{item.name}}</p>
                            </li>
                        </ul>
                    </div>
                    <div class="senseRight">
                        <div class="senseTeach">
                            <object type="application/x-shockwave-flash" wmode="transparent">
                                <param name="src" :value="rightSwf">
                                <param name="quality" value="high">
                            </object>
                        </div>
                        <div class="sahuaObj judgeObj" :class="win === 'right'?'visi':'hidd'">
                            <object type="application/x-shockwave-flash" wmode="transparent">
                                <param name="src" :value="sahua">
                                <param name="quality" value="high">
                            </object>
                        </div>
                        <ul class="bodyJudge">
                            <li v-for="item in rightArr" :key="item.name">
                                <transition  enter-active-class="animated bounceIn">
                                    <img v-show="win === 'right'" :src="rankStar" class="senseStar">
                                </transition>
                                <img :src="item.avatar_url" class="sensePer">
                                <p>{{item.name}}</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <!--<img class="Layer" :src="Layer" alt="">-->
                <!--最下边的人物-->
                <div class="senPerson">
                    <div class="senPerLeft">
                        <img :src="leftImg"  :class="leftShowImg">
                        <object :class="leftObject" type="application/x-shockwave-flash" wmode="transparent">
                            <param name="src" :value="boyDui">
                            <param name="quality" value="high">
                        </object>
                    </div>
                    <div class="senPerCenter">
                        <!-- <object type="application/x-shockwave-flash" wmode="transparent" v-if="swfValue.slice(-4, swfValue.length) === '.swf'">
                            <param name="src" :value="swfValue">
                            <param name="quality" value="high">
                        </object>
                        <img v-else :src="swfValue"> -->
                    </div>
                    <div class="senPerRight">
                        <img :src="rightImg" :class="rightShowImg">
                        <object :class="rightObject" type="application/x-shockwave-flash" wmode="transparent">
                            <param name="src" :value="girlCuo">
                            <param name="quality" value="high">
                        </object>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import '../../../assets/styles/sense.styl'
    import rankStar from '../../../assets/images/rank-star.png'
    import footing from '../../../assets/images/footing.png'
    import boyDui from '../../../assets/flash/boyDui.swf'
    import girlCuo from '../../../assets/flash/girlCuo.swf'
    import paishou from '../../../assets/flash/paishou.swf'
    import paitui from '../../../assets/flash/paitui.swf'
    import dog from '../../../assets/images/dog.png'
    import Layer from '../../../assets/images/Layer.png'
    import countdownbgm from '../../../assets/sounds/countdown.mp3'
    import { mapGetters, mapState } from 'vuex'
    import man from '../../../assets/images/man.png'
    import woman from '../../../assets/images/woman.png'
    import sahua from '../../../assets/flash/sahuac.swf'
    import bj from '../../../assets/sounds/bodyChoose/bj.mp3'
    import get from '../../../assets/sounds/bodyChoose/get.mp3'
    export default {
      name: "sense",
      data(){
        return{
          sahua,
          rightSwf: {},
          leftSwf: {},
          swfValue: {},
          leftObject: 'hidd',
          rightObject: 'hidd',
          leftShowImg: 'visi',
          rightShowImg: 'visi',
          senseShow:false, //控制两个场景切换
          configData:{},
          nowStep: 1,
          allStep: 0,
          task: [],
          leftArr: [],
          rightArr: [],
          percentage: 0,
          leftOption: {},
          rightOption: {},
          question: {},
          title: '',
          dog,
          footing,
          countdownbgm,
          boyDui,
          girlCuo,
          paishou,
          paitui,
          Layer,
          rankStar,
          win: '',
          leftImg: man,
          rightImg: woman,
          bgm_mp3:bj,
          get,
          des: false,
          clockTime: '',
          leftValue: 2
        }
      },
      computed: {
        ...mapGetters({
          'configData2': 'getBodyChoiceDefault',
          // 语音数据
        }),
        ...mapState({
          // websocket数据
          scoreData: state => state.game.scoreData,
          lessonID: state => state.game.lessonID,
          classID: state => state.game.classID,
          courseID: state => state.game.courseID
        })
      },
      mounted() {
        document.getElementsByTagName('body')[0].style.background = 'rgba(0, 0, 0, 0)'
        console.log(this.$route.params)
        this.configData = this.$route.params
        if (!this.configData.name) return console.log('体感判断没有拿到配置信息，不执行后面的逻辑！！！！！！！！！！！！')
        // this.bgm_sound = new Howl({
        //   src: [this.bgm_mp3],
        //   loop: true,
        //   volume: 0.1
        // })
        // this.bgm_sound.play()
        this.task = this.configData.configuration.task

        this.allStep = this.task.length
        this.interactionID = this.configData.interactionID
        this.configID = this.configData.configID
        // 改变倒计时的样式
        document.getElementsByClassName('el-progress-circle')[0].style.width = '0.38rem'
        document.getElementsByClassName('el-progress-circle')[0].style.height = '0.38rem'
        this.step()
      },
      beforeRouteLeave: function(to, from, next) {
        console.log('体感判断触发beforeRouteLeave')
        this.des = true
        console.log('this.des',this.des)
        if (this.clockTime) clearInterval(this.clockTime)
        if (this.prepareColock) clearTimeout(this.prepareColock)
        if (this.nextColock) clearTimeout(this.nextColock)
        if (this.showClock) clearTimeout(this.showClock)
        next()
      },
      methods: {
        enter:function() {
        },
        playSounds: function(sound) {
          let audio = new Audio(sound)
          audio.play()
        },
        step() {
          let that = this
          let arrIndex = that.nowStep - 1
          let data = that.task[arrIndex]
          this.leftValue = data.gestureOption[0].value
          if(data.gestureOption[0].value === 1) {
            this.leftSwf = this.paishou
            this.rightSwf = this.paitui
          } else {
            this.leftSwf = this.paitui
            this.rightSwf = this.paishou
          }
          this.question = data.question
          this.swfValue = data.question.picture
          this.title = data.title
          let quizTime = data.quizTime // 每个单词持续时间
          let prepareTime = data.prepareTime // 介绍的时间
          let showTime = data.showTime // 结果展现时间
          let num = quizTime/1000
          let jiange = 100/num
          this.prepareColock = setTimeout(() => {
            let startTime = this._getNowFormatDate()
            console.log('体感判断第'+that.nowStep+'轮开始时间', startTime)
            this.clockTime=setInterval(() => {
              this.playSounds(this.countdownbgm)
              this.percentage = this.percentage + jiange
              if(this.percentage >= 100){
                this.nextColock = setTimeout(() => {
                  clearInterval(this.clockTime)
                  this.playSounds(this.get)
                  if(data.rightGesture === 1) { // 1为left对，2为right对
                      this.win = 'left'
                      this.leftObject = 'visi'
                      this.leftShowImg = 'hidd'
                  } else {
                      this.win = 'right'
                      this.rightObject = 'visi'
                      this.rightShowImg = 'hidd'
                  }
                  this.showClock = setTimeout(() => {
                      this._timeFn(startTime) // 打印此活动的持续时间
                      that.nowStep++
                      console.log('allStep', that.allStep)
                      if(that.nowStep <= that.allStep) {
                        this.win = ''
                        this.leftObject = 'hidd'
                        this.leftShowImg = 'visi'
                        this.rightObject = 'hidd'
                        this.rightShowImg = 'visi'
                        that.leftArr = []
                        that.rightArr = []
                        that.percentage = 0
                        that.step()
                      } else {
                        // 互动结束后close
                        console.log('结束体感判断互动')
                        // if(window.webviewCallBack) window.webviewCallBack()
                        // this.$store.dispatch('fetchCoursewareEventEndData', this.interactionID)
                      }
                  }, showTime)
                }, 500)
              }
            }, 1000)
            that.Api.interactionStart({ // 开始互动
              lessonID: that.lessonID,
              classID: that.classID,
              interactionID: that.interactionID,
              type: that.type,
              configID: that.configID,
              config: '',
              taskID: arrIndex
            }).then(data => {
              that._checkData(data).then(data => {
                if (data.code === 0) {
                  console.log('开始体感选择的互动')
                }
              })
            })
          }, prepareTime)
        }
      },
      watch: {
        'scoreData': function(val) {
          if(this.leftArr.length >= 14 || this.rightArr.length >= 14) return
          let repeat = false
          for (let i = 0; i < this.leftArr.length; i++) {
            if (this.leftArr[i].student_id === val.student_id) repeat = true
          }
          for (let j = 0; j < this.rightArr.length; j++) {
            if (this.rightArr[j].student_id === val.student_id) repeat = true
          }
          if (repeat) return
          // if(val.student_id % 2 === 0){
          if(val.value === this.leftValue){
            this.leftArr.push(val)
          } else {
            this.rightArr.push(val)
          }
        }
      },
    }
</script>

<style scoped>

</style>