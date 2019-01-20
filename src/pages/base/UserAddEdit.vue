<template>
  <div id="modal">
    <Modal class="personalUserAddEditmodal" width="600" v-model="showModal"  @on-cancel="reset" ok-text="保存">
      <h3>
        <Icon :type="modal.icon" size="18"></Icon>
        {{modal.text}}
      </h3>
      <Form ref="formModal" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="12" pull="1">
          <FormItem label="账号" prop="account">
            <Input v-model="formValidate.account" :readonly="modal.type=='edit'" placeholder="请输入账号"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="姓名" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
          </FormItem>
          </Col>
          <Col span="12" pull="1">
          <FormItem label="性别" prop="mail">
            <Select v-model="formValidate.gender">
              <Option v-for="(item,index) in codeList.gender" :value="index" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="出生日期" prop="birthday">
            <DatePicker type="date" v-model="formValidate.birthday" placeholder="请选择日期"></DatePicker>
          </FormItem>
          </Col>
          <Col span="12" pull="1">
          <FormItem label="证件类型" prop="certType">
            <Select clearable v-model="formValidate.certType">
              <Option v-for="(item,index) in codeList.certType" :value="index" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="证件号码" prop="certNumber">
            <Input v-model="formValidate.certNumber" placeholder="请输入证件号码"></Input>
          </FormItem>
          </Col>
          <Col span="12" pull="1">
          <FormItem label="手机号码" prop="mobNumber">
            <Input v-model="formValidate.mobNumber" placeholder="请输入手机号码"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="固定电话" prop="telNumber">
            <Input v-model="formValidate.telNumber" placeholder="请输入固定电话"></Input>
          </FormItem>
          </Col>
          <Col span="12" pull="1">
          <FormItem label="邮箱" prop="email">
            <Input v-model="formValidate.email" placeholder="请输入邮箱"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="传真号码" prop="faxNumber">
            <Input v-model="formValidate.faxNumber" placeholder="请输入传真号码"></Input>
          </FormItem>
          </Col>
          <Col span="12" pull="1">
          <FormItem label="工号" prop="empId">
            <Input v-model="formValidate.empId" placeholder="请输入工号"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="微信OpenID" prop="wxOpenid">
            <Input v-model="formValidate.wxOpenid" placeholder="请输入微信OpenID"></Input>
          </FormItem>
          </Col>
          <Col span="12" pull="1">
          <FormItem label="职位" prop="position">
            <Select v-model="formValidate.position">
              <Option v-for="(item,index) in codeList.position" :value="index" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="直属上级" prop="managerId">
            <Select ref="select" clearable v-model="formValidate.managerId" filterable remote :remote-method="remoteMethod" @on-open-change="change">
                <Option v-for="(user, index) in managerList" :label="user.name" :value="user.id" :key="index">
                    <span>{{user.name}}</span>
                    <span style="float:right;color:#ccc">{{user.account}}</span>
                </Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="24" pull="1">
          <FormItem label="备注" prop="remark">
            <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows:4,maxRows:6}"
                   placeholder="请在此输入您的备注信息"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" class="btns">
        <Button type="default" @click="reset">重置</Button>
        <Button type="primary" @click="save">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'model',
    props:['codeList', 'modal','formValidate', 'userList'],
    data() {
      return {
        showModal:false,
        modalLoading:true,
        loading: true,
        ruleValidate: {  //表单验证
          account:[{ required: true, message: '账号不能为空', trigger: 'blur' }],
          name:[{ required: true, message: '姓名不能为空', trigger: 'blur' }],
          empId:[{ required: true, message: '工号不能为空', trigger: 'blur' }],
          position:[{ required: true, message: '职位不能为空', trigger: 'blur' }],
          certNumber:[],
          mobNumber:[{ type: 'string',pattern:/^1[3-578]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }],
          telNumber:[{ type: 'string',pattern:/^0\d{2,3}-?\d{7,8}$/, message: '电话号码格式不正确', trigger: 'blur' }],
          email:[{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
          faxNumber:[{ type: 'string',pattern:/^0\d{2,3}-?\d{7,8}$/, message: '传真号码格式不正确', trigger: 'blur' }]
        },
        managerList: [],
      }
    },
    watch: {
      userList:function(){
        this.remoteMethod(this.formValidate.managerId);
      }
    },
    methods:{
      change(val) {
        if(!val && !this.formValidate.managerId) {
          this.$refs.select.clearSingleSelect();
        }
      },
      remoteMethod(param) {
        if(param && param != '') {
            this.managerList = this.userList.filter(item =>
                item.name.indexOf(param) > -1 || item.id == this.formValidate.managerId
            );
        } else {
            this.formValidate.managerId = null;
            this.managerList = [];
        }
      },
      save(){
        if(this.formValidate.certType == '1') { //如果选择的证件类型为身份证，则加校验
          var regex = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
          if(this.formValidate.certNumber && !regex.test(this.formValidate.certNumber)) {
            this.oss.showModal({type: 'warning', content: '身份证格式不正确'});
            return;
          }
        }
        this.$refs.formModal.validate((valid) => {
          if(valid) {
            this.$emit("save",{formData:this.formValidate,type:this.modal.type});
          }
        })
      },
      reset(){
        this.$emit("reset",{formData:this.formValidate});
      }
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/common";

  .personalUserAddEditmodal{
    .btns{
      text-align:center;
    }
    // .ivu-select-not-found{
    //   display: none;
    // }
    .ivu-col-span-12 {
      display: inline-block;
      width: 49%;
      float: inherit;
    }
  }
</style>
