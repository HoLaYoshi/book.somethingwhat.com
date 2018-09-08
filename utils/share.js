import Config from '../constants/config.js';

/**
 * 微信分享
 */
const ShareHelper = {
  //返回默认设置
  DefaultSetting: (res) => {
    const { share } = Config
    return {
      title: share.title,
      path: share.path,
      success: function (res) {
        console.info('转发成功', res)
      },
      fail: function (res) {
        console.info('转发失败', res)
      }
    }
  }
};

export default ShareHelper;