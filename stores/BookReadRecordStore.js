import Ajax from '../utils/ajax.js';
import Config from '../constants/config.js';

/**
 * 书本阅读记录
 */
const BookReadRecordStore = {
  /**
   * 新增书本阅读记录
   */
  Add: (data) => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookReadRecord/Add';
      //参数
      //const data = data
      data.Book_Name = data.BookName;
      data.Book_Classify = data.BookType;
      data.Book_Link = data.BookLink;
      data.Cover_Image = data.Coverimg;
      data.Book_Intro = data.Intro;
      //发起请求
      Ajax.post(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
  /**
   * 获取书本阅读记录
   */
  GetSingle: (id) => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookReadRecord/GetSingle';
      //参数
      const data = id
      //发起请求
      Ajax.post(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
  /**
   * 更新收藏状态
   */
  UpdateCollectedState: (id, alreadyCollected) => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookReadRecord/UpdateCollectedState';
      //参数
      const data = {
        id: id,
        alreadyCollected: alreadyCollected
      }
      //发起请求
      Ajax.post(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
  /**
   * 获取最近的阅读
   */
  GetRecentReading: (pn, ps) => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookReadRecord/GetRecentReadingByPage';
      //参数
      const data = {
        pn: pn,
        ps: ps
      }
      //发起请求
      Ajax.get(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
  /**
   * 获取用户阅读记录概要信息
   */
  GetBookReadingRecordSummary: () => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookReadRecord/GetBookReadingRecordSummary';
      //参数
      const data = {}
      //发起请求
      Ajax.get(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
  /**
   * 获取用户收藏的小说数
   */
  GetBookUserCollectionSummary: () => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookReadRecord/GetBookUserCollectionSummary';
      //参数
      const data = {}
      //发起请求
      Ajax.get(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
  /**
   * 获取用户收藏的小说
   */
  GetCollectedList: () => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookReadRecord/GetCollectedList';
      //参数
      const data = {}
      //发起请求
      Ajax.get(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
};

export default BookReadRecordStore;