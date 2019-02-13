<template>
    <div id="robStarsBox">
        <div class="preDiv" style="position:absolute; opacity: 0"></div>
        <readyNow></readyNow>
        <!--<el-progress :text-inside="true" class="circleProgress" type="circle" :percentage="percentage" status="exception" :width="120" :stroke-width="14" color="#FF6161"></el-progress>-->
        <div class="progressCon" style="" v-if="!showReadygo">
            <el-progress :text-inside="true" :stroke-width="24" :percentage="percentage"
                         class="hengProgress " id="">
                <div class="progress-star"></div>
            </el-progress>
        </div>
        <ul class="totalBox">

        <!--学生-->
        <li  v-for="item,index in studentData" :key="index" :class="{active:index==3}" :studentID="item.studentID"  class="studentBox">
          <span>
              <img src="../../../assets/images/rotate.png" alt="" id="rotateImg" v-show="false">
              <img class="boyGirl" v-if="item.sex === 1" src="../../../assets/images/boy.png">
              <object class="boyGirlObject" v-if="item.sex === 1" v-show="false" >
                  <param :value="boy">
                  <param value="high">
                  <embed class="" :src="boy" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
              </object>
              <img class="boyGirl" v-if="item.sex === 2" src="../../../assets/images/xiao.png">
              <object class="boyGirlObject" v-if="item.sex === 2" v-show="false">
                  <param :value="girl">
                  <param value="high">
                  <embed class="" :src="girl" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
              </object>
              <img :src="item.avatar" alt="" class="avatar">
              <p class="name">{{item.name}}</p>
              <span class="starBox">
                 <!--<object class="oneStat" v-show="false" >-->
                      <!--<param :value="oneStat">-->
                      <!--<param value="high">-->
                      <!--<embed class="" :src="oneStat" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>-->
                 <!--</object>-->
                  <!--<object class="twoStar" v-show="false" >-->
                      <!--<param :value="twoStar">-->
                      <!--<param value="high">-->
                      <!--<embed class="" :src="twoStar" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>-->
                  <!--</object>-->
                  <!--<object class="threeStar" v-show="false" >-->
                      <!--<param :value="threeStar">-->
                      <!--<param value="high">-->
                      <!--<embed class="" :src="threeStar" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>-->
                  <!--</object>-->
                  <!--<object class="fourStar" v-show="false" >-->
                      <!--<param :value="fourStar">-->
                      <!--<param value="high">-->
                      <!--<embed class="" :src="fourStar" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>-->
                  <!--</object>-->
                  <!--<object class="fiveStar" v-show="false" >-->
                      <!--<param :value="fiveStar">-->
                      <!--<param value="high">-->
                      <!--<embed class="" :src="fiveStar" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>-->
                  <!--</object>-->
              </span>
          </span>
        </li>
        <!--老师-->
        <li class="teacherBox">
            <!--v-show="!showReadygo"-->
            <div  class="kelsey animation"></div>
            <!--<object class="kelsey" >-->
                <!--<param :value="kelsey">-->
                <!--<param value="high">-->
                <!--<embed class="" :src="kelsey" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>-->
            <!--</object>-->
        </li>
      </ul>

    </div>
</template>

<script>
import { mapState } from 'vuex'
import boy from '../../../assets/flash/boy.swf'
import girl from '../../../assets/flash/girl.swf'
import oneStat from '../../../assets/flash/oneStar.swf'
import twoStar from '../../../assets/flash/twoStar.swf'
import threeStar from '../../../assets/flash/threeStar.swf'
import fourStar from '../../../assets/flash/fourStar.swf'
import fiveStar from '../../../assets/flash/fiveStar.swf'
import kelsey from '../../../assets/flash/kelsey.swf'
import '../../../assets/styles/bodyRobStars.styl'
import { TweenMax } from 'gsap/TweenMax'
import readyGoSound from '../../../assets/sounds/readygo.mp3'
import readyNow from '../readyNow'
import avatar from '../../../assets/images/avatar.png'
import robStarGet from '../../../assets/sounds/robStarGet.mp3'
import bgm_mp3 from '../../../assets/sounds/robStar/bg.mp3'
import { clockCountDown } from '../../../utils/index'
import '../../../assets/gka/wave/gka.css'
import '../../../assets/gka/oneStar/gka.css'
import '../../../assets/gka/twoStar/gka.css'
import '../../../assets/gka/threeStar/gka.css'
import '../../../assets/gka/fourStar/gka.css'
import '../../../assets/gka/fiveStar/gka.css'
import one1 from '../../../assets/gka/oneStar/img/one0004.png'
import one2 from '../../../assets/gka/oneStar/img/one0006.png'
import one3 from '../../../assets/gka/oneStar/img/one0008.png'
import one4 from '../../../assets/gka/oneStar/img/one0010.png'
import one5 from '../../../assets/gka/oneStar/img/one0012.png'
import one6 from '../../../assets/gka/oneStar/img/one0014.png'
import one7 from '../../../assets/gka/oneStar/img/one0016.png'
import one8 from '../../../assets/gka/oneStar/img/one0018.png'
import one9 from '../../../assets/gka/oneStar/img/one0020.png'
import one10 from '../../../assets/gka/oneStar/img/one0022.png'
import one11 from '../../../assets/gka/oneStar/img/one0024.png'
import one12 from '../../../assets/gka/oneStar/img/one0026.png'
import one13 from '../../../assets/gka/oneStar/img/one0028.png'
import one14 from '../../../assets/gka/oneStar/img/one0030.png'
import two1 from '../../../assets/gka/twoStar/img/two0004.png'
import two2 from '../../../assets/gka/twoStar/img/two0006.png'
import two3 from '../../../assets/gka/twoStar/img/two0008.png'
import two4 from '../../../assets/gka/twoStar/img/two0010.png'
import two5 from '../../../assets/gka/twoStar/img/two0012.png'
import two6 from '../../../assets/gka/twoStar/img/two0014.png'
import two7 from '../../../assets/gka/twoStar/img/two0016.png'
import two8 from '../../../assets/gka/twoStar/img/two0018.png'
import two9 from '../../../assets/gka/twoStar/img/two0020.png'
import two10 from '../../../assets/gka/twoStar/img/two0022.png'
import two11 from '../../../assets/gka/twoStar/img/two0024.png'
import two12 from '../../../assets/gka/twoStar/img/two0026.png'
import two13 from '../../../assets/gka/twoStar/img/two0028.png'
import two14 from '../../../assets/gka/twoStar/img/two0030.png'
import three1 from '../../../assets/gka/threeStar/img/three0004.png'
import three2 from '../../../assets/gka/threeStar/img/three0006.png'
import three3 from '../../../assets/gka/threeStar/img/three0008.png'
import three4 from '../../../assets/gka/threeStar/img/three0010.png'
import three5 from '../../../assets/gka/threeStar/img/three0012.png'
import three6 from '../../../assets/gka/threeStar/img/three0014.png'
import three7 from '../../../assets/gka/threeStar/img/three0016.png'
import three8 from '../../../assets/gka/threeStar/img/three0018.png'
import three9 from '../../../assets/gka/threeStar/img/three0020.png'
import three10 from '../../../assets/gka/threeStar/img/three0022.png'
import three11 from '../../../assets/gka/threeStar/img/three0024.png'
import three12 from '../../../assets/gka/threeStar/img/three0026.png'
import three13 from '../../../assets/gka/threeStar/img/three0028.png'
import three14 from '../../../assets/gka/threeStar/img/three0030.png'
import four1 from '../../../assets/gka/fourStar/img/four0004.png'
import four2 from '../../../assets/gka/fourStar/img/four0006.png'
import four3 from '../../../assets/gka/fourStar/img/four0008.png'
import four4 from '../../../assets/gka/fourStar/img/four0010.png'
import four5 from '../../../assets/gka/fourStar/img/four0012.png'
import four6 from '../../../assets/gka/fourStar/img/four0014.png'
import four7 from '../../../assets/gka/fourStar/img/four0016.png'
import four8 from '../../../assets/gka/fourStar/img/four0018.png'
import four9 from '../../../assets/gka/fourStar/img/four0020.png'
import four10 from '../../../assets/gka/fourStar/img/four0022.png'
import four11 from '../../../assets/gka/fourStar/img/four0024.png'
import four12 from '../../../assets/gka/fourStar/img/four0026.png'
import four13 from '../../../assets/gka/fourStar/img/four0028.png'
import four14 from '../../../assets/gka/fourStar/img/four0030.png'
import five1 from '../../../assets/gka/fiveStar/img/five0004.png'
import five2 from '../../../assets/gka/fiveStar/img/five0006.png'
import five3 from '../../../assets/gka/fiveStar/img/five0008.png'
import five4 from '../../../assets/gka/fiveStar/img/five0010.png'
import five5 from '../../../assets/gka/fiveStar/img/five0012.png'
import five6 from '../../../assets/gka/fiveStar/img/five0014.png'
import five7 from '../../../assets/gka/fiveStar/img/five0016.png'
import five8 from '../../../assets/gka/fiveStar/img/five0018.png'
import five9 from '../../../assets/gka/fiveStar/img/five0020.png'
import five10 from '../../../assets/gka/fiveStar/img/five0022.png'
import five11 from '../../../assets/gka/fiveStar/img/five0024.png'
import five12 from '../../../assets/gka/fiveStar/img/five0026.png'
import five13 from '../../../assets/gka/fiveStar/img/five0028.png'
import five14 from '../../../assets/gka/fiveStar/img/five0030.png'
export default {
  data() {
    return {
      boy: boy,
      girl: girl,
      oneStat: oneStat,
      twoStar: twoStar,
      threeStar: threeStar,
      fourStar: fourStar,
      fiveStar: fiveStar,
      flag: true,
      kelsey: kelsey,
      percentage: 0,
      studentData: [],
      duration: 6000,
      showReadygo: true,
      readyGoSound,
      avatar,
      robStarGet,
      bgm_mp3,
      outTime: 2000,
      des: false
    }
  },
  mounted() {
    let that = this
    document.getElementsByTagName('body')[0].style.background = 'rgba(0, 0, 0, 1)'
    this.Api.fetchStudentData({
      classID: that.classID,
      lessonID: that.lessonID
    }).then(data => {
      that._checkData(data).then(data => {
        that.studentData = data.data.students
        if (that.studentData.length < 14) {
          let lastNum = 14 - that.studentData.length
          for (var i = 0; i < lastNum; i++) {
            let obj = {
              avatar: that.avatar,
              sex: Math.random() < 0.5 ? 1 : 2
            }
            that.studentData.push(obj)
          }
        }
      })
    })
    if (that.$route.params.name) {
      that.curConfigData = this.$route.params
      console.log('that.curConfigData', this.$route.params)
      that.interactionID = that.curConfigData.interactionID
      that.configID = that.curConfigData.configID
      that.type = that.curConfigData.type
      that.duration = that.curConfigData.configuration.task.quizTime // 持续多久
      that.outTime = that.curConfigData.configuration.prepareTime
      this.preloadImage([one1,one2,one3,one4,one5,one6,one7,one8,one9,one10,one11,one12,one13,one14], function() {
        document.querySelector('.preDiv').classList.add('oneStar')
      })
      this.preloadImage([two1,two2,two3,two4,two5,two6,two7,two8,two9,two10,two11,two12,two13,two14], function() {
        document.querySelector('.preDiv').classList.add('twoStar')
      })
      this.preloadImage([three1,three2,three3,three4,three5,three6,three7,three8,three9,three10,three11,three12,three13,three14], function() {
        document.querySelector('.preDiv').classList.add('threeStar')
      })
      this.preloadImage([four1,four2,four3,four4,four5,four6,four7,four8,four9,four10,four11,four12,four13,four14], function() {
        document.querySelector('.preDiv').classList.add('fourStar')
      })
      this.preloadImage([five1,five2,five3,five4,five5,five6,five7,five8,five9,five10,five11,five12,five13,five14], function() {
        document.querySelector('.preDiv').classList.add('fiveStar')
      })
    } else {
      return console.log('体感抢星星没有拿到配置信息，不执行后面的逻辑！！！！！！！！！！！！') // 没有配置文件，则不执行后面的逻辑
      // this.$store.dispatch('fetchConfigData', {
      //   courseID: that.courseID
      // }).then(data => {
      //   this._checkData(data).then(data => {
      //     let configData = data.data.interactions
      //     for (let i = 0; i < configData.length; i++) {
      //       const element = configData[i]
      //       if (element.template.name === 'body_follow_snatchstar') {
      //         that.curConfigData = configData[i].template
      //         break
      //       }
      //     }
      //     that.interactionID = that.curConfigData.interactionID
      //     that.configID = that.curConfigData.configID
      //     that.type = that.curConfigData.type
      //     that.duration = that.curConfigData.configuration.task.quizTime // 持续多久
      //   })
      // })
    }
    // 开始上升
    this.outTimeClock = setTimeout(() => {
      if (this.des) return
      this.startTime = this._getNowFormatDate()
      console.log('体感抢星星开始时间', this.startTime)
      that.showReadygo = false
      document.querySelector('.kelsey').style.opacity = 1
      this.bgm_sound = new Howl({
        src: [this.bgm_mp3],
        loop: true
      })
      this.bgm_sound.play()
      that.beginGetStars()
    }, that.outTime)
  },
  components: {
    readyNow
  },
  beforeRouteLeave: function(to, from, next) {
    console.log('beforeRouteLeave')
    this.des = true
    if (this.bgm_sound) this.bgm_sound.unload()
    if (this.outTimeClock) clearTimeout(this.outTimeClock)
    if (this.durationClock) clearTimeout(this.durationClock)
    if (this.rankClock) clearTimeout(this.rankClock)
    if (this.countDownClock) clearInterval(this.countDownClock)
    next()
  },
  beforeDestroy: function() {
    this.des = true
    if (this.bgm_sound) this.bgm_sound.unload()
    if (this.outTimeClock) clearTimeout(this.outTimeClock)
    if (this.durationClock) clearTimeout(this.durationClock)
    if (this.rankClock) clearTimeout(this.rankClock)
    if (this.countDownClock) clearInterval(this.countDownClock)
    console.log('beforeDestroybeforeDestroybeforeDestroybeforeDestroy')
  },
  methods: {
    preloadImage(names, cb) {
      window.gkaCache = window.gkaCache || [];
      var n = 0,img,imgs = {};
      names.forEach(function(name) {
        img = new Image();
        window.gkaCache.push(img);
        img.onload = (function(name, img) {
          console.log('onload')
          return function() {
            imgs[name] = img;
            (++n === names.length) && cb && cb(imgs);
          }
        })(name, img);
        img.src = name;
      });
    },
    playSounds: function(sound) {
      let audio = new Audio(sound)
      audio.play()
    },
    beginGetStars() {
      let that = this
      console.log('体感抢星星：classID===>', that.classID)
      // 开始互动
      let query = 'interactionpb.ClasskitStartInteractionRequest'
      let url = 'protos/interaction.proto'
      let params = {
        classID: that.classID,
        lessonID: that.lessonID,
        interactionID: that.interactionID,
        taskID: 0,
        type: that.type,
        config: ''
      }
      global.icsocket.encode(query, url, params, 6, global.icsocket.webskt)
      // let jiange = 100 / (this.duration / 1000)
      // let timeFlag = setInterval(() => {
      //   that.percentage = Math.ceil(that.percentage + jiange)
      //   if (that.percentage >= 100) clearInterval(timeFlag)
      // }, 1000)
      clockCountDown(this.duration / 1000, this, () => {
      })
      this.durationClock = setTimeout(() => {
        that.Api.fetchRanking({
          lessonID: that.lessonID,
          interactionID: that.interactionID,
          classID: that.classID
        }).then(data => {
          that._checkData(data).then(data => {
            let rankData
            if (data.data) {
              rankData = data.data
            } else {
              rankData = []
            }
            that.$store.dispatch('setRankData', rankData).then(() => {
                that.rankClock = setTimeout(() => {
                  that._timeFn(that.startTime) // 打印此活动的持续时间
                  if(window.webviewCallBack) window.webviewCallBack({
                    type: 'end',
                    start: typeof this.$route.params.from === 'undefined' ? '' : this.$route.params.from,
                    courseware: this.$route.params.name
                  })
                  // that.$router.push({
                  //   name: 'rank',
                  //   query: this.$route.query
                  // })
                }, 2000)
            })
          })
        })
      }, this.duration)
    },
    test() {
      if (document.getElementsByTagName('object')[0].style.display === 'block') {
        document.getElementsByTagName('object')[0].style.display = 'none'
        document.getElementsByTagName('object')[1].style.display = 'block'
      } else {
        document.getElementsByTagName('object')[0].style.display = 'block'
        document.getElementsByTagName('object')[1].style.display = 'none'
      }
    }
  },
  watch: {
    'scoreData': function(val) {
        let studentBox = document.getElementsByClassName('studentBox');
        for(let i = 0; i<studentBox.length; i++) {
          let studentID = studentBox[i].getAttribute('studentID')*1
          if (studentID === val.student_id) {
            let objEle = document.createElement('div')
            let value = val.value
            if (value === 1) {
              objEle.className = 'oneStar'
            } else if (value === 2) {
              objEle.className = 'twoStar'
            } else if (value === 3) {
              objEle.className = 'threeStar'
            } else if (value === 4) {
              objEle.className = 'fourStar'
            } else if (value === 5) {
              objEle.className = 'fiveStar'
            }
            document.querySelectorAll('.starBox')[i].appendChild(objEle)
            // let objEle = studentBox[i].getElementsByTagName('object')[val.value]
            // if (!objEle) return
            // objEle.style.display = 'block'
            this.playSounds(this.robStarGet)
            if (value > 4) {
              studentBox[i].getElementsByTagName('img')[0].style.display = 'block'
              TweenMax.to(studentBox[i].getElementsByTagName('img')[0], 10000, {
                rotation: 360000
              })
            }
          }
        }
    }
  },
  computed: {
    ...mapState({
      // 当前进入的步骤，即显示哪个界面
      step: state => state.game.starsGameStep,
      // 语音数据
      scoreData: state => state.game.scoreData,
      lessonID: state => state.game.lessonID,
      classID: state => state.game.classID,
      courseID: state => state.game.courseID
    })
  }
}
</script>

<style scoped>


</style>
