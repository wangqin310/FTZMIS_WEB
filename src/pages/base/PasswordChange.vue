<template>
  <div class="change-password">
    <Form ref="passwordForm" :model="passwordForm" :rules="ruleValidate" :label-width="100">
      <FormItem label="姓名">
        <span>{{passwordForm.name}}</span>
      </FormItem>
      <FormItem label="登录帐号">
        <span>{{passwordForm.account}}</span>
      </FormItem>
      <FormItem label="旧密码" prop="oldPassword">
        <Input type="password" v-model="passwordForm.oldPassword" placeholder="请输入旧密码">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem label="新密码" prop="newPassword">
        <Input type="password" v-model="passwordForm.newPassword" placeholder="请输入新密码">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem label="确认密码" prop="confirmPassword">
        <Input type="password" v-model="passwordForm.confirmPassword" placeholder="确认您的密码">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="changePassword">修改密码</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  export default {
    name: 'PasswordChange',
    data() {
      const confirmPasswordCheck = (rule, value, callback) => {
        if (value !== this.passwordForm.newPassword) {
          callback(new Error('新密码两次输入不一致'));
        } else {
          callback();
        }
      };
      return {
        passwordForm: {
          account: '',
          name: '',
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        ruleValidate: {
          oldPassword: [
              {required: true, message: '旧密码不能为空', trigger: 'blur'}
          ],
          newPassword: [
              {required: true, message: '新密码不能为空', trigger: 'blur'}
          ],
          confirmPassword: [
              {required: true, message: '确认密码不能为空', trigger: 'blur'},
              {validator: confirmPasswordCheck, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      changePassword() {
        this.$refs['passwordForm'].validate((valid) => {
          if(valid) {
            this.oss.post({
              url: '/sys/user/updatePassword',
              data: {username: this.passwordForm.account, password: this.passwordForm.oldPassword, newPassword: this.passwordForm.newPassword},
              ok: () => {
                this.oss.showMessage({type: 'success', content: '密码修改成功'});
                setTimeout(() =>{
                  // sessionStorage.removeItem('OSSGlobalData');
                  this.oss.__vue__.$router.push({name: 'login'});
                  },1000);
              }
            });
          }
        });
      }
    },
    created() {
      let currentUser = this.oss.getGlobalData('currentUser');
      this.passwordForm.account = this.oss.getValue(currentUser, ['user','account'], '[请重新登录后修改]');
      this.passwordForm.name = this.oss.getValue(currentUser, ['user','name'], '[请重新登录后修改]');
    }
  }
</script>

<style scoped>
  .change-password {
    width: 300px;
    margin: 30px 0px 0px 20px;
  }
</style>
