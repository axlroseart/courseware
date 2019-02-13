<template>
  <div class="games-index">
    <center style="margin-top: 150px">
      <el-select 
      v-model="coursewareName" 
      placeholder="请选择" 
      @change="selectCourseware" 
      v-show="mode === 'development' || host === '192.168.30.3' || host === 'ali.test.wisroom.firstleap.cn'">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item"
          :name="item.name">
        </el-option>
      </el-select>
    </center>
  </div>
</template>

<script>
import '../../assets/styles/common.styl'
import { mapState } from 'vuex'
export default {
  name: 'selectPage',
  data() {
    return {
      coursewareName: '',
      mode: process.env.NODE_ENV,
      host: window.location.host,
      options: [
        {
          value: 'faceu',
          label: '人脸签到',
          name: 'facedectect_snatchstar'
        },
        {
          value: 'roulette',
          label: '大转盘',
          name: 'pronunciation_single_roulette'
        },
        {
          value: 'seaBubble',
          label: '海底泡泡',
          name: 'pronunciation_all_bubble'
        },
        {
          value: 'pkSay',
          label: '语音分组PK-角色扮演',
          name: 'dub_group_default'
        },
        {
          value: 'robStars',
          label: '体感星星',
          name: 'body_follow_snatchstar'
        },
        {
          value: 'audioPk',
          label: '语音PK-跑圈',
          name: 'pronunciation_group_running'
        },
        {
          value: 'karaok',
          label: '卡拉OK',
          name: 'karaoke_default'
        },
        {
          value: 'monopoly',
          label: '大富翁',
          name: 'monopoly'
        },
        {
          value: 'bodyChoose',
          label: '体感选择',
          name: 'body_choice_default'
        },
        {
          value: 'bodyJudge',
          label: '体感判断',
          name: 'body_judge_default'
        },
        {
          value: 'arCosplay',
          label: 'ar角色扮演',
          name: 'roleplay_vr'
        },
        {
          value: 'ar',
          label: '普通ar',
          name: 'afr_common'
        },
        {
          value: 'hotBalloon',
          label: '热气球',
          name: 'pronunciation_all_multi_balloon'
        },
        {
          value: 'snowTest',
          label: 'snowTest',
          name: 'snow_test_fishing'
        },
        {
          value: 'smallHorn',
          label: '小喇叭',
          name: 'pronunciation_all_practice'
        }
      ]
    }
  },
  mounted() {
    console.log('====== 互动退出至index  ======')
    if(window.webviewCallBack && this.onloadStatus){
       window.webviewCallBack()
    }
    this.$store.dispatch('setOnloadStatus', true)
  },
  methods: {
    selectCourseware(option) {
      let params = {}
      console.log(option)
      for (let i = 0; i < this.configData.length; i++) {
        const element = this.configData[i]
        if (element.template.name === option.name) {
          console.log(element.template.name)
          params = element.template
          break
        }
      }
      console.log(params)
      this.$router.push({
        name: option.name,
        params: params
      })
    }
  },
  computed: {
    ...mapState({
      // websocket数据
      configData: state => state.game.configData,
      onloadStatus: state => state.game.onloadStatus
    })
  }
}
</script>

<style>

</style>
