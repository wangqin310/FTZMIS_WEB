<template>
  <div id="PCenter">
      <div class="j_part1" >
        <Row>
          <img class="j_user_img" ref="userImg" :src="oss.baseURL + currentUser.user.defaultUserPhoto" alt="" />
        </Row>
        <Row>
          <Upload :before-upload="handleUpload" action="">
            <Button class="change_img" type="primary">更换头像</Button>
          </Upload>
        </Row>
      </div>
      <div class="j_part3">&nbsp;
      </div>
      <div class="j_part2">
        <Row>
          <div class="jiben_hr">
            <hr class="b_hrLine"><span class="title">基本信息</span><hr class="a_hrLine">
          </div>
        </Row>
        <Form ref="formModal"  :rules="ruleValidate" :label-width="80">
          <Row class="first_row">
            <Col span="12">
              <FormItem label="姓名">
              <p>{{currentUser.user.name}}</p>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem  label="账号">
                <p class="j_text">{{currentUser.user.account}}</p>
              </FormItem>
            </Col>
            <Col span="12" >
              <FormItem label="工号">
              <p class="j_text">{{currentUser.user.empId}}</p>
              </FormItem>
            </Col>
            <Col span="12" >
              <FormItem  label="职位">
                <p class="j_text">{{currentUser.code['position'][currentUser.user.position]}}</p>
              </FormItem>
            </Col>
            <Col span="12" >
              <FormItem label="直接上级">
              <p class="j_text">{{managerName}}</p>
              </FormItem>
            </Col>
            <Col span="12" >
              <FormItem  label="所属部门">
                <span class="j_text" v-for="org in currentUser.orgList" :key="org.id">{{org.name+' '}}</span>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Row>
          <div class="jiben_hr" span="24">
            <hr class="b_hrLine"><span class="title">完善信息</span><hr class="a_hrLine">
          </div>
        </Row>
        <Form ref=""  :rules="ruleValidate" :label-width="80">
          <Row class="first_row1">
            <Col span="12">
              <FormItem label="性别">
              <Select v-model="editParams.gender" class="j_input" style="width: 150px;">
                  <Option v-for="(item,index) in this.currentUser.code.gender" :value="index" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12" >
              <FormItem  label="出生日期" >
                <DatePicker class="j_input" type="date" v-model="editParams.birthday" placeholder="请选择日期" style="width: 150px;"></DatePicker>
              </FormItem>
            </Col>
            <Col span="12" >
              <FormItem label="证件类型">
                <Select v-model="editParams.certType" class="j_input" style="width: 150px;">
                  <Option v-for="(item,index) in this.currentUser.code.certType" :value="index" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12" >
              <FormItem  label="证件号码">
                <Input class="j_input" v-model="editParams.certNumber" placeholder="请输入证件号码" style="width: 150px;"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="固定电话">
                <Input class="j_input" v-model="editParams.telNumber" placeholder="例：021-64660472" style="width: 150px;"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem  label="手机号码">
                <Input class="j_input" v-model="editParams.mobNumber" placeholder="请输入手机号码" style="width: 150px;"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="传真号码" prop="typeCode">
                <Input class="j_input" v-model="editParams.faxNumber" placeholder="例：021-64660472" style="width: 150px;"></Input>
              </FormItem>
            </Col>
            <Col span="12" >
              <FormItem  label="电子邮件" prop="typeCode">
                <Input class="j_input" v-model="editParams.email" placeholder="请输入类型代码" style="width: 150px;"></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="微信公众号" prop="remark">
                <Input v-model="editParams.wxOpenid" style="width:400px" placeholder="请输入微信公众号" ></Input>
              </FormItem>
            </Col>
            <Col span="24" >
              <FormItem label="备注" prop="remark">
                <Input v-model="editParams.remark" style="width:400px" type="textarea"  :autosize="{minRows:4,maxRows:6}"
                        placeholder="请在此输入您的备注信息"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="17">
              <FormItem class="btns">
                <Button type="primary" @click="editPersonalInformation">保存</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
  </div>
</template>
<script>
  export default {
    // name: 'ProductManagement',
    name: 'PersonalCenter',
    data() {
      return {
        currentUser: {},
        managerName:'',
        editParams:{
        gender:'',
        birthday:'',
        certType:'',
        certNumber:'',
        telNumber:'',
        mobNumber:'',
        faxNumber:'',
        email:'',
        wxOpenid:'',
        remark:''
        },
        ruleValidate:{
          gender:[
            { required: true, message: '性别不能为空', trigger: 'blur' }
          ],
          birthday:[
            { required: true, message: '出生日期不能为空', trigger: 'blur' }
          ],
          certType:[
            { required: true, message: '证件类型不能为空', trigger: 'blur' }
          ],
          certNumber:[
            { required: true, message: '证件号不能为空', trigger: 'blur' }
          ],
           mobNumber:[
            { type: 'string',pattern:/^1[3-578]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
          ],
          telNumber:[
            { type: 'string',pattern:/^0\d{2,3}-?\d{7,8}$/, message: '电话号码格式不正确', trigger: 'blur' }
          ],
          email:[
            { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
          ],
          faxNumber:[
            { type: 'string',pattern:/^0\d{2,3}-?\d{7,8}$/, message: '传真号码格式不正确', trigger: 'blur' }
          ],
          wxOpenid:[
            { required: true, message: '微信公众号不能为空', trigger: 'blur' }
          ]
        },
      }
    },
    methods: {
      formatDate(date){
        var y=date.getFullYear();
        var m=date.getMonth()+1;
        m = m < 10 ? '0' + m :m;
        var d=date.getDate();
        d = d < 10 ? '0' + d :d;
        return y + '/' + m + '/' + d;
      },
      editPersonalInformation(){
        this.editParams.birthday=this.formatDate(this.editParams.birthday);
        var self=this;
        this.oss.post({
          url: '/sys/user/editMe',
          data: self.editParams,
          ok(data, page, code) {
            self.oss.showMessage({type: 'success', content: '修改成功'});
          }
        });
        this.currentUser = this.oss.getGlobalData('currentUser');
        this.currentUser.user.gender=this.editParams.gender;
        this.currentUser.user.birthday=this.editParams.birthday;
        this.currentUser.user.certType=this.editParams.certType;
        this.currentUser.user.certNumber=this.editParams.certNumber;
        this.currentUser.user.telNumber=this.editParams.telNumber;
        this.currentUser.user.mobNumber=this.editParams.mobNumber;
        this.currentUser.user.faxNumber=this.editParams.faxNumber;
        this.currentUser.user.email=this.editParams.email;
        this.currentUser.user.wxOpenid=this.editParams.wxOpenid;
        this.currentUser.user.remark=this.editParams.remark;
        self.editParams.birthday=new Date(self.editParams.birthday);
      },
       handleUpload (file) {
          this.changePic(file);
          return false;
      },
      changePic(file){
        var self=this;
        this.oss.post({
          action: "upload",
          url:'/sys/user/uploadHeadPic',
          data:{
            file: file
          },
          ok(data){
            self.oss.showMessage({type: 'success', content: '更换头像成功'});
            self.currentUser.user.defaultUserPhoto = '/'+data;
          }
        })
      },
      showManager(){
        var self=this;
        this.oss.get({
          url:'/sys/user/findById',
          data:{
            id: self.currentUser.user.managerId
          },
          ok(data){
            if(data!==null){
              self.managerName = data.name;
            }else{
              self.managerName='';
            }

          }
        })
      }
    },
    mounted() {

    },
    created() {
      this.currentUser = this.oss.getGlobalData('currentUser');
      this.editParams.gender=this.currentUser.user.gender;
      this.editParams.birthday=this.currentUser.user.birthday;
      this.editParams.certType=this.currentUser.user.certType;
      this.editParams.certNumber=this.currentUser.user.certNumber;
      this.editParams.telNumber=this.currentUser.user.telNumber;
      this.editParams.mobNumber=this.currentUser.user.mobNumber
      this.editParams.faxNumber=this.currentUser.user.faxNumber;
      this.editParams.email=this.currentUser.user.email;
      this.editParams.wxOpenid=this.currentUser.user.wxOpenid;
      this.editParams.remark=this.currentUser.user.remark;
      this.showManager();
    }
  }
</script>

<style lang="less">
  @import "../../assets/css/common";
  #PCenter{
    width: 100%;
    height: 100%;
    //background-color: white;
    .j_user_img {
      .w(110px);
      .h(110px);
      margin-top: 35px;
      float: right;
      border-radius: 50%;
      -webkit-box-shadow: 2px 3px 6px #e6e6e6;
      -moz-box-shadow: 2px 3px 6px #e6e6e6;
      box-shadow: 2px 3px 6px #e6e6e6;
      }
    .change_img{
      margin-left: 250px;
      margin-top: 10px;
    }
    .confirm_img{
      margin-left: 136px;
      margin-top: -11px;
    }
    .b_hrLine{
      vertical-align:middle;
      display:inline-block;
      width: 25px;
      border: 0;
      color: #d7dadf;
      background-color: #d7dadf;
      height: 1px
    }
    .a_hrLine{
      vertical-align:middle;
      display:inline-block;
      width: 395px;
      border: 0;
      color: #d7dadf;
      background-color: #d7dadf;
      height: 1px
    }
    .jiben_hr{
      width:100%;
      text-align:left;
      margin-right:15px;
      // margin-top: 20px;
      .title {
        font-size: 14px;
        margin: 0px 10px 0px 10px;
      }
    }
    .jiben_row{
      min-width: 205px;
    }
    .first_row{
      margin-top: 10px;
      min-width: 205px;
    }
    .first_row1{
      margin-top: 13px;
      min-width: 205px;
    }
    .t_font{
      font-size: 18px;
      text-align: center;
    }
    .before_titile{
      margin-left: 0;
    }
    .btns{
      .ivu-form-item-content{
        text-align:center;
        .ivu-btn-primary{
          margin-right:-120px;

        }
      }
    }
    .ivu-form-item-label{
      width: 90px ! important;
    }
    .j_input{
      width:65%;
    }
    .j_part1{
      float: left;
      width: 280px;
      // height: 1000px;
      // padding-right: 60px;
    }
    .j_part2{
      margin:0 auto;
      float: left;
      width:700px;
      // height: 1000px;
      padding-right: 200px;
    }
    .j_part3{
      float: left;
      width: 100px;
      // height: 1000px;
      // padding-right: 60px;
    }
    .ivu-upload{
      float: right;
      margin-right: 9px;
    }
    // .ivu-form-item-content{
    //   margin-left: 120px;
    // }
  }


</style>
