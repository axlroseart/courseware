<template>
	<div>
		<div class="senseBox">
			<!--最头部的闹钟-->
			<div class="clockBox">
				<div class="clockText">
					{{title}}
				</div>
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
						<img :src="paishouTop" alt="" class="paishouTop">
                        <img :src="borderTop" class="borderTop" v-show="win === 'left'">
					</div>
					<div class="animatRight" >
                        <img :src="rightOption.picture">
						<!--<div class="animatInner">-->
							<!--<img :src="rightOption.picture">-->
							<!--<p>{{rightOption.text}}</p>-->
						<!--</div>-->
						<img :src="paituiTop" alt="" class="paituiTop">
                        <img :src="borderTop" class="borderTop" v-show="win === 'right'">
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
			<!--第二个场景-->
            <!--<bigStarAnime ref="bigStarAnime" style="position: absolute; top: 222px;width: 50%;height: 50%;left: 0;"></bigStarAnime>-->
		</div>
		<!-- <bigStarAnime ref="bigStarAnime" style="position: absolute; top: 100px;width: 80%;height: 80%;left: 10%;" v-show="bigStarShow"></bigStarAnime> -->
		<!-- add by ryan -->
		<bigStarAnime ref="bigStarAnime" v-show="bigStarShow"></bigStarAnime>
	</div>
</template>

<script>
	import '../../../assets/styles/sense.styl'
	import dog from '../../../assets/images/dog.png'
	import countdownbgm from '../../../assets/sounds/countdown.mp3'
	import { mapGetters, mapState } from 'vuex'
	import sahua from '../../../assets/images/bodyChoose/sahua.gif'
	import bj from '../../../assets/sounds/bodyChoose/bj.mp3'
	import get from '../../../assets/sounds/bodyChoose/get.mp3'
    import borderOut from '../../../assets/images/bodyChoose/borderOut.png'
    import borderTop from '../../../assets/images/bodyChoose/borderTop.png'
    import paishou from '../../../assets/images/bodyChoose/paishou.gif'
	import paitui from '../../../assets/images/bodyChoose/paitui.gif'
	import paishouTop from '../../../assets/images/bodyChoose/paishouTop.gif'
    import paituiTop from '../../../assets/images/bodyChoose/paituiTop.gif'
    import bigStarAnime from '../../common/bigStarAnimeOld'
    import huanhu from '../../../assets/sounds/audioPk/huanhu.mp3'
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
                huanhu
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
			document.getElementsByTagName('body')[0].style.background = 'rgba(0, 0, 0, 0)'
			this.configData = this.$route.params
			// this.bgm_sound = new Howl({
			//   src: [this.bgm_mp3],
			//   loop: true,
			//   volume: 0.1
			// })
			// this.bgm_sound.play()
			console.log('this.configData', this.configData)
			if (!this.configData.name) return console.log('体感选择没有拿到配置信息，不执行后面的逻辑！！！！！！！！！！！！')
			this.task = this.configData.configuration.task
			this.allStep = this.task.length
			this.interactionID = this.configData.interactionID
			this.configID = this.configData.configID
			// 改变倒计时的样式
			document.getElementsByClassName('el-progress-circle')[0].style.width = '0.38rem'
			document.getElementsByClassName('el-progress-circle')[0].style.height = '0.38rem'
			// 发送开始互动的请求
			// this.Api.coursewareStart({
            //   classID: this.classID,
            //   lessonID: this.lessonID,
            //   interactionID: this.configData.interactionID,
            //   config: this.configData
            // }).then(data => {
            //   this._checkData(data).then(data => {
            //     console.log('====== 向服务端发起互动成功 ======', data)
            //   }).catch(error => {
            //     console.log('====== 向服务端发起互动失败 ======', error)
            //   })
            // })
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
                this.isShowBorder = false
				let arrIndex = that.nowStep - 1
				let data = that.task[arrIndex]
				this.leftValue = data.gestureOption[0].value
				if (data.gestureOption[0].value === 1) {
					this.leftSwf = this.paishou
					this.rightSwf = this.paitui
				} else {
					this.leftSwf = this.paitui
					this.rightSwf = this.paishou
				}
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
						this.percentage = this.percentage + jiange
						if (this.percentage >= 100) {
							this.nextColock = setTimeout(() => {
								clearInterval(this.clockTime)
								this.playSounds(this.get)
								if (data.rightGesture === 1) { // 1为left对，2为right对
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
							}, 500)
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
					// that.Api.interactionStart({ // 开始互动
					// 	lessonID: that.lessonID,
					// 	classID: that.classID,
					// 	interactionID: that.interactionID,
					// 	type: that.type,
					// 	configID: that.configID,
					// 	config: '',
					// 	taskID: arrIndex
					// }).then(data => {
					// 	that._checkData(data).then(data => {
					// 		if (data.code === 0) {
					// 			console.log("开始体感选择")
					// 		}
					// 	})
					// })
				}, prepareTime)
			}
		},
		watch: {
			'scoreData': function(val) {
				if (this.leftArr.length >= 14 || this.rightArr.length >= 14) return
				let repeat = false
				for (let i = 0; i < this.leftArr.length; i++) {
					if (this.leftArr[i].student_id === val.student_id) repeat = true
				}
				for (let j = 0; j < this.rightArr.length; j++) {
					if (this.rightArr[j].student_id === val.student_id) repeat = true
				}
				if (repeat) return
				// if(val.student_id % 2 === 0){
				if (val.value === this.leftValue) {
					this.leftArr.push(val)
				} else {
					this.rightArr.push(val)
				}
			}
		},
	}
</script>

<style scoped>
</style>