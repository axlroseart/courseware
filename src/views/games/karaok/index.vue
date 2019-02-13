<template>
  <div class="karaok-index">
    <div class="cover">
      <object width="100%" height="100%" wmode="transparent" type="application/x-shockwave-flash" class="karaok-back-flash">
        <param name="src" :value="karaokBack" />
        <param name="quality" value="high" />
      </object>
      <object width="100%" height="100%" wmode="transparent" type="application/x-shockwave-flash" class="karaok-result-flash">
        <param name="src" :value="karaokResult" />
        <param name="quality" value="high" />
      </object>
    </div>
    <div class="title">
      <div class="title-leap"></div>
      <div class="title-star"></div>
    </div>
    <!-- 学生部分 -->
    <div class="students-area">
      <div class="student-body"
        v-for="items, index in onlineStudents"
        :key="index"
        :class="{ boy: items.sex === 1, girl: items.sex === 2 }">
        <div class="avatar-wrap">
          <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
            <div v-show="showStars && items.name !== 'default'" class="star">+ 2</div>
          </transition>
          <img :src="items.avatar" :alt="items.name">
        </div>
        <div class="body"></div>
      </div>
      <div class="student-body"
        v-for="items, index in refillStudents"
        :key="items.id"
        :class="{ boy: items.sex === 1, girl: items.sex === 2 }">
        <div class="avatar-wrap">
          <img :src="items.avatar" :alt="items.name">
        </div>
        <div class="body"></div>
      </div>
    </div>
    <!-- 学生部分 -->
    <!-- 字幕部分 -->
    <div class="karaok-lyrics">
      <div class="dot">
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div class="content">
        <div class="top loader">
          <div class="loader__mask">
            <div class="loader__text loader__text--progress">{{ lyrics_top }}</div>
          </div>
          <div class="loader__text loader__text--preload">{{ lyrics_top }}</div>
        </div>
        <div class="bottom loader">
          <div class="loader__mask">
            <div class="loader__text loader__text--progress">{{ lyrics_bottom }}</div>
          </div>
          <div class="loader__text loader__text--preload">{{ lyrics_bottom }}</div>
        </div>
      </div>
    </div>
    <!-- 字幕部分 -->
    <!-- 奖品部分 -->
    <div class="karaok-bonus-bbt"></div>
    <div class="karaok-bonus-mic"></div>
    <div class="karaok-bonus-rose"></div>
    <!-- 奖品部分 -->
    <!-- <div class="fans"></div> -->
  </div>
</template>

<script>
import '../../../assets/styles/karaok.styl'
import karaokBack from '../../../assets/flash/karaok1.swf'
import karaokResult from '../../../assets/flash/karaok2.swf'
import bgm_mp3 from '../../../assets/sounds/karaok/bgm.mp3'
import clap_mp3 from '../../../assets/sounds/karaok/clap.mp3'
import yahoo_mp3 from '../../../assets/sounds/karaok/yahoo.mp3'
import anime from 'animejs'
import { TweenMax } from 'gsap/TweenMax'
import { mapState, mapGetters } from 'vuex'
import defaultAvatar from '../../../assets/images/avatar.png'
export default {
  data() {
    return {
      defaultAvatar,
      // 背景flash
      karaokBack: karaokBack,
      // 撒花flash
      karaokResult: karaokResult,
      // 上面歌词
      lyrics_top: '',
      // 下面歌词
      lyrics_bottom: '',
      // 歌词数组
      lyrics: [],
      // 歌词顺位
      lyricsIndex: 2,
      // 头顶星星
      showStars: false,
      // ready-go 执行时间， 单位为秒
      readyGoTime: 4,
      // 当前在线的学生数据
      onlineStudents: [],
      // 默认上课人数
      totalStudent: 14,
      // 互动开始时间
      startTime: '',
      // 互动结束时间
      endTime: '',
      // 补全的学生数据
      refillStudents: [],
      studentID: [],
      // 音效资源
      bgm_mp3,
      clap_mp3,
      yahoo_mp3,
      // 声音对象
      bgm_sound: {},
      clap_sound: {},
      yahoo_sound: {},
      runTimeout: {},
      goNextTimeout: {}
      // lessonID: 221,
      // classID: 1
    }
  },
  mounted() {
    // 播放伴奏
    this.bgm_sound = new Howl({
      src: [this.bgm_mp3],
      loop: false
    })
    // 最后鼓掌音效
    this.clap_sound = new Howl({
      src: [this.clap_mp3]
    })
    // 送花音效
    this.yahoo_sound = new Howl({
      src: [this.yahoo_mp3]
    })
    this.currConfigData = this.$route.params
    typeof this.currConfigData.configuration === 'undefined' ? this.currConfigData = this.configData : !0
    // this.currConfigData = this.configData.template
    // 歌词数据数组
    console.log(this.currConfigData)
    // 先拿取在线学生数据
    this.Api.fetchStudentData({
      classID: this.classID,
      lessonID: this.lessonID
    }).then(data => {
      this._checkData(data).then(data => {
        data = data.data
        for (let index = 0; index < data.students.length; index++) {
          const element = data.students[index]
          if (element.online) {
            this.onlineStudents.push(element)
          }
        }
      })
    }).catch(error => {
      this.$message.error(error.message)
    })
    // 如果上课学生不够基数，则以默认头像补充
    if (this.onlineStudents.length < this.totalStudent) {
      for (let i = 0; i < this.totalStudent - this.onlineStudents.length; i++) {
        this.refillStudents.push({
          id: i + this.onlineStudents.length,
          name: 'default',
          avatar: defaultAvatar,
          sex: this._getRd(1, 2)
        })
      }
    }
    for (let index = 0; index < this.onlineStudents.length; index++) {
      const element = this.onlineStudents[index]
      this.studentID.push({
        studentID: element.studentID,
        changeValue: 2
      })
    }
    if (this.currConfigData) {
      this.bgm_sound.play()
      this.lyrics = this.currConfigData.configuration.lyric
      this.lyrics_top = this.lyrics[0].Text
      this.lyrics_bottom = this.lyrics[1].Text
      // 上面歌词
      let lyricsTop = document.querySelector('.karaok-lyrics .content .top')
      // 下面歌词
      let lyricsBottom = document.querySelector('.karaok-lyrics .content .bottom')
      // 标题下降
      this.titleFallDown()
      // 准备时间过后，开始唱歌
      let me = this
      this.runTimeout = setTimeout(() => {
        this.startTime = this._getNowFormatDate()
        console.log('当前互动开始执行，开始时间为：', this.startTime)
        this.moveBody()
        anime({
          targets: '.karaok-lyrics .dot li',
          opacity: 0,
          duration: 1000,
          delay: function(target, index) {
            return index * 1000
          },
          complete: function() {
            // 先跑开头两句，之后再递归执行后面的歌词
            me.txtKaraok(lyricsTop, me.lyrics[0].Duration).then(() => {
              me.txtKaraok(lyricsBottom, me.lyrics[1].Duration).then(() => {
                // 前两句唱完后，清除字幕渐变效果
                let textProDom = document.querySelectorAll('.loader__text--progress')
                if (textProDom) {
                  textProDom[0].removeAttribute('style')
                  textProDom[1].removeAttribute('style')
                }
                me.showLyrics(2, me.lyrics[2].Duration, me.lyrics[2].Text, lyricsTop, lyricsBottom)
              })
            })
          }
        })
      }, this.currConfigData.configuration.prepareTime)
    } else {
      console.log('$$$$$$ 当前互动暂无配置数据 $$$$$$')
    }
  },
  methods: {
    // 身体晃动动画
    moveBody() {
      let body = document.querySelectorAll('.student-body')
      for (let index = 0; index < body.length; index++) {
        const element = body[index]
        TweenMax.fromTo(element, 1, {
          css: {
            transform: 'rotate(-7deg)'
          }
        }, {
          css: {
            transform: 'rotate(7deg)'
          },
          repeat: -1,
          yoyo: true,
          yoyoEase: true
        })
      }
    },
    showLyrics(index, time, text, lyricsTop, lyricsBottom) {
      // 偶数行在上面
      if (index % 2 === 0) {
        this.lyrics_top = text
        if (index < this.lyrics.length - 1) {
          this.lyrics_bottom = this.lyrics[index + 1].Text
        }
        this.txtKaraok(lyricsTop, time)
      } else {
        // 奇数行在下面
        if (index < this.lyrics.length - 1) {
          this.lyrics_top = this.lyrics[index + 1].Text
        }
        this.lyrics_bottom = text
        this.txtKaraok(lyricsBottom, time)
      }
      // 中间开始送花
      if (this.lyricsIndex === 2) {
        this.giveitup()
      }
      // 延迟执行下一句歌词逻辑
      this.goNextTimeout = setTimeout(() => {
        this.lyricsIndex ++
        this.queupCallBack(this.lyricsIndex, this.lyrics, lyricsTop, lyricsBottom)
      }, time)
    },
    queupCallBack(index, tasks, lyricsTop, lyricsBottom) {
      if (index <= this.currConfigData.configuration.lyric.length - 1) {
        this.showLyrics(index, tasks[index].Duration, tasks[index].Text, lyricsTop, lyricsBottom)
        return
      }
      let body = document.querySelectorAll('.student-body')
      if (body) {
        for (let index = 0; index < body.length; index++) {
          const element = body[index]
          TweenMax.killTweensOf(element)
          if (element) {
            element.removeAttribute('style')
          }
        }
      }
      let me = this
      anime({
        targets: '.student-body',
        translateY: [50, 0],
        duration: 1500,
        delay: function(target, index) {
          return index * 150
        },
        complete: function() {
          anime({
            targets: '.karaok-result-flash',
            opacity: 1,
            begin: function() {
              me.clap_sound.play()
            },
            complete: function() {
              me.showStars = true
              me.Api.wholeLessonScore({
                lessonID: me.lessonID,
                classID: me.classID,
                updates: me.studentID
              })
              me.endTime = me._getNowFormatDate()
              console.log('当前互动结束，时间为：', me.endTime)
              me._timeFn(me.startTime)
            }
          })
        }
      })
    },
    // 送花效果
    giveitup() {
      let me = this
      let bbt = document.querySelector('.karaok-bonus-bbt')
      let mic = document.querySelector('.karaok-bonus-mic')
      let rose = document.querySelector('.karaok-bonus-rose')
      // let bonusArray = [bbt, mic, rose]
      // let randomBonus1 = bonusArray[this._getRd(0, 2)]
      // let randomBonus2 = bonusArray[this._getRd(0, 2)]
      // let avatarDoms = document.querySelectorAll('')
      this.yahoo_sound.play()
      anime({
        targets: [bbt, mic, rose],
        left: function(target, index) {
          return index * me._getRd(100, 300) + me._getRd(200, 300)
        },
        bottom: function(target, index) {
          return index * me._getRd(30, 90) + me._getRd(200, 400)
        },
        opacity: {
          value: 0,
          duration: 1500
        },
        rotate: '1turn',
        scale: [
          {
            value: 2
          },
          {
            value: 1
          }
        ],
        delay: function(target, index) {
          return index * 1000
        },
        loop: 4,
        duration: 800,
        easing: 'easeInOutSine',
        complete: function() {
        }
      })
    },
    // 标题降下效果
    titleFallDown() {
      anime({
        targets: '.title',
        translateY: '1.3rem',
        duration: 1000
      })
    },
    // 卡拉OK文字效果
    txtKaraok(dom, time) {
      let me = this
      return new Promise((resolve) => {
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
            // 最后两句不清除歌词渐变效果，代表已经唱完了
            if (me.lyricsIndex > 2 && me.lyricsIndex < me.lyrics.length - 1) {
              let textProDom = document.querySelectorAll('.loader__text--progress')
              if (textProDom) {
                textProDom[0].removeAttribute('style')
                textProDom[1].removeAttribute('style')
              }
            }
            resolve()
          }
        })
      })
    },
  },
  beforeRouteLeave: function(to, from, next) {
    clearTimeout(this.runTimeout)
    clearTimeout(this.goNextTimeout)
    this.bgm_sound.unload()
    this.clap_sound.unload()
    this.yahoo_sound.unload()
    next()
  },
  computed: {
    ...mapState({
      students: state => state.game.studentsData,
      lessonID: state => state.game.lessonID,
      classID: state => state.game.classID,
      courseID: state => state.game.courseID
    }),
    ...mapGetters({
      'configData': 'getKaraokDefault'
    })
  }
}
</script>

<style>

</style>
