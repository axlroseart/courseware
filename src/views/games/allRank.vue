<template>
    <div id="rankBox">
        <img :src="bg" class="bgObj" alt="">
        <img :src="cs" class="bgObj" alt="">
        <div class="logo"></div>
        <div class="rankList" v-show="flag">
            <ul class="rankLeft">
                <li v-for="(item,index) in grounpOne" :key="index">
                    <span class="useBox">
                        <img class="allRankImg" :src="item.avatar_url"/>
                        <p class="imgName">{{item.name}}</p>
                    </span>
                    <span class="elBox">
                            <el-progress :text-inside="true" :stroke-width="28" :percentage="0"
                                         class="words-switch-count-down" :data="item.stars">
                                <div class="progress-star"></div>
                            </el-progress>
                           <span class="starNumber"
                              :class="getClass(item.stars)"></span>
                    </span>
                </li>
            </ul>
            <ul class="rankRight">
                <li v-for="(item,index) in grounpTwo" :key="index">
                    <span class="useBox">
                        <img class="allRankImg" :src="item.avatar_url"/>
                        <p class="imgName">{{item.name}}</p>
                    </span>
                    <span class="elBox">
                        <el-progress :text-inside="true" :stroke-width="28"
                                     :percentage="0"
                                     class="words-switch-count-down"
                                     :data="item.stars">
                            <div class="progress-star"></div>
                        </el-progress>
                        <span class="starNumber"
                              :class="getClass(item.stars)"></span>
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
  import bg from '../../assets/images/bg.gif'
  import cs from '../../assets/images/cs.gif'
  import '../../assets/styles/allRank.styl'
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        flashw: '100%',
        flashh: '100%',
        bg,
        cs,
        grounpOne: [],
        grounpTwo: [],
        flag: false,
        num: 0
      }
    },
    computed: {
      ...mapState({
        // websocket数据
        lessonID: state => state.game.lessonID,
        classID: state => state.game.classID,
        courseID: state => state.game.courseID
      })
    },
    methods: {
      getClass(num) {
        let starNum = Math.floor(num/this.base)
        if(starNum <10){
          return 'act1'
        } else if (starNum >= 10 && starNum < 20) {
          return 'act2'
        } else if (starNum >= 20 && starNum <= 30) {
          return 'act3'
        } else if (starNum > 30 && starNum <= 40) {
          return 'act4'
        } else if (starNum > 40 && starNum <= 50) {
          return 'act5'
        } else if (starNum > 50 && starNum <= 60) {
          return 'act6'
        } else if (starNum > 60 && starNum <= 70) {
          return 'act7'
        } else if (starNum > 70 && starNum <= 80) {
          return 'act8'
        } else if (starNum > 80 && starNum <= 90) {
          return 'act9'
        } else if (starNum > 90 && starNum <= 100) {
          return 'act10'
        }
      },
      screenShot() {
        setTimeout(() => {
          // 截图
          let avaRankData = []
          if (this.students.length > 0) {
            this.students.sort(function(a, b) {
              if (a.stars < b.stars) return 1
              else return -1
            })
            console.log(this.students)
            for (let index = 0; index < 5; index++) {
              const element = this.students[index]
              if (element) avaRankData.push(element.uid)
            }
            console.log('avaRankData:', avaRankData)
            let fileName = 'allRank'+ new Date().getTime() + '.jpg'
            window.callClassroom({
              type: 'screenShot',
              param: {
                fileName: fileName,
                lessonID: this.lessonID,
                classID: this.classID,
                category: 6,
                related: avaRankData
              }
            })
          }
        }, 1000)
      }
    },
    mounted() {
      let students
      this.flag = true
        this.Api.fetchlessonResult({
          classID: this.classID,
          lessonID: this.lessonID,
        }).then(data => {
            this._checkData(data).then(data => {
              students = data.data
              this.students = students
              let arr1 = []
              let arr2 = []
              let zuidaNum = 1
              // 后续操作
              for (let i = 0; i < students.length; i++) {
                if (students[i].stars > zuidaNum) {
                  zuidaNum = students[i].stars
                }
                if (i%2 === 0) {
                  arr1.push(students[i])
                } else {
                  arr2.push(students[i]);
                }
              }
              this.base = zuidaNum / 100
              this.grounpOne = arr1
              this.grounpTwo = arr2


              this.$nextTick(function(){
                let inner=document.getElementsByClassName('el-progress-bar__inner');
                let outer=document.getElementsByClassName('words-switch-count-down');
                let starNum=document.getElementsByClassName('starNumber');
                let jishu = 2.375/100
                for(let i=0;i<inner.length;i++){
                  let nowPer=0;
                  let j=i;
                  let data2=outer[j].getAttribute('data');
                  let data = Math.floor(data2 / this.base)
                  let down=setInterval(() => {
                    if (!starNum[j]) return
                    if(data==nowPer){
                      starNum[j].innerHTML=data2
                      clearInterval(down)
                      this.num ++
                      if (this.num >= inner.length) {
                        this.screenShot()
                      }
                    } else {
                      starNum[j].innerHTML=Math.floor(nowPer*this.base);
                    }
                    inner[j].style.width=nowPer+"%";
                    starNum[j].style.left=nowPer*jishu+'rem'
                    nowPer++;
                  },10)
                }
              })
            })
        })
    }
  }
</script>

<style scoped>

</style>
