<template>
  <div class="ready-go">
    <div class="vertical-circle-stars"
      v-for="items, index in stars"
      :key="index"
      :style="'top:' + items.top + 'px; left: ' + items.left + '; '">
      <div class="vertical"></div>
      <div class="circle" :style="'transform: scale(' + items.scale + ')'"></div>
    </div>
    <i class="icon-star" 
      v-for="items, index in opaStars" 
      :key="items.left"
      :style="'left: ' + items.left +'%; top: ' + items.top + '; transform: scale(' + items.scale + ')'">
    </i>
    <div class="bottom-light"></div>
    <div class="ready-go-animate">
      <div class="ready-read"></div>
      <div class="ready-y"></div>
      <div class="go"></div>
    </div>
    <div id="motionPath">
      <svg>
        <path
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        :d="svgPath"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script>
import anime from 'animejs'
import { mapState } from 'vuex'
import backSound from '../../assets/sounds/backsound.mp3'
import readyGoSound from '../../assets/sounds/readygo.mp3'
export default {
  data() {
    return {
      width: 1920,
      height: 1080,
      // ready - read 的运动三次贝塞尔曲线轨迹
      svgPath: 'M146 1762 C0 1 1135 4 1433,97',
      // 背景声音
      backSound: backSound,
      // ready-go 声音
      readyGoSound: readyGoSound,
      // 吊挂的星星
      stars: [
        {
          left: '17%',
          top: -100,
          scale: 0.7
        },
        {
          left: '21%',
          top: -180,
          scale: 0.7
        },
        {
          left: '33%',
          top: -200,
          scale: 1
        },
        {
          left: '40%',
          top: -128,
          scale: 1
        },
        {
          left: '47%',
          top: -220,
          scale: 1
        },
        {
          left: '57%',
          top: -210,
          scale: 1
        },
        {
          left: '66%',
          top: -280,
          scale: 1
        },
        {
          left: '76%',
          top: -150,
          scale: 0.7
        },
        {
          left: '81%',
          top: -280,
          scale: 0.7
        },
        {
          left: '84%',
          top: -200,
          scale: 1
        }
      ],
      // 背景虚化星星
      opaStars: [
        {
          top: '58px',
          scale: 1,
          left: (235 / 1920) * 100
        },
        {
          top: '-25px',
          scale: 1,
          left: (590 / 1920) * 100
        },
        {
          top: '75px',
          scale: 1,
          left: (805 / 1920) * 100
        },
        {
          top: '-30px',
          scale: 1,
          left: (850 / 1920) * 100
        },
        {
          top: '-15px',
          scale: 1,
          left: (1015 / 1920) * 100
        },
        {
          top: '35px',
          scale: 1,
          left: (1190 / 1920) * 100
        },
        {
          top: '-40px',
          scale: 0.5,
          left: (1490 / 1920) * 100
        },
        {
          top: '10px',
          scale: 0.6,
          left: (1675 / 1920) * 100
        }
      ]
    }
  },
  mounted() {
    // 背景音乐
    var backSound = new Howl({
      src: [this.backSound]
    })
    backSound.play()
    // // 延迟播放ready-go音效
    setTimeout(() => {
      var readyGoSound = new Howl({
        src: [this.readyGoSound]
      })
      readyGoSound.play()
    }, 1500)
    let me = this
    this.$store.dispatch('setStarsGameStep', 'ready').then(function() {
      // 实星
      anime({
        targets: '.vertical-circle-stars .vertical',
        height: [330, 360],
        loop: true,
        direction: 'alternate',
        delay: function(target, index) {
          return index * 150
        }
      })
      // 虚星
      anime({
        targets: '.grab-stars i.icon-star',
        delay: 0,
        translateY: {
          value: 50,
          duration: 800
        },
        loop: false,
        scale: function(el, i) {
          switch (i) {
            case 0:
              return 0.8
            case 1:
              return 0.8
            case 2:
              return 0.5
            case 3:
              return 0.5
            case 4:
              return 1
            case 5:
              return 0.5
            case 6:
              return 0.5
            case 7:
              return 0.5
          }
          // return 0.25 * i
        },
        rotate: {
          value: 360,
          duration: 600,
          easing: 'easeInOutSine'
        }
      })
      // ready-go 动画
      let path = anime.path('#motionPath path')
      anime({
        targets: '.ready-read',
        scale: [
          {
            value: 1.5
          },
          {
            value: 1
          }
        ],
        translateX: path('x'),
        translateY: path('y'),
        rotate: path('angle'),
        easing: 'easeInOutSine',
        duration: 850,
        loop: false,
        complete: function() {
          anime({
            targets: '.ready-read',
            translateY: 3,
            translateX: 1140,
            rotate: 0,
            duration: 500
          })
        }
      })
      // y 字动画
      setTimeout(() => {
        anime({
          targets: '.ready-y',
          opacity: 1,
          scale: [
            {
              value: 0.5,
              duration: 200
            },
            {
              value: 1,
              duration: 600
            }
          ],
          complete: function() {
            anime({
              targets: '.go',
              opacity: [
                {
                  value: 1,
                  duration: 650
                }
              ],
              scale: [
                {
                  value: 1.4,
                  duration: 650
                },
                {
                  value: 1,
                  duration: 50
                },
                {
                  value: 1.4,
                  duration: 650
                },
                {
                  value: 1,
                  duration: 50
                },
                {
                  value: 1.4,
                  duration: 650
                },
                {
                  value: 1,
                  duration: 50
                }
              ],
              complete: function() {
                me.$store.dispatch('setStarsGameStep', 'game')
              }
            })
          }
        })
      }, 1100)
      // document.querySelector('.bottom-light').style.width = '' + window.innerHeight + 'px'
      // document.querySelector('.bottom-light').style.height = '' + window.innerHeight + 'px'
      // 灯光效果
      anime({
        targets: '.bottom-light',
        rotate: {
          value: 360,
          duration: 18800,
          easing: 'easeInOutSine'
        },
        loop: true
      })
    })
  },
  computed: {
    ...mapState({
      // 当前进入的步骤，即显示哪个界面
      step: state => state.game.starsGameStep,
      // 当前设定的语音匹配单词
      currWord: state => state.game.currWord
    })
  }
}
</script>

<style>

</style>
