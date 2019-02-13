/**
 * 获取体感数据的词组信息
 * @param {*}
 */
export const getBodySenseWords = state => {
  // 返回数组第二位，即happy,fine
  return state.command.split(':')[1].split(',')
}
/**
 * 获取具体的Hirender事件指令
 * @param {*}
 */
export const getHirenderEvent = state => {
  return state.command.split(':')[0]
}
/**
 * 获取体感选择的正确答案
 */
export const getAnswer = state => {
  return state.command.split(':')[2]
}
/**
 * 获取看词读音的单词
 * @param {*}
 */
export const getReadWords = state => {
  // 返回数组第二位，即happy,fine
  return state.command.split(':')[1]
}
/**
 * 体感选择 - 执行事件
 */
export const getBodySenseCommand = state => {
  return state.command.split(':')[3]
}
/**
 * 体感选择 - 标题内容
 */
export const getBodySenseTitle = state => {
  return state.command.split(':')[4]
}
/**
 * 获取重新填充默认学生数据之后的学生数据
 */
export const getFinalStudentsData = state => {
  let data = state.rankDataAll
  let dataArr = []
  if (data.length < 14) {
    for (let i = 0; i < 14 - data.length; i++) {
      dataArr.push({
        rank: i + data.length,
        name: 'default',
        avatar_url: '',
        stars: 0
      })
    }
  }
  return state.rankDataAll.concat(dataArr)
}
/**
 * 学生数据处理
 */
// export const getOneClassFullStudentData = state => {
//   let studentData = this.shuffle(state.studentData)
//   console.log(studentData)
// }
/**
 * 各个类型的互动的配置信息分发
 * @getBodyChoiceDefault 默认体感选择
 * @getBodyChoiceFerriswheel
 * @getBodyFollowSnatchstar 体感抢星星
 * @getPronunciationAllBubble 海底泡泡
 * @getPronunciationSingleRoulette 大转盘
 * @getPronunciationGroupRunning 分组语音跑圈pk
 * @getDubGroupDefault 分组配音pk
 * @getMonopoly 大富翁
 */
export const getBodyChoiceDefault = state => {
  let configData = state.configData
  for (let i = 0; i < configData.length; i++) {
    const element = configData[i]
    if (element.template.name === 'body_choice_default') {
      return element.template
    }
  }
}
export const getBodyChoiceFerriswheel = state => {
  let configData = state.configData
  for (let i = 0; i < configData.length; i++) {
    const element = configData[i]
    if (element.template.name === 'body_choice_ferriswheel') {
      return element.template
    }
  }
}
export const getBodyFollowSnatchstar = state => {
  let configData = state.configData
  for (let i = 0; i < configData.length; i++) {
    const element = configData[i]
    if (element.template.name === 'body_follow_snatchstar') {
      return element.template
    }
  }
}
export const getPronunciationAllBubble = state => {
  let configData = state.configData
  for (let i = 0; i < configData.length; i++) {
    const element = configData[i]
    if (element.template.name === 'pronunciation_all_bubble') {
      return element.template
    }
  }
}
export const getPronunciationSingleRoulette = state => {
  let configData = state.configData
  for (let i = 0; i < configData.length; i++) {
    const element = configData[i]
    if (element.template.name === 'pronunciation_single_roulette') {
      return element.template
    }
  }
}
export const getPronunciationGroupRunning = state => {
  let configData = state.configData
  for (let i = 0; i < configData.length; i++) {
    const element = configData[i]
    if (element.template.name === 'pronunciation_group_running') {
      return element.template
    }
  }
}
export const getDubGroupDefault = state => {
  let configData = state.configData
  for (let i = 0; i < configData.length; i++) {
    const element = configData[i]
    if (element.template.name === 'dub_group_default') {
      return element.template
    }
  }
}
export const getKaraokDefault = state => {
  let configData = state.configData
  for (let i = 0; i < configData.length; i++) {
    const element = configData[i]
    if (element.template.name === 'karaoke_default') {
      return element.template
    }
  }
}
export const getMonopoly = state => {
  let configData = state.configData
  for (let i = 0; i < configData.length; i++) {
    const element = configData[i]
    if (element.template.name === 'monopoly') {
      return element.template
    }
  }
}
