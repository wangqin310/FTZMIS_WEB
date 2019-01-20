// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from '@/router'        //引入路由配置
import oss from '@/assets/js/oss'    //引入公用方法
import mapUtils from '@/assets/js/MapUtils'   //引入地图
import moment from 'moment'
import numeral from 'numeral'

import ElementUI from 'element-ui'
import iView from 'iview'
import 'babel-polyfill'
import 'iview/dist/styles/iview.css'

import 'element-ui/lib/theme-chalk/index.css'

import '@/assets/css/common.less'

// 阿里巴巴矢量图--字体图标
import '@/assets/images/icon/iconfont.css'
import '@/assets/images/icon/iconfont.js'

import tableRowDataDetail from '@/components/TableRowDataDetail.vue'

Vue.config.productionTip = false

Vue.prototype.oss = oss
Vue.prototype.mapUtils = mapUtils
// Vue.prototype.S = S
Vue.prototype.moment = moment
Vue.prototype.numeral = numeral

Vue.use(iView);
Vue.use(ElementUI);
Vue.component('tableRowDataDetail', tableRowDataDetail);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  data(){
    return{
      // breadNav:[],            //面包屑导航
      // showView:false,         //客户视图
      // showConfigure:false,     //客户画像
      navList: [],        //菜单导航
      currentMenuId: '',  //当前高亮菜单id
    }
  },
  created() {
    this.oss.__vue__ = this;
  }
})
