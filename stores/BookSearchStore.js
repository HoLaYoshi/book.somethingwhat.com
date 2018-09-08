import Ajax from '../utils/ajax.js';
import Config from '../constants/config.js';

/**
 * 小说搜索
 */
const BookSearchStore = {
  /**
   * 获取所有搜索来源分类
   */
  GetBookCategoryList: () => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/Search/GetBookCategoryList';
      //参数
      const data = {}
      //发起请求
      Ajax.get(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
  /**
   * 搜索小说
   */
  GetBookList: (q, pn, rule) => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/Search/GetBookList';
      //参数
      const data = {
        q: q,
        pn: pn,
        rule: rule
      }
      //发起请求
      Ajax.get(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
  /**
   * 获取小说的章节列表
   */
  GetBookChapter: (id) => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/Search/GetBookChapter';
      //参数
      const data = {
        id: id
      }
      //发起请求
      Ajax.get(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
  /**
   * 获取小说的内容
   */
  GetBookContent: (id, link) => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/Search/GetBookContent';
      //参数
      const data = {
        id: id,
        link: link
      }
      //发起请求
      Ajax.get(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  }
};

export default BookSearchStore;