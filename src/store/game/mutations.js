const mutations = {
  STARS_GAME_STEP(state, data) {
    state.starsGameStep = data
  },
  CURR_GAME_WORD(state, data) {
    state.currWord = data
  },
  USER_SCORE_DATA(state, data) {
    state.scoreData = data
  },
  USER_STEP_DATA(state, data) {
    state.stepData = data
  },
  SHUFFLE_STUDENT_DATA(state, data) {
    state.shuffleStudentData = data
  },
  GET_USER_COMMANDS(state, data) {
    state.command = data
  },
  GET_EXCUTED_COMMAND(state, data) {
    state.excuted = data
  },
  // 排行榜数据
  GET_RANK_DATA(state, data) {
    state.rankData = data
  },
  'fetchStudentData'(state, data) {
    data = data.data.students
    for (let index = 0; index < data.length; index++) {
      const element = data[index]
      if (element.online) {
        state.studentsData.push(element)
      }
    }
    // state.studentsData = data.data.students
  },
  'fetchConfigData'(state, data) {
    state.configData = data.data.interactions
  },
  // 单个互动排行
  ['fetchRanking'](state, data) {
    state.rankData = data.data || []
  },
  // 排行总榜
  ['fetchlessonResult'](state, data) {
    state.rankDataAll = data.data || []
  },
  COURSEWARE_CONFIG_DATA(state, data) {
    state.configData = data
  },
  COURSEWARE_EVENT_START_DATA(state, data) {
    state.coursewareEventStartData = data
  },
  TETCH_AWARD_DATA(state, data) {
    state.awardData = data
  },
  CHANGE_AR(state, data) {
    state.arData = data
  },
  COURSEWARE_EVENT_END_DATA(state, data) {
    state.coursewareEventEndData = data
  },
  MONOPOLY_TURN_INDEX(state, data) {
    state.monopolyTurnIndex = data
  },
  MONOPOLY_CURRENT_INDEX(state, data) {
    state.monopolyCurrentIndex = data
  },
  MONOPOLY_PREV_POINT(state, data) {
    state.monopolyPrevPoint = data
  },
  MONOPOLY_CURRENT_POINT(state, data) {
    state.monopolyCurrentPoint = data
  },
  RABBIT_X(state, data) {
    state.rabbitPointX = data
  },
  RABBIT_Y(state, data) {
    state.rabbitPointY = data
  },
  MONO_JUMPED_ARR(state, data) {
    state.jumpedArray.push(data)
  },
  UPDATE_STUDENTS_SCORE_DATA(state, data) {
    state.studentsScoreData = data
  },
  CLASS_ID(state, data) {
    state.classID = data
  },
  LESSON_ID(state, data) {
    state.lessonID = data
  },
  COURSE_ID(state, data) {
    state.courseID = data
  },
  ORIGINAL_RANK_DATA(state, data) {
    state.originalRankData = data
  },
  SET_ONLOADSTATUS(state, data) {
    state.onloadStatus = data
  }
}

export default mutations
