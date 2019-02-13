/**
 * config.js
 * 服务配置项
 * 以及属性、关键字配置等
 * ...
 */

// 根据获取到的useType动态拼接API和Socket地址
let useType = window.localStorage.getItem('useType')
let api_variable = useType === 'CMS' ? 'simulation/' : ''
let socket_variable = useType === 'CMS' ? 'simulation' : 'sub'

function getParams(_url) {
  var urlParameters = _url
  //声明并初始化接收请求参数的对象
  var requestParameters = new Object()
  //如果该求青中有请求的参数，则获取请求的参数，否则打印提示此请求没有请求的参数
  if (urlParameters.indexOf('?') != -1){
    //获取请求参数的字符串
    var parameters = decodeURI(urlParameters.substr(urlParameters.lastIndexOf('?') + 1))
    parameters = parameters.replace(/#/, '').replace('/', '')
    //将请求的参数以&分割中字符串数组
    var parameterArray = parameters.split('&')
    //循环遍历，将请求的参数封装到请求参数的对象之中
    for (var i = 0; i < parameterArray.length; i++) {
      requestParameters[parameterArray[i].split('=')[0]] = (parameterArray[i].split('=')[1])
    }
  }
  return requestParameters
}
var firstParam = getParams(window.location.href)
console.log('firstParam', firstParam)
let socketUrl = firstParam.socketUrl
let socketPort = firstParam.socketPort
let api_url
if (process.env.NODE_ENV === 'development') { // 开发环境api地址
  api_url = ''
} else { // 非开发环境，用socket地址拼接成api地址
  api_url = 'http://' + firstParam.socketUrl
}
if (!socketUrl) { // 默认值
  console.log('互动api地址使用默认值')
  socketUrl = '192.168.30.3'
  socketPort = '80'
  api_url = 'http://192.168.30.3:80'
}
console.log('socketUrl=================>', socketUrl)
console.log('socketPort=================>', socketPort)
console.log('api_url=================>', api_url)

const globalConfig = {
  // 测试用课程ID
  testLessonId: 1,
  // 测试用课堂ID
  testClassId: 1,
  // 测试用课件ID
  testCourseId: 1,
  // socket地址
  socketUrl: socketUrl,
  // socket端口
  socketPort: socketPort,
  // API拼接常量
  apivar: api_variable,
  // Socket地址拼接常量
  socketvar: socket_variable,
  // 接口地址指定
  apiUrl: api_url,
  // 测试环境socket地址
  testScocketUrl: '',
  // 开发环境socket地址
  proSocketUrl: '',
  // 测试用token
  token_test: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXIiOiJodHRwOi8vMTkyLjE2OC4zMC4zL2F2YXRhci9jbGFzc3Jvb20ucG5nIiwiY2lkIjo1LCJjbGFzc0lEIjowLCJleHAiOjE1NDcwMDEyMzgsImlkIjo1LCJuYW1lIjoiY2xhc3Nyb29tIiwib3JpZ19pYXQiOjE1NDQ0MDkyMzgsInJvbGUiOjMsInNleCI6MX0.gk6TQJnJB6H0gKhTGUWhHLLFjS5rtLc15XJpKifCoQc',
  // 测试用mtoken,
  mtoken_test: '44d7db7fe53a8d1bb8ad2eaab5d88910ee9a132e',
  // 默认教师ID
  teacherId: 5,
  // 默认角色ID
  role: 3
}

export default globalConfig
