import axios from 'axios'
import qs from 'qs'

axios.defaults.baseURL = 'http://192.169.2.250:8787/FTZMIS/';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// axios拦截器
axios.interceptors.request.use(config => {
  config.cancelToken = new axios.CancelToken(cancel => {
    window._axiosPromiserArr= window._axiosPromiserArr ||[];
    window._axiosPromiserArr.push(cancel);   //保存每次请求
  })
  return config
});

const oss = {
  companyName: '上海天正智能公司',
  systemCode: 'FTZMIS',
  systemName: '自贸区监管报送系统',
  baseURL: axios.defaults.baseURL || '.',
  GlobalData: {__init__: true},
  pageSizeOpts: [10, 20, 50, 100, 200],

  setGlobalData(key, value) {
    oss.GlobalData[key] = value;
    sessionStorage.setItem('OSSGlobalData', JSON.stringify(oss.GlobalData));
  },

  getGlobalData(key, defaultValue) {
    if(oss.GlobalData['__init__']) {
      let tmp = sessionStorage.getItem('OSSGlobalData');
      if(tmp) {
        tmp = JSON.parse(tmp);
        for(let key in tmp) {
          oss.GlobalData[key] = tmp[key];
        }
      }
      oss.GlobalData['__init__'] = false;
    }
    if(key in oss.GlobalData) {
      return oss.GlobalData[key];
    }else if(!oss.isUndefined(defaultValue)) {
      return defaultValue;
    }
  },

  clearGlobalData() {
    oss.GlobalData = {__init__: true};
    sessionStorage.clear();
  },

  removeGlobalData(key) {
    if(key in oss.GlobalData) {
      delete oss.GlobalData[key];
      sessionStorage.setItem('OSSGlobalData', JSON.stringify(oss.GlobalData));
    }
  },

  getValue(obj, key, defaultValue) {
    let val;
    if(oss.isObject(obj)) {
      if(oss.isString(key) || oss.isNumber(key)) {
        val = obj[key];
      }else if(oss.isArray(key)) {
        val = obj;
        for(let k of key) {
          if(!oss.isObject(val) || !(k in val)) {
            val = null;
            break;
          }
          val = val[k];
        }
      }
      return val || defaultValue;
    }
  },

  /**
   * 会话超时，重新登录层
   */
  reLogin() {
    oss.showModal({
      type: 'confirm',
      title: '系统登录',
      width: 320,
      content: 'reLogin Action'
    });
  },

  /**
   * 定义全局对话框
   */
  showMessage(config) {
    oss.MsgBox('message', config);
  },
  showNotice(config) {
    oss.MsgBox('notice', config);
  },
  showModal(config) {
    oss.MsgBox('modal', config);
  },
  MsgBox(msgType, config) {
    let M = oss.__vue__;
    if(!M) {
      alert('MsgBox调用错误：未向oss对象中注册vue实例');
      return;
    }
    switch(msgType) {
    case 'message':
      M = M.$Message;
      break;
    case 'notice':
      M = M.$Notice;
      break;
    case 'modal':
      if(!config.hasOwnProperty('width')) config['width'] = 300;
      M = M.$Modal;
      break;
    default:
      M = null;
    }
    if(M === null) {
      alert('MsgBox调用错误：未知的消息类型"' + msgType + '"');
      return;
    }
    config['duration'] = 2;
    if (!config.hasOwnProperty('title')) config['title'] = '系统提示';

    switch(config.type) {
    case 'success':
      M.success(this.getRenderConfig(config) ? this.getRenderConfig(config) : config);
      break;
    case 'warning':
      M.warning(this.getRenderConfig(config) ? this.getRenderConfig(config) : config);
      break;
    case 'error':
      M.error(this.getRenderConfig(config) ? this.getRenderConfig(config) : config);
      break;
    case 'loading': // Message专用
      M.loading(config);
      break;
    case 'open': // Notice专用
      M.open(config);
      break;
    case 'confirm': // Modal专用
      M.confirm(this.getRenderConfig(config) ? this.getRenderConfig(config) : config);
      break;
    default:
      M.info(config);
    }
  },

  /**
   * 将服务端的树状结构转换成iview可识别的结构，加title和expand属性，
   * title为树形结构的节点名称，
   * expand为true时展开树形图，为false时收起树形图
   * @param {*} data 待转换的额树形结构对象
   */
  treeConverter(treeObj, orgExpend) {
    if(!orgExpend) {
      orgExpend = 0;
    }
    let self = this;
    treeObj.map((obj) => {
      obj.title = obj.name;
      if (orgExpend < 2) {
        obj.expand = true;
      }
      if(obj.children.length > 0) {
        self.treeConverter(obj.children, orgExpend + 1);
      }
    });
    return treeObj;
  },

  /**
   * 将组件路径转换为组件名称
   */
  path2name: path => {
    let _path = '';
    if(path.substring(path.length-4) === '.vue') {
      _path = path.substring(1, path.length-4);
    }else {
      _path = path.substring(1);
    }
    _path = _path.split('/').join('_');
    return _path;
  },

  /**
   * saveUserConfig 保存用户自定义配置项
   * @param item 配置名称
   * @param value 配置值
   * @param desc 配置描述
   */
  saveUserConfig: (item, value, desc, ok, err) => {
    oss.post({
      url: '/sys/user/editUserConfig',
      data: {
        configItem: item,
        configValue: value,
        configDesc: desc
      },
      ok: ok,
      err: err
    });
  },

  /**
   * Ajax请求：传入cfg对象
   * @param cfg.url     请求路径
   * @param cfg.method  请求类型（POST/GET）
   * @param cfg.data    请求发送的数据
   * @param cfg.action  处理方式（upload-上传文件 download-下载文件）
   * @param cfg.ok      成功回调函数
   * @param cfg.err     失败回调函数
   */
  ajax: cfg => {
    if(cfg.url && cfg.url.indexOf('/') === 0) {
      cfg.url = cfg.url.substr(1);
    }
    if(cfg.method === 'get') {
      cfg.params = cfg.data;
      delete cfg.data
      cfg.paramsSerializer = data => {
        return qs.stringify(data, {arrayFormat: 'repeat'});
      };
    }else if(cfg.method === 'post' && cfg.action !== 'upload') {
      cfg.transformRequest = [data => {
        return qs.stringify(data, {arrayFormat: 'repeat'});
      }];
    }
    if(cfg.action === 'upload') {
      cfg.headers = {'Content-Type': 'multipart/form-data'};
      let form = new FormData();
      for(let d in cfg.data) {
        let v = cfg.data[d];
        if(oss.isArray(v)) {
          v.forEach(function(item){
            form.append(d, item);
          });
        }else {
          form.append(d, v);
        }
      }
      cfg.data = form;
    }else if(cfg.action === 'download') {
      cfg.responseType = 'blob';
    }
    axios(cfg).then(resp => {
      if(cfg.action === 'download') {
        if(oss.getValue(resp, ['headers','content-type'], '').indexOf('application/octet-stream') != -1) {
          var filename = resp.headers['original-filename'];
          filename = decodeURIComponent(escape(filename));
          oss.download(filename, resp.data);
          oss.isFunction(cfg.ok) && cfg.ok();
        }else {
          if(oss.isFunction(cfg.err)) {
            let errBlob = new Blob([resp.data], {type: 'application/json'});
            let fr = new FileReader();
            fr.readAsText(errBlob);
            fr.onload = function() {
              const err = JSON.parse(this.result);
              cfg.err(err.message, err.detailmsg);
            }
          }
        }
      }else {
        let r = resp.data;
        if(r.errcode === 0) {
          oss.isFunction(cfg.ok) && cfg.ok(r.data, r.page, r.code);
        }else if(r.errcode === 60113) {
          oss.showModal({type: 'confirm', title: '登录提示', content: '登录会话失效，请重新登录后再操作', width: 310, onOk: () => {
            sessionStorage.removeItem('OSSGlobalData');
            oss.__vue__.$router.push({name: 'login'});
          }});
        }else {
          if(oss.isFunction(cfg.err)) {
            cfg.err(r.errmsg, r.errdetail,r.errcode);
          }else {
            oss.showModal({type: 'error', title: '错误提示', content: r.errmsg, errDetail: r.errdetail});
          }
        }
      }
      oss.isFunction(cfg.finish) && cfg.finish();
    }).catch(error => {
      if(error.constructor.name=='Cancel'){
        return false;
      }
      let errMsg = error.response ? '(' + error.response.status + ')糟糕，服务器不见了！' : error.message;
      let errTitle = error.response ? '服务器异常' : '系统异常';
      if(oss.isFunction(cfg.err)) {
        cfg.err(errTitle + '-' + errMsg);
      }else{
        oss.showModal({type: 'error', title: errTitle, content: errMsg});
      }
      oss.isFunction(cfg.finish) && cfg.finish();
    })
  },

  /**
   * Ajax POST请求：传入cfg对象
   * @param cfg.url  请求路径
   * @param cfg.data 请求发送的数据
   * @param cfg.ok   成功回调函数
   * @param cfg.err  失败回调函数
   */
  post: cfg => {
    cfg.method = 'post';
    oss.ajax(cfg);
  },

  /**
   * Ajax GET请求：传入cfg对象
   * @param cfg.url  请求路径
   * @param cfg.data 请求发送的数据
   * @param cfg.ok   成功回调函数
   * @param cfg.err  失败回调函数
   */
  get: cfg => {
    cfg.method = 'get';
    oss.ajax(cfg);
  },

  download: (filename, data) => {
    const blob = new Blob([data]);
    var downloadElement = document.createElement('a');
    var href = window.URL.createObjectURL(blob); //创建下载的链接
    downloadElement.href = href;
    downloadElement.download = filename; //下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); //点击下载
    document.body.removeChild(downloadElement); //下载完成移除元素
    window.URL.revokeObjectURL(href); //释放掉blob对象
  },

  trim: str => {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
  },

  /**
   * 判断对象是否为函数类型
   * @param obj 任意对象
   */
  isFunction: val => {
    return Object.prototype.toString.call(val) === '[object Function]';
  },

  /**
   * 判断对象是否为数组类型
   * @param obj 任意对象
   */
  isArray: val => {
    return Object.prototype.toString.call(val) === '[object Array]';
  },

  isDate: val => {
    return Object.prototype.toString.call(val) === '[object Date]';
  },

  isObject: val => {
    return val !== null && typeof val === 'object';
  },

  isString: val => {
    return typeof val === 'string';
  },

  isNumber: val => {
    return typeof val === 'number';
  },

  isNull: val => {
    return val === null && typeof val === 'undefined'
  },

  isUndefined: val => {
    return typeof val === 'undefined';
  },
  UUID: () => {
    function S4() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return 'crm' + S4() + S4() + new Date().getTime() + S4() + S4();
  },
  /**
   * 该方法用于加载JS、CSS资源，放在页面的head标签内
   */
  loadResource(res, callback) {
    var head = document.getElementsByTagName('head')[0];
    if(!head) {
      console.log('No Head tag in the document!');
      return;
    }
    var node = null;
    if(res.tag === 'script') {
      node = document.createElement(res.tag);
      node.type = res.type;
      node.src = res.src;
      if(oss.isFunction(callback)) {
        node.onload = node.onreadystatechange = function () {
          if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
            callback(res.src);
            node.onload = node.onreadystatechange = null;
          }
        };
      }
    }else if(res.tag === 'link') {
      node = document.createElement(res.tag);
      node.type = res.type;
      node.rel = res.rel;
      node.href = res.href;
      if(oss.isFunction(callback)) {
        callback(res.href);
      }
    }
    if(node) head.appendChild(node);
  },
  //判断浏览区是否支持canvas
  isSupportCanvas() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  },

  /**
   * 获取表格的高度
   * @param lineHeight tr的高度
   * @param headAndPageHeight  表头和分页的高度
   * @param topHeight  距离页面顶部的距离
   * @param size  分页显示多少条
   */
  setTableHeight(config) {
    config.topHeight = (config.hasOwnProperty('topHeight') && config.topHeight) || 200;
    config.headAndPageHeight = (config.hasOwnProperty('headAndPageHeight') && config.headAndPageHeight) || 98;
    config.size = (config.hasOwnProperty('size') && config.size) || 0;
    let lineHeight = 40; //表格每行的高度
    let curTableHeight = config.size * lineHeight + config.headAndPageHeight;
    let rightTableHeight = window.innerHeight - config.topHeight;
    let offsetTopHeight = Math.min(curTableHeight, rightTableHeight) + 2;
    config.el.tableHeight = offsetTopHeight;
    config.el.$refs.topcheerOssTable && (config.el.$refs.topcheerOssTable.style.height = offsetTopHeight + 'px');
  },
  /**
   *
   * @param menu    侧边栏返回菜单数据
   * @param isNav   是否是导航菜单
   * @param requestAdd  是否需要发送add请求
   */
  toMenu(config) {
    config.menu = config.menu;
    let self=config.self;
    config.isNav = config.hasOwnProperty('isNav') ? config.isNav : false;
    config.requestAdd = config.hasOwnProperty('requestAdd') ? config.requestAdd : false;
    // self.$root.showView=false;
    // self.$root.showConfigure=false;
    if (config.requestAdd) {
      self.oss.post({
        url: '/sys/logMenu/add',
        data: {resourceId: config.menu.id, resourceUri: config.menu.uri}
      });
    }
    self.$root.navList = self.$root.navList || [];
    if(config.isNav){
      let flag = self.$root.navList.some(item => {
        return config.menu.id == item.id;
      })
      // 判断路由不存在不生成标签
      if (config.menu.uri && (config.menu.uri.indexOf('/pages') != -1) && !flag) {
        config.menu.query = config.query;

        self.$root.navList.push(config.menu);
        self.oss.setGlobalData('navList', self.$root.navList);
        // 保存当前菜单的id
        self.oss.setGlobalData('currentMenuId', config.menu.id);
        self.$root.currentMenuId = config.menu.id;
      }
      if (flag) {
        self.oss.setGlobalData('currentMenuId', config.menu.id);
        self.$root.currentMenuId = config.menu.id;
      }
    }
    // self.oss.setGlobalData('globalBreadNav', config.menu.path);
    let key = self.oss.UUID();
    self.oss.setGlobalData(key, config.menu);
    if (config.menu.uri.indexOf('?ReportCode') != -1){
      let code = config.menu.uri.split('?')[1].split('=')[1];
      let uri = config.menu.uri.split('?')[0];
      config.query = {ReportCode: code};
      self.$router.push({name: self.oss.path2name(uri), query: config.query});
      self.oss.setGlobalData(code, config.menu);
    } else {
      config.query = {datakey: key};
      self.$router.push({name: self.oss.path2name(config.menu.uri), query: config.query});
    }

    // config.query = (config.hasOwnProperty('query') && config.query) || {datakey: key};
    // self.$router.push({name: self.oss.path2name(config.menu.uri), query: config.query});
  },
  /**
   *
   * @param title      弹框标题名
   * @param content    弹框内容
   * @param errDetail  错误详细信息
   */
  getRenderConfig(config) {
    let renderConfig = null;
    if (config.hasOwnProperty('errDetail')) {
      renderConfig = {
        title: config.title,
        render: (h) => {
          return h('DIV', {
            domProps: {
              innerHTML:
               '<div style="margin-left: 38px">'+ config.content +'</div><div id="details" style="z-index:999;display:none;position:absolute; left:-150px; bottom: -354px; width: 700px; border-radius: 5px; background: #fff; padding: 15px; height:460px; border-top: 1px solid #ccc;"><p style="font-size:16px;font-weight:bold">详细信息</p><div style="overflow-y:scroll; height:381px;">'+ config.errDetail +'</div><p style="text-align:right"><button id="btn" style="padding:2px 10px; border:0; margin-top: 8px; border-radius: 5px; background-color: #57a3f3; color: #fff">关闭</button></p></div><a id="toggle" style="position: absolute; left: 38px; top: 50px;">详细信息</a>'
            },
            on: {
              click: function(event) {
                let details = document.getElementById('details');

                  if (event.target.id == 'toggle' && config.errDetail) {
                    if (details.style.display == 'none') {
                      details.style.display = 'block';
                    }
                  } else if (event.target.id == 'btn') {
                    details.style.display = 'none';
                  }

              }
            }
          })
        }
      }
    }
    return renderConfig;
  },
  // getRenderConfig(config) {
  //   let renderConfig = null;
  //   if (config.hasOwnProperty('errDetail')) {
  //     renderConfig = {
  //       title: config.title,
  //       render: (h) => {
  //         return h('DIV', {
  //           domProps: {
  //             innerHTML:
  //              '<div style="margin-left: 38px">'+ config.content +'</div><div id="details" style="display:none;position:absolute; left:-20px; bottom: -222px; width: 416px; border-radius: 5px; background: #fff; padding: 15px; height:150px; border-top: 1px solid #ccc;"><div style="overflow-y:scroll; height:120px;">'+ config.errDetail +'</div></div><a id="toggle" style="position: absolute; left: 38px; top: 50px;">详细信息</a>'
  //           },
  //           on: {
  //             click: function(event) {
  //               let details = document.getElementById('details');

  //                 if (event.target.id == 'toggle' && config.errDetail) {
  //                   if (details.style.display == 'none') {
  //                     details.style.display = 'block';
  //                   } else {
  //                     details.style.display = 'none';
  //                   }
  //                 }

  //             }
  //           }
  //         })
  //       }
  //     }
  //   }
  //   return renderConfig;
  // }

};

export default oss;
