import * as getters from './getters'

const state = {
  command: '',
  starsGameStep: 'ready',
  currWord: '',
  scoreData: {},
  stepData: {},
  excuted: '',
  rankData: [],
  rankDataAll: [],
  originalRankData: [],
  studentsData: [],
  studentsScoreData: [],
  // 打乱排列后的学生数组
  shuffleStudentData: [],
  // 所有课件资源配置信息
  configData: [],
  // 互动触发类型数据，即触发显示哪个互动
  coursewareEventStartData: {},
  // 触发结束某个互动
  coursewareEventEndData: {},
  // 大富翁当前轮次
  monopolyTurnIndex: 0,
  // 大富翁当前跳至的格子数
  monopolyCurrentIndex: 0,
  // 大富翁游戏上一轮的点数
  monopolyPrevPoint: 0,
  // 大富翁游戏当前轮的点数
  monopolyCurrentPoint: 1,
  // 大富翁兔子的定位X
  rabbitPointX: 0,
  // 大富翁兔子的定位Y
  rabbitPointY: 0,
  // 已经跳过的格子的数组
  jumpedArray: [],
  // 教室ID
  classID: 1,
  // 课程ID
  lessonID: 1,
  // 课件资源ID
  courseID: 1,
  // 课后颁奖的每个数据
  awardData: {},
  // ar场景的数据
  arData: {},
  // 课件加载完成状态
  onloadStatus: false
}

export default{
  state,
  actions: require('./actions').default,
  getters,
  mutations: require('./mutations').default
}
