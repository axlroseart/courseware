<template>
  <div class="streaming" id="streaming">
    <video-player class="vjs-custom-skin"  :options="playerOptions" @ready="playerReadied"></video-player>
  </div>
</template>

<script>
import '../../../assets/styles/video-theme.styl'
export default {
  data() {
    return {
      videoType: 'rtmp/flv',
      // video options
      playerOptions: {
        autoplay: true,
        controls: false,
        width: this.width,
        height: this.height,
        muted: this.muted,
      }
    }
  },
  props: ['width', 'height', 'videoSrc', 'muted'],
  components: {
  },
  mounted() {
  },
  methods: {
    /**
     * video methods
     */
    // player is ready
    playerReadied(player) {
      console.log('player readied')
      console.log('videoType:', this.videoType)
      console.log('videoSrc:', this.videoSrc)
      // 播放flash必须加上此段
      if (this.videoType.split('/')[0] === 'rtmp') {
        player.options_.techOrder = ['flash']
      } else {
        player.options_.techOrder = ['html5']
      }
      setTimeout(() => {
        player.src({
          type: this.videoType,
          src: localStorage.getItem('videoSrc')
        })
        player.__proto__.play()
      }, 5000)
    }
  }
}
</script>

<style>

</style>
