<template>
  <div id="superContainer">
    <div id="gamePage" class="pageBackground_share">
      <canvas id="canvas_game" width="1024" height="768" tyle="position:absoluteleft:0pxtop:0pxwidth:1024pxheight:768pxz-index:100">
      </canvas>
    </div>
    <div id="vueContainer">
      <table class="info-list">
         <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
            </tr>
         </thead>
         <tbody>
           <tr v-for="items, index in listData" :key="index"  v-if="index >= startList && index < startList + pageMax" @click="checkedOne(items.id)" class="listRow" v-bind:class="{listChecked:checkedList.indexOf(items.id) > 0}">
              <td><input type='checkbox' :checked="checkedList.indexOf(items.id) >= 0" name='checkboxinput'  @click='checkedOne(items.id)'></td>
              <td></td>
           </tr>
         </tbody>
         <div v-for="items, index in listData" :key="index" class="list-row" v-if="index >= startList && index < startList + pageMax ">
              <input type='checkbox' :checked="checkedList.indexOf(items.id) >= 0" name='checkboxinput'  @click='checkedOne(items.id)'>

         </div>  
      </table> 
    </div>
  </div>
</template>

<script>
import "../../../assets/styles/snowTestFishing.styl"
import MYAIDE from "../../../utils/myaide.js"
import bgImg from "../../../assets/images/snowTest/snowBg.png"
import ballImg from "../../../assets/images/snowTest/snowBall.png"
import nextBtnImg from "../../../assets/images/snowTest/nextBtn.png"
import nextBtnImgMo from "../../../assets/images/snowTest/nextBtn_mo.png"
import Vue from "vue"


export default {
  data() {
    return {
      canvasItem: null,
      container: null,
      renderer: null,
      scene: null,
      isReady: false,
      bgImg,
      ballImg,
      nextBtnImg,
      nextBtnImgMo,
      minX: 32,
      maxX: 996,
      minY: 32,
      maxY: 740,
      r: 13,
      startList:2,
      pageMax:5,
      checkedList:[],
      listData:[
                { id: 0, text: "第一名", score: 98, showSta:true },
                { id: 1, text: "第二名", score: 85, showSta:true },
                { id: 2, text: "第三名", score: 82, showSta:false },
                { id: 3, text: "第四名", score: 80, showSta:true },
                { id: 4, text: "第五名", score: 79, showSta:true },
                { id: 5, text: "第六名", score: 78, showSta:true },
                { id: 6, text: "第七名", score: 76, showSta:true },
                { id: 7, text: "第八名", score: 75, showSta:true },
                { id: 8, text: "第九名", score: 69, showSta:true },
                { id: 9, text: "第十名", score: 68, showSta:true },
                { id: 10, text: "第十一名", score: 66, showSta:true },
                { id: 11, text: "第十二名", score: 65, showSta:true },
                { id: 12, text: "第十三名", score: 60, showSta:true }
            ]
    }
  },
  mounted() {
    // console.log('begin')
    // console.log(this)
    // console.log(MYAIDE)
    console.log(Vue)
    this.canvasItem = document.getElementById("canvas_game")
    this.container = document.getElementById("superContainer")
  console.log(this.bgImg)
    this.renderer = new MYAIDE.Renderer({ canvas: this.canvasItem })

    this.myScene = new MYAIDE.Scene({ background: this.bgImg })
    this.renderer.add(this.myScene)

    this.initLayer()

    this.renderer.begin()


  },
  methods: {
    checkedOne(index){
      console.log(index)
      console.log(this.checkedList)
      let i = this.checkedList.indexOf(index)
      console.log(i)
      if(i < 0){
        this.checkedList.push(index)
      }else{
        this.checkedList.splice(i,1)
      }
    },
    initLayer() {
      var self = this
      // ball
      var ani1 = new MYAIDE.Animal({
        name: "ball1",
        background: this.ballImg,
        x: 100,
        y: 350,
        listenerStatus: true,
        zIndex: 100
      })
      var ani2 = new MYAIDE.Animal({
        name: "ball2",
        background: this.ballImg,
        x: 100,
        y: 350,
        listenerStatus: true,
        zIndex: 100
      })
      this.myScene.add(ani1, ani2)

      this.speed = 6
      ani1.setAttr("speedX", this.speed)
      ani1.setAttr("speedY", -this.speed / 2)
      ani2.setAttr("speedX", this.speed)
      ani2.setAttr("speedY", this.speed)
      ani1.addListener("mousedown", aniDown)
      ani2.addListener("mousedown", aniDown)
      function aniDown() {
        console.log("点到了" + this.name)
        self.changeSpeed(this)
      }

      MYAIDE.Sint.add(
        "ballFly",
        function() {
          self.fly(ani1)
          self.fly(ani2)
        },
        20
      )

      // 添加btn
      var nextBtnImgArr = MYAIDE.Labeler.createImage(
        this.nextBtnImg,
        this.nextBtnImgMo
      )
      this.nextBtn = new MYAIDE.Button({
        upImg: nextBtnImgArr[0],
        moveImg: nextBtnImgArr[1],
        x: 820,
        y: 600,
        zIndex: 500
      })
      this.nextBtn.addListener("mousedown", function() {
        self.changeSpeed(ani1)
        self.changeSpeed(ani2)
      })

      this.myScene.add(this.nextBtn)

      // 绘渐变圆
      var gradientElm2 = this.renderer.ctx.createRadialGradient(
        150,
        350,
        10,
        150,
        350,
        150
      )
      gradientElm2.addColorStop(0, "red")
      gradientElm2.addColorStop(1, "green")

      var CircularGraphics1 = new MYAIDE.CircularGraphics({
        centre: [200, 350],
        radius: 150,
        lineWidth: 5,
        fillStatus: true,
        gradientStatus: true,
        gradient: gradientElm2,
        strokeStyle: "#009",
        strokeStatus: false
      })

      this.myScene.add(CircularGraphics1)

      // 倒计时
      this.timeClock = new MYAIDE.TimeText({
        startTime: 0,
        endTime: 11000,
        timeDirection: true,
        x: 850,
        y: 105,
        fontSize: 36,
        fillStyle: "#fff",
        showFunc: function(timer) {
          var m = parseInt(timer / 60)
          var s = timer % 60
          m = m > 9 ? m : "0" + m
          s = s > 9 ? s : "0" + s
          return m + ":" + s
        },
        callBack: function() {
          console.log("end")
        }
      })

      this.myScene.add(this.timeClock)
      this.timeClock.play()

      // 碰撞计数
      var collisionNumberScene = new MYAIDE.Text({
        x: 750,
        y: 200,
        txt: "碰撞次数：",
        fontSize: 36,
        fillStyle: "#fff"
      })
      this.collisionNumber = new MYAIDE.Text({
        x: 200,
        txt: "0",
        fontSize: 36,
        fillStyle: "#fff",
        textAlign: "center"
      })
      collisionNumberScene.add(this.collisionNumber)

      this.myScene.add(collisionNumberScene)

      // 辅助线(点击碰撞次数显隐)
      var axes = new MYAIDE.GridHelper({
        size: 1000,
        step: 50,
        x: 500,
        y: 400,
        axisColor: "red",
        gridColor: "#fff",
        visible: true,
        alpha: 0
      })
      this.myScene.add(axes)

      // 自适应
      MYAIDE.Resizer.add(this.container, true)

      // 色子
      var szImgArr = []
      MYAIDE.Loader.loadAniImg(
        szImgArr,
        "/assets/images/dices/mono-dice-",
        5,
        1
      )
      this.szAni = new MYAIDE.IntervalAnimation({
        frameArray: szImgArr,
        x: 500,
        y: 500,
        autoPlay: true,
        intervalStatus: true,
        cycle: 50
      })
      this.myScene.add(this.szAni)

      // htmlText
      var lala = new MYAIDE.HtmlText({
        lineWidth: 200,
        wordWrap: true,
        x: 810,
        y: 350,
        listenerStatus: true,
        htmlText:
          "<span class='test'><u>点我</u><myText></myText>显隐</span><hey>辅助线</hey>"
      })
      this.myScene.add(lala)
      // 属性名前带 . 的视为class名，只能加给span标签
      lala.setStyle(".test", "{font-size:35color:#F00}")
      // 属性名不带 . 的视为标签名，直接当作标签使用
      lala.setStyle("hey", "{font-size:25color:#0F0}")
      // 添加监听
      lala.addListener("mousedown", function() {
        console.log(axes.alpha)
        if (axes.alpha === 1) {
          MYAIDE.Labeler.hideAnimal(axes, 1000)
        } else {
          console.log("show")
          MYAIDE.Labeler.showAnimal(axes, 1000)
        }
      })
    },
    fly(ele) {
      var speedX = ele.getAttr("speedX")
      var speedY = ele.getAttr("speedY")

      var sx = ele.position.x + this.r
      var sy = ele.position.y + this.r

      sx += speedX
      sy += speedY

      if (sx > this.maxX || sx < this.minX) {
        ele.setAttr("speedX", -speedX)
        this.collisionNumber.setText(
          parseInt(this.collisionNumber.getText()) + 1
        )
      }

      if (sy < this.minY || sy > this.maxY) {
        ele.setAttr("speedY", -speedY)
        this.collisionNumber.setText(
          parseInt(this.collisionNumber.getText()) + 1
        )
      }

      ele.position.x = sx - this.r
      ele.position.y = sy - this.r
    },
    collision() {},
    changeSpeed(ele) {
      var newSpeedX = parseInt(Math.random() * 10)
      var newSpeedY = parseInt(Math.random() * 10)
      ele.setAttr("speedX", newSpeedX)
      ele.setAttr("speedY", newSpeedY)
    },
    getImageSrc(_src, type) {
      var str = _src + (type === undefined ? ".png" : type ? "." + type : "")
      return `/assets/images/${str}`
    }
  },

  beforeDestroy: function() {
    console.log("before")
  },
  computed: {}
}
</script>

<style>
</style>