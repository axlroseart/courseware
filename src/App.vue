<template>
  <div id="app">
    <router-view v-if="isGotData"/>
  </div>
</template>

<script>
import './assets/styles/reset.css'
import './assets/styles/common.styl'
import globalConfig from './config'
import { mapState } from 'vuex'
import Velocity from 'velocity-animate'
import 'velocity-animate/velocity.ui.js'
import ICsocket from './utils/icsocket'
export default {
  data() {
    return {
      configData: {},
      isGotData: false,
      waitTime: 0,
      isLoadAll: false
    }
  },
  mounted() {
    console.log('当前环境：', process.env.NODE_ENV)
    console.log(Velocity)
    var self = this
    this.createTime = new Date().getTime()
    // this.SOCKET = null
    this.signals.addListener('updataCookie', function(data){
      self.getData(data)
    })
    this.signals.addListener('updataSocket', function(data){
      console.log('updataSocket,更新socket连接')
      if(global.icsocket && global.icsocket.webskt) global.icsocket.webskt.close()
      self.createSocket(data)
    })
    setTimeout(() => {
      if(!this.isGotData) this.signals.publish('updataCookie')
    }, 5000)
  },
  watch: {
    'coursewareEventStart': function(data) {
      let isMonopoly = data.isMonopoly
      let eventData = JSON.parse(data.interaction)
      eventData.from = 'teacher'
      // 跳转对应name的路由，即对应的互动，同时传递数据过去
      if (!isMonopoly) {
        this.$router.push({
          name: eventData.name,
          params: eventData
        })
      }
    }
  },
  methods: {
    getData(){
      // 默认账号
      let token = window.localStorage.getItem('token')
      let useType = window.localStorage.getItem('useType')
      let courseID = window.localStorage.getItem('courseID')
      let classID = window.localStorage.getItem('classID') || globalConfig.testClassId
      let lessonID = window.localStorage.getItem('lessonID') || globalConfig.testLessonId
      // 根据调用端不同对账号密码分流
      if (useType) {
        switch (useType) {
          case 'CMS':
            courseID = globalConfig.testCourseId
          break
          case 'classroom':
            courseID = typeof courseID === 'undefined' || courseID === null ? globalConfig.testCourseId : courseID
          break
        }
      } else {
        courseID = typeof courseID === 'undefined' || courseID === null ? globalConfig.testCourseId : courseID
      }
      this.$store.dispatch('fetchClassId', classID)
      this.$store.dispatch('fetchLessonId', lessonID)
      this.$store.dispatch('fetchCourseId', courseID)
      // 如果token未定义，则写入测试用的静态token值
      if (!token) {
        token = globalConfig.token_test
        // 测试用数据，课件系统开发环境用
        this.Api.fetchCoursewareConfigData({
          courseID: courseID
        }).then(data => {
          this._checkData(data).then(data => {
            data = data.data.interactions
            // 存储configData到store
            this.$store.dispatch('setCoursewareConfigData', data)
          })
        })
      }
      // 设置token到cookie
      this._setCookie('token', token, 1)
      // 先拿一份总榜数据
      this.$store.dispatch('fetchlessonResult', {
        classID: classID,
        lessonID: lessonID
      })
      let method = window.addEventListener ? 'addEventListener' : 'attachEvent'
      window[method]((method === 'addEventListener' ? '' : 'on') + 'resize', this.onResize.bind(window), false)
      this.onResize()
      this.isGotData = true
      this.signals.publish('updataSocket')
    },
    onResize() {
      // 设置字体
      let docEl = document.documentElement
      let width = docEl.clientWidth >= 1920 ? 1920 : docEl.clientWidth
      let fontSize = width / 10
      let defaultUIWidth = 1920
      let fontScale = width / defaultUIWidth
      document.querySelector('html').style.fontSize = fontSize + 'px'
      document.querySelector('body').style.fontSize = 20 * fontScale + 'px'
    },
    editImagesLoadStatus(boo) {
      this.isLoadAll = boo
    },
    createSocket(){
      let self = this
      let mToken = window.localStorage.getItem('mToken') || globalConfig.mtoken_test
      let identityID = window.localStorage.getItem('teacherId') || 4
      let role = window.localStorage.getItem('role') || 3
      let classID = window.localStorage.getItem('classID') || 1
      global.icsocket = new ICsocket({
        token: mToken,
        deviceID: '',
        classID: classID,
        identityID: identityID,
        role: role
      }, (data) => {
        let isFromMomopoly = data.realData.isMonopoly
        console.log('接收到socket消息：', data)
        // message name
        switch (data.protoName) {
          // 课后颁奖的切换
          case 'AwardsAfterClassNtf':
            self.$store.dispatch('fetchAwardData', data.realData)
            break
          // ar场景的切换  
          case 'ChangeARSceneNtf':
            self.$store.dispatch('changeAr', data.realData)
            break  
          case 'AutoStartInteractionNtf':
            // 互动事件数据
            self.$store.dispatch('fetchCoursewareEventStartData', data.realData)
            break
          case 'AutoFinishInteractionNtf':
            self.$store.dispatch('setOnloadStatus', false).then(() => {
              // 结束某个已经开始的互动
              // console.log('是否来自结束大富翁内的互动：', data.realData.isMonopoly)
              // 如果是从大富翁跳转过去的互动，则结束时返回大富翁游戏
              if (isFromMomopoly) {
                self.$router.push({
                  name: 'monopoly'
                })
              } else { // 否则跳回首页
                self.$router.push({
                  name: 'index'
                })
              }
              self.$store.dispatch('fetchCoursewareEventEndData', data.realData)
            })
            break
          case 'StudentOperationNtf':
            // 学生操作数据
            self.$store.dispatch('fetchUserScoreData', data.realData)
            break
          case 'InteractionNextStepNtf':
            // ar角色扮演执行第二步
            self.$store.dispatch('fetchNextStep', data.realData)
            break
          case 'StartScreenshotNtf':
            // 截图
            window.ScreenShotData = data.realData
            break
        }
      })
      if(window.updateReady) {
        setTimeout(() => {
          window.updateReady()
        }, 3000)
      }
    }
  },
  computed: {
    ...mapState({
      coursewareEventStart: state => state.game.coursewareEventStartData,
      coursewareEventEnd: state => state.game.coursewareEventEndData
    })
  }
}
</script>

<style lang="stylus">

</style>
