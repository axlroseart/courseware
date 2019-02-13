<template>
	<div class="bodyChooseAudioCon">
		<!-- <div style="position:absolute;top:0;left:10px;z-index:9999">
			<button @click="toShow(1)">左边</button>
			<button @click="toShow(2)">右边</button>
			<button @click="toShow(3)">抖动</button>
		</div> -->
		<div class="senseBox">
			<!--最头部的闹钟-->
			<div class="clockBox">
				<img :src="title" alt="" class="titleImg">
				<!-- <div class="clockText">
					{{title}}
				</div> -->
				<div class="clock">
					<img src="../../../assets/images/count-down-clock.png">
					<el-progress class="chooseProgress" type="circle" :percentage="percentage" :width="40" :stroke-width="5" color="#FF6161" :show-text="false"></el-progress>
				</div>
			</div>
			<!--第一个场景-->
			<div class="senseTotal" v-show="senseShow">
				<!--选项-->
				<div class="animatBox">
					<div class="animatLeft" >
                        <img :src="leftOption.picture">
						<!--<div class="animatInner">-->
							<!--<img :src="leftOption.picture">-->
							<!--<p>{{leftOption.text}}</p>-->
						<!--</div>-->
					</div>
					<div class="animatRight" >
                        <img :src="rightOption.picture">
						<!--<div class="animatInner">-->
							<!--<img :src="rightOption.picture">-->
							<!--<p>{{rightOption.text}}</p>-->
						<!--</div>-->
					</div>
				</div>
				<!--中间的老师-->
				<!--人物-->
				<!--<div class="Person">-->
				<!--<img src="../../../assets/images/teach.png">-->
				<!--</div>-->
				<!--最下边的team-->
				<div class="senseTeam">
                    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOutDown">
                        <img :src="leftSwf" alt="" class="shuidi" v-show="!isShowBorder">
                    </transition>
                    <transition enter-active-class="animated bounceIn" >
                        <div class="senseLeft" v-show="isShowBorder">
                            <img :src="borderOut" class="borderOut" alt="" v-show="win === 'left'">
                            <div class="sahuaObj" :class="win === 'left'?'visi':'hidd'">
                                <img :src="sahua" alt="">
                                <!--<object>-->
                                    <!--<param :value="sahua">-->
                                    <!--<param value="high">-->
                                    <!--<embed class="" :src="sahua" wmode="transparent" quality=high ALIGN="" TYPE="application/x-shockwave-flash"></embed>-->
                                <!--</object>-->
                            </div>
                            <ul>
                                <li v-for="item in leftArr" v-bind:key="item.name">
                                    <transition enter-active-class="animated bounceIn">
                                        <img v-show="win === 'left' && showStar" src="../../../assets/images/rank-star.png" class="senseStar">
                                    </transition>
                                    <img :src="item.avatar_url" class="sensePer">
                                    <p>{{item.name}}</p>
                                </li>
                            </ul>
                        </div>
                    </transition>
                    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOutDown">
                        <img :src="rightSwf" alt="" class="shuidi shuidi2" v-show="!isShowBorder">
                    </transition>
                    <transition enter-active-class="animated bounceIn" >
                        <div class="senseRight" v-show="isShowBorder">
                            <img :src="borderOut" class="borderOut" alt="" v-show="win === 'right'">
                            <div class="sahuaObj" :class="win === 'right'?'visi':'hidd'">
                                <img :src="sahua" alt="">
                                <!--<object>-->
                                    <!--<param :value="sahua">-->
                                    <!--<param value="high">-->
                                    <!--<embed class="" :src="sahua" wmode="transparent" quality=high ALIGN="" TYPE="application/x-shockwave-flash"></embed>-->
                                <!--</object>-->
                            </div>
                            <ul>
                                <li v-for="item in rightArr" :key="item.name">
                                    <transition enter-active-class="animated bounceIn">
                                        <img v-show="win === 'right' && showStar" src="../../../assets/images/rank-star.png" class="senseStar">
                                    </transition>
                                    <img :src="item.avatar_url" class="sensePer">
                                    <p>{{item.name}}</p>
                                </li>
                            </ul>
                        </div>
                    </transition>
				</div>
			</div>
			<!--最下面的学生头像-->
            <div class="elRow">
				<img v-for="item in studentData" :key="item.name" class="avatarBottom" :src="item.avatar" alt="">
			</div>
		</div>
		<!-- <bigStarAnime ref="bigStarAnime" style="position: absolute; top: 100px;width: 80%;height: 80%;left: 10%;" v-show="bigStarShow"></bigStarAnime> -->
		<!-- add by ryan -->
		<bigStarAnime ref="bigStarAnime" v-show="bigStarShow"></bigStarAnime>
	</div>
</template>

<script>
	import '../../../assets/styles/sense.styl'
	import '../../../assets/styles/bodyChooseAudio.styl'
	import dog from '../../../assets/images/dog.png'
	import countdownbgm from '../../../assets/sounds/countdown.mp3'
	import { mapGetters, mapState } from 'vuex'
	import sahua from '../../../assets/images/bodyChoose/sahua.gif'
	import bj from '../../../assets/sounds/bodyChoose/bj.mp3'
	import get from '../../../assets/sounds/bodyChoose/get.mp3'
    import borderOut from '../../../assets/images/bodyChoose/borderOut.png'
	import borderTop from '../../../assets/images/bodyChoose/borderTop.png'
	import avatar from '../../../assets/images/avatar.png'
    import paishou from '../../../assets/images/bodyChoose/paishou.gif'
	import paitui from '../../../assets/images/bodyChoose/paitui.gif'
	import paishouTop from '../../../assets/images/bodyChoose/paishouTop.gif'
    import paituiTop from '../../../assets/images/bodyChoose/paituiTop.gif'
    import bigStarAnime from '../../common/bigStarAnimeOld'
	import huanhu from '../../../assets/sounds/audioPk/huanhu.mp3'
	import 'velocity-animate/velocity.ui.js'
	import Velocity from 'velocity-animate'
	export default {
		name: "sense",
		data() {
			return {
				senseShow: true, //控制两个场景切换
				sahua,
				rightSwf: '',
				leftSwf: '',
				paishou,
				paitui,
				paishouTop,
				paituiTop,
				configData: {},
				nowStep: 1,
				allStep: 0,
				task: [],
				leftArr: [],
				rightArr: [],
				allArr: [],
				allArrIndex: 0,
				allArrStatus: 'ended',
				percentage: 0,
				leftOption: {},
				rightOption: {},
				title: '',
				dog,
				countdownbgm,
				win: '',
				bgm_mp3: bj,
				get,
				leftValue: 2,
				des: false,
				clockTime: '',
                borderOut,
                borderTop,
                isShowBorder: false,
                showStar: false,
                bigStarShow: false,
				huanhu,
				studentData: [],
				animateTime: 50,
				nextTime: 50,
				animateClock: ''
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
		mounted() {
			let that = this
			this.Api.fetchStudentData({
				classID: this.classID,
				lessonID: this.lessonID
				}).then(data => {
					that._checkData(data).then(data => {
					let arr = data.data.students
					for (let i = 0; i < arr.length; i++) {
						let item = arr[i]
						if (!item.online) {
							item.avatar = avatar
						}
					}
					that.studentData = arr
				})
			})
			document.getElementsByTagName('body')[0].style.background = 'rgba(0, 0, 0, 0)'
			this.configData = this.$route.params 
			console.log('this.configData', this.configData)
			if (!this.configData.name) return console.log('体感选择没有拿到配置信息，不执行后面的逻辑！！！！！！！！！！！！')
			this.task = this.configData.configuration.task
			this.allStep = this.task.length
			this.interactionID = this.configData.interactionID
			this.configID = this.configData.configID
			// 改变倒计时的样式
			document.getElementsByClassName('el-progress-circle')[0].style.width = '0.38rem'
			document.getElementsByClassName('el-progress-circle')[0].style.height = '0.38rem'
			// this.studentData = [{"studentID":1,"name":"sunny","avatar":"http://192.168.30.3/avatar/sunny.png","sex":2,"online":true,"star":1287,"group":2},{"studentID":2,"name":"mark","avatar":"http://192.168.30.3/avatar/mark.png","sex":1,"online":true,"star":1254,"group":1},{"studentID":3,"name":"pete","avatar":"http://192.168.30.3/avatar/pete.png","sex":1,"online":true,"star":1352,"group":1},{"studentID":4,"name":"coco","avatar":"http://192.168.30.3/avatar/coco.png","sex":2,"online":true,"star":1310,"group":1},{"studentID":5,"name":"yuki","avatar":"http://192.168.30.3/avatar/yuki.png","sex":2,"online":true,"star":1247,"group":1},{"studentID":6,"name":"ryan","avatar":"http://192.168.30.3/avatar/ryan.png","sex":1,"online":true,"star":1279,"group":1},{"studentID":7,"name":"snow","avatar":"http://192.168.30.3/avatar/jefferson.png","sex":1,"online":true,"star":1330,"group":2},{"studentID":8,"name":"lucas","avatar":"http://192.168.30.3/avatar/lucas.png","sex":1,"online":true,"star":1284,"group":1},{"studentID":9,"name":"hui","avatar":"http://192.168.30.3/avatar/hui.png","sex":1,"online":true,"star":1288,"group":2},{"studentID":10,"name":"mona","avatar":"http://192.168.30.3/avatar/mona.png","sex":2,"online":true,"star":1329,"group":2},{"studentID":11,"name":"lily","avatar":"http://192.168.30.3/avatar/lily.png","sex":2,"online":true,"star":1297,"group":2},{"studentID":12,"name":"lynn","avatar":"http://192.168.30.3/avatar/lynn.png","sex":1,"online":true,"star":1268,"group":2},{"studentID":13,"name":"hao","avatar":"http://192.168.30.3/avatar/hao.png","sex":1,"online":true,"star":1292,"group":1},{"studentID":14,"name":"murray","avatar":"http://192.168.30.3/avatar/murray.png","sex":1,"online":true,"star":1299,"group":2}]
			this.step()
		},
		// beforeDestroy: function() {
		//   this.bgm_sound.stop()
		// },
		beforeRouteLeave: function(to, from, next) {
			console.log('体感选择触发beforeRouteLeave')
			this.des = true
			console.log('this.des', this.des)
            if(this.huanhuObj) this.huanhuObj.pause()
			if (this.clockTime) clearInterval(this.clockTime)
			if (this.prepareColock) clearTimeout(this.prepareColock)
			if (this.nextColock) clearTimeout(this.nextColock)
			if (this.showClock) clearTimeout(this.showClock)
            if (this.borderClock) clearTimeout(this.borderClock)
            if (this.beginStar) clearTimeout(this.beginStar)
			if (this.endStar) clearTimeout(this.endStar)
			if (this.animateClock) clearTimeout(this.animateClock)
			next()
		},
        components: {
          bigStarAnime
        },
		methods: {
			enter: function() {
			},
			playSounds: function(sound) {
				let audio = new Audio(sound)
				audio.play()
			},
			step() {
				console.log(this.des)
				if (this.des) return
				let that = this
                this.isShowBorder = true
				let arrIndex = that.nowStep - 1
				let data = that.task[arrIndex]
				// this.leftValue = data.gestureOption[0].value
				// if (data.gestureOption[0].value === 1) {
				// 	this.leftSwf = this.paishou
				// 	this.rightSwf = this.paitui
				// } else {
				// 	this.leftSwf = this.paitui
				// 	this.rightSwf = this.paishou
				// }
				this.leftOption = data.textOption[0]
				this.rightOption = data.textOption[1]
				this.title = data.title
				let quizTime = data.quizTime // 每个单词持续时间
				let prepareTime = data.prepareTime // 介绍的时间
				let showTime = data.showTime // 结果展现时间
				let num = quizTime / 1000
				let jiange = 100 / num
				this.prepareColock = setTimeout(() => {
					let startTime = this._getNowFormatDate()
					console.log('体感选择第' + that.nowStep + '轮开始时间', startTime)
                    this.borderClock = setTimeout(() => {
                      this.isShowBorder = true
                    }, 1000)
					this.clockTime = setInterval(() => {
						this.playSounds(this.countdownbgm)
						let perNum = this.percentage + jiange
						if (perNum >= 100) {
							this.percentage = 100
						} else {
							this.percentage = this.percentage + jiange
						}
						if (this.percentage >= 100) {
							this.allArrStatus = 'over' // 倒计时结束后不能再上墙
							this.nextColock = setTimeout(() => {
								clearInterval(this.clockTime)
								this.playSounds(this.get)
								if (data.answer === 1) { // 1为left对，2为right对
									this.win = 'left'
								} else {
									this.win = 'right'
								}
                                this.huanhuObj = new Audio(this.huanhu)
                                this.huanhuObj.volume = 0.4
                                this.huanhuObj.play()
								this.beginStar = setTimeout(() => { // 开始展现加星结算
                                  if ((this.win === 'left' && this.leftArr.length > 0) || (this.win === 'right' && this.rightArr.length > 0)) {
                                    this.bigStarShow = true
                                    this.$refs.bigStarAnime.starAanime.play() // 开启星星动画，leap动画注释此行即可
                                    this.$refs.bigStarAnime.showSound.play() // 音效
                                  }
                                  this.endStar = setTimeout(() => { // 结束加星结算
                                    this.showStar = true // 实现星星大动画完后，学生头像的星星出现
                                    this.bigStarShow = false // 隐藏掉星星大动画
                                  }, 2650)
                                }, 2000)
								this.showClock = setTimeout(() => {
									this._timeFn(startTime) // 打印此活动的持续时间
                                    that.nowStep++
									if (that.nowStep <= that.allStep) {
                                        this.showStar = false
										this.win = ''
										that.leftArr = []
										that.rightArr = []
										that.allArr = []
										that.allArrIndex = 0
										that.percentage = 0
										that.step()
									} else {
                                      // 互动结束后close
                                      console.log('结束体感选择互动')
                                      if(window.webviewCallBack) window.webviewCallBack({
                                        type: 'end',
                                        start: typeof this.$route.params.from === 'undefined' ? '' : this.$route.params.from,
                                        courseware: this.$route.params.name
                                      })
									}
								}, showTime)
							}, 0)
						}
					}, 1000)
					// 开始互动
					let query = 'interactionpb.ClasskitStartInteractionRequest'
					let url = 'protos/interaction.proto'
					let params = {
						classID: that.classID,
						lessonID: that.lessonID,
						interactionID: that.interactionID,
						taskID: arrIndex,
						type: that.type,
						config: ''
					}
					global.icsocket.encode(query, url, params, 6, global.icsocket.webskt)
				}, prepareTime)
			},
			toShow(val) {
				if (this.leftArr.length >= 14 || this.rightArr.length >= 14 || this.allArrStatus === 'over' || val.interaction_id !== this.interactionID) return
                if (this.allArr.length >= 14) return
                this.allArr.push(val)
                if (this.allArrStatus === 'ended') {
                    this.beginAni()
                }
			},
			beginAni() {
				if (this.allArrStatus === 'over') return
				if (this.allArrIndex >= this.allArr.length) {
					this.allArrStatus = 'ended'
					return
				} else {
					this.allArrStatus = 'started'
				}
				let item = this.allArr[this.allArrIndex]
				let ele
				for (let k = 0; k < this.studentData.length; k++) {
					if (this.studentData[k].studentID === item.student_id * 1) {
						ele = document.querySelectorAll('.avatarBottom')[k]
					}
				}
				// console.log('item', item)
				// console.log('ele', ele)
				if (!ele) {
					this.allArrStatus = 'ended'
					return
				}
				if (item.value === 1) { // 1是左边，2是右边，3是抖动
					Velocity(ele, {left: '1.666666666666667rem', top: '-1.5625rem'}, {dutation: this.animateTime, complete: () => {
					}})
					this.animateClock = setTimeout(() => {
						console.log(1)
                        console.log(new Date().getTime())
                        ele.style.display = 'none'
                        this.leftArr.push(item)
                        this.allArrIndex ++
                        this.beginAni()
					}, this.nextTime)
				} else if (item.value === 2) {
					Velocity(ele, {left: '7.708333333333333rem', top: '-1.5625rem'}, {duration: this.animateTime, complete:() => {
					}})
					this.animateClock = setTimeout(() => {
						console.log(2)
                        console.log(new Date().getTime())
                        ele.style.display = 'none'
                        this.rightArr.push(item)
                        this.allArrIndex ++
                        this.beginAni()
					}, this.nextTime)
				} else {
                    Velocity(ele, 'transition.bounceIn', {duration: this.animateTime, complete: () => {
					}})
					this.animateClock = setTimeout(() => {
						console.log(-1)
                        console.log(new Date().getTime())
                        this.allArrIndex ++
                        this.beginAni()
					}, this.nextTime)
                }
			}
		},
		watch: {
			'scoreData': function(val) {
				this.toShow(val)
			}
		},
	}
</script>

<style scoped>
</style>