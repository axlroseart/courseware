<template>
    <div id="audioPkBox">
        <readyNow></readyNow>
        <!--左边-->
        <div id="earthLeft">
            <img :src="earth" alt="" class="earthImg" >
            <img :src="lemonJing" alt="" class="lemonJing" v-show="stepNum === 1">
            <!--<div class="flag" v-show="stepNum !== 1">-->
                <!--<img :src="flagImg" alt="" class="earthImg" >-->
                <!--<div class="flagText">{{distanceLeft}}m</div>-->
            <!--</div>-->
        </div>
        <!--烟雾-->
        <object class="yanwuLeft" v-show="leftShowQuick && stepNum === 2">
            <param :value="yanwu">
            <param value="high">
            <embed class="" :src="yanwu" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>
        <!--能量光圈-->
        <object class="nliangLeft gq"  v-show="leftShowQuick && stepNum === 2">
            <param :value="nguangquan">
            <param value="high">
            <embed class="" :src="nguangquan" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>
        <!--能量轨迹-->
        <object class="nliangLeft gj" v-show="leftShowQuick && leftShowGuiji && stepNum === 2">
            <param :value="nguiji">
            <param value="high">
            <embed class="" :src="nguiji" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>
        <object class="lemonObjectLeft" :class="{visi:stepNum === 2 && !leftShowQuick}">
            <param :value="lemon">
            <param value="high">
            <embed class="" :src="lemon" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>
        <object class="lemonObjectLeft" :class="{visi:stepNum === 2 && leftShowQuick}">
            <param :value="lemonQuick">
            <param value="high">
            <embed class="" :src="lemonQuick" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>

        <!--右边-->
        <!--<img :src="earth" alt="" id="earthRight">-->

        <div id="earthRight">
            <img :src="earth" alt="" class="earthImg" style="transform: rotateY(-180deg)">
            <img :src="hahaJing" alt="" class="hahaJing" v-show="stepNum === 1">
            <!--<div class="flagRight" v-show="stepNum !== 1">-->
                <!--<img src="../../../assets/images/flagRight.png" alt="" class="earthImg" >-->
                <!--<div class="flagText flagTextRight">{{distanceRight}}m</div>-->
            <!--</div>-->
        </div>
        <!--烟雾-->
        <object class="yanwuRight" v-show="rightShowQuick && stepNum === 2">
            <param :value="yanwu">
            <param value="high">
            <embed class="" :src="yanwu" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>
        <!--能量光圈-->
        <object class="nliangRight"  v-show="rightShowQuick && stepNum === 2">
            <param :value="nguangquan">
            <param value="high">
            <embed class="" :src="nguangquan" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>
        <!--能量轨迹-->
        <object  class="nliangRight" v-show="rightShowQuick && rightShowGuiji && stepNum === 2">
            <param :value="nguiji">
            <param value="high">
            <embed class="" :src="nguiji" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>
        <object class="lemonObjectRight" :class="{visi:stepNum === 2 && !rightShowQuick}" >
            <param :value="haha">
            <param value="high">
            <embed class="" :src="haha" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>
        <object class="lemonObjectRight"  :class="{visi:stepNum === 2 && rightShowQuick}">
            <param :value="hahaQuick">
            <param value="high">
            <embed class="" :src="hahaQuick" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>

        <!--两个team比赛前-->
        <div id="team" class="beforeTeam" v-show="stepNum === 1">
            <!--左边-->
            <div class="teamLeft">
                <img src="../../../assets/images/team1.png" class="teamImg">
                <ul>
                    <li v-for="(item, index) in grounpOne" :class="{active:index === 0}" :key="item.name">
                        <img :src="item.avatar"/>
                        <p>{{item.name}}</p>
                    </li>
                </ul>
                <!--<div class="process" v-if="!perShow"></div>-->
            </div>

            <!--右边-->
            <div class="teamRight">
                <img src="../../../assets/images/team2.png" class="teamImg">
                <ul>
                    <li v-for="(item, index) in grounpTwo" :class="{active:index === 0}" :key="item.name">
                        <img :src="item.avatar"/>
                        <p>{{item.name}}</p>
                    </li>
                </ul>
                <!--<div class="process" v-if="!perShow"></div>-->
            </div>

            <!--人物-->
            <!--<div class="teamPers" v-if="true">-->
                <!--<img src="../../../assets/images/teacherImg.png">-->
            <!--</div>-->
        </div>

            <!--比赛中-->
            <div id="team" v-show="stepNum === 2">
                <div class="teamLeft">
                    <img :src="leftMi" class="leftMi"  alt="">
                    <img src="../../../assets/images/team1.png" class="teamImg">
                    <ul>
                        <li v-for="(item, index) in grounpOne" :class="{active:index === 0}" :key="item.name">
                            <img :src="item.avatar"/>
                            <p>{{item.name}}</p>
                        </li>
                    </ul>
                    <el-progress :text-inside="true" :stroke-width="24" :percentage="percentLeft"
                                 class="words-switch-count-down " id="elProgress">
                        <div class="progress-star"></div>
                    </el-progress>
                    <p class="leftP">{{distanceLeft}}m</p>
                </div>
                <!--右边-->
                <div class="teamRight">
                    <img :src="rightMi" class="rightMi"  alt="">
                    <img src="../../../assets/images/team2.png" class="teamImg">
                    <ul>
                        <li v-for="(item, index) in grounpTwo" :key="item.name" :class="{active:index === 0}">
                            <img :src="item.avatar"/>
                            <p>{{item.name}}</p>
                        </li>
                    </ul>
                    <el-progress id="pro2" :text-inside="true" :stroke-width="24" :percentage="percentRight"
                                 class="words-switch-count-down">
                        <div class="progress-star"></div>
                    </el-progress>
                    <p class="rightP">{{distanceRight}}m</p>
                </div>
                <div class="centerTeam">
                    <div style="text-align: center">
                        <img  :src="cookImgSrc"  class="cookPer"/>
                    </div>
                    <div class="cooking">{{text}}</div>
                    <div class="yuyin">
                        <object class="voiceWaves"  >
                            <param :value="voiceWaves">
                            <param value="high">
                            <embed class="" :src="voiceWaves" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
                        </object>
                        <el-progress class="voiceProgress"  type="circle" :percentage="percentage"  :width="70" :stroke-width="5" color="#FF6161" :show-text='false'></el-progress>
                    </div>
                </div>
            </div>

        <!--<teamMatch v-show="stepNum === 2 || stepNum === 3" :perShow="false"></teamMatch>-->

        <!--比赛结果-->
        <!--<winTeam v-show="stepNum === 3"></winTeam>-->
        <div id="winTeam" v-show="stepNum === 3">
            <div class="winLeft" :class="{winYellow:win === 'left'}">
                <img src="../../../assets/images/team1.png" class="teamImg">
                <img v-if="grounpOneWin" src="../../../assets/images/winImg.png" class="winImg">
                <ul>
                    <li v-for="(item,index) in grounpOne" :key="index" :class="{active:index === 0}">
                        <div v-if="grounpOneWin" class="starImg">+2</div>
                        <div v-if="grounpPing" class="starImg">+1</div>
                        <img :src="item.avatar_url"/>
                        <img v-if="index === 0" class="mvpImg" src="../../../assets/images/mvp.png"/>
                        <p>{{item.name}}</p>
                    </li>
                </ul>
            </div>
            <div class="winRight" :class="{winYellow:win === 'right'}">
                <!--<div style="padding: 50px;width: 100%;height: 100%"></div>-->
                <img src="../../../assets/images/team2.png" class="teamImg">
                <img v-if="grounpTwoWin" src="../../../assets/images/winImg.png" class="winImg">
                <ul>
                    <li v-for="(item,index) in grounpTwo" :key="index" :class="{active:index === 0}">
                        <div v-if="grounpTwoWin" class="starImg">+2</div>
                        <div v-if="grounpPing" class="starImg">+1</div>
                        <img :src="item.avatar_url"/>
                        <img v-if="index === 0" class="mvpImg" src="../../../assets/images/mvp.png"/>
                        <p>{{item.name}}</p>
                    </li>
                </ul>
            </div>

            <!--星星闪-->
            <object class="starObj" v-if="grounpOneWin">
                <param :value="star">
                <param value="high">
                <embed class="" :src="star" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
            </object>

            <!--撒花-->
            <object class="flowerObj" v-if="grounpOneWin">
                <param :value="flower">
                <param value="high">
                <embed class="" :src="flower" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
            </object>

            <!--闪光-->
            <object class="lastObj" v-if="grounpOneWin">
                <param :value="last">
                <param value="high">
                <embed class="" :src="last" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
            </object>

            <!--星星闪-->
            <object class="starObjRight" v-if="grounpTwoWin">
                <param :value="star">
                <param value="high">
                <embed class="" :src="star" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
            </object>

            <!--撒花-->
            <object class="flowerObjRight" v-if="grounpTwoWin">
                <param :value="flower">
                <param value="high">
                <embed class="" :src="flower" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
            </object>

            <!--闪光-->
            <object class="lastObj lastPing" v-if="grounpTwoWin">
                <param :value="last">
                <param value="high">
                <embed class="" :src="last" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
            </object>

            <!--撒花-->
            <object class="flowerObj flowerPing" v-if="grounpPing">
                <param :value="flower">
                <param value="high">
                <embed class="" :src="flower" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
            </object>

            <!--闪光-->
            <object class="lastObjRight lastPing" v-if="grounpPing">
                <param :value="last">
                <param value="high">
                <embed class="" :src="last" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
            </object>
            <img v-if="grounpPing" class="draw" :src="draw" alt="">
            <div class="fixBox"></div>
        </div>
    </div>
</template>

<script>
import {mapGetters , mapState } from 'vuex'
import haha from '../../../assets/flash/haha.swf'
import hahaQuick from '../../../assets/flash/hahaQuick.swf'
import lemon from '../../../assets/flash/lemon.swf'
import lemonQuick from '../../../assets/flash/lemonQuick.swf'
import '../../../assets/styles/audioPk.styl'
import { clockCountDown } from '../../../utils/index'
import { TweenMax } from 'gsap/TweenMax'
import earth from '../../../assets/images/earth.png'
import flagImg from '../../../assets/images/flag.png'
import lemonJing from '../../../assets/images/lemonJing.png'
import hahaJing from '../../../assets/images/hahaJing.png'
import draw from '../../../assets/images/draw.png'
import leftMi from '../../../assets/images/leftMi.png'
import rightMi from '../../../assets/images/rightMi.png'
import yanwu from '../../../assets/flash/yanwu.swf'
import nguangquan from '../../../assets/flash/nguangquan.swf'
import nguiji from '../../../assets/flash/nguiji.swf'
import voiceWaves from '../../../assets/flash/voiceWaves.swf'
import star from '../../../assets/flash/star.swf'
import flower from '../../../assets/flash/flower2.swf'
import last from '../../../assets/flash/last2.swf'
import bgm_mp3 from '../../../assets/sounds/audioPk/bj.mp3'
import huanhu from '../../../assets/sounds/audioPk/huanhu.mp3'
import sou from '../../../assets/sounds/audioPk/sou.mp3'
import countdownbgm from '../../../assets/sounds/countdown.mp3'
// add by ryan
import readyNow from '../readyNow'
export default {
  data() {
    return {
      sou,
      draw,
      bgm_mp3,
      huanhu,
      haha: haha,
      hahaQuick: hahaQuick,
      lemon: lemon,
      lemonQuick: lemonQuick,
      yanwu,
      nguangquan,
      nguiji,
      rightMi,
      leftMi,
      stepNum: 1, // 1为分组介绍，2为匀速跑，3为快速跑
      percentage: 0,
      earth: earth,
      teamShow:true, //两个team比赛前
      matchShow:false,//比赛中
      winShow:false, //比赛结果
      flagImg,
      lemonJing,
      hahaJing,
      distanceLeft: 0,
      TweenMaxLeft: '',
      distanceFlagLeft: true,
      distanceRight: 0,
      TweenMaxRight: '',
      distanceFlagRight: true,
      timeNum: 0,
      yun: 25000,
      quick: 8000,
      whoQuick: 0,
      leftShowQuick: false,
      rightShowQuick: false,
      clockCountDown: clockCountDown,
      percentRight: 0,
      rightShowGuiji: false,
      leftShowGuiji: false,
      text: '',
      imgFlag: true,
      percentLeft: 0,
      voiceWaves,
      randomLeft: 0,
      randomRight: 0,
      star,
      flower,
      last,
      grounpOne: [],
      grounpTwo: [],
      grounpOneWin: false,
      grounpTwoWin: false,
      grounpPing:false,
      win: '',
      perNum: 25,
      perRange: 10,
      perStart: 25,
      allStep: 0,
      nowStep: 0,
      cookImgSrc: '',
      jinTime: 100, // 进度条填充到25的时间间隔
      des: false,
      countdownbgm
    }
  },
  mounted() {
    // TweenMax.to(document.getElementById('earth'), 6000, {
    //   rotation: 360000,
    //   repeat: -1
    // })
    //
    let that = this
    this.Api.fetchStudentData({
      classID: that.classID,
      lessonID: that.lessonID,
    }).then(data => {
      that._checkData(data).then(data => {
        let students = data.data.students
        let arr1 = []
        let arr2 = []
        // 后续操作
        for (let i = 0; i < students.length; i++) {
          if (students[i].online) {
            if (students[i].group === 1) {
              arr1.push(students[i])
            } else {
              arr2.push(students[i])
            }
          }
        }
        that.grounpOne = arr1
        that.grounpTwo = arr2
        console.log(that.grounpOne)
        console.log(that.grounpTwo)
      })
    })
    if (that.$route.params.name) {
      that.curConfigData = that.$route.params
    } else {
      that.curConfigData = that.configData2.template
    }
    if (!that.curConfigData.name) return console.log('分组跑步没有拿到配置信息，不执行后面的逻辑！！！！！！！！！！！！') // 没有配置文件，则不执行后面的逻辑
    let prepareTime = that.curConfigData.configuration.prepareTime // 分组介绍时间
    this.prepareClock = setTimeout(() => {
        // that.showResult()
      if (this.des) return
      this.bgm_sound = new Howl({
        src: [this.bgm_mp3],
        loop: true
      })
      this.bgm_sound.play()
      that.stepNum = 2
      that.runLeft(that.yun)
      that.runRight(that.yun)
      that.loops()
      that.left = setInterval(() => {
        if (this.percentLeft === that.perNum) {
          clearInterval(that.left)
          that.randomLeft = setInterval(() => {
            let numLeft = Math.floor(Math.random() * that.perRange)+that.perStart
            that.percentLeft = numLeft
          }, 100)
          that.randomRight = setInterval(() => {
            let numRight = Math.floor(Math.random() * that.perRange)+that.perStart
            that.percentRight = numRight
          }, 100)
        }
        this.percentLeft = this.percentLeft + 1
        this.percentRight = this.percentRight + 1
      }, this.jinTime)
      // 改变倒计时的样式
      document.getElementsByClassName('el-progress-circle')[0].style.width = '0.71rem'
      document.getElementsByClassName('el-progress-circle')[0].style.height = '0.71rem'
    }, prepareTime)

    that.interactionID = that.curConfigData.interactionID
    that.configID = that.curConfigData.configID
    that.type = that.curConfigData.type
    that.Api.interactionStart({ // 开始互动
      lessonID: that.lessonID,
      interactionID: that.interactionID,
      type: that.type,
      configID: that.configID,
      config: ''
    }).then(data => {
        that._checkData(data).then(data => {
          if (data.code) {
            console.log('开始分组跑步')
          }
        })
    })

  },
  beforeRouteLeave: function(to, from, next) {
    console.log('分组跑步触发beforeRouteLeave')
    this.des = true
    if (this.huanSheng) this.huanSheng.stop()
    if (this.bgm_sound) this.bgm_sound.stop()
    if (this.prepareClock) clearTimeout(this.prepareClock)
    if (this.randomLeft) clearInterval(this.randomLeft)
    if (this.randomRight) clearInterval(this.randomRight)
    if (this.curClock) clearTimeout(this.curClock)
    if (this.clockTime) clearInterval(this.clockTime)
    if (this.countDownClock) clearInterval(this.countDownClock)
    if (this.time1) clearTimeout(this.time1)
    if (this.countDownTu) clearInterval(this.countDownTu)
    if (this.countDownFu) clearInterval(this.countDownFu)
    if (this.fetchClock1) clearTimeout(this.fetchClock1)
    if (this.fetchClock2) clearTimeout(this.fetchClock2)
    if (this.musicClock) clearTimeout(this.musicClock)
    if (this.showClock) clearTimeout(this.showClock)
    next()
  },
  methods: {
    playSounds: function(sound) {
      let audio = new Audio(sound)
      audio.play()
    },
    loop(index) {
      let that = this
      if (this.des) return
      this.nowStep++
      this.startTime = this._getNowFormatDate()
      console.log('分组跑步第'+this.nowStep+'轮开始时间', this.startTime)
      if(this.nowStep > this.allStep) { // 判断几轮，结束则跳到排行榜
        this.TweenMaxLeft.kill()
        this.TweenMaxRight.kill()
        that.showResult()
        return
      }
      let text = that.curConfigData.configuration.task[index].text.text
      let picture = that.curConfigData.configuration.task[index].text.picture
      that.text = text
      this.cookImgSrc = picture
      let interactionID = that.curConfigData.interactionID
      let configID = that.curConfigData.configID
      let collectTime = that.curConfigData.configuration.task[index].collectTime * 2
      let quizTime = that.curConfigData.configuration.task[index].quizTime // 本轮时间
      // add by ryan
      let currAudio = that.curConfigData.configuration.task[index].text.audio
      let currPrepareTime = that.curConfigData.configuration.task[index].prepareTime
      let fetchTime = 4000 // 过多久请求接口
      let num = quizTime / collectTime
      console.log('当前单词领读时间：', currPrepareTime)
      that.currAudio_sound = new Howl({
        src: [currAudio]
      })
      that.currAudio_sound.play()
      this.curClock = setTimeout(() => {
        that.Api.interactionStart({ // 开始互动
          lessonID: that.lessonID,
          classID: that.classID,
          interactionID: interactionID,
          type: that.type,
          configID: configID,
          config: '',
          taskID: index
        }).then(data => {
          that._checkData(data).then(data => {
            console.log(data)
          })
        })
        that.percentage = 0
        that.clockTime = setInterval(() => {
          if (that.percentage >= 100) {
            clearInterval(that.clockTime)
          } else {
            that.playSounds(that.countdownbgm)
          }
        }, 1000)
        // 执行收音倒数逻辑
        clockCountDown(quizTime / 1000, that, () => {
          that._timeFn(that.startTime) // 打印此活动的持续时间
          that.loop(that.nowStep) // 本轮结束，启动下一轮
        })
        that.time1 = setTimeout(() => {
          that.Api.fetchAveragescore({
            lessonID: that.lessonID,
            interactionID: interactionID,
            classID: that.classID,
            taskID: index
          }).then(data => {
            that._checkData(data).then(data => {
              let group1 = data.data.scores[1].GroupScore
              let group2 = data.data.scores[2].GroupScore
              // group1 = Math.random()
              // group2 = Math.random()
              that.countDownTu = null
              that.countDownFu = null
              that.playSounds(that.sou)
              if (group1 > group2) { // left快
                that.playSounds(that.sou)
                clearInterval(that.randomLeft)
                that.countDownTu = setInterval(() => {
                  that.percentLeft = that.percentLeft + 1
                  if (that.percentLeft === 100) {
                    clearInterval(that.countDownTu);
                    // 充能到100，对应的人物和地球快跑，另一个匀速。且轨迹动画出现
                    that.runLeft(that.quick)
                    that.runRight(that.yun)
                    that.leftShowQuick = true
                    that.rightShowQuick = false
                    that.leftShowGuiji = true
                    that.fetchClock1 = setTimeout(() => {
                      // 轨迹动画消失
                      that.leftShowGuiji = false
                      // 充能条回归到0，重新变为70
                      that.percentLeft = 0
                      // 人物加速跑动作消失
                      that.leftShowQuick = false
                      // 地球匀速转
                      that.runLeft(that.yun)
                      that.countDownFu = setInterval(() => {
                        that.percentLeft = that.percentLeft + 1
                        if (that.percentLeft === that.perNum) {
                          clearInterval(that.countDownFu);
                          that.randomLeft = setInterval(() => {
                            let numLeft = Math.floor(Math.random() * that.perRange)+that.perStart
                            that.percentLeft = numLeft
                          }, 100)
                        }
                      }, that.jinTime)
                    }, fetchTime)
                  }
                }, 5)
              }
              if (group1 < group2){ // right快
                that.playSounds(that.sou)
                clearInterval(that.randomRight)
                that.countDownTu = setInterval(() => {
                  that.percentRight = that.percentRight + 1
                  if (that.percentRight === 100) {
                    clearInterval(that.countDownTu);
                    // 充能到100，对应的人物和地球快跑，另一个匀速。且轨迹动画出现
                    that.runLeft(that.yun)
                    that.runRight(that.quick)
                    that.leftShowQuick = false
                    that.rightShowQuick = true
                    that.rightShowGuiji = true
                    that.fetchCLock2 = setTimeout(() => {
                      // 轨迹动画消失
                      that.rightShowGuiji = false
                      // 充能条回归到0，重新变为70
                      that.percentRight = 0
                      // 人物加速跑动作消失
                      that.rightShowQuick = false
                      // 地球匀速转
                      that.runRight(that.yun)
                      that.countDownFu = setInterval(() => {
                        that.percentRight = that.percentRight + 1
                        if (that.percentRight === that.perNum) {
                          clearInterval(that.countDownFu);
                          that.randomRight = setInterval(() => {
                            let numRight = Math.floor(Math.random() * that.perRange)+that.perStart
                            that.percentRight = numRight
                          }, 100)
                        }
                      }, that.jinTime)
                    }, fetchTime)
                  }
                }, 5)
              }
            })
          })
          that.timeNum++
          if (that.timeNum === num) {
            // clearInterval(time1)
            that.timeNum = 0
          }
        }, quizTime - fetchTime)
      }, currPrepareTime)
    },
    loops() {
      let that = this
      console.log(that.curConfigData)
      this.allStep = that.curConfigData.configuration.task.length // 总共几轮
      that.loop(0)
      // return new Promise((resolve) => {
      //   that.loop(0, resolve)
      // }).then(() => {
      //   return new Promise((resolve) => {
      //     that.loop(1, resolve)
      //   }).then(() => {
      //     return new Promise((resolve) => {
      //       that.loop(2, resolve)
      //     }).then(() => {
      //       return new Promise((resolve) => {
      //         that.loop(3, resolve)
      //       }).then(() => {
      //           this.TweenMaxLeft.kill()
      //           this.TweenMaxRight.kill()
      //           that.showResult()
      //       })
      //     })
      //   })
      // })
    },
    showResult() {
      this.bgm_sound.stop()
      let that = this
      that.Api.fetchGroupResult({ // 结果
        lessonID: that.lessonID,
        classID: that.classID,
        interactionID: that.interactionID
      }).then(data => {
        that._checkData(data).then(data => {
          let scoresOne = data.data.scores[1]
          let scoresTwo = data.data.scores[2]
          let arr1 = scoresOne.Members
          let arr2 = scoresTwo.Members
          for (var i = 0; i < arr1.length; i++) {
            if (scoresOne.Mvp.uid === arr1[i].uid) {
              arr1.splice(i,1)
              arr1.unshift(scoresOne.Mvp)
            }
          }
          for (var j = 0; j < arr2.length; j++) {
            if (scoresTwo.Mvp.uid === arr2[j].uid) {
              arr2.splice(j,1)
              arr2.unshift(scoresTwo.Mvp)
            }
          }
          that.grounpOne = arr1
          that.grounpTwo = arr2
          if (scoresOne.Win) {
            that.win = 'left'
            that.grounpOneWin = true
            that.grounpTwoWin = false
            that.grounpPing = false
          } else if (scoresTwo.Win) {
            that.grounpOneWin = false
            that.grounpTwoWin = true
            that.grounpPing = false
            that.win = 'right'
          } else {
            that.grounpOneWin = false
            that.grounpTwoWin = false
            that.grounpPing = true
          }
          that.musicClock = setTimeout(() => {
            that.huanSheng = new Howl({
              src: [that.huanhu]
            })
            that.huanSheng.play()
            // that.stepNum = 3
            // setTimeout(() => { // 互动结束后close
            //   console.log('结束跑圈互动')
            //   if(window.webviewCallBack) window.webviewCallBack()
            // }, that.curConfigData.configuration.showTime)
          }, 0)
        })
      })
      // 跳到排行榜不通过接口
      that.stepNum = 3
      that.showClock = setTimeout(() => { // 互动结束后close
        console.log('结束跑圈互动')
        if(window.webviewCallBack) window.webviewCallBack()
      }, that.curConfigData.configuration.showTime)
    },
    test() {
      if (document.getElementsByTagName('object')[0].style.display === 'block') {
        document.getElementsByTagName('object')[0].style.display = 'none'
        document.getElementsByTagName('object')[1].style.display = 'block'
      } else {
        document.getElementsByTagName('object')[0].style.display = 'block'
        document.getElementsByTagName('object')[1].style.display = 'none'
      }
    },
    test2() {
        if (this.flag) {
          this.flag = false
        } else {
          this.flag = true
        }
    },
    test3() {
      TweenMax.to(document.getElementById('earthLeft'), 10000, {
        rotation: -360000,
        repeat: -1
      })
    },
    runLeft(duration) {
      let that = this
      if (this.TweenMaxLeft) this.TweenMaxLeft.kill()
      this.TweenMaxLeft = TweenMax.to(document.getElementById('earthLeft'), duration, {
        rotation: -360000,
        onUpdate: function(){
          if(!this.target.style) return
          var num = this.target.style.transform.split('(')[1].split(',')[0]*1
          if (num < -0.4 & that.distanceFlagLeft) {
            that.distanceFlagLeft = false
            that.distanceLeft = that.distanceLeft + 50
          }
          if (num > 0.9) {
            that.distanceFlagLeft = true
          }
        }
      })
    },
    runRight(duration) {
      let that = this
      if (this.TweenMaxRight) this.TweenMaxRight.kill()
      this.TweenMaxRight = TweenMax.to(document.getElementById('earthRight'), duration, {
        rotation: 360000,
        onUpdate: function(){
          if(!this.target.style) return
          var num = this.target.style.transform.split('(')[1].split(',')[0]*1
          if (num < -0.4 & that.distanceFlagRight) {
            that.distanceFlagRight = false
            that.distanceRight = that.distanceRight + 50
          }
          if (num > 0.9) {
            that.distanceFlagRight = true
          }
        }
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
    'scoreData': function(val) {
        let studentBox = document.getElementsByClassName('studentBox');
        for(let i = 0; i<studentBox.length; i++) {
          let studentID = studentBox[i].getAttribute('studentID')*1
          if (studentID === val.student_id) {
            // studentBox[i].getElementsByTagName('img')[0].style.display = 'none'
            // studentBox[i].getElementsByTagName('object')[0].style.display = 'block'
            studentBox[i].getElementsByTagName('object')[val.value].style.display = 'block'
          }
        }
    }
  },
  computed: {
    // 星星表情图片
    ...mapState({
      // 当前进入的步骤，即显示哪个界面
      step: state => state.game.starsGameStep,
      studentData: state => state.game.studentData,
      // 语音数据
      scoreData: state => state.game.scoreData,
      lessonID: state => state.game.lessonID,
      classID: state => state.game.classID,
      courseID: state => state.game.courseID
    }),
    ...mapGetters({
      'configData2': 'getPronunciationGroupRunning',
      // 语音数据
    }),
  },
    components:{
        readyNow
    }
}
</script>

<style scoped>
.yun .el-progress-circle{
    width: 80px;
    height: 80px;
}
</style>
