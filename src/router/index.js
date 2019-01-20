import Vue from 'vue'
import Router from 'vue-router'
import path from 'path'
import oss from '@/assets/js/oss'

import Login from '@/pages/Login'
import SSOMain from '@/pages/SSOMain'
import Main from '@/pages/Main'


import OSSRouter from './OSSRouter'
import FTZMISRouter from './FTZMISRouter'

Vue.use(Router)

const routes = [
  {name: 'login', path: '/', component: Login},
  {name: 'ssoMain', path: '/sso/:token', component: SSOMain},
  {
    name: 'main',
    path: '/main',
    component: Main,
    redirect:'/WorkPlatform',
    children: [
      ...OSSRouter,
      ...FTZMISRouter
    ]
  },
];

const router = new Router({
  // mode: 'history',
  base: path.join('/', oss.systemCode, '/'),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) { //如果未匹配到路由
    oss.showModal({type: 'error', title: '路由错误', content: `找不到指定页面：<br>${to.name}`, width: 350});
  } else {
    window._axiosPromiserArr && window._axiosPromiserArr.forEach((cancel, index) => {
      cancel();   //路由跳转之前，要把上一个页面所有的请求都清除
      delete window._axiosPromiserArr[index];
    });
    next();
  }

});

export default router


