/**
 * WebSocket SDK
 * 建立websocket连接
 * 数据编解码
 * 心跳机制（每隔30秒递增发送一次心跳请求，连接关闭后会在15s内递增重连，尝试10次后放弃）
 * Ryan
 * 2018年7月2日 19:46:33
 */
import protobuf from 'protobufjs'
import globalConfig from '../config'

const _socketUrl = globalConfig.socketUrl
const _socketPort = globalConfig.socketPort

/**
 *
 * @param {*params 身份验证} params
 * @param {*socket 服务地址} socketUrl
 * @param {*socket 服务端口} socketPort
 * @param {*socket 数据回调} callback
 */
const ICSocket = function(params, callback, socketUrl, socketPort) {
  // 心跳间隔（秒）
  this.interval = 1
  // 最大连接次数
  this.maxConnectTimes = 10
  // 重连时间
  this.delay = 3
  // 请求头信息总长
  this.rawHeaderLen = 14
  // 总消息偏移量
  this.packetOffset = 0
  // 消息头偏移量
  this.headerOffset = 4
  // 操作类型偏移量
  this.opOffset = 6
  // 消息序号偏移量
  this.seqOffset = 10
  // 消息名长度的长度
  this.headLen = 2
  // socket对象
  this.params = params
  // 退出flag
  this.quit = false
  this.heartbeatInterval = null
  // socket server 配置
  this.socketUrl = socketUrl || _socketUrl
  this.socketPort = socketPort || _socketPort
  this.url = 'ws://' + this.socketUrl + ':' + this.socketPort + '/' + globalConfig.socketvar + ''

  this.callback = callback
  this.textEncoder = new TextEncoder()

  this.init(this.maxConnectTimes)
}

ICSocket.prototype.heartbeat = function(webskt) {
  // 心跳请求，只需要发送请求头，不包含消息体
  let headerBuf = new ArrayBuffer(this.rawHeaderLen)
  let headerView = new DataView(headerBuf, 0)
  headerView.setInt32(this.packetOffset, this.rawHeaderLen)
  headerView.setInt16(this.headerOffset, this.rawHeaderLen)
  headerView.setInt32(this.opOffset, 1)
  headerView.setInt32(this.seqOffset, 1)
  // 检测到连接状态为关闭时后终止心跳
  if (webskt.readyState === 3) {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval)
    return
  }
  webskt.send(headerBuf)
  console.log('======> ICSocket send: heartbeat')
}

// 整个缓冲区包括请求头和消息体
ICSocket.prototype.auth = function(params, webskt) {
  // 将Token转化为缓冲区数据
  // let bodyBuf = this.textEncoder.encode(token)
  // 将需要传递的参数，转化为缓冲区数据
  let query = 'messagepb.loginInformation'
  let url = 'protos/message.proto'
  this.encode(query, url, params, 3, webskt)
}

// 合并缓冲区数据方法
ICSocket.prototype.mergeArrayBuffer = function(ab1, ab2) {
  let u81 = new Uint8Array(ab1)
  let u82 = new Uint8Array(ab2)
  let res = new Uint8Array(ab1.byteLength + ab2.byteLength)
  res.set(u81, 0)
  res.set(u82, ab1.byteLength)
  return res
}

// ICSocket初始化，新建WebSocket连接
ICSocket.prototype.init = function(max) {
  let self = this
  console.log('======> socket init...')
  if (max === 0) {
    return
  }
  let webskt = new WebSocket(this.url)
  self.webskt = webskt
  webskt.binaryType = 'arraybuffer'
  webskt.onopen = () => {
    console.log('======> socket on open.')
    // 第一次连接，身份验证
    this.auth(this.params, webskt)
  }

  webskt.onmessage = function(evt) {
    let data = evt.data
    let dataView = new DataView(data, 0)
    let realData = []
    // 解析服务器返回的数据
    // 返回的消息体总长度
    let packetLen = dataView.getInt32(self.packetOffset)
    // 请求头信息总长度
    let headerLen = dataView.getInt16(self.headerOffset)
    // 操作类型
    let op = dataView.getInt32(self.opOffset)
    // 消息序号
    let seq = dataView.getInt32(self.seqOffset)
    console.log('======> Websocket receiveHeader: packetLen=' + packetLen, 'headerLen=' + headerLen, 'op=' + op, 'seq=' + seq)

    let msgName = ''
    let protoUrl = ''
    let msgNameLen
    switch (op) {
      case 4:
        // 心跳请求
        self.heartbeat(webskt)
        self.heartbeatInterval = setInterval(function() {
          self.heartbeat(webskt)
        }, self.interval * 1000)
        break
      case 2:
        // 心跳回复
        console.log('======> ICSocket receive: heartbeat')
        break
      case 5:
        // 待解析的数据体
        // 消息名数据长度
        // console.log('msgNameLen: ', msgNameLen)
        msgNameLen = dataView.getUint16(self.rawHeaderLen)
        // 遍历包arraybuffer区间，拼接字符串，最终得到massage name
        for (let index = 0; index < msgNameLen; index++) {
          msgName = msgName + String.fromCharCode(dataView.getUint8(index + self.rawHeaderLen + self.headLen))
        }
        // 填充真实数据
        // 真实数据长度为：消息体总长 - 请求头长度 - 消息名长度的长度 - 消息名长度
        for (let k = 0; k < packetLen - headerLen - self.headLen - msgNameLen; k++) {
          // 真实数据的偏移量（查找下标）为：请求头长度 + 消息名长度的长度 + 消息名长度 + K
          realData.push(dataView.getUint8(self.rawHeaderLen + self.headLen + msgNameLen + k))
        }
        realData = Buffer.from(realData)
        // 载入.proto文件并查找对应的message name
        if (msgName.split('.')[0] === 'lessonpb') {
          protoUrl = 'protos/lesson.proto'
        } else {
          protoUrl = 'protos/interaction.proto'
          // protoUrl = `${path.join(__dirname, '../../../protos/interaction.proto')}`
        }
        self.loadpb(protoUrl).then(function(res) {
          let resInfo = res.lookup(msgName)
          // 解码，得到最终数据
          realData = resInfo.decode(realData)
          console.log('======> op = 5, data:', realData)
          if (self.callback) {
            self.callback({
              realData: realData,
              protoName: msgName.split('.')[1]
            })
          }
        })
        break
    }
  }

  webskt.onclose = function(e) {
    console.log(`!!!!!! websocket closed: !!!!!! 错误code：${e.code} 错误原因：${e.reason} 是否正常关闭：${e.wasClean}`)
    // console.log('======> self.quit:', self.quit)
    // console.log('======> global.icsocket.webskt.quit:', global.icsocket.quit)
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval)
    if (!self.quit) {
      setTimeout(function() {
        console.log('======> >>>>>> ready to reconnect <<<<<<')
        self.init(--max)
      }, self.delay * 1000)
    }
  }

  // 异常
  webskt.onerror = function(event) {
    console.log('!!!!!! websocket error !!!!!!', event)
  }
}

// proto文件查找，解析方法
ICSocket.prototype.loadpb = (url) => {
  let root = new protobuf.Root()
  return new Promise((resolve) => {
    root.load(url, { keepCase: true }).then((root) => {
      resolve(root)
    })
  })
}

// 编码过程
ICSocket.prototype.encode = function(query, url, params, reqType, webskt) {
  // config 参数要转字符串
  if (params.config) {
    params.config = JSON.stringify(params.config)
  }
  let self = this
  // ------------------- 缓冲区建立 -------------------
  // 建立长度为14的header缓冲区
  let headerBuf = new ArrayBuffer(self.rawHeaderLen)
  // 创建DataView对象
  let headerView = new DataView(headerBuf, 0)
  this.loadpb(url).then((res) => {
    // 创建pb缓冲区数据
    let info = res.lookupType(query)
    let currInfo = info.create(params)
    // 解码出要提交的数据
    let bodyBuf = info.encode(currInfo).finish()
    // message.name转为buffer数据
    let queryToBytes = Buffer.from(query)
    // 数据类buffer合并
    // let allData = Buffer.concat([queryToBytes, bodyBuf])
    let allData = this.mergeArrayBuffer(queryToBytes, bodyBuf)
    // allData = Buffer.from(allData)
    // 以总长为单位，定义消息体的区间长度（2为message.name长度）
    let bytearr = new ArrayBuffer(2 + allData.length)
    let dv = new DataView(bytearr)
    // message.name长度填充
    dv.setInt16(0, queryToBytes.length)
    // 数据类buffer填充
    for (var i = 0; i < allData.length; i++) {
      dv.setUint8(2 + i, allData[i], false)
    }
    // ------------------- 缓冲区写入 -------------------
    // 消息总长度
    headerView.setInt32(self.packetOffset, self.rawHeaderLen + bytearr.byteLength)
    // 消息头长度
    headerView.setInt16(self.headerOffset, self.rawHeaderLen)
    // 操作类型
    headerView.setInt32(self.opOffset, reqType)
    // 消息序号
    headerView.setInt32(self.seqOffset, 1)
    // 合并请求头和消息体，并发送
    webskt.send(self.mergeArrayBuffer(headerBuf, bytearr).buffer)
  })
}

export default ICSocket
