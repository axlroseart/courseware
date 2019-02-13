<template>
  <div class="games-rank">
    <div class="caidai-left"></div>
    <div class="caidai-right"></div>
    <div class="grill">
      <!-- 左起第一个奖杯-第四名 -->
      <div class="cup grill-four">
        <div class="rank-common">
          <!-- 星星 -->
          <div class="star-score">
          </div>
          <!-- 星星 -->

          <!-- 头像 -->
          <div class="avatar">
            <div class="wrap"></div>
            <div class="inside">
              <img :src="typeof rankData[3] !== 'undefined' ? rankData[3].avatar_url : avatar" alt="">
            </div>
          </div>
          <!-- 头像 -->

          <!-- 名字 -->
          <div class="rank-name">
            <h2>{{ typeof rankData[3] !== 'undefined' ? rankData[3].name : ' - ' }}</h2>
          </div>
          <!-- 名字 -->
          <!-- 奖杯 -->
        </div>
      </div>
      <!-- 左起第一个奖杯-第四名 -->

      <!-- 左起第二个奖杯-第二名 -->
      <div class="cup grill-two">
        <div class="rank-common">
          <!-- 星星 -->
          <div class="star-score">
          </div>
          <!-- 星星 -->

          <!-- 头像 -->
          <div class="avatar">
            <div class="wrap"></div>
            <div class="inside">
              <img :src="typeof rankData[1] !== 'undefined' ? rankData[1].avatar_url : avatar" alt="">
            </div>
          </div>
          <!-- 头像 -->

          <!-- 名字 -->
          <div class="rank-name">
            <h2>{{ typeof rankData[1] !== 'undefined' ? rankData[1].name : ' - ' }}</h2>
          </div>
          <!-- 名字 -->
        </div>
      </div>
      <!-- 左起第二个奖杯-第二名 -->
      
      <!-- 最中间的奖杯-第一名 -->
      <div class="cup grill-one">
        <div class="rank-common">
          <!-- 星星 -->
          <div class="star-score">
          </div>
          <!-- 星星 -->

          <!-- 头像 -->
          <div class="avatar">
            <div class="wrap"></div>
            <div class="inside">
              <img :src="typeof rankData[0] !== 'undefined' ? rankData[0].avatar_url : avatar" alt="">
            </div>
          </div>
          <!-- 头像 -->

          <!-- 名字 -->
          <div class="rank-name">
            <h2>{{ typeof rankData[0] !== 'undefined' ? rankData[0].name : ' - ' }}</h2>
          </div>
          <!-- 名字 -->
        </div>
      </div>
      <!-- 最中间的奖杯-第一名 -->
      
      <!-- 右起第二个奖杯-第三名 -->
      <div class="cup grill-three">
        <div class="rank-common">
          <!-- 星星 -->
          <div class="star-score">
          </div>
          <!-- 星星 -->

          <!-- 头像 -->
          <div class="avatar">
            <div class="wrap"></div>
            <div class="inside">
              <img :src="typeof rankData[2] !== 'undefined' ? rankData[2].avatar_url : avatar" alt="">
            </div>
          </div>
          <!-- 头像 -->

          <!-- 名字 -->
          <div class="rank-name">
            <h2>{{ typeof rankData[2] !== 'undefined' ? rankData[2].name : ' - ' }}</h2>
          </div>
          <!-- 名字 -->
        </div>
      </div>
      <!-- 右起第二个奖杯-第三名 -->

      <!-- 右起第一个奖杯-第五名 -->
      <div class="cup grill-five">
        <div class="rank-common">
          <!-- 星星 -->
          <div class="star-score">
          </div>
          <!-- 星星 -->

          <!-- 头像 -->
          <div class="avatar">
            <div class="wrap"></div>
            <div class="inside">
              <img :src="typeof rankData[4] !== 'undefined' ? rankData[4].avatar_url : avatar" alt="">
            </div>
          </div>
          <!-- 头像 -->

          <!-- 名字 -->
          <div class="rank-name">
            <h2>{{ typeof rankData[4] !== 'undefined' ? rankData[4].name : ' - ' }}</h2>
          </div>
          <!-- 名字 -->
        </div>
      </div>
      <!-- 右起第一个奖杯-第五名 -->
    </div>
    <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
      <div class="rank-area-b" v-show="showBlockB">
        <div class="leap">
          <div class="student-list">
            <transition-group name="list-complete" tag="ul">
              <li class="block-b-one-list list-complete-item" :class="{ noMarginRight: ((index + 1) % 5 === 0 && index > 0) }" v-for="items, index in childs_no_grill" :key="index">
                <!-- odometer控制的数字翻转 -->
                <!-- <transition enter-active-class="animated fadeInDown" leave-active-class="animated fadeOut">
                  <i class="rank-stars" v-show="showAfterBling"></i>
                </transition> -->
                <i class="rank-stars"></i>
                <!-- odometer控制的数字翻转 -->
                <i class="update-score">{{ diffArray[index] }}</i>
                <img :src="childs_no_grill.length > 0 && items.avatar_url !== '' ? items.avatar_url : avatar" :alt="items.name">
                <i class="bling-bling animation-blingbling" v-show="showBling"></i>
                <span class="areab-name">{{ items.name }}</span>
              </li>
            </transition-group>
          </div>
        </div>
      </div>
    </transition>
    <!-- mask -->
    <!-- <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div class="flow-star-mask" v-show="showStarsAnime"></div>
    </transition> -->
    <!-- mask -->
    <!-- 小星星动画canvas -->
    <canvas id="canvas_a_star" class="canvas-a-star" width="1920" height="1080"></canvas>
    <!-- 小星星动画canvas -->
    <!-- <bigStarAnime v-show="showStarsAnime"></bigStarAnime> -->
    <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
      <bigStarAnime ref="bigStarAnime" v-show="showBigAnimation"></bigStarAnime>
    </transition>
  </div>
</template>

<script>
import '../../assets/gka-blingbling-css/gka.css'
import { mapState, mapGetters } from 'vuex'
import anime from 'animejs'
import avatar from '../../assets/images/avatar.png'
import bigStarAnime from '../common/bigStarAnime'
// import rankLight from '../../assets/flash/rank-light.swf'
import rankBgm from '../../assets/sounds/rankbgm.mp3'
import updateMp3 from '../../assets/sounds/updateStar.mp3'
import testImg from '../../assets/images/little-girl.png'
import MYAIDE from "../../utils/myaide.js"

export default {
  data() {
    return {
      avatar: avatar,
      rankBgm: rankBgm,
      updateMp3,
      testImg,
      // rankLight: rankLight,
      flashw: '100%',
      flashh: '100%',
      // N1延迟时间
      showBlockBDelayTime: 6000,
      showBlockB: false,
      rankDuration: 17000, // 排行榜持续时间
      // 排行榜总数据的拷贝，做排序用
      // originalXY: [],
      // 星星阵列
      flowStars: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      // 星星动画显示状态
      showStarsAnime: false,
      // 分数变化值
      diffArray: [],
      // 每节课学生数
      totalStudent: 14,
      // 补全学生数据
      refillStudents: [],
      showBlockBtimeout: {},
      callbackTimeout: {},
      reqBdataTimeout: {},
      playBigStarTimeout: {},
      starScaleAnimeTimeout: {},
      setStarPositionTimeout: {},
      // 声音1
      audioSound: {},
      // 声音2
      updateSound: {},
      // 渲染器
      renderer: {},
      // 小星星1数据组,
      smallStarArrOne: [],
      smallStarArrOne_copy: [],
      // 小星星1动画
      smallStarAnimeOne: {},
      smallStarAnimeOne_copy: {},
      // 小星星2数据组,
      smallStarArrTwo: [],
      smallStarArrTwo_copy: [],
      // 小星星2动画
      smallStarAnimeTwo: {},
      smallStarAnimeTwo_copy: {},
      // 小星星3数据组,
      smallStarArrThree: [],
      // 小星星3动画
      smallStarAnimeThree: {},
      // bling动画
      showBling: false,
      showAfterBling: false,
      // 数字翻转动画
      showCounter: false,
      // 互动开始时间
      startTime: '',
      // 互动结束时间
      endTime: '',
      // 励步兔动画显示状态
      showBigAnimation: false
    }
  },
  mounted() {
    this.startTime = this._getNowFormatDate()
    console.log('进入排行榜，开始时间为：', this.startTime)
    console.log('开始时间戳：', new Date().getTime())
    // 声音1
    this.audioSound = new Howl({
      src: this.rankBgm
    })
    // 加分数声音
    this.updateSound = new Howl({
      src: this.updateMp3
    })
    this.audioSound.play()
    this.animeInit()
    this.$store.dispatch('fetchRanking', this.$route.params).then(() => {
      // 第4名奖杯动画
      let me = this
      anime({
        targets: '.grill-four',
        left: '15%',
        opacity: 1,
        easing: 'easeInSine',
        duration: 500,
        complete: function() {
          anime({
            targets: '.grill-two',
            left: '29%',
            opacity: 1,
            easing: 'easeInOutCirc',
            duration: 801,
            complete: function() {
              // 第2名奖杯动画
              anime({
                targets: '.grill-one',
                opacity: 1,
                translateY: '92%',
                duration: 1000,
                easing: 'easeOutElastic'
              })
              // 第1名奖杯动画
              anime({
                targets: '.rank-flash-light',
                opacity: 1,
                complete: function() {
                  // ---- star 3 ----
                  me.smallStarAnimeOne.position.x = 95
                  me.smallStarAnimeOne.position.y = 25
                  me.smallStarAnimeOne.play()
                  me.smallStarAnimeOne_copy.position.x = 1342
                  me.smallStarAnimeOne_copy.position.y = 25
                  me.smallStarAnimeOne_copy.play()
                  // ---- star 2 ----
                  me.smallStarAnimeTwo.position.x = 375
                  me.smallStarAnimeTwo.position.y = 25
                  me.smallStarAnimeTwo.play()
                  me.smallStarAnimeTwo_copy.position.x = 1050
                  me.smallStarAnimeTwo_copy.position.y = 25
                  me.smallStarAnimeTwo_copy.play()
                  // ---- star 1 ----
                  me.smallStarAnimeThree.position.x = 782
                  me.smallStarAnimeThree.position.y = 0
                  me.smallStarAnimeThree.scale.set(0.8, 0.8)
                  me.smallStarAnimeThree.play()
                  setTimeout(() => {
                    // 截图
                    let avaRankData = []
                    if (me.rankData.length > 0) {
                      for (let index = 0; index < 5; index++) {
                        const element = me.rankData[index]
                        if (element) avaRankData.push(element.uid)
                      }
                      console.log('avaRankData:', avaRankData)
                      if(window.callClassroom) window.callClassroom({
                        type: 'screenShot',
                        message: 'detectface',
                        param: {
                          fileName: 'rank_screenShot.jpg',
                          lessonID: me.lessonID,
                          classID: me.classID,
                          category: 5,
                          related: avaRankData
                        }
                      })
                    }
                  }, 2500)
                  // 一定时间后，重新定位各个星星，时间以奖杯的位移时间为准
                  // 延时显示B区
                  me.showBlockBtimeout = setTimeout(() => {
                    me.showBlockB = true
                    // A区星星飞入B区动画，之后请求B区数据，更新B区排名位置变化
                    // me.showStarsAnime = true
                    // 播放大星星动画
                    me.playBigStarTimeout = setTimeout(() => {
                      // 播放音效
                      me.$refs.bigStarAnime.showSound.play()
                      // 动画展现
                      me.showBigAnimation = true
                    }, 500)
                    me.reqBdataTimeout = setTimeout(() => {
                      console.log('加星星动画播放完了')
                      me.showBigAnimation = false
                      // me.showStarsAnime = false
                      // 播放bling动画
                      setTimeout(() => {
                        me.showBling = true
                      }, 300)
                      setTimeout(() => {
                        // me.showAfterBling = true
                        anime({
                          targets: '.rank-stars',
                          opacity: [0, 1],
                          translateY: 50,
                          delay: function(target, index) {
                            // 头像出现延迟速率
                            return index * 130
                          },
                          complete: function() {
                            me.endTime = me._getNowFormatDate()
                            console.log('排行榜自然结束，当前时间为：', me.endTime)
                            me._timeFn(me.startTime)
                            console.log('结束时间戳：', new Date().getTime())
                          }
                        })
                        me.updateSound.play()
                      }, 1000)
                    }, 5000)
                  }, me.showBlockBDelayTime)
                }
              })
            }
          })
        }
      })
      // 第5名奖杯动画
      anime({
        targets: '.grill-five',
        right: '11%',
        opacity: 1,
        easing: 'easeInSine',
        duration: 500,
        complete: function() {
          // 第3名奖杯动画
          anime({
            targets: '.grill-three',
            right: '25%',
            opacity: 1,
            duration: 800,
            easing: 'easeInOutCirc'
          })
        }
      })
    })
    this.callbackTimeout = setTimeout(() => { // 互动结束后close
      console.log('排行榜结束')
      if(window.webviewCallBack) window.webviewCallBack({
        type: 'end',
        start: typeof this.$route.params.from === 'undefined' ? '' : this.$route.params.from,
        courseware: this.$route.params.name
      })
    }, this.rankDuration)
  },
  methods: {
    animeInit() {
      let me = this
      // 小星星渲染器
      let canvasItemsStar = document.getElementById("canvas_a_star")
      this.renderer = new MYAIDE.Renderer({ canvas: canvasItemsStar })
      this.renderer.begin()
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
        cycle: 30
      })
      this.renderer.add(this.smallStarAnimeOne)
      this.smallStarAnimeOne_copy = new MYAIDE.IntervalAnimation({
        frameArray: me.smallStarArrOne,
        playTime: 1,
        listenerStatus: true,
        cycle: 30
      })
      this.renderer.add(this.smallStarAnimeOne_copy)
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
        cycle: 30
      })
      this.renderer.add(this.smallStarAnimeTwo)
      this.smallStarAnimeTwo_copy = new MYAIDE.IntervalAnimation({
        frameArray: me.smallStarArrTwo,
        playTime: 1,
        listenerStatus: true,
        cycle: 30
      })
      this.renderer.add(this.smallStarAnimeTwo_copy)
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
        cycle: 30
      })
      this.renderer.add(this.smallStarAnimeThree)
    },
    starsFlow() {
      let stars = document.querySelectorAll('.flow-stars li')
      return new Promise((resolve) => {
        anime({
          targets: stars,
          rotate: '1turn',
          left: '490px',
          top: '170px',
          duration: 1500,
          opacity: 0,
          easing: 'easeOutQuad',
          complete: function() {
            resolve()
          }
        })
      })
    },
    scoreUpdate() {
      return new Promise((resolve) => {
        // 分值变化动画
        let updateTimeline = anime.timeline()
        updateTimeline.add({
          targets: '.update-score',
          opacity: 1,
          scale: [
            {
              value: 2,
              duration: 500
            },
            {
              value: 1,
              duration: 1000
            }
          ],
          easing: 'easeOutBack'
        }).add({
          targets: '.update-score',
          translateY: [0, -20],
          opacity: 0,
          easing: 'linear',
          duration: 1000,
          complete: function() {
            resolve()
          }
        })
      })
    }
  },
  beforeRouteLeave: function(to, from, next) {
    console.log('trigger beforeRouteLeave:', this.$route.name)
    if (this.renderer) {
      // this.renderer.remove(this.smallStarAnimeOne, this.smallStarAnimeOne_copy, this.smallStarAnimeTwo, this.smallStarAnimeTwo_copy, this.smallStarAnimeThree)
      // this.renderer.runStatus = false
      this.renderer.stop()
    }
    clearTimeout(this.showBlockBtimeout)
    clearTimeout(this.callbackTimeout)
    clearTimeout(this.reqBdataTimeout)
    clearTimeout(this.playBigStarTimeout)
    clearTimeout(this.starScaleAnimeTimeout)
    clearTimeout(this.setStarPositionTimeout)
    this.audioSound.unload()
    this.updateSound.unload()
    next()
  },
  computed: {
    // 5名之后的数据
    childs_no_grill: function() {
      return this.rankData.filter(function(data) {
        return data.rank > 5
      })
    },
    ...mapGetters({
      'rankDataAll': 'getFinalStudentsData'
    }),
    ...mapState({
      // 当前设定的语音匹配单词
      'rankData': state => state.game.rankData,
      // 'rankDataAll': state => state.game.rankDataAll,
      'lessonID': state => state.game.lessonID,
      'classID': state => state.game.classID,
      'courseID': state => state.game.courseID
    })
  },
  components: {
    bigStarAnime
  }
}
</script>

<style>

</style>
