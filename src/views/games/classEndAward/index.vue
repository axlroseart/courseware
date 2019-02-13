<template>
    <div class="AwardCon" style="width:100%;height:100%">
      <div id="xu" class="" v-show="videoEnd"></div>
      <div class="videoCon" v-show="!videoEnd">
        <video :src="videoPath" :poster="arBg" autoplay @ended="ended" @timeupdate="timeupdate"></video>
      </div>
      <div v-show="imgShow" class="oneCon">
        <img class="imgUrl" :src="imgUrl" alt="">
        <div class="name">{{name}}</div>
      </div>
      <div class="threeCon" v-show="threeShow">
        <div class="lollCon lollLeft">
          <img class="Lollipop" :src="Lollipop" alt="">
          <img class="imgUrlThree" :src="threeStudents[0].avatar" alt="">
          <div class="threeText">{{threeStudents[0].name}}</div>
          <div v-show="starShow">
            <img class="starLeft" :src="star" alt="">
            <img class="starCenter" :src="star" alt="">
            <img class="starRight" :src="star" alt="">
          </div>
        </div>
        <div class="lollCon lollCenter">
          <img class="Lollipop" :src="Lollipop" alt="">
          <img class="imgUrlThree" :src="threeStudents[1].avatar" alt="">
          <div class="threeText">{{threeStudents[1].name}}</div>
          <div v-show="starShow">
            <img class="starLeft" :src="star" alt="">
            <img class="starCenter" :src="star" alt="">
            <img class="starRight" :src="star" alt="">
          </div>
        </div>
        <div class="lollCon lollRight">
          <img class="Lollipop" :src="Lollipop" alt="">
          <img class="imgUrlThree" :src="threeStudents[2].avatar" alt="">
          <div class="threeText">{{threeStudents[2].name}}</div>
          <div v-show="starShow">
            <img class="starLeft" :src="star" alt="">
            <img class="starCenter" :src="star" alt="">
            <img class="starRight" :src="star" alt="">
          </div>
        </div>
        <img class="good" :src="good" alt="">
      </div>
      <div class="starXu"></div>
      <!--<div class="button">-->
        <!--<button @click="test1">111</button>-->
        <!--<input type="text">-->
      <!--</div>-->
    </div>
</template>

<script>
  import GreatestProgressAward1 from '../../../assets/video/1GreatestProgressAward.mp4'
  import BestBehaviorAward2 from '../../../assets/video/2BestBehaviorAward.mp4'
  import BestConcentrationAward3 from '../../../assets/video/3BestConcentrationAward.mp4'
  import MostPositiveAward4 from '../../../assets/video/4MostPositiveAward.mp4'
  import MostCreativeAward5 from '../../../assets/video/5MostCreativeAward.mp4'
  import BestPronunciationAward6 from '../../../assets/video/6BestPronunciationAward.mp4'
  import arBg from '../../../assets/images/classEndAward/award.png'
  import Lollipop from '../../../assets/images/classEndAward/Lollipop.png'
  import star from '../../../assets/images/classEndAward/star.png'
  import good from '../../../assets/images/classEndAward/good.png'
  import {importAll, preloadImage } from '../../../utils/index'
  import '../../../assets/styles/classEndAward.styl'
  import { mapState } from 'vuex'
  import '../../../assets/gka/gka-1GreatestProgressAward-css/gka.css'
  import '../../../assets/gka/gka-2BestBehaviorAward-css/gka.css'
  import '../../../assets/gka/gka-3BestConcentrationAward-css/gka.css'
  import '../../../assets/gka/gka-4MostPositiveAward-css/gka.css'
  import '../../../assets/gka/gka-5MostCreativeAward-css/gka.css'
  import '../../../assets/gka/gka-6BestPronunciationAward-css/gka.css'
  import '../../../assets/gka/awardStar/gka.css'
  const gka1GreatestProgressAward = importAll(require.context ('../../../assets/gka/gka-1GreatestProgressAward-css/img', false, /\.jpg$/))
  const gka2BestBehaviorAward = importAll(require.context ('../../../assets/gka/gka-2BestBehaviorAward-css/img', false, /\.jpg$/))
  const gka3BestConcentrationAward = importAll(require.context ('../../../assets/gka/gka-3BestConcentrationAward-css/img', false, /\.jpg$/))
  const gka4MostPositiveAward = importAll(require.context ('../../../assets/gka/gka-4MostPositiveAward-css/img', false, /\.jpg$/))
  const gka5MostCreativeAward = importAll(require.context ('../../../assets/gka/gka-5MostCreativeAward-css/img', false, /\.jpg$/))
  const gka6BestPronunciationAward = importAll(require.context ('../../../assets/gka/gka-6BestPronunciationAward-css/img', false, /\.jpg$/))
  const awardThree = importAll(require.context ('../../../assets/gka/awardStar/img', false, /\.png$/))
  export default {
    data() {
      return {
        arBg,
        Lollipop,
        star,
        good,
        videoPath:'',
        videoEnd: false,
        students:[],
        imgShow: false,
        threeShow: false,
        starShow: false,
        imgUrl: '',
        imgBegin: 2127,
        imgEnd: 5127,
        jianGe: 300,
        screenShotTime: 9000, // 一人颁奖9s后截图
        screenShotTime6: 6500, // 三人颁奖6.5s后截图
        type: '',
        name: '',
        threeStudents: [{}, {}, {}],
        imgTime: '',
        shotTime: '',
        xuTime: '',
        timeFlag1: true,
        timeFlag2: true,
        timeFlag3: true,
        timeFlag4: true,
        timeFlag5: true
      }
    },
    mounted() {
      document.getElementsByTagName('body')[0].style.background = 'rgba(0, 0, 0, 1)'
      // if (this.$route.params && this.$route.params.name) {
      //   this.curConfigData = this.$route.params
      // } else {
      //   return console.log('课后颁奖没有拿到配置信息，不执行后面的逻辑！！！！！！！！！！！！')
      // }
      this.video = document.querySelector('video')
      // this.loadData()
      preloadImage(gka1GreatestProgressAward)
      preloadImage(gka2BestBehaviorAward)
      preloadImage(gka3BestConcentrationAward)
      preloadImage(gka4MostPositiveAward)
      preloadImage(gka5MostCreativeAward)
      preloadImage(gka6BestPronunciationAward)
      preloadImage(awardThree)
      this.Api.fetchStudentData({
        classID: this.classID,
        lessonID: this.lessonID,
      }).then(data => {
        this._checkData(data).then(data => {
          this.students = data.data.students
        })
      })
    },
    beforeRouteLeave: function(to, from, next) {
      console.log('课后颁奖触发beforeRouteLeave')
      if (this.shotTime) clearTimeout(this.shotTime)
      if (this.xuTime) clearTimeout(this.xuTime)
      if (this.imgTime) clearInterval(this.imgTime)
      next()
    },
    methods: {
      test1() {
        let id = document.querySelector('input').value * 1
        this.curConfigData = {
          awardID: id
        }
        this.loadData()
      },
      loadData() {
        if (this.shotTime) clearTimeout(this.shotTime)
        if (this.xuTime) clearTimeout(this.xuTime)
        if (this.imgTime) clearInterval(this.imgTime)
        // GreatestProgressAward   = 1; // 进步小明星
        // BestBehaviorAward       = 2; // 文明小明星
        // BestConcentrationAward  = 3; // 专注小明星
        // MostPositiveAward       = 4; // 勤奋小明星
        // MostCreativeAward       = 5; // 创意小明星
        // BestPronunciationAward  = 6; // 励步好声音
        let path = ''
        let type = this.curConfigData.awardID
        if (type === 1) {
          path = GreatestProgressAward1
        } else if (type === 2) {
          path = BestBehaviorAward2
        } else if (type === 3) {
          path = BestConcentrationAward3
        } else if (type === 4) {
          path = MostPositiveAward4
        } else if (type === 5) {
          path = MostCreativeAward5
        } else if (type === 6) {
          path = BestPronunciationAward6
        }
        this.videoPath = path
        this.videoEnd = false
        this.imgShow = false
        this.threeShow = false
        this.timeFlag1 = true
        this.timeFlag2 = true
        this.timeFlag3 = true
        this.timeFlag4 = true
        this.timeFlag5 = true
        this.starShow = false
        this.video.removeAttribute('poster')
        document.querySelector('#xu').removeAttribute('class')
        if (this.type === type) {
          this.video.play()
        }
        this.type = type
      },
      ended() {
        console.log('ended')
        let type = this.curConfigData.awardID
        let path = ''
        if (type === 1) {
          path = 'gka1GreatestProgressAward'
        } else if (type === 2) {
          path = 'gka2BestBehaviorAward'
        } else if (type === 3) {
          path = 'gka3BestConcentrationAward'
        } else if (type === 4) {
          path = 'gka4MostPositiveAward'
        } else if (type === 5) {
          path = 'gka5MostCreativeAward'
        } else if (type === 6) {
          path = 'gka6BestPronunciationAward'
        }
        document.querySelector('#xu').classList.add(path)
        console.log('path', path)
        this.videoEnd = true
      },
      screenShot() {
        this.shotTime = setTimeout(() => {
          // 截图
          let avaRankData = []
          let students = this.curConfigData.students
          if (students.length > 0) {
            for (let index = 0; index < students.length; index++) {
              const element = students[index]
              avaRankData.push(element.id)
            }
            let fileName = 'award'+ new Date().getTime() + '.jpg'
            console.log('fileName:', fileName)
            window.callClassroom({
              type: 'screenShot',
              param: {
                fileName: fileName,
                lessonID: this.lessonID,
                classID: this.classID,
                category: 7,
                related: avaRankData
              }
            })
          }
        }, 1000)
      },
      timeupdate() {
        console.log(this.video.currentTime)
        let time = this.video.currentTime * 1000
        if (this.type !== 6) {
          if (time >= this.screenShotTime && this.timeFlag5) {
            this.timeFlag5 = false
            console.log('一人截图')
            this.screenShot()
          }
          if (time >= this.imgBegin && this.timeFlag1) {
            this.imgShow = true
            this.timeFlag1 = false
            this.changeImgUrl()
            console.log('timeupdate')
            this.imgTime = setInterval(() => {
              this.changeImgUrl()
            }, 80)
          }
          if (time >= this.imgEnd && this.timeFlag2) {
            this.timeFlag2 = false
            console.log('timeupdate1')
            clearInterval(this.imgTime)
            this.imgUrl = this.curConfigData.students[0].avatar
            this.name = this.curConfigData.students[0].name
          }
        }
        if (this.type === 6) {
          if (time >= this.screenShotTime6 && this.timeFlag5) {
            this.timeFlag5 = false
            console.log('三人人截图')
            this.screenShot()
          }
          if (time >= this.imgBegin - 150 && this.timeFlag3) {
            this.threeShow = true
            this.timeFlag3 = false
            document.querySelector('.lollLeft').classList.add('lollLeftAnima')
            document.querySelector('.lollCenter').classList.add('lollCenterAnima')
            document.querySelector('.lollRight').classList.add('lollRightAnima')
            this.threeStudents = this.curConfigData.students
          }
          if (time >= 4500 && this.timeFlag4) {
            this.timeFlag4 = false
            document.querySelector('.starXu').classList.add('awardStarXu')
            this.xuTime = setTimeout(() => {
              this.starShow = true
              document.querySelector('.starXu').classList.remove('awardStarXu')
            }, 1240)
          }
        }
      },
      changeImgUrl() {
        let num = parseInt(Math.random() * this.students.length)
        this.imgUrl = this.students[num].avatar
        this.name = this.students[num].name
      }
    },
    watch: {
      'awardData': function(data) {
        this.curConfigData = data
        this.loadData()
        console.log('data---------------', data)
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
        courseID: state => state.game.courseID,
        awardData: state => state.game.awardData
      })
    }
  }
</script>

<style scoped>
.button{
    position: absolute;
    top: 0;
    left: 0;
}
</style>