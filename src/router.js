import Vue from 'vue'
import Router from 'vue-router'
// import index from '@/games/index'
// import robStars from '@/games/bodyRobStars'
// import seaBubble from '@/games/seaBubble'
// import roulette from '@/games/roulette'
// import pkSay from '@/games/pkSay'
// import allRank from '@/games/allRank'
// import audioPk from '@/games/audioPk'
// import karaok from '@/games/karaok'
// import bodyChoose from '@/games/bodyChoose'
// import bodyJudge from '@/games/bodyJudge'
// import monopoly from '@/games/monopoly'
// import arCosplay from '@/games/arCosplay'
// import ar from '@/games/ar'
// import readyNow from '@/games/readyNow.vue'
// import rank from '@/games/rank'
// import hotBalloon from '@/games/hotBalloon'
// import snowTest from '@/games/snowTestFishing'
// import smallHorn from '@/games/smallHorn'
// import select from '@/games/select'
// import faceu from '@/games/faceu'
// import summary_award from '@/games/classEndAward'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: (resolve) => require(['@/games/select'], resolve)
    },
    {
      path: '/select',
      name: 'select',
      // component: select
      component: (resolve) => require(['@/games/select'], resolve)
    },
    {
      path: '/robStars',
      name: 'body_follow_snatchstar',
      component: (resolve) => require(['@/games/bodyRobStars'], resolve)
      // component: robStars
    },
    {
      path: '/seaBubble',
      name: 'pronunciation_all_bubble',
      component: (resolve) => require(['@/games/seaBubble'], resolve)
      // component: seaBubble
    },
    {
      path: '/roulette',
      name: 'pronunciation_single_roulette',
      component: (resolve) => require(['@/games/roulette'], resolve)
      // component: roulette
    },
    {
      path: '/pkSay',
      name: 'dub_group_default',
      component: (resolve) => require(['@/games/pkSay'], resolve)
      // component: pkSay
    },
    {
      path: '/allRank',
      name: 'final_ranking',
      component: (resolve) => require(['@/games/allRank'], resolve)
      // component: allRank
    },
    {
      path: '/audioPk',
      name: 'pronunciation_group_running',
      component: (resolve) => require(['@/games/audioPk'], resolve)
      // component: audioPk
    },
    {
      path: '/karaok',
      name: 'karaoke_default',
      component: (resolve) => require(['@/games/karaok'], resolve)
      // component: karaok
    },
    {
      path: '/bodyChoose',
      name: 'body_choice_default',
      component: (resolve) => require(['@/games/bodyChoose'], resolve)
      // component: bodyChoose
    },
    {
      path: '/bodyChooseAudio',
      name: 'pronunciation_choice',
      component: (resolve) => require(['@/games/bodyChooseAudio'], resolve)
      // component: bodyChoose
    },
    {
      path: '/bodyJudge',
      name: 'body_judge_default',
      component: (resolve) => require(['@/games/bodyJudge'], resolve)
      // component: bodyJudge
    },
    {
      path: '/monopoly',
      name: 'monopoly',
      component: (resolve) => require(['@/games/monopoly'], resolve)
      // component: monopoly
    },
    {
      path: '/arCosplay',
      name: 'roleplay_vr',
      component: (resolve) => require(['@/games/arCosplay'], resolve)
      // component: arCosplay
    },
    {
      path: '/ar',
      name: 'afr_common',
      component: (resolve) => require(['@/games/ar'], resolve)
      // component: ar
    },
    {
      path: '/ar',
      name: 'ar_common',
      component: (resolve) => require(['@/games/ar'], resolve)
      // component: ar
    },
    {
      path: '/arMany',
      name: 'ar_multi_scene',
      component: (resolve) => require(['@/games/arMany'], resolve)
    },
    {
      path: '/ar',
      name: 'ar_video',
      component: (resolve) => require(['@/games/ar'], resolve)
      // component: ar
    },
    {
      path: '/readyNow',
      name: 'readyNow',
      component: (resolve) => require(['@/games/readyNow'], resolve)
      // component: readyNow
    },
    {
      path: '/rank',
      name: 'rank',
      component: (resolve) => require(['@/games/rank'], resolve)
      // component: rank
    },
    {
      path: '/hotBalloon',
      name: 'pronunciation_all_multi_balloon',
      component: (resolve) => require(['@/games/hotBalloon'], resolve)
      // component: hotBalloon
    },
    {
      path: '/snowTestFishing',
      name: 'snow_test_fishing',
      component: (resolve) => require(['@/games/snowTestFishing'], resolve)
      // component: snowTest
    },
    {
      path: '/smallHorn',
      name: 'pronunciation_all_practice',
      component: (resolve) => require(['@/games/smallHorn'], resolve)
      // component: smallHorn
    },
    {
      path: '/faceu',
      name: 'facedectect_snatchstar',
      component: (resolve) => require(['@/games/faceu'], resolve)
      // component: faceu
    },
    {
      path: '/summary_award',
      name: 'summary_award',
      component: (resolve) => require(['@/games/classEndAward'], resolve)
      // component: summary_award
    }
  ]
})
