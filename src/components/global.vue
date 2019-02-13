<template>
  <div class="vue-global"></div>
</template>

<script>
import globalConfig from '../config'
import ICsocket from '../utils/icsocket'
export default {
  data() {
    return {

    }
  },
  mounted() {
    this.SOCKET = null
    var self = this
    // 注册监听
    this.signals.addListener('updataSocket', function(data){
      console.log('updataSocket,更新socket连接')
      if(self.SOCKET) self.SOCKET.close()
      self.createSocket(data)
    })
  },
  methods: {
    createSocket(){
      let mToken = window.localStorage.getItem('mToken') || globalConfig.mtoken_test
      let identityID = window.localStorage.getItem('teacherId') || 4
      let role = window.localStorage.getItem('role') || 3
      let classID = window.localStorage.getItem('classID') || 1
      this.SOCKET = new ICsocket({
        token: mToken,
        deviceID: '',
        classID: classID,
        identityID: identityID,
        role: role
      }, (data) => {
        let isFromMomopoly = data.realData.isMonopoly
        console.log('接收到socket消息：', data.realData)
        // message name
        switch (data.protoName) {
          case 'AwardsAfterClassNtf':
            global.$vue.$store.dispatch('fetchAwardData', data.realData)
            break
          case 'AutoStartInteractionNtf':
            // 互动事件数据
            global.$vue.$store.dispatch('fetchCoursewareEventStartData', data.realData)
            break
          case 'AutoFinishInteractionNtf':
            global.$vue.$store.dispatch('setOnloadStatus', false).then(() => {
              // 结束某个已经开始的互动
              // console.log('是否来自结束大富翁内的互动：', data.realData.isMonopoly)
              // 如果是从大富翁跳转过去的互动，则结束时返回大富翁游戏
              if (isFromMomopoly) {
                global.$vue.$router.push({
                  name: 'monopoly'
                })
              } else { // 否则跳回首页
                global.$vue.$router.push({
                  name: 'index'
                })
              }
              global.$vue.$store.dispatch('fetchCoursewareEventEndData', data.realData)
            })
            break
          case 'StudentOperationNtf':
            // 学生操作数据
            global.$vue.$store.dispatch('fetchUserScoreData', data.realData)
            break
          case 'InteractionNextStepNtf':
            // ar角色扮演执行第二步
            global.$vue.$store.dispatch('fetchNextStep', data.realData)
            break
          case 'StartScreenshotNtf':
            // 截图
            window.ScreenShotData = data.realData
            break
        }
      })
      if(window.updateReady) window.updateReady()
    }
  },
  computed: {
  }
}
// createSocket()
// function createSocket(){
//   let mToken = window.localStorage.getItem('mToken') || globalConfig.mtoken_test
//   let identityID = window.localStorage.getItem('teacherId') || 4
//   let role = window.localStorage.getItem('role') || 3
//   let classID = window.localStorage.getItem('classID') || 1
//   SOCKET = new ICsocket({
//     token: mToken,
//     deviceID: '',
//     classID: classID,
//     identityID: identityID,
//     role: role
//   }, (data) => {
//     let isFromMomopoly = data.realData.isMonopoly
//     console.log('接收到socket消息：', data.realData)
//     // message name
//     switch (data.protoName) {
//       case 'AwardsAfterClassNtf':
//         global.$vue.$store.dispatch('fetchAwardData', data.realData)
//         break
//       case 'AutoStartInteractionNtf':
//         // 互动事件数据
//         global.$vue.$store.dispatch('fetchCoursewareEventStartData', data.realData)
//         break
//       case 'AutoFinishInteractionNtf':
//         global.$vue.$store.dispatch('setOnloadStatus', false).then(() => {
//           // 结束某个已经开始的互动
//           // console.log('是否来自结束大富翁内的互动：', data.realData.isMonopoly)
//           // 如果是从大富翁跳转过去的互动，则结束时返回大富翁游戏
//           if (isFromMomopoly) {
//             global.$vue.$router.push({
//               name: 'monopoly'
//             })
//           } else { // 否则跳回首页
//             global.$vue.$router.push({
//               name: 'index'
//             })
//           }
//           global.$vue.$store.dispatch('fetchCoursewareEventEndData', data.realData)
//         })
//         break
//       case 'StudentOperationNtf':
//         // 学生操作数据
//         global.$vue.$store.dispatch('fetchUserScoreData', data.realData)
//         break
//       case 'InteractionNextStepNtf':
//         // ar角色扮演执行第二步
//         global.$vue.$store.dispatch('fetchNextStep', data.realData)
//         break
//       case 'StartScreenshotNtf':
//         // 截图
//         window.ScreenShotData = data.realData
//         break
//     }
//   })
// }

</script>

<style>

</style>
