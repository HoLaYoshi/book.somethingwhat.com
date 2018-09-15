import Key from '../constants/key.js';

/**
 * ajax请求
 */
const Ajax = {
  httpRequest: (method, url, params, contentType) => {
    const openid = wx.getStorageSync(Key.storageKey.openid);
    const token = wx.getStorageSync(Key.storageKey.token);
    //console.info('httpRequest', method, url, params, contentType)
    return new Promise(function(resolve, reject) {
      wx.request({
        url: url,
        data: params,
        header: {
          'content-type': contentType,
          'App-From': 'miniprogram',
          'cat-token': token,
          'cat-openid': openid
        },
        method: method,
        success: function(res) {
          console.info('httpRequest', res)
          if (res.statusCode != 200 || res.data.Code < 0) {

            let msg = (res.data.Msg || ('错误码：' + res.statusCode));
            // if (res.data && res.data.Msg.indexOf('操作失败') == -1)
            //   msg = '操作失败，' + msg;

            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 2000
            })
            reject(msg)
          } else
            resolve(res.data.Data);
        },
        fail: function(res) {
          console.info('wx.request fail', res, res.errMsg)
          const msg = '远程服务器返回异常' + res.errMsg;
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 2000
          })
          reject(msg)
        }
      })
    })
  },
  get: (url, data) => Ajax.httpRequest('GET', url, data, 'application/json'),
  post: (url, data) => Ajax.httpRequest('POST', url, data, 'application/x-www-form-urlencoded')
};

export default Ajax;