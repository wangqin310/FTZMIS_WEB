<template>
  <div id="login">
    <div class="login-wrapper">
      <div class="header">
        <img class="logoImg" src="../assets/images/logo.png" alt="" title=""/>
        <span class="title">{{oss.systemName}}</span>
      </div>
      <!--表单-->
      <div :class="classObj">
         <!--用户名-->
         <div class="account-wrapper input-wrapper">
           <div class="text-wrapper left-wrapper">
             <img class="icons" src="../assets/images/icon1.png" alt="" title=""/>
             <span class="text">用&nbsp;户&nbsp;名&nbsp;</span>
           </div>
           <div class="right-wrapper">
             <input type="text"
                    class="account input-box"
                    placeholder="请输入用户名"
                    v-model="loginInfo.username"
                    autofocus="autofocus"
                    @keyup.enter="focusStatus = true"
              />
           </div>
         </div>
         <div class="error-box" :style="{marginBottom:showConfirmPass?0:'7px'}"/>
        <!--密码/旧密码-->
        <div class="password-wrapper input-wrapper">
          <div class="text-wrapper left-wrapper">
            <img class="icons" src="../assets/images/icon2.png" alt="" title=""/>
            <span class="text" v-if="showConfirmPass">旧&nbsp;密&nbsp;码&nbsp;</span>
            <span class="text" v-else>密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码&nbsp;</span>
          </div>
          <div class="right-wrapper">
            <input type="password"
                   class="password input-box"
                   :placeholder="showConfirmPass?'请输入旧密码':'请输入密码'"
                   v-model="loginInfo.password"
                   v-focus="focusStatus"
                   @blur="focusStatus = false"
                   @keyup.enter="login"
            />
          </div>
        </div>
        <div class="error-box" />
         <!--新密码-->
         <div class="newPassword-wrapper input-wrapper" v-if="showConfirmPass">
           <div class="text-wrapper left-wrapper">
             <img class="icons" src="../assets/images/icon2.png" alt="" title=""/>
             <span class="text">新&nbsp;密&nbsp;码&nbsp;</span>
           </div>
           <div class="right-wrapper">
             <input type="password"
                    class="password input-box"
                    placeholder="请输入新密码"
                    v-model="loginInfo.newPassword"
                    v-focus="focusStatus"
                    @blur="focusStatus = false"
                    @keyup.enter="login"
             />
           </div>
         </div>
         <div class="error-box" v-if="showConfirmPass"/>
        <!--确认密码-->
        <div class="confirmNewPassword-wrapper input-wrapper" v-if="showConfirmPass">
          <div class="text-wrapper left-wrapper">
            <img class="icons" src="../assets/images/icon2.png" alt="" title=""/>
            <span class="text">确认密码</span>
          </div>
          <div class="right-wrapper">
            <input type="password"
                   class="password input-box"
                   placeholder="请输入确认密码"
                   v-model="loginInfo.confirmNewPassword"
                   v-focus="focusStatus"
                   @blur="focusStatus = false"
                   @keyup.enter="login"
            />
          </div>
        </div>
        <div class="error-box" v-if="showConfirmPass" />
         <!--登录-->
         <Button class="loginBtn" long :type="showConfirmPass?'warning':'error'" :style="{'marginTop':showConfirmPass?0:'6px'}" :loading="loading" shape="circle" @click.prevent="login">
            <span class="confirmLogin" v-if="!loading" v-text="showConfirmPass?'确认修改':'登  录'"></span>
            <span v-else>正&nbsp;&nbsp;在&nbsp;&nbsp;登&nbsp;&nbsp;录...</span>
         </Button>
         <div class="error-box error-password">
           <span>{{errorMsg}}</span><a href="#" class="editPassword" @click="editPass" v-text="showConfirmPass?'登录?':'修改密码?'"></a>
         </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    props: ['reLoginInfo'],
    data() {
      return{
        loginInfo:{
          username: 'wu.liang',
          password: '123456',
          newPassword:'',
          confirmNewPassword:''
        },
        errorMsg: '',
        loading: false,
        focusStatus: false,
        showConfirmPass:false,
        classObj:{
          form:true,
          loginForm:true,
          editPaddForm:false
        }
      }
    },
    directives: {
      focus: { // 指令的定义
        update: function (el, {value}) {
          if(value) el.focus()
        }
      }
    },
    methods:{
      login() {
        if(this.loginInfo.username === '') {
          this.errorMsg = '用户名不能为空！';
          return;
        }
        if(!this.showConfirmPass){    //登录时
          if(this.loginInfo.password === '') {
            this.errorMsg = '密码不能为空！';
            return;
          }else{
            var self = this;
            self.errorMsg = '';
            self.loading = true;
            this.oss.post({
              url: '/sys/user/login',
              data: {
                username: this.loginInfo.username,
                password: this.loginInfo.password,
                depth: 2,
                deviceType: 'C'
              },
              ok: (data, page, code) =>{
                self.menuSortAndParent(data.resourceTree);
                data.code = code;
                data.user.defaultUserPhoto = '/uploads/userHeadPic/user-default.png';
                self.oss.setGlobalData('currentUser', data);
                // 登录成功，清空之前存的navList, id
                self.$root.navList=[];
                self.$root.currentMenuId='';
                self.oss.removeGlobalData('navList');
                self.oss.removeGlobalData('currentMenuId');
                self.$router.push({name: 'main'});

                // 登录smartbi服务器--有跨域问题，需要代理包。
                // this.loginSmartbi();
              },
              err(msg,detail,code) {
                self.errorMsg = msg;
              },
              finish() {
                self.loading = false;
              }
            });
          }
        }else{    //修改密码时
          if(this.loginInfo.password === '') {
            this.errorMsg = '旧密码不能为空！';
            return;
          }else if (this.loginInfo.newPassword === ''){
            this.errorMsg = '新密码不能为空！';
            return;
          }else if(this.loginInfo.confirmNewPassword === ''){
            this.errorMsg = '确认密码不能为空！';
            return;
          }else if(this.loginInfo.newPassword!=this.loginInfo.confirmNewPassword){
            this.errorMsg = '确认密码有误，请重新输入';
            this.loginInfo.confirmNewPassword='';
            return;
          }else{
            var self = this;
            self.errorMsg = '';
            self.loading = true;
            this.oss.post({
              url: '/sys/user/updatePassword',
              data: {
                username: this.loginInfo.username,
                password: this.loginInfo.password,
                newPassword:this.loginInfo.confirmNewPassword
              },
              ok:(data, page, code)=>{
                this.oss.showMessage({type:'success',content:'密码修改成功！'});
                this.loginInfo={};
              },
              err(msg,detail,code) {
                self.errorMsg = msg;
              },
              finish() {
                self.loading = false;
              }
            });
          }
        }
      },
      loginSmartbi() {
        this.oss.get({
          url: '/crm/smartbi/loginSmartbi',
          data: {user: this.loginInfo.username, password: this.loginInfo.password},
          // data: {user: 'admin', password: 'admin'},
          ok: (data, page, code) => {
            this.oss.setGlobalData('smartbiParam', {'cookie':data.cookie, 'smPrifix': data.smPrifix});
          }
        })
      },
      editPass(){
          this.loginInfo={};
          this.showConfirmPass=!this.showConfirmPass;
          this.classObj.loginForm=!this.showConfirmPass;
          this.classObj.editPaddForm=this.showConfirmPass;
      },   //修改密码
      /**
       * 1.对菜单进行排序
       * 2.给每个菜单增加菜单路径(包含自己)，没有上级的只有当前菜单，格式为数组
       */
      menuSortAndParent(objArr, parent) {
        let self = this;
        objArr.sort((a, b) => {
          return a.sort - b.sort;
        });
        objArr.map((obj) => {
          if(parent && parent.path) {
            obj.path = [...parent.path];
          }else if(!obj.hasOwnProperty('path')){
            obj.path = [];
          }
          obj.path.push(obj.name);
          if(obj.children.length > 0) {
            self.menuSortAndParent(obj.children, obj);
          }
        });
      }
    },
    mounted(){
      this.loginInfo={};
    },
    beforeRouteLeave(to,from,next){
      let currentUser = this.oss.getGlobalData('currentUser');
      if(currentUser){   //判断是否有登录用户记录
        next()   //跳转到另一个路由
      }else{
        next(false);//不跳转
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../assets/css/common";
  #login{
    position:relative;
    .w(100%);
    .h(100%);
    background:url("../assets/images/login.png");
    background-size:100% 100%;
    .login-wrapper{
      position:absolute;
      width:320px;
      height:300px;
      top:calc(~"50% - 130px");
      bottom:calc(~"50% - 130px");
      left:60%;
      right:14%;
      .p(25px 25px 0);
      border-radius:6px;
      box-sizing:border-box;
      background:#fff;
      box-shadow:3px 3px 3px rgba(0,0,0,0.5);
      .header{
        .w(100%);
        .h(62px);
        .l-h(42px);
        .t-c(center);
        padding-bottom:37px;
        box-sizing:border-box;
        .logoImg{
          .d-i(inline-block);
          .w(40px);
          .h(38px);
          vertical-align: middle;
        }
        .title{
          .d-i(inline-block);
          .h(42px);
          .l-h(24px);
          .p(9px 0);
          .f-s(18px);
          font-family:'Microsoft YaHei';
          box-sizing:border-box;
          font-weight:bold;
        }
      }
    }
    .form{
      .w(100%);
      .h(calc(~"100% - 64px"));
      padding-bottom:25px;
      box-sizing:border-box;
      .input-wrapper{
        .w(100%);
        .h(22%);
        .p(0 15px);
        box-sizing:border-box;
        border-radius:50px;
        border:1px solid @grayColor;
        overflow:hidden;
        .left-wrapper,.right-wrapper{
          .d-i(inline-block);
          .p(0 10px 0 0);
          .h(22px);
          line-height: 22px;
          font-size:18px;
          color:@blackColor;
          font-family:@fontFamily6;
          &.left-wrapper{
            border-right:1px solid @grayColor;
            width: 100px;
            .text{
              display: inline-block;
              text-align: justify;
              text-align-last: justify;
              width: 60px;
            }
          }
          &.right-wrapper{
            .w(53%);
            .h(100%);
            .input-box{
              .f-s(14px);
              padding-left:5px;
            }
            .input-box::-webkit-input-placeholder {
              .f-s(14px);
              color:@blackColor;
              font-family:@fontFamily3;
            }
            .text{
              .w(100%);
              .h(100%);
              border:none;
            }
            input {
              width: 100%;
              height: 100%;
              border: none;
              outline: none;
            }
          }
          .icons{
            .w(18px);
            .h(18px);
            margin-right:3px;
            vertical-align: middle;
          }
          .text{
            .f-s(14px);
            color:@blackColor;
            font-family:@fontFamily3;
          }
        }
      }
      .error-box{
        .w(100%);
        .h(14%);
        .f-s(12px);
        .l-h(28px);
        box-sizing:border-box;
        color:@redColor;
        font-family:@fontFamily3;
        padding-left: 15px;
        &.error-password{
          padding-left: 4px;
        }
        .editPassword{
          float:right;
        }
      }
      .confirmNewPassword-wrapper{
        margin-bottom:-2px;
      }
      .login{
        display:flex;
        background:@redColor;
        color:@whiteColor;
        cursor: pointer;
        text-align:center;
        align-items:center;
        justify-content:center;
      }
    }

    .loginForm{
      .input-wrapper{
        .h(20%);
      }
      .error-box{
        .h(15%);
      }
      .loginBtn{
        .h(40px);
      }
    }

    .editPaddForm{
      .input-wrapper{
        .h(14%);
      }
      .error-box{
        .h(6%);
      }
      .loginBtn{
        .h(35px);
      }

    }

    @media only screen and (min-width: 1400px) {
      .login-wrapper{
       // width:380px;
       // height:320px;
        .w(400px);
        .h(367px);
        top:calc(~"50% - 190px");
        bottom:calc(~"50% - 190px");
        left:calc(~"70% - 190px");
        right:calc(~"30% + 190px");
        .p(35px 35px 0);
        border-radius:10px;
        .header{
          .h(68px);
          .logoImg{
            .w(46px);
            .h(42px);
          }
          .title{
            .f-s(20px);
          }
        }
        .form{
          .h(calc(~"100% - 68px"));
          padding-bottom:35px;
          .right-wrapper{
            .w(55%);
          }
          .left-wrapper .text,.right-wrapper .input-box,.login{
              .f-s(14px);
            .input-box::-webkit-input-placeholder {
              .f-s(14px);
            }
          }
        }
        .loginForm{
          .input-wrapper{
            .h(20%);
          }
          .error-box{
            .h(15%);
          }
          .loginBtn{
            .h(40px);
          }
        }

        .editPaddForm{
          .input-wrapper{
            .h(14%);
          }
          .error-box{
            .h(6%);
          }
          .loginBtn{
            .h(35px);
          }
        }
      }
    }
    .confirmLogin{
      .f-s(14px);
    }
  }
</style>
