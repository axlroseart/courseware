<template>
        <div class="hotBox">
            <readyNow style="width: 100%"></readyNow>
            <div class="hotCon"  v-for="(item,index) in allStep" :key="index">
                <!--左边-->
                <div  class="hotLeft">
                    <div class="leftOne">
                        <img class="leftPicture picture" >
                        <div class="leftTitle textTitle"></div>
                    </div>
                    <div class="hotStar">
                        <transition enter-active-class="animated bounceIn"  v-on:enter="enter">
                            <img v-show="false" :src="hotStar" class="leftStar">
                        </transition>
                    </div>
                    <div class="hotPer">
                        <img class="hotImg" >
                    </div>
                    <div class="hotName"></div>
                </div>

                <!--中间-->
                <div class="hotCenter">
                    <div class="centerOne">
                        <img class="centerPicture picture" >
                        <div class="centerTitle textTitle"></div>
                    </div>
                    <div class="hotStar">
                        <transition enter-active-class="animated bounceIn"  v-on:enter="enter">
                            <img v-show="false" :src="hotStar" class="leftStar">
                        </transition>
                    </div>
                    <div class="hotPer">
                        <img class="hotImg" >
                    </div>
                    <div class="hotName"></div>
                </div>

                <!--右边-->
                <div class="hotRight">
                    <div class="rightOne">
                        <img class="rightPicture picture" >
                        <div class="rightTitle textTitle"></div>
                    </div>
                    <div class="hotStar">
                        <transition  enter-active-class="animated bounceIn" v-on:enter="enter">
                            <img v-show="false"  :src="hotStar" class="leftStar">
                        </transition>
                    </div>
                    <div class="hotPer">
                        <img class="hotImg" >
                    </div>
                    <div class="hotName"></div>
                </div>
            </div>

            <!--语音-->
            <div class="hotYuyin">
                <div class="voiceWaves" style="height: 100%;background-size: contain;"></div>
                <!--<object class="voiceWaves"  >-->
                    <!--<param :value="voiceWaves">-->
                    <!--<param value="high">-->
                    <!--<embed class="" :src="voiceWaves" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>-->
                <!--</object>-->
                <el-progress class="voiceProgress"  type="circle" :percentage="percentage"  :width="70" :stroke-width="5" color="#FF6161" :show-text='false'></el-progress>
                <!--<img src="../../../assets/images/hotYuyin.png">-->
            </div>
        </div>
</template>

<script>
    import '../../../assets/styles/hotBalloon.styl'
    import Velocity from 'velocity-animate'
    import 'velocity-animate/velocity.ui.js'
    import readyNow from '../readyNow'
    import voiceWaves from '../../../assets/flash/voiceWaves.swf'
    import hotStar from "../../../assets/images/hotStar.png"
    import { mapGetters, mapState } from 'vuex'
    import hotBalloonGet from '../../../assets/sounds/hotBalloonGet.mp3'
    import bgm_mp3 from '../../../assets/sounds/hotBalloon/bj.mp3'
    import '../../../assets/gka/audio/gka.css'
    import yin1 from '../../../assets/gka/audio/img/yinp_00000.png'
    import yin2 from '../../../assets/gka/audio/img/yinp_00002.png'
    import yin3 from '../../../assets/gka/audio/img/yinp_00004.png'
    import yin4 from '../../../assets/gka/audio/img/yinp_00006.png'
    import yin5 from '../../../assets/gka/audio/img/yinp_00008.png'
    import yin6 from '../../../assets/gka/audio/img/yinp_00010.png'
    import yin7 from '../../../assets/gka/audio/img/yinp_00012.png'
    import yin8 from '../../../assets/gka/audio/img/yinp_00014.png'
    import yin9 from '../../../assets/gka/audio/img/yinp_00016.png'
    import yin10 from '../../../assets/gka/audio/img/yinp_00018.png'
    import yin11 from '../../../assets/gka/audio/img/yinp_00020.png'
    import yin12 from '../../../assets/gka/audio/img/yinp_00022.png'
    import yin13 from '../../../assets/gka/audio/img/yinp_00024.png'
    import yin14 from '../../../assets/gka/audio/img/yinp_00026.png'
    import yin15 from '../../../assets/gka/audio/img/yinp_00028.png'
    export default {
      name: "hotBalloon",
      data() {
        return {
          hotNum: 1,
          topValue: '0',
          curConfigData:{},
          allStep:0,
          nowStep:0,
          rightData: {},
          leftData: {},
          centerData: {},
          voiceWaves,
          hotStar,
          percentage: 0,
          leftStar: false,
          centerStar: true,
          rightStar: false,
          hotBalloonGet,
          bgm_mp3,
          outTime: 2000,
          des: false
        }
      },
      mounted() {
        let that = this
        document.getElementsByTagName('body')[0].style.background = 'rgba(0, 0, 0, 1)'
        document.getElementsByClassName('el-progress-circle')[0].style.width = '0.85rem'
        document.getElementsByClassName('el-progress-circle')[0].style.height = '0.85rem'
        if (that.$route.params.name) {
          that.curConfigData = that.$route.params
        }
        console.log(that.curConfigData)
        if (!that.curConfigData.name) return console.log('热气球没有拿到配置信息，不执行后面的逻辑！！！！！！！！！！！！')
        function preloadImage(names, cb){
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
        }
        preloadImage([yin1,yin2,yin3,yin4,yin5,yin6,yin7,yin8,yin9,yin10,yin11,yin12,yin13,yin14,yin15], function() {
          document.querySelector('.voiceWaves').classList.add('audioGka')
        }, "./src/assets/gka/audio/img/")
        that.interactionID = that.curConfigData.interactionID
        that.configID = that.curConfigData.configID
        that.type = that.curConfigData.type
        that.task = that.curConfigData.configuration.task
        that.outTime = that.curConfigData.configuration.prepareTime
        that.allStep = that.task.length
        that.outClock = setTimeout(() => {
          // ele.style.top = '5.2rem'
          if (that.des) return
          this.startTime = this._getNowFormatDate()
          console.log('热气球开始时间', this.startTime)
          this.bgm_sound = new Howl({
            src: [this.bgm_mp3],
            loop: true
          })
          this.bgm_sound.play()
          that.step()
        }, that.outTime)
      },
      beforeRouteLeave: function(to, from, next) {
        this.des = true
        if (this.bgm_sound) this.bgm_sound.stop()
        if (this.outClock) clearTimeout(this.outClock)
        if (this.rankClock) clearTimeout(this.rankClock)
        if (this.preClock) clearTimeout(this.preClock)
        if (this.twoClock) clearTimeout(this.twoClock)
        if (this.time) clearInterval(this.time)
        if (this.fiveClock) clearTimeout(this.fiveClock)
        if (this.durationClock) clearTimeout(this.durationClock)
        next()
      },
      methods: {
        playSounds: function(sound) {
          let audio = new Audio(sound)
          audio.play()
        },
        enter(el) {
          console.log('Velocity', el)
          // Velocity(el, 'transition.bounceIn', { duration: 800, complete: function() {
          //   }})
        },
        step() {
          let ele
          let that = this
          if (that.des) return
          let arrIndex = this.nowStep
          let nowData = this.task[this.nowStep]
          this.nowStep++
          console.log('this.nowStep', this.nowStep)
          console.log('this.allStep', this.allStep)
          if(this.nowStep > this.allStep) {
            that.rankClock = setTimeout(() => {
              that._timeFn(that.startTime) // 打印此活动的持续时间
              // 跳转至排行榜界面
              this.$router.push({
                name: 'rank',
                params: {
                  classID: this.classID,
                  lessonID: this.lessonID,
                  interactionID: this.curConfigData.interactionID,
                  from: this.$route.params.from,
                  name: this.$route.params.name
                },
                query: this.$route.query
              })
            }, 4000)
            return
          }
          ele = document.getElementsByClassName('hotCon')[this.nowStep-1]
          if (!ele) return
          let prepareTime = nowData.prepareTime // 分组介绍时间
          prepareTime = 0
          let duration = nowData.quizTime // 单个持续多久
          let showTime = nowData.showTime // 结果展现时间
          showTime = 0
          this.preClock = setTimeout(() => { // 分组介绍完
            this.leftData = nowData.text[0]
            this.centerData = nowData.text[1]
            this.rightData = nowData.text[2]
            // 给热气球加上对应的图片和文字
            if (!nowData.text[0].picture) {
              ele.getElementsByClassName('leftPicture')[0].style.display = 'none'
              ele.getElementsByClassName('centerPicture')[0].style.display = 'none'
              ele.getElementsByClassName('rightPicture')[0].style.display = 'none'
              ele.getElementsByClassName('leftTitle')[0].style.bottom =  '0.78rem'
              ele.getElementsByClassName('centerTitle')[0].style.bottom =  '0.78rem'
              ele.getElementsByClassName('rightTitle')[0].style.bottom =  '0.78rem'
            } else {
              ele.getElementsByClassName('leftPicture')[0].setAttribute('src', nowData.text[0].picture)
              ele.getElementsByClassName('centerPicture')[0].setAttribute('src', nowData.text[1].picture)
              ele.getElementsByClassName('rightPicture')[0].setAttribute('src', nowData.text[1].picture)
            }
            ele.getElementsByClassName('leftTitle')[0].innerHTML =  nowData.text[1].text
            ele.getElementsByClassName('centerTitle')[0].innerHTML =  nowData.text[1].text
            ele.getElementsByClassName('rightTitle')[0].innerHTML =  nowData.text[1].text
            let top = '-4.948rem'
            let num = duration/1000
            let jiange = 100/num
            this.twoClock = setTimeout(() => {
              this.time = setInterval(() => {
                this.percentage = this.percentage + jiange
                if(this.percentage >= 100) {
                  clearInterval(this.time)
                  this.fiveClock = setTimeout(() => {
                    this.percentage = 0
                  }, 500)
                }
              }, 1000)
              // 开始互动
              let query = 'interactionpb.ClasskitStartInteractionRequest'
              let url = 'protos/interaction.proto'
              let params = {
                classID: this.classID,
                lessonID: this.lessonID,
                interactionID: this.interactionID,
                taskID: arrIndex,
                type: this.type,
                config: ''
              }
              global.icsocket.encode(query, url, params, 6, global.icsocket.webskt)
              // this.Api.interactionStart({ // 开始互动
              //   lessonID: this.lessonID,
              //   classID: this.classID,
              //   interactionID: this.interactionID,
              //   type: this.type,
              //   configID: this.configID,
              //   config: '',
              //   taskID: arrIndex
              // }).then(data => {
              //   this._checkData(data).then(data => {
              //     if (data.code === 0) {
              //       console.log('开始热气球互动')
              //     } else {
              //       console.log('热气球开始互动接口请求失败')
              //     }
              //   })
              // })
              this.durationClock = setTimeout(() => {
                this.hotNum= 2
                this.leftData = {}
                this.centerData = {}
                this.rightData = {}
                this.step()
              }, duration)
            }, 2000)

            Velocity(ele, {top: top} , {duration:duration+4000, easing: 'linear', complete: () => {
                setTimeout(() => {
                  // ele.style.top = '2.083333333333333rem'
                  // this.leftData = {}
                  // this.centerData = {}
                  // this.rightData = {}
                  // this.step()
                }, showTime)
            }})
          }, prepareTime)
        }
      },
      components: {
        readyNow
      },
      watch: {
        'scoreData': function(val) {
          let ele = document.getElementsByClassName('hotCon')[this.nowStep-1]
          if (!ele) return
          this.playSounds(this.hotBalloonGet)
          if(val.textIndex === 1) {
            let leftEle = ele.getElementsByClassName('hotLeft')[0]
            if (leftEle.getElementsByClassName('hotName')[0].innerHTML === '') {
              Velocity(leftEle.getElementsByClassName('leftStar')[0], 'transition.bounceIn', { duration: 800, complete: function() {}})
              // leftEle.getElementsByClassName('leftStar')[0].style.display = 'block'
              leftEle.getElementsByClassName('hotName')[0].innerHTML = val.name
              leftEle.getElementsByClassName('hotImg')[0].setAttribute('src', val.avatar_url)
            }
          } else if (val.textIndex === 2) {
            let centerEle = ele.getElementsByClassName('hotCenter')[0]
            if (centerEle.getElementsByClassName('hotName')[0].innerHTML === '') {
              Velocity(centerEle.getElementsByClassName('leftStar')[0], 'transition.bounceIn', { duration: 800, complete: function() {}})
              // centerEle.getElementsByClassName('leftStar')[0].style.display = 'block'
              centerEle.getElementsByClassName('hotName')[0].innerHTML = val.name
              centerEle.getElementsByClassName('hotImg')[0].setAttribute('src', val.avatar_url)
            }
          } else if (val.textIndex === 3) {
            let rightEle = ele.getElementsByClassName('hotRight')[0]
            if (rightEle.getElementsByClassName('hotName')[0].innerHTML === '') {
              Velocity(rightEle.getElementsByClassName('leftStar')[0], 'transition.bounceIn', { duration: 800, complete: function() {}})
              // rightEle.getElementsByClassName('leftStar')[0].style.display = 'block'
              rightEle.getElementsByClassName('hotName')[0].innerHTML = val.name
              rightEle.getElementsByClassName('hotImg')[0].setAttribute('src', val.avatar_url)
            }
          }
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
    }
</script>

<style scoped>

</style>