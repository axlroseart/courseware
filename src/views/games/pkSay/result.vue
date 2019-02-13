<template>
  <div class="pk-say-result">
    <div class="logo"></div>
    <embed :src="pkWinSwf" v-show="isLeftWin" width="100%" height="100%" type="application/x-shockwave-flash" wmode="transparent" class="pk-win-flash pk-win-flash-left">
    <embed :src="pkWinSwf" v-show="isRightWin" width="100%" height="100%" type="application/x-shockwave-flash" wmode="transparent" class="pk-win-flash pk-win-flash-right">
    <div class="panel panel-left" :class="{ win: isLeftWin }">
      <div class="title green">team 1</div>
      <div class="show-score score-green">
        <countTo :startVal='startVal' :endVal='leftTotalScore' :duration='countDownDuration * 1000' ref="countTo"></countTo>
      </div>
      <div class="avatar-score-list" v-if="leftArr.length > 0">
        <!-- <transition-group enter-active-class="animated zoomIn"  leave-active-class="animated zoomOut"> -->
          <li v-for="items, index in leftArr" :key="index">
            <transition-group enter-active-class="animated zoomIn" leave-active-class="animated fadeOut">
              <i class="stars" :key="990" v-show="isLeftWin">+{{ items.stars }}</i>
              <i class="stars" :key="991" v-show="!isLeftWin && !isRightWin">+1</i>
            </transition-group>
            <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
              <span v-show="isShowSingelScore">{{ items.value }}</span>
            </transition>
            <img :src="items.avatar_url" :alt="items.name">
            <img :src="items.avatar_url" :alt="items.name" v-show="items.uid === leftMvp.uid">
            <label>{{ items.name }}</label>
          </li>
        <!-- </transition-group> -->
      </div>
    </div>
    <div class="panel panel-right" :class="{ win: isRightWin }">
      <div class="title blue">team 2</div>
      <div class="show-score score-blue">
        <countTo :startVal='startVal' :endVal='rightTotalScore' :duration='countDownDuration * 1000'></countTo>
      </div>
      <div class="avatar-score-list" v-if="rightArr.length > 0">
        <!-- <transition-group enter-active-class="animated zoomIn"  leave-active-class="animated zoomOut"> -->
          <li v-for="items, index in rightArr" :key="index">
            <transition-group enter-active-class="animated zoomIn" leave-active-class="animated fadeOut">
              <i class="stars" :key="992" v-show="isRightWin">+{{ items.stars }}</i>
              <i class="stars" :key="993" v-show="!isRightWin && !isLeftWin">+1</i>
            </transition-group>
            <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
              <span v-show="isShowSingelScore">{{ items.value }}</span>
            </transition>
            <img :src="items.avatar_url" :alt="items.name">
            <img :src="items.avatar_url" :alt="items.name" v-show="items.uid === rightMvp.uid">
            <label>{{ items.name }}</label>
          </li>
        <!-- </transition-group> -->
      </div>
    </div>
    <div class="mid-bonus little-girl mvp-left">
      <div class="high-light" v-if="showMvp && leftMvp.name !== ''">
        <i class="star-badage"></i>
        <div class="flash-part flash-part-left">
          <embed :src="backHalo" width="100%" height="100%" type="application/x-shockwave-flash" wmode="transparent" class="halo-back-flash">
        </div>
        <img :src="leftMvp.avatar_url" alt="" class="left-mvp-img">
        <label>{{ leftMvp.name }}</label>
      </div>
      <div class="role-shadow"></div>
    </div>
    <div class="mid-bonus little-boy mvp-right">
      <div class="high-light" v-if="showMvp && rightMvp.name !== ''">
        <i class="star-badage"></i>
        <div class="flash-part flash-part-right">
          <embed :src="backHalo" width="100%" height="100%" type="application/x-shockwave-flash" wmode="transparent" class="halo-back-flash">
        </div>
        <img :src="rightMvp.avatar_url" alt="" class="right-mvp-img">
        <label>{{ rightMvp.name }}</label>
      </div>
      <div class="role-shadow"></div>
    </div>
    <!-- <div id="motionPathleft">
      <svg>
        <path 
        fill="none" 
        stroke="currentColor" 
        stroke-width="1" 
        :d="svgPathLeft"
        ></path>
      </svg>
    </div>
    <div id="motionPathright">
      <svg>
        <path 
        fill="none" 
        stroke="currentColor" 
        stroke-width="1" 
        :d="svgPathRight"
        ></path>
      </svg>
    </div> -->
  </div>
</template>

<script>
import defaultAvatar from '../../../assets/images/avatar.png'
import pkWinSwf from '../../../assets/flash/pkwin.swf'
import backHalo from '../../../assets/flash/back-halo.swf'
import yahoo_mp3 from '../../../assets/sounds/pksay/clap.mp3'
import win_mp3 from '../../../assets/sounds/pksay/win.mp3'
import { TweenMax } from 'gsap/TweenMax'
import { mapState, mapGetters } from 'vuex'
import countTo from 'vue-count-to'
// import anime from 'animejs'
export default {
  data() {
    return {
      defaultAvatar: defaultAvatar,
      pkWinSwf: pkWinSwf,
      backHalo: backHalo,
      // winflash 判断
      isLeftWin: false,
      isRightWin: false,
      leftArr: [],
      rightArr: [],
      leftScoreData: {},
      rightScoreData: {},
      leftMvp: {
        avatar_url: '',
        name: ''
      },
      rightMvp: {
        avatar_url: '',
        name: ''
      },
      startVal: 0,
      leftTotalScore: 0,
      rightTotalScore: 0,
      leftMvpData: {},
      rightMvpData: {},
      countDownDuration: 2,
      showMvp: false,
      // 互动开始时间
      startTime: '',
      // 互动结束时间
      endTime: '',
      // 是否显示每个人头顶分数
      isShowSingelScore: false,
      yahoo_mp3,
      win_mp3,
      yahoo_sound: {},
      win_sound: {} 
      // lessonID: 221,
      // classID: 1
      // svgPathLeft: 'M1.5 4 Q334.5 2 465.5 6',
      // svgPathRight: 'M537.5 250 C300 150 400 150 39.5,4'
    }
  },
  mounted() {
    console.log('pksay-result configData:', this.configData)
    this.isShowSingelScore = true
    this.startTime = this._getNowFormatDate()
    console.log('当前互动对应的排行榜逻辑开始执行，开始时间为：', this.startTime)
    this.Api.fetchRolePlayRankData({
      lessonID: this.lessonID,
      classID: this.classID,
      interactionID: this.configData.interactionID
    }).then(data => {
      this._checkData(data).then(data => {
        data = data.data.scores
        let leftData = data['1']
        let rightData = data['2']
        if (leftData.Members !== null && typeof leftData.Members !== 'undefined') {
          this.leftTotalScore = leftData.GroupScore
          this.leftArr = leftData.Members
          this.leftMvp = leftData.Mvp
        }
        if (rightData.Members !== null && typeof rightData.Members !== 'undefined') {
          this.rightTotalScore = rightData.GroupScore
          this.rightArr = rightData.Members
          this.rightMvp = rightData.Mvp
        }
        let me = this
        // win flash 出现
        setTimeout(() => {
          me.isShowSingelScore = false
          this.isLeftWin = leftData.Win
          this.isRightWin = rightData.Win
          // 两小孩出现
          TweenMax.to('.pk-say-result .little-girl', 0.4, {
            opacity: 1,
            x: 140
          })
          TweenMax.to('.pk-say-result .little-boy', 0.4, {
            opacity: 1,
            x: -140,
            onComplete: function() {
              if (me.leftMvp !== null && typeof me.leftMvp !== 'undefined') {
                me.mvpFly('left', me.leftArr, me.leftMvp.uid)
              }
              if (me.rightMvp !== null && typeof me.rightMvp !== 'undefined') {
                me.mvpFly('right', me.rightArr, me.rightMvp.uid)
              }
            }
          })
        }, this.countDownDuration * 1000)
      })
    })
  },
  // watch: {
  //   'leftArr': function() {
  //     this.$nextTick(() => {
  //       TweenMax.staggerTo('.panel-left li', 1, {
  //         transform: ['scaleX(-1)', 'scaleX(11)']
  //       }, 0.5)
  //     })
  //   }
  // },
  methods: {
    mvpFly(dir, arr, mvpId) {
      let me = this
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i]
        if (mvpId === element.uid) {
          let mvpDom = document.querySelectorAll('.panel-' + dir + ' li')[i].querySelector('img')
          let toDomX
          let toDomY
          dir === 'left' ? toDomX = 2.5 : toDomX = 2
          dir === 'left' ? toDomY = -2.4 : toDomY = -1.3
          if (dir === 'left') {
            TweenMax.to(mvpDom, 1, {
              left: '' + toDomX + 'rem',
              top: '' + toDomY + 'rem',
              opacity: 0
            }, 0.5)
          } else {
            TweenMax.to(mvpDom, 1, {
              right: '' + toDomX + 'rem',
              top: '' + toDomY + 'rem',
              opacity: 0
            }, 0.5)
          }
        }
      }
      // 结果音效
      // me.yahoo_sound = new Howl({
      //   src: [me.yahoo_mp3]
      // })
      // me.yahoo_sound.play()
      setTimeout(() => {
        // me.yahoo_sound.stop()
        me.showMvp = true
        console.log('执行完了')
        me.endTime = me._getNowFormatDate()
        console.log('当前互动对应的排行榜逻辑执行结束，时间为：', me.endTime)
        me._timeFn(me.startTime)
      }, 1000)
    },
    collectArr(objData, arr) {
      for (const key in objData) {
        for (let i = 0; i < this.studentsData.length; i++) {
          const element = this.studentsData[i]
          // 分组学生数据
          if (String(element.studentID) === key) {
            arr.push(element)
          }
          // 左边组MVP数据
          if (element.studentID === this.leftMvp) {
            this.leftMvpData = element
          }
          // 右边组MVP数据
          if (element.studentID === this.rightMvp) {
            this.rightMvpData = element
          }
        }
      }
    }
  },
  // beforeDestroy: function() {
  //   this.yahoo_sound.stop()
  // },
  computed: {
    ...mapGetters({
      'configData': 'getDubGroupDefault'
    }),
    ...mapState({
      studentsData: state => state.game.studentsData,
      lessonID: state => state.game.lessonID,
      classID: state => state.game.classID,
      courseID: state => state.game.courseID
    })
  },
  components: {
    countTo
  }
}
</script>

<style>

</style>
