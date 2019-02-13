import 'whatwg-fetch'
import apiConfig from './api.config.mjs'
import globalConfig from '../config'
// import $vue from '../main'
const apiMap = {}

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
if(firstParam !== {}){
  let nameList = Object.keys(firstParam)
  for (let i = 0; i < nameList.length; i++) {
    window.localStorage.setItem(nameList[i], firstParam[nameList[i]])
  }
}


/**
 * 自动生成Api
 * @param {api配置文件} config
 */
function _apiGenerator(_config) {
  let config = apiConfig || _config
  let headers
  if (window.localStorage.getItem('useType') === 'classroom') {
    headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${window.localStorage.getItem('token')}`
    }
  } else {
    headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
  let apiNames = Object.keys(config)
  for (let name of apiNames) {
    let apiRoute = config[name]
    // console.log(`==> generate api ${name}`)
    apiMap[name] = (formData, extra) => {
      // console.log(`==> api url : ${apiRoute.url} \n`)
      // 添加时间戳
      formData = {...formData, ...{t: new Date().getTime()}}

      let url = globalConfig.apiUrl + apiRoute.url
      let params
      // form表单提交
      if (apiRoute.type === 'form') {
        params = Object.assign(apiRoute.params, formData)
        params = _serialize(params)
      } else if (apiRoute.type === 'json') { // JSON格式提交
        params = Object.assign(apiRoute.params, formData)
        // 如果传递上来的参数带有pageNum字段，即为分页数据查询逻辑
        if (params.hasOwnProperty('pageNum')) {
          url += params.pageNum
          delete params.pageNum
        }
        params = JSON.stringify(params, null, 2)
      } else if (apiRoute.type === 'mix') { // 混合模式
        params = Object.assign(apiRoute.params, formData)
        params = _serialize(params)
        url += '?' + params
        params = JSON.stringify({ ...apiRoute.extra, ...extra }, null, 2)
      } else {
        // 如果接口没有任何请求参数，则默认params为空对象
        params = Object.assign(apiRoute.params || {}, formData)
        if (params.hasOwnProperty('pageNum')) {
          url += params.pageNum
          delete params.pageNum
        }
        params = _serialize(params)
        url += '?' + params
        params = null
      }
      // whatwg-fetch
      return fetch(url, {
        method: apiRoute.method,
        body: params,
        // XMLHttpRequest请求头信息配置
        headers: headers,
        credentials: 'include'
      }).then(checkStatus)
    }
  }
}

/**
 * 检查请求状态
 * @param {Ajax Response} response
 */
function checkStatus(response) {
  // 已经超时
  if (response.status === 401) {
    // 未登录
    // return {
    //   code: 401,
    //   msg: '超时'
    // }
    // $vue.$router.push({
    //   name: 'index'
    // })
    return response.json()
  }

  if (response.status >= 200 && response.status < 300) {
    return response.json()
  } else {
    let error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function _serialize(data) {
  let ret = []
  for (let key in data) {
    ret.push(`${key}=${data[key]}`)
  }

  return ret.join('&')
}

_apiGenerator(apiConfig)

export default apiMap
