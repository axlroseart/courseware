<template>
    <div id="winTeam">
        <div class="winLeft" :class="{winYellow:win === 'left'}">
            <img src="../../../assets/images/team1.png" class="teamImg">
            <img v-if="grounpOneWin" src="../../../assets/images/winImg.png" class="winImg">
            <ul>
                <li v-for="item,index in grounpOne" :class="{active:index == 0}">
                    <div v-if="grounpOneWin" class="starImg">+2</div>
                    <img :src="item.avatar"/>
                    <img v-if="index === 0" class="mvpImg" src="../../../assets/images/mvp.png"/>
                    <p>{{item.name}}</p>
                </li>
            </ul>
        </div>
        <div class="winRight" :class="{winYellow:win === 'right'}">
            <!--<div style="padding: 50px;width: 100%;height: 100%"></div>-->
            <img src="../../../assets/images/team2.png" class="teamImg">
            <img v-if="grounpTwoWin" src="../../../assets/images/winImg.png" class="winImg">
            <ul>
                <li v-for="item,index in grounpTwo" :class="{active:index==0}">
                    <div v-if="grounpTwoWin" class="starImg">+2</div>
                    <img :src="item.avatar"/>
                    <img v-if="index === 0" class="mvpImg" src="../../../assets/images/mvp.png"/>
                    <p>{{item.name}}</p>
                </li>
            </ul>
        </div>

        <!--星星闪-->
        <object class="starObj" v-if="grounpOneWin">
            <param :value="star">
            <param value="high">
            <embed class="" :src="star" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>

        <!--撒花-->
        <object class="flowerObj" v-if="grounpOneWin">
            <param :value="flower">
            <param value="high">
            <embed class="" :src="flower" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>

        <!--闪光-->
        <object class="lastObj" v-if="grounpOneWin">
            <param :value="last">
            <param value="high">
            <embed class="" :src="last" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>

        <!--星星闪-->
        <object class="starObjRight" v-if="grounpTwoWin">
            <param :value="star">
            <param value="high">
            <embed class="" :src="star" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>

        <!--撒花-->
        <object class="flowerObjRight" v-if="grounpTwoWin">
            <param :value="flower">
            <param value="high">
            <embed class="" :src="flower" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>

        <!--闪光-->
        <object class="lastObjRight" v-if="grounpTwoWin">
            <param :value="last">
            <param value="high">
            <embed class="" :src="last" wmode="transparent" quality=high   ALIGN="" TYPE="application/x-shockwave-flash"></embed>
        </object>
        <div class="fixBox"></div>
    </div>
</template>

<script>
    import '../../../assets/styles/audioPk.styl'
    import star from '../../../assets/flash/star.swf'
    import flower from '../../../assets/flash/flower2.swf'
    import last from '../../../assets/flash/last2.swf'
    export default {
        name: "winTeam",
        data() {
            return {
                star,
                flower,
                last,
                grounpOne: [],
                grounpTwo: [],
                grounpOneWin: false,
                grounpTwoWin: false,
                win: ''
            }
        },
        mounted() {
          let that = this
          that.Api.fetchGroupResult({ // 结果
            lessonID: 221,
            classID: 1,
            interactionID: 4
          }).then(data => {
            that._checkData(data).then(data => {
              if (data.data.scores[1].Win) {
                that.win = 'left'
                that.grounpOneWin = true
                that.grounpTwoWin = false
              } else {
                that.grounpOneWin = false
                that.grounpTwoWin = true
                that.win = 'right'
              }
            })
          })
          this.Api.fetchStudentData({
            classID: 1,
            lessonID: 221,
          }).then(data => {
            that._checkData(data).then(data => {
              // 拿到选中的学生ID
              let students = data.data.students
              let arr1 = []
              let arr2 = []
              // 后续操作
              for (let i = 0; i < students.length; i++) {
                if (students[i].group === 1) {
                  arr1.push(students[i])
                } else {
                  arr2.push(students[i])
                }
              }
              that.grounpOne = arr1
              that.grounpTwo = arr2
            })
          })
        }
    }
</script>

<style scoped>

</style>