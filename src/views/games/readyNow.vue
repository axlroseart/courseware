<template>
    <div class="readyNow" v-show="showStartMask">
        <div class="readyCon">

        </div>
        <div class="bodyReadyGo" >
          <transition enter-active-class="animated zoomIn"  leave-active-class="animated fadeOut">
            <div class="bodyReadyRead" v-show="showReady"></div>
          </transition>
            <!-- <div class="readyY"></div> -->
          <transition enter-active-class="animated zoomIn"  leave-active-class="animated fadeOut">
            <div class="BodyGo" v-show="showGo"></div>
          </transition>
        </div>
    </div>

</template>

<script>
  // import anime from 'animejs'
  import readyGoSound from '../../assets/sounds/readygo.mp3'
  import '../../assets/styles/readyNow.styl'
  export default {
    name: "ready-now",
    data() {
      return {
        readyGoSound,
        showStartMask: true,
        showReady: false,
        showGo: false
      }
    },
    mounted() {
      var readyGoSound = new Howl({
        src: [this.readyGoSound]
      })
      readyGoSound.play()
      this.showReady = true
      setTimeout(() => {
        this.showGo = true
        setTimeout(() => {
          this.showStartMask = false
        }, 1000)
      }, 1000)
    }
  }
</script>

<style scoped>

</style>