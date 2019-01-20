/**
 * 视图组件命名规范：将组件路径中的分隔符(/)替换为下划线(_)后的名称作为import标识符(区分大小写)
 * 如：/pages/base/User 导入名称应为：pages_base_User
 */

// import pages_base_User from '@/pages/base/User'
// import pages_base_Org from '@/pages/base/Org'
// import pages_base_Role from '@/pages/base/Role'
// import pages_base_Resource from '@/pages/base/Resource'
// import pages_base_DataPermission from '@/pages/base/DataPermission'
// import pages_base_Code from '@/pages/base/Code'
// import pages_base_LogLogin from '@/pages/base/LogLogin'
// import pages_base_LogLevel from '@/pages/base/LogLevel'
// import pages_base_LogResource from '@/pages/base/LogResource'
// import pages_base_LogOperate from '@/pages/base/LogOperate'
// import pages_base_ReportConfig from '@/pages/base/ReportConfig'
// import pages_base_ReportTemplate from '@/pages/base/ReportTemplate'
// import pages_base_SqlQuery from '@/pages/base/SqlQuery'
// import pages_base_FileBrowser from '@/pages/base/FileBrowser'
// import pages_base_OnlineUserList from '@/pages/base/OnlineUserList'
// import pages_base_UserLoginStatistics from '@/pages/base/UserLoginStatistics'
// import pages_base_UserOnlineStatistics from '@/pages/base/UserOnlineStatistics'
// import pages_base_SchedulingOperation from '@/pages/base/SchedulingOperation'
// import pages_base_CacheManagement from '@/pages/base/CacheManagement'
// import pages_base_SystemSetting from '@/pages/base/SystemSetting'
// import pages_base_PersonalCenter from '@/pages/base/PersonalCenter'
// import pages_base_PasswordChange from '@/pages/base/PasswordChange'
// import pages_base_AppDownload from '@/pages/base/AppDownload'
// import pages_base_SystemMessage from '@/pages/base/SystemMessage'
// import pages_base_NotificationManagement from '@/pages/base/NotificationManagement'
// import pages_base_NotifyTemplateConfig from '@/pages/base/NotifyTemplateConfig'
// import pages_base_DocumentManagement from '@/pages/base/DocumentManagement'
// import pages_base_SystemFunctionUsageStatistics from '@/pages/base/SystemFunctionUsageStatistics'
// import pages_base_TimeTask_TimedTask from '@/pages/base/TimeTask/TimedTask'
// import pages_base_DBLinkManagement from '@/pages/base/DBLinkManagement'
// import pages_base_FtpLinkManagement from '@/pages/base/FtpLinkManagement'


const pages_base_User = () => import('@/pages/base/User')
const pages_base_Org = () => import('@/pages/base/Org')
const pages_base_Role = () => import('@/pages/base/Role')
const pages_base_Resource = () => import('@/pages/base/Resource')
const pages_base_DataPermission = () => import('@/pages/base/DataPermission')
const pages_base_Code = () => import('@/pages/base/Code')
const pages_base_LogLogin = () => import('@/pages/base/LogLogin')
const pages_base_LogLevel = () => import('@/pages/base/LogLevel')
const pages_base_LogResource = () => import('@/pages/base/LogResource')
const pages_base_LogOperate = () => import('@/pages/base/LogOperate')
const pages_base_ReportConfig = () => import('@/pages/base/ReportConfig')
const pages_base_ReportTemplate = () => import('@/pages/base/ReportTemplate')
const pages_base_SqlQuery = () => import('@/pages/base/SqlQuery')
const pages_base_FileBrowser = () => import('@/pages/base/FileBrowser')
const pages_base_OnlineUserList = () => import('@/pages/base/OnlineUserList')
const pages_base_UserLoginStatistics = () => import('@/pages/base/UserLoginStatistics')
const pages_base_UserOnlineStatistics = () => import('@/pages/base/UserOnlineStatistics')
const pages_base_SchedulingOperation = () => import('@/pages/base/SchedulingOperation')
const pages_base_CacheManagement = () => import('@/pages/base/CacheManagement')
const pages_base_SystemSetting = () => import('@/pages/base/SystemSetting')
const pages_base_PersonalCenter = () => import('@/pages/base/PersonalCenter')
const pages_base_PasswordChange = () => import('@/pages/base/PasswordChange')
const pages_base_AppDownload = () => import('@/pages/base/AppDownload')
const pages_base_SystemMessage = () => import('@/pages/base/SystemMessage')
const pages_base_NotificationManagement = () => import('@/pages/base/NotificationManagement')
const pages_base_NotifyTemplateConfig = () => import('@/pages/base/NotifyTemplateConfig')
const pages_base_DocumentManagement = () => import('@/pages/base/DocumentManagement')
const pages_base_SystemFunctionUsageStatistics = () => import('@/pages/base/SystemFunctionUsageStatistics')
const pages_base_TimeTask_TimedTask = () => import('@/pages/base/TimeTask/TimedTask')
const pages_base_DBLinkManagement = () => import('@/pages/base/DBLinkManagement')
const pages_base_FtpLinkManagement = () => import('@/pages/base/FtpLinkManagement')

const routes = [
  {name: 'pages_base_User', path: '/User', component: pages_base_User},
  {name: 'pages_base_Code', path: '/Code', component: pages_base_Code},
  {name: 'pages_base_Role', path: '/Role', component: pages_base_Role},
  {name: 'pages_base_Resource', path: '/Resource', component: pages_base_Resource},
  {name: 'pages_base_DataPermission', path: '/DataPermission', component: pages_base_DataPermission},
  {name: 'pages_base_Org', path: '/Org', component: pages_base_Org},
  {name: 'pages_base_LogLogin', path: '/LoginLog', component: pages_base_LogLogin},
  {name: 'pages_base_LogLevel', path: '/LevelLog', component: pages_base_LogLevel},
  {name: 'pages_base_LogResource', path: '/ResourceLog', component: pages_base_LogResource},
  {name: 'pages_base_LogOperate', path: '/OperateLog', component: pages_base_LogOperate},
  {name: 'pages_base_ReportConfig', path: '/ReportConfig', component: pages_base_ReportConfig},
  {name: 'pages_base_ReportTemplate', path: '/ReportTemplate', component: pages_base_ReportTemplate},
  {name: 'pages_base_SqlQuery', path: '/SqlQuery', component: pages_base_SqlQuery},
  {name: 'pages_base_FileBrowser', path: '/FileBrowser', component: pages_base_FileBrowser},
  {name: 'pages_base_OnlineUserList', path: '/OnlineUserList', component: pages_base_OnlineUserList},
  {name: 'pages_base_UserLoginStatistics', path: '/UserLoginStatistics', component: pages_base_UserLoginStatistics},
  {name: 'pages_base_UserOnlineStatistics', path: '/UserOnlineStatistics', component: pages_base_UserOnlineStatistics},
  {name: 'pages_base_SchedulingOperation', path: '/SchedulingOperation', component: pages_base_SchedulingOperation},
  {name: 'pages_base_CacheManagement', path: '/CacheManagement', component: pages_base_CacheManagement},
  {name: 'pages_base_SystemSetting', path: '/SystemSetting', component: pages_base_SystemSetting},
  {name: 'pages_base_PersonalCenter', path: '/PersonalCenter', component: pages_base_PersonalCenter},
  {name: 'pages_base_PasswordChange', path: '/ChangePassword', component: pages_base_PasswordChange},
  {name: 'pages_base_AppDownload', path: '/AppDownload', component: pages_base_AppDownload},
  {name: 'pages_base_SystemMessage', path: '/SystemMessage', component: pages_base_SystemMessage},
  {name: 'pages_base_NotificationManagement', path: '/NotificationManagement', component: pages_base_NotificationManagement},
  {name: 'pages_base_NotifyTemplateConfig', path: '/NotifyTemplateConfig', component: pages_base_NotifyTemplateConfig},
  {name: 'pages_base_DocumentManagement', path: '/DocumentManagement', component: pages_base_DocumentManagement},
  {name: 'pages_base_SystemFunctionUsageStatistics', path: '/SystemFunctionUsageStatistics', component: pages_base_SystemFunctionUsageStatistics},
  {name: 'pages_base_TimeTask_TimedTask', path: '/TimedTask', component: pages_base_TimeTask_TimedTask},
  {name: 'pages_base_DBLinkManagement', path: '/DBLinkManagement', component: pages_base_DBLinkManagement},
  {name: 'pages_base_FtpLinkManagement', path: '/FtpLinkManagement', component: pages_base_FtpLinkManagement}
];

export default routes
