<template>
    <div class="ssoMain">
        <Spin class="spin" size="large" fix v-if="spinShow"></Spin>
    </div>
</template>
<script>
  export default {
    name: 'SSOLogin',
    data() {
        return {
            spinShow: true,
        }
    },
    methods: {

    },
    created() {
        // 从路径中获取token参数
      var token = this.$route.params.token;
      if(token != null && token.length > 0) {
        this.oss.post({
          url: '/crm/sso/login',
          data: {
            token: token
          },
          ok: (data, page, code) =>{
            data.code = code;
            data.user.defaultUserPhoto = '/uploads/userHeadPic/user-default.png';
            this.oss.setGlobalData('currentUser', data);
            this.$router.push({name: 'main'});
          },
          err:(msg,detail,code) =>{
            if(code === 60117) { // 说明token无效，跳转到cat的登录页面去
              window.location.href = "http://192.169.2.250:8666/CAT/";
            } else {  // 获取用户信息失败的流程处理
              this.oss.showMessage({type: 'error', title: '提示', content: msg});
            }
          },
          finish: () => {
              this.spinShow = false;
          }
        });
      }
    }
  }
</script>
<style lang="less">
    @import "../assets/css/common";
    .ssoMain{
        .w(100%);
        .spin{
            .w(100%);
            .h(calc(~'100% + 33px'));
        }
    }
</style>

