/**
 * 视图组件命名规范：将组件路径中的分隔符(/)替换为下划线(_)后的名称作为import标识符(区分大小写)
 * 如：/pages/base/User 导入名称应为：pages_base_User
 */

const pages_ftzmis_WorkPlatform_WorkPlatform = () => import('@/pages/ftzmis/WorkPlatform/WorkPlatform')
const pages_ftzmis_Tpublish_Tpublish = () => import('@/pages/ftzmis/Tpublish/Tpublish')

const routes = [
  {name: 'pages_ftzmis_WorkPlatform_WorkPlatform', path: '/WorkPlatform', component: pages_ftzmis_WorkPlatform_WorkPlatform},
  {name: 'pages_ftzmis_Tpublish_Tpublish', path: '/Tpublish', component: pages_ftzmis_Tpublish_Tpublish}
];

export default routes
