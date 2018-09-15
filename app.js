//app.js
import {
  key
} from '/constants/key.js';

App({
  onLaunch: function() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          // 执行缓存清理
          wx.clearStorageSync()
          //
          wx.showToast({
            title: '正在更新版本...',
            icon: 'none',
            duration: 5000
          })
        }
      })

      updateManager.onUpdateReady(function() {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })

      });
    }
    //访问当前小程序或插件帐号信息
    var accountInfo = wx.getAccountInfoSync();
    this.globalData.appid = accountInfo.miniProgram.appId
    //console.info('accountInfo', accountInfo, this.globalData)
  },
  globalData: {
    appid: null,
    openid: null,
  }
})