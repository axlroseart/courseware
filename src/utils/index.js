import os from 'os'

// 时间格式化
export const dateFormat = (time, format) => {
  var t = new Date(time)
  var tf = function(i) { return (i < 10 ? '0' : '') + i }
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear())
      case 'MM':
        return tf(t.getMonth() + 1)
      case 'mm':
        return tf(t.getMinutes())
      case 'dd':
        return tf(t.getDate())
      case 'HH':
        return tf(t.getHours())
      case 'ss':
        return tf(t.getSeconds())
    }
  })
}

export const getNowFormatDate = () => {
  var date = new Date()
  var seperator1 = '-'
  var seperator2 = ':'
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate =
    date.getFullYear() +
    seperator1 +
    month +
    seperator1 +
    strDate +
    ' ' +
    date.getHours() +
    seperator2 +
    date.getMinutes() +
    seperator2 +
    date.getSeconds()
  return currentdate
}

// 计算时间差
export const timeFn = (d1) => {
  var dateBegin = new Date(d1.replace(/-/g, '/'))
  var dateEnd = new Date()
  var dateDiff = dateEnd.getTime() - dateBegin.getTime()
  var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))
  var leave1 = dateDiff % (24 * 3600 * 1000)
  var hours = Math.floor(leave1 / (3600 * 1000))
  var leave2 = leave1 % (3600 * 1000)
  var minutes = Math.floor(leave2 / (60 * 1000))
  var leave3 = leave2 % (60 * 1000)
  var seconds = Math.round(leave3 / 1000)
  console.log('相差 ' + dayDiff + '天 ' + hours + '小时 ' + minutes + ' 分钟' + seconds + ' 秒')
}

// 字符串转为ArrayBuffer对象，参数为字符串
export const str2ab = (str) => {
  var buf = new ArrayBuffer(str.length * 1) // 每个字符占用2个字节
  var bufView = new Uint8Array(buf)
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}

/**
 * JS获取n至m随机整数
 */
export const getRd = (n, m) => {
  var c = m - n + 1
  return Math.floor(Math.random() * c + n)
}

/**
 * 删除数组中某个元素
 */
export const removeElement = (arr, ele) => {
  var result = []
  if (arr instanceof Array) {
    if (ele instanceof Array) {
      result = arr.filter(function(item) {
        var isInEle = ele.some(function(eleItem) {
          return item === eleItem
        })
        return !isInEle
      })
    } else {
      result = arr.filter(function(item) {
        return item !== ele
      })
    }
  } else {
    console.log('parameter error of functionremoveElement')
  }
  return result
}

/**
 * 获取指定范围内无序数组
 * @argument numCount 要生成数组的长度
 * @argument numMin 从此参数开始算
 * @argument numMax 到此参数结尾
 */
export const getRandom = (numCount, numMin, numMax) => {
  var numList = []
  var listLen = numMax - numMin + 1
  var outPut = []
  // 将所有数顺序装填到数字列表中
  for (var i = numMin; i < numMax + 1; i++) {
    numList.push(i)
  }
  var randNum
  for (var j = 0; j < numCount; j++) {
    // 产生一个小于列表长度的随机数randNum
    randNum = Math.floor(Math.random() * listLen)
    // 将列表的第randNum项输出
    outPut.push(numList[randNum])
    // 将列表的最后一项替换到刚被取出的数的位置
    numList[randNum] = numList[listLen - 1]
    // 列表长度减一,即列表最后一项不会再被取到
    listLen--
  }
  return outPut
}

/**
 * 获取本机IPv4地址
 */
export const hostIp = () => {
  var IPv4
  if (process.platform === 'darwin') {
    for (var i = 0; i < os.networkInterfaces().en0.length; i++) {
      if (os.networkInterfaces().en0[i].family === 'IPv4') {
        IPv4 = os.networkInterfaces().en0[i].address
      }
    }
  } else if (process.platform === 'win32') {
    let localhost = os.networkInterfaces()
    let adrArray = []
    for (let index in localhost) {
      adrArray.push(localhost[index][1])
    }
    for (var k = 0; k < adrArray.length; k++) {
      if (adrArray[k].family === 'IPv4' && adrArray[k].address !== '127.0.0.1') {
        IPv4 = adrArray[k].address
      }
    }
  }
  return IPv4
}

/**
 * buffer convert to arraybuffer
 */
export const toArrayBuffer = (buffer) => {
  // 创建一个缓存对象，长度等于buffer.length
  var ab = new ArrayBuffer(buffer.length)
  // 创建一个Uint8类型的数组对象
  var view = new Uint8Array(ab)
  for (var i = 0; i < buffer.length; ++i) {
    // 把buffer的数据拷贝到ab缓存内
    view[i] = buffer[i]
  }
  // 返回新的 ArrayBuffer对象
  return ab
}

/**
 * 动态加载JS文件
 */
export const getJS = (url) => {
  return new Promise(function(resolve, reject) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    if (script.readyState) { // IE
      script.onreadystatechange = function() {
        if (script.readyState === 'loaded' ||
          script.readyState === 'complete') {
          script.onreadystatechange = null
          resolve('success: ' + url)
        }
      }
    } else {
      script.onload = function() {
        resolve('success: ' + url)
      }
    }
    script.onerror = function() {
      reject(Error(url + 'load error!'))
    }
    script.src = url + '?' + 'time=' + Date.parse(new Date())
    document.body.appendChild(script)
  })
}

/**
 * 通用倒计时方法
 */
export const clockCountDown = (interval, self, callback) => {
  // 播放倒计时音效
  self.percentage = 0
  let countDownTimes = 0
  self.countDownClock = setInterval(() => {
    // 第一次为0.不播放声音
    // if (countDownTimes >= 1) {
    //   if (self.countdown_sound) self.countdown_sound.play()
    // }
    if (self.countdown_sound) self.countdown_sound.play()
    // 兔子耳朵倒计时
    if (self.timeAni) {
      var ang = parseInt(countDownTimes / interval * 40)
      var index = Math.round(ang)
      if(!isNaN(index)) self.timeAni.gotoAndStop(index)
    }
    if (countDownTimes >= interval) {
      clearInterval(self.countDownClock)
      if (callback) {
        callback()
      }
    } else {
      if (self.percentage === 100) {
        self.percentage = 100
        clearInterval(self.countDownClock)
        if (callback) {
          callback()
        }
        return
      }
      self.percentage = self.percentage + 10 * (10 / interval)
      countDownTimes++
    }
  }, 1000)
}

/**
 ** 获取数据状态处理
 ** @param {object} data
 * */
export const checkData = (data) => {
  return new Promise((resolve, reject) => {
    if (typeof data !== 'undefined') {
      if (data.code === 200 || data.code === 0) {
        resolve(data)
      } else {
        reject(data)
      }
    }
  })
}

/**
 * 随机打乱数组内元素算法
 */
export const shuffle = (arr) => {
  return arr.sort(() => Math.random() > 0.5)
}

/**
 * 生成序列动画的工具函数
 */
export const preloadImage = (names, cb) => {
  window.gkaCache = window.gkaCache || [];
  var n = 0,img,imgs = {};
  names.forEach(function(name) {
    img = new Image();
    window.gkaCache.push(img);
    img.onload = (function(name, img) {
      return function() {
        imgs[name] = img;
        (++n === names.length) && cb && cb(imgs);
      }
    })(name, img);
    img.src = name;
  });
}

/**
 * 多张图片加载，带回调
 */
export const loadImages = (sources, callback) => {
  let promiseAll = [], img = [], imgTotal = sources.length
  for(let i = 0 ; i < imgTotal ; i++){
    promiseAll[i] = new Promise((resolve)=>{
      img[i] = new Image()
      img[i].src = sources[i]
      img[i].onload = function(){
        //第i张加载完成
        resolve(img[i])
      }
    })
  }
  Promise.all(promiseAll).then((img)=>{
    //全部加载完成
    callback(img)
  })
} 

/**
 * 导入所有图片文件
 */
export const importAll = (r) => {
  return r.keys().map(r)
}

//获取cookie
export function getCookie(name) {
  //获取name在Cookie中起止位置
  var start = document.cookie.indexOf(name + '=')
  if ( start != -1 ) {
    start = start + name.length + 1
    //获取value的终止位置
    var end = document.cookie.indexOf(";", start)
    if ( end == -1 )
        end = document.cookie.length
    //截获cookie的value值,并返回
    return unescape(document.cookie.substring(start,end))
  }
  return ''
}

//设置cookie,增加到vue实例方便全局调用
export function setCookie(c_name, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

//删除cookie
export function delCookie(name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null)
   document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()
}