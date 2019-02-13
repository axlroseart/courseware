<template>
  <div class="rank-common">
    <!-- 星星 -->
    <div class="star-score">
      <i class="rank-star"></i>
      <span>{{ currData.stars }}</span>
    </div>
    <!-- 星星 -->

    <!-- 头像 -->
    <div class="avatar">
      <div class="wrap"></div>
      <div class="inside">
        <img :src="currData.avatar_url" alt="">
      </div>
    </div>
    <!-- 头像 -->

    <!-- 名字 -->
    <div class="rank-name">
      <h2>{{ currData.name }}</h2>
    </div>
    <!-- 名字 -->

    <!-- 奖杯 -->
    <div class="rank-cup"></div>
    <!-- 奖杯 -->
  </div>
</template>

<script>
import avatar from '../../assets/images/avatar.png'
export default {
  data() {
    return {
      avatar: avatar
    }
  },
  props: ['currData'],
  mounted() {
    console.log(this.currData)
  }
}
</script>

<style>

</style>
