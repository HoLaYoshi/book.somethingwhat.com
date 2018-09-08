import Ajax from '../utils/ajax.js';
import Config from '../constants/config.js';

/**
 * 用户消费记录
 */
const BookUserConsumeStore = {
  /**
   * 阅读章节的扣费操作
   */
  AddByReading: (chapterid, remark) => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookUserConsume/AddByReading';
      //参数
      const data = {
        chapterid: chapterid,
        remark: remark
      }
      //发起请求
      Ajax.post(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
};

export default BookUserConsumeStore;