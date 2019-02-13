<template>
  <div class="small-horn-box">
    <div class="small-horn-content">
      <transition enter-active-class="animated fadeInUp">
        <div class="bottom-bg" v-show="initStatus"></div>
      </transition>
      <div class="middle-horn-content">
        <canvas id="horn_game_canvas" width="379" height="409"></canvas>
      </div>
      <div v-for="items, index in onlineStudents" class="student-box" :s="index" v-bind:style="'left:' + items.left" v-bind:key="index">
         <div class="student-rage-box" v-show="!showStar && runStatus">
           <div class="student-rage-content" v-bind:style="{height: items.height + '%', background: 'linear-gradient(rgba(255,' + items.topColor + ',0,0.8), rgba(255,'+ items.bottomColor +',0,0.8)'}" ></div>
           <div class="student-rage-star" v-bind:style="'opacity:' + items.rageStar"></div>
         </div>
         <transition enter-active-class="animated bounceIn">
           <div class="students-avatar-box">
         <!-- <div v-bind:class="['students-avatar-box', items.opacity === 0 ? 'students-avatar-box-normal' : 'students-avatar-box-say']" v-show="initStatus"> -->
           <!-- <div v-show="items.opacity > 0" class="students-avatar-light-border"></div>  -->
           <img :src="items.online ? items.avatar : avatar" class="student-avatar" width="100%" height="100%" >
           <img :src="avatarlight" class="student-avatar-light" v-bind:style="'opacity:' + items.lightOpacity">
           <!-- <transition enter-active-class="animated bounceIn">
              <img v-show="items.showStar && items.maxScore > minScore" src="../../../assets/images/rank-star.png" class="student-avatar-star">
           </transition> -->
           <transition enter-active-class="animated bounceIn">
              <img v-show="items.scoreStar === 1" :src="starImg1" class="student-score-star">
           </transition>
           <transition enter-active-class="animated bounceIn">
              <img v-show="items.scoreStar === 2" :src="starImg2" class="student-score-star">
           </transition>
           <transition enter-active-class="animated bounceIn">
              <img v-show="items.scoreStar >= 3" :src="starImg3" class="student-score-star">
           </transition>
         </div>
         </transition>   
      </div>
    </div>
  </div>
</template>
<script>
import '../../../assets/styles/smallHorn.styl'
import avatar from '../../../assets/images/avatar.png'
import avatarlight from '../../../assets/images/avatar-light.png'
import starImg1 from '../../../assets/images/smallHorn/star1.png'
import starImg2 from '../../../assets/images/smallHorn/star2.png'
import starImg3 from '../../../assets/images/smallHorn/star3.png'
import { mapState, mapGetters } from 'vuex'
import MYAIDE from "../../../utils/myaide.js"
export default {
  data() {
    return {
      // 在线学生信息
      onlineStudents:[],
      // 最大学生信息
      maxStudent: 14,
      // 默认头像
      avatar: avatar,
      avatarlight: avatarlight,
      // 最大阀值分数
      maxScore: 70,
      // 最低阀值分数
      minScore: 20,
      // 运行状态
      runStatus: false,
      // 准备时长
      prepareTime: 1000,
      // 互动时长
      quizTime: 10000,
      // 开始时间
      startTime: new Date().getTime(),
      timer: new Date().getTime(),
      // 显示加星
      showStar: false,
      showStarStatus: false,
      // 加星间隔
      starTimer: 50,
      // 结果显示时间
      scoreShowTime: 2000,
      taskID: 0,
      initStatus: false,
      starImg1,
      starImg2,
      starImg3
    }
  },
  components: {
  },
  mounted() {
    // 获取配置
    this.currConfigData = this.$route.params
    typeof this.currConfigData.configuration === 'undefined' ? this.currConfigData = this.configData : !0
    this.showStar = false
    this.runStatus = false
    this.showStarStatus = false
    console.log(this.currConfigData)
    // this.currConfigData = this.configData.template
    // 设置tasks内容为configData里的配置项
    this.maxScore = this.currConfigData.configuration.max || 80
    this.minScore = this.currConfigData.configuration.min || 20
    this.prepareTime = parseInt(this.currConfigData.configuration.prepareTime) || 1000
    this.quizTime = parseInt(this.currConfigData.configuration.task[this.taskID].quizTime)
    this.startTime = new Date().getTime()
    console.log(this.prepareTime, this.quizTime)
    

    this.canvasItem = document.getElementById("horn_game_canvas")
    this.renderer = new MYAIDE.Renderer({ canvas: this.canvasItem })
    document.body.style.background="rgba(0, 0, 0, 0)"
    // this.arcElm1 = new MYAIDE.ArcGraphics({start:0,end:0,centre:[190,208],lineCap:'round', lineWidth:10, radius:125, strokeStyle:'#FF6161', rotate:-90})
    // this.renderer.add( this.arcElm1)
    this.renderer.begin()

    this.addAnimation()

    // this.test = setInterval(() =>{
    //   if (this.runStatus) {
    //     this.onlineStudents.forEach((ele) => {
    //       var score =  Math.round(Math.random() * 100)
    //       // var score  = 100
    //       if(ele.score < score) {
    //         ele.targetScore = score
    //         ele.changeStatus = true
    //       }
    //       if(ele.maxScore < score) {
    //         ele.maxScore = score
    //       }
    //       // console.log(ele.height)
    //     })
    //     this.onlineStudents = this.onlineStudents.concat([])
    //   }
    // }, 800)

    this.getStudentData()

  },
  methods: {
    addAnimation() {
      // var self = this
      // 手表出现动画
      var showAniArr = []
      MYAIDE.Loader.loadAniImg(
        showAniArr,
        "./assets/images/smallHorn/showAni/cx_00",
        22,
        249
      )
      this.showAni = new MYAIDE.IntervalAnimation({
        frameArray: showAniArr,
        listenerStatus: true,
        cycle: 50,
        zIndex: 50,
        x: 57,
        y: 74
      })
      this.showAni.addListener('ended', () =>{
        this.showAni.visible = false
        if(!this.runStatus){
          this.yhAni.visible = true
          this.yhAni.gotoAndPlay(0)
        }
        
      })
      // 摇晃动画
      var yhAniArr = []
      MYAIDE.Loader.loadAniImg(
        yhAniArr,
        "./assets/images/smallHorn/secAni/s_00",
        29,
        271
      )
      this.yhAni = new MYAIDE.IntervalAnimation({
        frameArray: yhAniArr,
        visible: false,
        cycle: 40,
        zIndex: 50,
        x: 57,
        y: 74
      })
      // 晃耳朵动画
      var hedAniArr = []
      MYAIDE.Loader.loadAniImg(
        hedAniArr,
        "./assets/images/smallHorn/thrAni/ed_00",
        24,
        314
      )
      this.edAni = new MYAIDE.IntervalAnimation({
        frameArray: hedAniArr,
        intervalStatus: true,
        cycle: 50,
        visible: false,
        zIndex: 50,
        x: 57,
        y: 74
      })
      // 喇叭动画
      var hornAniArr = []
      MYAIDE.Loader.loadAniImg(
        hornAniArr,
        "./assets/images/smallHorn/hornAni/lb00",
        26,
        342
      )
      this.hornAni = new MYAIDE.IntervalAnimation({
        frameArray: hornAniArr,
        intervalStatus: true,
        cycle: 50,
        zIndex: 50,
        x: 86,
        y: 145
      })
      this.edAni.add(this.hornAni)

      // 倒计时
      var timeAniArr = []
      MYAIDE.Loader.loadAniImg(
        timeAniArr,
        "./assets/images/smallHorn/timeAni/time_00",
        40,
        305
      )
      this.timeAni = new MYAIDE.IntervalAnimation({
        frameArray: timeAniArr,
        direction: false,
        cycle: 50,
        zIndex: 50,
        x: 0,
        y: 0
      })
      this.edAni.add(this.timeAni)

      this.renderer.add(this.showAni, this.yhAni, this.edAni)
    },
    // 开始答题动画
    playQueAnimation() {
      this.hornAni.gotoAndPlay(0)
      this.yhAni.visible = false
      this.edAni.visible = true
      this.timeAni.visible = true
      this.timeAni.gotoEnd()
      this.edAni.gotoAndPlay(0)
    },
    getStudentData(){
      // 获取学生数据
      this.Api.fetchStudentData({
        classID: this.classID,
        lessonID: this.lessonID
      }).then(data => {
        this._checkData(data).then(data => {
          console.log(data)
          this.onlineStudents = []
          for(var i = 0; i < data.data.students; i ++){
            if(data.data.students[i].online) {
              this.onlineStudents.push(data.data.students[i])
            }
          }
          // this.onlineStudents = data.data.students
          // 补齐14位学生
          // if(this.onlineStudents.length < this.maxStudent){
          //   var n = this.maxStudent - this.onlineStudents.length
          //   for (var i = 0; i < n; i ++) {
          //     var obj = {
          //       studentID:-1,
          //       name: 'leapTest',
          //       avatar: this.avatar,
          //       online: false
          //     }
          //     this.onlineStudents.push(obj)
          //   }
          // }
          this.initData()
        })
      })
    },
    // 初始化游戏数据
    initData() {
      this.onlineStudents.forEach((ele, index)=>{
        ele.score = 0
        ele.scoreStar = 0
        ele.left = index % 2 === 0 ? (26 +(6 - index / 2) * 113) / 19.2 + '%' : (1125 + (index - 1) / 2 * 113) / 19.2 + '%'
        ele.maxScore = 0
        ele.showStar = false
        ele.targetScore = 0
        this.getStyle(ele, ele.score)
        // 更新状态 true=+  false = -
        ele.changeStatus = false
      })
      // this.runStatus = true     
      this.showStar = false
      this.initStatus = false
      setTimeout(() => {
        this.startShowAvatar()
        this.showAni.gotoAndPlay(0)
      })
    },
    // 展示头像
    startShowAvatar() {
      this.initStatus = true
      console.log('===========================time:', this.prepareTime)
      this.waiter = setTimeout(() => {
        this.runStatus = true
        this.playQueAnimation()
        this.startGame()
        this.timer = new Date().getTime()
        this.startTime = new Date().getTime()
        this.changeStudentRage()
      }, this.prepareTime)
    },
    // 开始互动
    startGame(){
      // 开始互动
      // this.Api.interactionStart({
      //   classID: this.classID,
      //   lessonID: this.lessonID,
      //   type: 2,
      //   interactionID: this.currConfigData.interactionID,
      //   taskID: this.taskID
      // }).then(data => {
      //   this._checkData(data).then(data => {
      //     console.log('====== 向服务端发起互动成功 ======', data)
      //     this.getStudentData()
      //   }).catch(error => {
      //     console.log('====== 向服务端发起互动失败 ======', error)
      //   })
      // })
      let query = 'interactionpb.ClasskitStartInteractionRequest'
      let url = 'protos/interaction.proto'
      let params = {
        classID: this.classID,
        lessonID: this.lessonID,
        interactionID: this.currConfigData.interactionID,
        taskID: this.taskID,
        type: this.currConfigData.type,
        config: ''
      }
      // 编码，并发送socket请求
      // 6为互动请求类型
      global.icsocket.encode(query, url, params, 6, global.icsocket.webskt)
    },
    // 根据成绩确定opacity,height
    getStyle(ele, score) {
      var oScore = score
      score = score > this.maxScore ? this.maxScore : score
      score = score < this.minScore ? this.minScore : score
      var progress = (score - this.minScore) / (this.maxScore - this.minScore)
      ele.opacity = score > this.maxScore - 20 ? 1 : progress
      // ele.lightOpacity = score > this.maxScore ? 1 : progress
      ele.lightOpacity = oScore > this.maxScore ? ( oScore - this.maxScore) / 20 : 0
      ele.height = 28 + 72 * progress
      ele.topColor = 255 * progress
      ele.rageStar = score >= this.maxScore ? 1 : 0
      ele.bottomColor = 0
    },
    // 更改学生成绩
    changeStudentRage() {
      if(this.runStatus){
        var nTime = new Date().getTime()
        if(nTime - this.timer > 60){
          this.onlineStudents.forEach((ele) =>{
            // console.log(ele.score)
            if(ele.changeStatus) {
              if(ele.score === ele.targetScore && ele.score > this.maxScore) {
                if(ele.scoreStar < 3) {
                  ele.scoreStar ++
                }
              }
              if(ele.score < ele.targetScore) {
                var cs = ele.targetScore - ele.score >= 10 ? 10 : ele.targetScore - ele.score
                ele.score += cs
                this.getStyle(ele, ele.score)
              } else {
                ele.changeStatus = false
              }
            } else {
              if(ele.score > 0) {
                if(ele.score > this.maxScore) {
                  ele.score = this.maxScore - 2
                } else {
                  ele.score -= 2
                }
                this.getStyle(ele, ele.score) 
              }
            }
            
          })
          this.onlineStudents = this.onlineStudents.concat([])
          this.timer = nTime
        }
        if(nTime - this.startTime > this.quizTime){
          // 结束
          console.log('game over')
          this.runStatus = false
          this.resetStudentRage()
          this.studentShowStar()
          this.hornAni.gotoAndStop(0)
          this.showStar = true
        } else {
          window.requestAnimationFrame(this.changeStudentRage)
        }        
      }
      // var ang = (nTime - this.startTime) / (this.quizTime + this.prepareTime) * 360
      var ang = parseInt((nTime - this.startTime)/1000) /  (this.quizTime / 1000) * 40
      // this.arcElm1.angle = ang
      // this.arcElm1.setEnd(ang)
      var index = Math.round(ang)
      if(!isNaN(index)) this.timeAni.gotoAndStop(index)
    },
    resetStudentRage() {
      this.onlineStudents.forEach((ele) => {
        ele.score = 0
        // ele.scoreStar = 0
        this.getStyle(ele, ele.score)
      })
      this.onlineStudents = this.onlineStudents.concat([])
    },
    studentShowStar() {
      this.$store.dispatch('fetchRanking', {
        classID: this.classID,
        lessonID: this.lessonID,
        interactionID: this.currConfigData.interactionID
      }).then(() => {

      })
      let index = 0
      let self = this
      let nTimer = new Date().getTime()
      let nTimer1 = new Date().getTime()
      self.showStarStatus = true
      self.oldTarget = -1
      function showStar() {
        var nowTime = new Date().getTime()
        if (!self.showStarStatus) return
        if(nowTime - nTimer >= self.starTimer){
          if(index < self.onlineStudents.length){
            if(self.onlineStudents[index].maxScore > self.minScore && self.onlineStudents[index].scoreStar < 3) {
              self.onlineStudents[index].scoreStar ++
              self.onlineStudents[index].lightOpacity = 1
            }
            self.onlineStudents[index].showStar = true
            index ++
            self.onlineStudents = self.onlineStudents.concat([])
          } else {
            self.resetStudentRage()
          }
        }
        
        if(nowTime - nTimer1 >= self.scoreShowTime){ 
          self.$router.push({
            name: 'index'
          })
          self.showStarStatus = false
          return
        }
        window.requestAnimationFrame(showStar)
      }
      showStar()
    }
  },
  beforeRouteLeave: function(to, from, next) {
    clearTimeout(this.waiter)
    this.showStarStatus = false
    this.runStatus = false
    next()
  },
  watch: {
    'scoreData': function(val) {
      // console.log(this.runStatus)
      // console.log(val)
      if(this.runStatus) {
        for (let i = 0; i < this.onlineStudents.length; i++) {
        let ele = this.onlineStudents[i]
        if (val.name === ele.name) {
          if(val.value <= 20) break
          if(ele.score < val.value) {
            ele.targetScore = val.value
            ele.changeStatus = true
            
            // var obj = this.getStyle(val.value)
            // ele.opacity = obj.opacity
            // ele.score = val.value
            // ele.height = obj.height
          }
          if(ele.maxScore < val.value) {
              ele.maxScore = val.value
          }
          break
        }
      }
      this.onlineStudents = this.onlineStudents.concat([])
      }
      
    }
  },
  computed: {
    ...mapGetters({
      'configData': 'getPronunciationAllBubble'
    }),
    ...mapState({
      'students': state => state.game.studentsData,
      // 当前进入的步骤，即显示哪个界面
      'step': state => state.game.starsGameStep,
      // 语音数据
      'scoreData': state => state.game.scoreData,
      'lessonID': state => state.game.lessonID,
      'classID': state => state.game.classID,
      'courseID': state => state.game.courseID
    })
  }
}
</script>
