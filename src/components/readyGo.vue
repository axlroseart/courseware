<template>
  <div class="ready-go-count-down">
    <div class="count-down-three"></div>
    <div class="count-down-two"></div>
    <div class="count-down-one"></div>
  </div>
</template>

<script>
import anime from 'animejs'
import bubble_321_mp3 from '../assets/sounds/bubble/321.mp3'
export default {
  data() {
    return {
      bubble_321_mp3,
      isCountDownDone: false,
      countDownVoice: {},
      duration: 600
    }
  },
  mounted() {
    this.countDownVoice = new Howl({
      src: [this.bubble_321_mp3]
    })
    let t1 = anime.timeline({
      easing: 'easeInOutQuart'
    })
    let c3 = document.querySelector('.count-down-three')
    let c2 = document.querySelector('.count-down-two')
    let c1 = document.querySelector('.count-down-one')
    let me = this
    t1.add({
      targets: c3,
      opacity: {
        value: 1
      },
      scale: {
        value: 2,
        duration: this.duration,
        easing: 'easeInOutQuart'
      },
      begin: function() {
        setTimeout(() => {
          me.countDownVoice.play()
        }, 500)
      },
      complete: function() {
        anime({
          targets: c3,
          opacity: {
            value: 0
          }
        })
      }
    }).add({
      targets: c2,
      opacity: {
        value: 1
      },
      scale: {
        value: 2,
        duration: this.duration,
        easing: 'easeInOutQuart'
      },
      complete: function() {
        anime({
          targets: c2,
          opacity: {
            value: 0
          }
        })
      }
    }).add({
      targets: c1,
      opacity: {
        value: 1
      },
      scale: {
        value: 2,
        duration: this.duration,
        easing: 'easeInOutQuart'
      },
      complete: function() {
        anime({
          targets: c1,
          opacity: {
            value: 0
          }
        })
      }
    })
  }
}
</script>

<style lang="stylus">
</style>
