/**
 * API业务参数对象，属性名对应mutations
 * url: 接口地址
 * method: 请求类型
 * type: json（参数为json格式对象）, form（参数为form表单对象）, url（参数为字符串拼接）, mix（参数为混合型数据结构）
 * params: 默认请求参数对象
 * extra: 混合模式下的参数类型
 */
import globalConfig from '../config'

const apiConfig = {
  // 获取用户个人信息
  fetchUserInfo: {
    url: '/v1/' + globalConfig.apivar + 'user/profile',
    method: 'GET'
  },
  // 开始上课请求
  startStreaming: {
    url: '/v1/' + globalConfig.apivar + 'lesson/start',
    method: 'POST',
    type: 'url',
    params: {
      lesson: 0
    }
  },
  // 获取服务器时间，精确到毫秒
  fetchServerTime: {
    url: '/v1/' + globalConfig.apivar + 'lesson/timestamp',
    method: 'GET'
  },
  // 当前课堂学生数据
  fetchStudentData: {
    url: '/v1/' + globalConfig.apivar + 'lesson/student',
    method: 'GET',
    type: 'url',
    params: {
      classID: 1,
      lessonID: 221
    }
  },
  // 大转盘抽出的学生数据
  pickStudent: {
    url: '/v1/' + globalConfig.apivar + 'interaction/pronunciation/single/pickstudent',
    method: 'POST',
    type: 'json',
    params: {
      classID: 1,
      lessonID: 221,
      interactionID: 1
    }
  },
  // 课件配置数据
  fetchCoursewareConfigData: {
    url: '/v1/' + globalConfig.apivar + 'courses/config',
    method: 'GET',
    type: 'url',
    params: {
      courseID: 1
    }
  },
  // 角色语音pk 结果数据
  fetchRolePlayRankData: {
    url: '/v1/' + globalConfig.apivar + 'interaction/roleplay/group/result',
    method: 'GET',
    type: 'url',
    params: {
      lessonID: 1,
      classID: 1,
      interactionID: 1
    }
  },
  // 开启一个互动
  startInteraction: {
    url: '/v1/' + globalConfig.apivar + 'interaction/start',
    method: 'POST',
    type: 'json',
    params: {
      lessonID: 1,
      interactionID: 1,
      classID: 1,
      taskID: 1,
      type: 1,
      configID: 1,
      config: ''
    }
  },
  // 查询课程配置
  fetchConfigData: {
    url: '/v1/' + globalConfig.apivar + 'courses/config',
    method: 'GET',
    type: 'url',
    params: {
    }
  },
  // 开始一个互动
  interactionStart: {
    url: '/v1/' + globalConfig.apivar + 'interaction/start',
    method: 'POST',
    type: 'json',
    params: {
    }
  },
  // 请求平均分
  fetchAveragescore: {
    url: '/v1/' + globalConfig.apivar + 'interaction/pronunciation/group/averagescore',
    method: 'GET',
    type: 'url',
    params: {
    }
  },
  // 请求总榜
  fetchlessonResult: {
    url: '/v1/' + globalConfig.apivar + 'lesson/student/star',
    method: 'GET',
    type: 'url',
    params: {
    }
  },
  // 单个互动排行榜
  fetchRanking: {
    url: '/v1/' + globalConfig.apivar + 'interaction/rankinglist',
    method: 'GET',
    type: 'url',
    params: {
    }
  },
  fetchGroupResult: {
    url: '/v1/' + globalConfig.apivar + 'interaction/pronunciation/group/result',
    method: 'GET',
    type: 'url',
    params: {
    }
  },
  // 角色扮演(VR)-获取当前赞数
  fetchArZan: {
    url: '/v1/' + globalConfig.apivar + 'interaction/roleplay/vr/result',
    method: 'GET',
    type: 'url',
    params: {
    }
  },
  // 发起开启某个独立互动
  coursewareStart: {
    url: '/v1/' + globalConfig.apivar + 'interaction/start/notify',
    method: 'POST',
    type: 'json',
    params: {
      lessonID: 0,
      interactionID: 0,
      classID: 0,
      config: {}
    }
  },
  // 发起向互动课件进行实时数据传递的请求
  coursewareEnd: {
    url: '/v1/' + globalConfig.apivar + 'interaction/finish/notify',
    method: 'POST',
    type: 'json',
    params: {
      lessonID: 0,
      interactionID: 0,
      classID: 0
    }
  },
  // 大富翁积分获取
  monopolyGetScore: {
    url: '/v1/' + globalConfig.apivar + 'interaction/monopoly/star',
    method: 'GET',
    type: 'url',
    params: {
      lessonID: 0,
      interactionID: 0,
      classID: 0
    }
  },
  // 大富翁加减分
  monopolyUpdateScore: {
    url: '/v1/' + globalConfig.apivar + 'interaction/monopoly/star',
    method: 'POST',
    type: 'json',
    params: {
      lessonID: 0,
      interactionID: 0,
      classID: 0,
      changeValue: 0
    }
  },
  // 整节课计分
  wholeLessonScore: {
    url: '/v1/' + globalConfig.apivar + 'interaction/rankinglist/update',
    method: 'POST',
    type: 'json',
    params: {
      lessonID: 0,
      classID: 0,
      updates: [
        {
          studentID: 1,
          changeValue: 0
        }
      ]
    }
  },
  // 更新学生积分V2(带人脸识别签到功能)
  updateStudentsStar: {
    url: '/v1/' + globalConfig.apivar + 'lesson/student/starv2',
    method: 'POST',
    type: 'json',
    params: {
      lessonID: 1,                //类型：Number  必有字段  备注：课程ID
      classID: 1,                //类型：Number  必有字段  备注：班级ID
      interactionID: 1,                //类型：Number  必有字段  备注：互动ID
      first: true,                //类型：Boolean  必有字段  备注：是否为本节课的第一个互动
      updates: {                //类型：Object  必有字段  备注：无
        studentID: 1,                //类型：Number  必有字段  备注：学生ID
        changeValue: 'mock'                //类型：String  必有字段  备注：加星数
      }
    }
  }
}

export default apiConfig
