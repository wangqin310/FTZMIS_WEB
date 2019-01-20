<template>
  <div class="main_page">
    <!--头部导航-->
    <transition tag="div" name="fade" enter-active-class="slideInleft" leave-active-class="slideInRight">
      <aside class="aside" ref="aside" :key="1">
        <div class="aside_top" ref="asideTop">
          <div class="arrow" ref="arrow" @click="toggle">
            <Icon class="arrow_icon" :type="isCollapse ? 'ios-arrow-forward' : 'ios-arrow-back'"></Icon>
          </div>
          <!--公司logo和名称-->
          <div class="com_info">
            <img class="com_img" src="./../assets/images/logo.png" alt="">
            <div class="com_name" v-if="!isCollapse">{{oss.companyName}}<br>{{oss.systemName}}</div>
          </div>
          <!--头像、姓名和职位-->
          <div class="user_info">
            <!-- <div class="notify_num" v-if="isCollapse">2</div> -->
            <Badge :count="isCollapse ? msgInfo.num : 0" :overflow-count="msgInfo.max" @click="showSysMsg">
              <img class="user_img" ref="userImg" :src="oss.baseURL + currentUser.user.defaultUserPhoto" alt="" />
            </Badge>
            <div class="user_desc">
              <span class="user_name">{{currentUser.user.name}}</span>
              <br>
              <span class="user_pos" v-if="!isCollapse">{{currentUser.code['position'][currentUser.user.position]}}</span>
            </div>
          </div>
          <!--提醒、设置、退出-->
          <div class="icon_wrapper" ref="iconWrapper">
            <div class="exit" @click="logout">
              <el-tooltip effect="dark" content="退出系统" :placement="isCollapse ? 'bottom' : 'right'">
                <Icon type="md-power" size="17"></Icon>
              </el-tooltip>
            </div>
            <div class="setting" v-if="!isCollapse">
              <Dropdown trigger="click" placement="bottom" @on-click="setting">
                <Icon type="md-settings" size="21"></Icon>
                <DropdownMenu slot="list">
                  <DropdownItem name="setting">首选项</DropdownItem>
                  <DropdownItem name="myself">个人中心</DropdownItem>
                  <DropdownItem name="password">修改密码</DropdownItem>
                  <DropdownItem name="about">关于系统</DropdownItem>
                  <DropdownItem name="appdownload" style="color:#6bc7ff">下载移动端</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div class="notify" v-if="!isCollapse" @click="showSysMsg">
              <Badge :count="isCollapse ? 0 : msgInfo.num" :overflow-count="msgInfo.max">
                <Icon class="bell" type="md-notifications-outline" size="22"></Icon>
              </Badge>
            </div>
          </div>
        </div>
        <!--侧边栏导航-->
        <div class="sider_wrapper">
          <el-menu :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :default-active="menuId" >
            <NavMenu :menuList="currentUser.resourceTree" :currentUser="currentUser"  @handleMenu="handleMenu"></NavMenu>
          </el-menu>
        </div>
      </aside>
    </transition>
    <div class="main" ref="main">
      <div class="blank"></div>
      <!--页面显示标签化-->
      <div class="tag_wrapper" ref="tagWrapper">
        <tags-nav-list :menuId="menuId"></tags-nav-list>
      </div>
      <!-- 面包屑导航 -->
      <!-- <Breadcrumb class="bread_nav">
        <BreadcrumbItem v-for="item in $root.breadNav" :key="item.id">{{item}}</BreadcrumbItem>
      </Breadcrumb> -->
      <!--路由内容显示区-->
      <div class="content_wrapper" ref="contentWrapper">
        <div class="content">
            <keep-alive :include="tagsList">
              <router-view />
            </keep-alive>
        </div>
      </div>
    </div>
    <!-- <Login :reLoginInfo="reLoginInfo" /> -->
  </div>
</template>
<script>
import NavMenu from "@/components/NavMenu.vue";
import Login from "./Login.vue";
import TagsNavList from "@/components/TagsNavList.vue";

export default {
  name: "main_page",
  components: { NavMenu, Login, TagsNavList },
  data() {
    return {
      aboutInfo: [],
      currentUser: {},
      isCollapse: false,
      msgInfo: { num: 0, max: 99 },
      reLoginInfo: { status: false, errmsg: "", account: "" },
      defaultActive: "3",
      mapSetting:{
        setting:{
          menu:{id:'setting',uri:'/pages/base/SystemSetting.vue',name:'首选项'},
          self:this,
          isNav:true,
          requestAdd: false
        },
        myself:{
          menu:{id:'myself',uri:'/pages/base/PersonalCenter.vue',name:'个人中心'},
          self:this,
          isNav:true,
          requestAdd: false
        },
        password:{
          menu:{id:'password',uri:'/pages/base/PasswordChange.vue',name:'修改密码'},
          self:this,
          isNav:true,
          requestAdd: false
        },
        appdownload:{
          menu:{id:'appdownload',uri:'pages/base/AppDownload.vue',name:'下载移动端'},
          self:this,
          isNav:true,
          requestAdd: false,
        }
      }
    }
  },
  computed: {
    tagsList() {     //生成的标签
       return this.$root.navList && this.$root.navList.map(item => {
          let urlList = item.uri.split("/");
          let name = urlList[urlList.length - 1].split(".")[0];
          return name
      })
    },
    menuId() {
      return this.$root.currentMenuId.toString();
    }
  },
  methods: {
    setting(name) {
      if(this.mapSetting.hasOwnProperty(name)){
        this.oss.toMenu(this.mapSetting[name]);
      }
      if (name === "about") {
        this.oss.showModal({
          type: "info",
          title: "关于系统",
          width: 321,
          content: `<div>${this.aboutInfo.join("")}</div>`
        });
      }
    },
    // setting(name) {
    //   if (name === "setting") {
    //     this.$router.push({ name: "pages_base_SystemSetting" });
    //   } else if (name === "myself") {
    //     this.$router.push({ name: "pages_base_PersonalCenter" });
    //   } else if (name === "password") {
    //     this.$router.push({ name: "pages_base_PasswordChange" });
    //   } else if (name === "about") {
    //     this.oss.showModal({
    //       type: "info",
    //       title: "关于系统",
    //       width: 321,
    //       content: `<div>${this.aboutInfo.join("")}</div>`
    //     });
    //   } else if (name === "appdownload") {
    //     this.$router.push({ name: "pages_base_AppDownload" });
    //   }
    // },
    showSysMsg() {
      let key = this.oss.UUID();
      this.oss.setGlobalData(key, this.msgInfo);
      this.$router.push({
        name: "pages_base_SystemMessage",
        query: { datakey: key }
      });
    },
    /**
     * 控制左侧导航条的显示和隐藏：
     */
    toggle(event) {
      this.isCollapse = !this.isCollapse;
      this.$refs.aside.style.width = this.isCollapse ? "64px" : "200px";
      this.$refs.main.style.width = this.isCollapse ? "calc(100% - 64px)" : "calc(100% - 200px)";
      this.$refs.tagWrapper.style.width = this.isCollapse ? "calc(100% - 64px)" : "calc(100% - 200px)";
      this.$refs.arrow.style.left = this.isCollapse ? "64px" : "200px";
      this.$refs.asideTop.style.padding = this.isCollapse ? "0 5px" : "0 20px";
      this.$refs.userImg.style.width = this.isCollapse ? "37px" : "60px";
      this.$refs.userImg.style.height = this.isCollapse ? "37px" : "60px";
      this.$refs.userImg.style.marginLeft = this.isCollapse ? "7px" : "50px";
      this.$refs.iconWrapper.style.marginTop = this.isCollapse
        ? "15px"
        : "25px";
      //自动切换时不发送更新配置的请求
      if (event) {
        this.oss.saveUserConfig(
          "NavIsCollapse",
          this.isCollapse,
          "导航菜单展开(false)/收缩(true)状态"
        );
      }
    },
    /**
     * 特殊处理，导航菜单收缩时，文本没有隐藏的问题
     */
    handleMenu() {
      let navMenuEL = document.getElementById("navigation-menu-topcheer");
      let parent = navMenuEL.parentNode;
      let nodes = navMenuEL.childNodes;
      if (parent && nodes) {
        parent.append(...nodes);
      }
      // 获取存的index
      let currentMenuId = this.oss.getGlobalData("currentMenuId");
      if (currentMenuId) {
        this.$root.currentMenuId = currentMenuId;
      }
      if (!currentMenuId) {
        let currMenu = this.currentUser.resourceTree.filter(
          item => item.id == this.defaultActive
        );
        this.$root.navList=this.$root.navList||[];
        this.$root.navList.push(currMenu[0]);
        //默认登录成功显示工作平台
        this.oss.setGlobalData("navList", this.$root.navList);
        if (currMenu.length > 0) {
          this.$root.currentMenuId = currMenu[0].id.toString();
          this.oss.setGlobalData("currentMenuId", currMenu[0].id)
        }
      }
    },

    /**
     * 退出系统
     */
    logout() {
      this.oss.get({
        url: "/sys/user/logout",
        finish: () => {
          // this.oss.clearGlobalData();
          this.$router.push({ name: "login" });

        }
      });
    }
  },
  mounted() {
    if (this.oss.getValue(this.currentUser, ["configMap", "NavIsCollapse"]) === "true") {
      this.toggle();
    } else {
      this.reLoginInfo.msg = "登录信息失效，请重新登录！";
      this.reLoginInfo.status = true;
    }
  },
  created() {
    this.currentUser = this.oss.getGlobalData("currentUser");
    this.reLoginInfo.account = this.oss.getValue(this.currentUser, ["user", "account"]);
    this.oss.get({
      url: "/sys/message/unReadCount",
      ok: (data, page, code) => {
        this.msgInfo.num = data;
      }
    });
    if (this.currentUser && this.currentUser.user.headPic) {
      this.oss.get({
        url: "/sys/file/getWebPath",
        data: {
          id: this.currentUser.user.headPic
        },
        ok: (data, page, code) => {
          this.currentUser.user.defaultUserPhoto = "/" + data;
        }
      });
    }
    this.oss.get({
      url: "/sys/code/findCodeDetailByType",
      data: { typeCodes: "SystemAbout" },
      ok: (data, page, code) => {
        let SystemAbout = this.oss.getValue(data, "SystemAbout", {});
        let tmp = [];
        for (let a in SystemAbout) {
          tmp.push(SystemAbout[a]);
        }
        tmp.sort((x, y) => {
          return x.itemSort - y.itemSort;
        });
        tmp.map((item, index) => {
          this.aboutInfo.push(
            [
              '<div style="margin-top:10px">',
              item.itemName,
              "：",
              item.attr1,
              "</div>"
            ].join("")
          );
        });
      }
    });
  }
};
</script>

<style lang="less">
@import "../assets/css/common";

.main_page {
  .w(100%);
  .h(100%);
  .b(#f4f8fb);
  overflow: hidden;
  .aside {
    .w(200px);
    .h(100%);
    .p(20px 0 0 0);
    float: left;
    z-index: 999;
    .b(@whiteColor);
    box-shadow: 4px 12px 12px #e6e6e6;
    -webkit-box-shadow: 4px 12px 12px #e6e6e6;
    /*-webkit-box-shadow:3px 4px 7px #e6e6e6;*/
    position: relative;
    .el-menu {
      border: 0;
    }
    .aside_top {
      .w(100%);
      .h(225px);
      .p(0 15px);
    }
    .arrow {
      position: absolute;
      .w(16px);
      .h(40px);
      top: 10px;
      left: 200px;
      .b(@blue);
      cursor: pointer;
      text-align: center;
      border-radius: 3px;
      .arrow_icon {
        .l-h(40px);
        .f-s(14px);
        color: @whiteColor;
      }
    }
    //公司logo和名称
    .com_info {
      .w(100%);
      .h(46px);
      .com_img,
      .com_name {
        .h(46px);
        float: left;
      }
      .com_img {
        .w(55px);
      }
      .com_name {
        .w(calc(~"100% - 55px"));
        display: flex;
        font-weight: bolder;
        align-items: center;
        text-align: center;
      }
    }
    //头像、姓名和职位
    .user_info {
      position: relative;
      .w(100%);
      .h(85px);
      margin-top: 20px;
      .notify_num {
        position: absolute;
        .d-i(inline-block);
        .w(12px);
        .h(12px);
        .b(red);
        .l-h(12px);
        top: 0px;
        right: -2px;
        text-align: center;
        border-radius: 50%;
        color: @whiteColor;
      }
      .user_img {
        .w(60px);
        .h(60px);
        margin-left: 50px;
        border-radius: 50%;
        -webkit-box-shadow: 2px 3px 6px #e6e6e6;
        -moz-box-shadow: 2px 3px 6px #e6e6e6;
        box-shadow: 2px 3px 6px #e6e6e6;
      }
      .user_desc {
        text-align: center;
      }
      .user_name {
        font-size: 14px;
        font-weight: bolder;
      }
      .user_pos {
        margin-top: 5px;
      }
    }
    //提醒、设置、退出
    .icon_wrapper {
      display: flex;
      .w(100%);
      .h(30px);
      .f-s(18px);
      margin-top: 35px;
      margin-bottom: 25px;
      .notify,
      .setting,
      .exit {
        flex: 1;
        .h(100%);
        cursor: pointer;
        text-align: center;
      }
      .setting {
      }
      .notify {
        position: relative;
        .num {
          position: absolute;
          .d-i(inline-block);
          .w(10px);
          .h(10px);
          .l-h(6px);
          .b(red);
          .f-s(12px);
          .p(2px);
          top: 3px;
          left: 27px;
          color: @whiteColor;
          text-align: center;
          border-radius: 50%;
        }
      }
    }
    //侧边栏导航
    .sider_wrapper {
      overflow-x: hidden;
      height: calc(100% - 225px);
    }
    .sider_wrapper {
       /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
        -ms-overflow-style:none;
        /*火狐下隐藏滚动条*/
        overflow:-moz-scrollbars-none;
    }
    .sider_wrapper::-webkit-scrollbar {
      width: 0;
      display: none;
    }

  }
  .main {
    position: relative;
    .w(calc(~"100% - 200px"));
    .h(100%);
    .b(@bodyBg);
    float: left;
    .p(16px 0 0 0);
    padding-left: 25px;
    overflow-x: auto;
    .blank {
      width: 25px;
      .h(100%);
      position: absolute;
      left: 0;
      top: 0;
      .b(@bodyBg);
      z-index: 199;
    }
    .tag_wrapper {
      .w(calc(~"100% - 200px"));
      position: fixed;
      z-index: 100;
      top: 0;
      .h(35px);
      background-color: #f4f8fb;
    }
    // .bread_nav {
    //   position: fixed;
    //   z-index: 100;
    //   width: 100%;
    //   top:0px;
    //   .h(35px);
    //   .l-h(38px);
    //   .b(@bodyBg);
    //   .ivu-breadcrumb-item-link, .ivu-breadcrumb-item-separator {
    //     color: #495060;
    //   }
    // }
    .content_wrapper {
      .w(100%);
      .h(calc(~"100% - 20px"));
      float: left;
      margin-top: 20px;
      .content {
        .w(100%);
        .h(100%);
        .b(@bodyBg);
        overflow-x: hidden;
        min-width: 1111px;
        .type {
          .h(50px);
          border-bottom: 1px solid #e6e6e6;
        }
      }
    }
  }
}
</style>

