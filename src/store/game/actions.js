import Api from '../../api'
import { checkData as _checkData } from '../../utils'

let actions = {
  handler: () => {}
}
/**
 * commit工厂函数
 * 根据api.config.mjs导出的模型生成各业务逻辑API处理方法
 * mutation函数名和api名字一致
 * @param {*} ApiMap
 */
function _factory(ApiMap) {
  for (let api in ApiMap) {
    // 遍历生成各个业务数据逻辑的actions
    actions[api] = ({commit}, params) => {
      return Api[api](params).then(data => {
        return _checkData(data).then(data => {
          commit(api, { ...data, ...params })
          return data
        }).catch(data => {
          commit(api, { ...data, ...params })
          return data
        })
      }).catch(err => {
        // 网络问题
        console.log('Network error ' + err.message)
      })
    }
  }
}

// common api
_factory(Api)

// 获取用户登录状态
export const fetchUserLoginStatus = ({ commit }, data) => {
  commit('USER_LOGIN_STATUS', data)
}

/**
 * 获取当前课堂信息
 */
export const fetchCurrClassData = ({ commit }, data) => {
  commit('CURR_CLASS_DATA', data)
}

/**
 * 设置是否开启按钮提醒
 */
export const setIsTimeToAlert = ({commit}, data) => {
  commit('IS_TIME_TO_ALERT', data)
}

/**
 * 设置websocket监听到的数据
 * @param {*} param0
 * @param {*} data
 */
export const setWebsocket = ({commit}, data) => {
  commit('SET_WEBSOCKET', data)
}

export const setToken = ({commit}, data) => {
  commit('SET_TOKEN', data)
}

export const setStarsGameStep = ({commit}, data) => {
  commit('STARS_GAME_STEP', data)
}

export const setCurrGameWord = ({commit}, data) => {
  commit('CURR_GAME_WORD', data)
}

export const resetUserCommand = ({commit}, data) => {
  commit('GET_USER_COMMANDS', data)
}

export const fetchUserScoreData = ({commit}, data) => {
  commit('USER_SCORE_DATA', data)
}
export const fetchNextStep = ({commit}, data) => {
  commit('USER_STEP_DATA', data)
}

// 体感抢星星获取14个学生得头像和名字
export const editStudentData = ({commit}, data) => {
  return new Promise((resolve) => {
    commit('SHUFFLE_STUDENT_DATA', data)
    resolve(data)
  })
}
// 设置排行榜数据
export const setRankData = ({commit}, data) => {
  commit('GET_RANK_DATA', data)
}

// 将要触发的互动课件的相关数据
export const fetchCoursewareEventStartData = ({commit}, data) => {
  commit('COURSEWARE_EVENT_START_DATA', data)
}
// 课后颁奖的每个数据 awardID：1， 2，3
export const fetchAwardData = ({commit}, data) => {
  commit('TETCH_AWARD_DATA', data)
}
// ar场景的切换
export const changeAr = ({commit}, data) => {
  commit('CHANGE_AR', data)
}

// 将要结束的互动课件的相关数据
export const fetchCoursewareEventEndData = ({commit}, data) => {
  commit('COURSEWARE_EVENT_END_DATA', data)
}

export const setExcutedCommand = ({commit}, data) => {
  commit('GET_EXCUTED_COMMAND', data)
}

// 大富翁当前轮次设置
export const setMonoTurnIndex = ({commit}, data) => {
  commit('MONOPOLY_TURN_INDEX', data)
}

// 大富翁当前跳至的格子数设置
export const setMonoCurrentIndex = ({commit}, data) => {
  commit('MONOPOLY_CURRENT_INDEX', data)
}

// 大富翁当前轮次设置
export const setMonoPrevPoint = ({commit}, data) => {
  commit('MONOPOLY_PREV_POINT', data)
}

// 大富翁当前跳至的格子数设置
export const setMonoCurrentPoint = ({commit}, data) => {
  commit('MONOPOLY_CURRENT_POINT', data)
}

// 大富翁兔子位置x
export const setRabbitX = ({commit}, data) => {
  commit('RABBIT_X', data)
}

// 大富翁兔子位置y
export const setRabbitY = ({commit}, data) => {
  commit('RABBIT_Y', data)
}

// 保存大富翁跳过的格子
export const setMonoJumpedArray = ({commit}, data) => {
  commit('MONO_JUMPED_ARR', data)
}

// 更新学生数据
export const fetchStudentsScoreData = ({commit}, data) => {
  commit('UPDATE_STUDENTS_SCORE_DATA', data)
}

// 获取class id
export const fetchClassId = ({commit}, data) => {
  commit('CLASS_ID', Number(data))
}

// 获取 lesson id
export const fetchLessonId = ({commit}, data) => {
  commit('LESSON_ID', Number(data))
}

// 获取 course id
export const fetchCourseId = ({commit}, data) => {
  commit('COURSE_ID', Number(data))
}

export const setCoursewareConfigData = ({commit}, data) => {
  commit('COURSEWARE_CONFIG_DATA', data)
}

export const setOriginalRankAllData = ({commit}, data) => {
  commit('ORIGINAL_RANK_DATA', data)
}
export const setOnloadStatus = ({commit}, data) => {
  return new Promise((resolve) => {
    commit('SET_ONLOADSTATUS', data)
    resolve()
  })
}


export default {
  ...actions,
  fetchUserLoginStatus,
  fetchCurrClassData,
  setIsTimeToAlert,
  setWebsocket,
  editStudentData,
  setRankData,
  setExcutedCommand,
  setToken,
  fetchUserScoreData,
  setCurrGameWord,
  setCoursewareConfigData,
  setStarsGameStep,
  fetchCoursewareEventStartData,
  fetchCoursewareEventEndData,
  resetUserCommand,
  fetchNextStep,
  setMonoTurnIndex,
  setMonoCurrentIndex,
  setMonoPrevPoint,
  setMonoCurrentPoint,
  setRabbitX,
  setRabbitY,
  setMonoJumpedArray,
  fetchStudentsScoreData,
  fetchClassId,
  fetchLessonId,
  fetchCourseId,
  setOriginalRankAllData,
  fetchAwardData,
  changeAr,
  setOnloadStatus
}
