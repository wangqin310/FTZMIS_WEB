<template>
  <div id="modal" style="min-width:600px;overflow:auto" >
    <Modal class="modal_j" width="600"  v-model="showModal"  @on-cancel="reset"  ok-text="保存">
      <h3>
        <Icon :type="modal.icon" size="18"></Icon>
        {{modal.text}}
      </h3>
      <Form ref="formModal" :model="formValidate" :rules="ruleValidate" :label-width="85">
        <Row>
          <Col span="12" v-if="modal.type==='add'">
          <FormItem label="连接名称" prop="connName" >
            <Input v-model="formValidate.connName" placeholder="请输入连接名称" @on-blur="testByConnName()"></Input>
          </FormItem>
          </Col>
          <Col span="12" v-if="modal.type==='edit'">
          <FormItem label="连接名称">
            <Input v-model="formValidate.connName" placeholder="请输入连接名称" disabled></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="连接类型" prop="connType">
            <Select class="selects" v-model="formValidate.connType" placeholder="请选择连接类型" @on-change="changeConnType">
              <Option v-for="(item,index) in codeList.dbConnType" :value="index" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          </Col>

          <Col span="12">
          <FormItem label="数据库类型" prop="dbType">
            <Select class="selects" v-model="formValidate.dbType" placeholder="请选择数据库类型"  @on-change="changeDBType">
              <Option v-for="(item,index) in codeList.dbType" :value="index" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="驱动类名" prop="driverClass">
            <Input v-model="formValidate.driverClass" placeholder="请输入驱动类名"  style="width:98.5%"></Input>
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem label="连接URL" prop="url">
            <Input v-model="formValidate.url" placeholder="请输入连接URL" style="width:98.5%" ></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="用户名" prop="username">
            <Input v-model="formValidate.username" placeholder="请输入用户名" ></Input>
          </FormItem>
          </Col>
          <Col span="12" >
          <FormItem label="密码" prop="password">
            <Input v-model="formValidate.password" type="password" placeholder="请输入密码"  ></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="初始化连接池" prop="initialSize">
            <!-- <Input type="number" v-model="formValidate.password" placeholder="请输入密码"></Input> -->
            <InputNumber :max="5" :min="1"  style="width:173.72px"  v-model="formValidate.initialSize" placeholder="输入初始化连接池大小(1~5)"></InputNumber>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="最大连接池" prop="maxTotal">
            <InputNumber :max="10" :min="1"  style="width:173.72px"  v-model="formValidate.maxTotal" placeholder="输入最大连接池大小(1~10)" @on-blur="compare()"></InputNumber>
          </FormItem>
          </Col>
          
          <Col span="24" >
          <FormItem label="备注" prop="remark">
            <Input v-model="formValidate.remark" type="textarea" style="width:98.5%" :autosize="{minRows:4,maxRows:6}"
                     placeholder="请在此输入您的备注信息"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" class="btns">
        <Button type="warning" @click="test">测试</Button>
        <Button type="primary" @click="save">保存</Button>
        <Button v-if="modal.type==='add'" type="default" @click="reset">重置</Button>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'model',
    props:['codeList','modal','formValidate'],
    data() {
      return {
        showModal:false,
        modalLoading:true,
        loading: true,
        ruleValidate:{
          connName:[
            { required: true, message: '连接名称不能为空', trigger: 'blur' }
          ],
          driverClass:[
            { required: true, message: '驱动类名不能为空', trigger: 'blur' }
          ],
          connType:[
            { required: true, message: '连接类型不能为空', trigger: 'blur' }
          ],
          dbType:[
            { required: true, message: '数据库类型不能为空', trigger: 'blur' }
          ],
          url:[
            { required: true, message: '连接URL不能为空', trigger: 'blur' }
          ],
        },
      }
    },
    methods:{
      save() {
        var self = this;
        /**
         * 新增代码：
         */
        if (self.modal.type == 'add') {
            this.$refs.formModal.validate(valid => {
              if (valid) {
                this.oss.post({
                  url: '/sys/dbConfig/add',
                  data: self.formValidate,
                  ok(data) {
                    self.oss.showMessage({type: 'success', content: '数据库连接添加成功'});
                    self.$emit("getDBConfigList",'');
                    self.showModal = false;
                  },
                  // err(error) {
                  //   self.oss.showModal({
                  //       type: 'error',
                  //       title: '异常提示',
                  //       content: '数据库连接添加失败'
                  //   });
                  // }
                });
            }
          });
        }
        /**
         * 编辑代码：
         */
        else if (self.modal.type == 'edit') {
          this.$refs.formModal.validate(valid => {
            if (valid) {
              this.oss.post({
                url: '/sys/dbConfig/edit',
                data: self.formValidate,
                ok(data) {
                  self.oss.showMessage({type: 'success', content: '数据库连接编辑成功'});
                  self.$emit("getDBConfigList",'');
                  self.showModal = false;
                },
                // err(error) {
                //   self.oss.showModal({
                //       type: 'error',
                //       title: '异常提示',
                //       content: '数据库连接编辑失败'
                //   });
                // }
              });
            }
          });
        }
      },
       /**
       * 重置
       *
       */
      reset() {
        this.$refs.formModal.resetFields();
      },
      test(){
        this.oss.post({
          url: '/sys/dbConfig/testConn',
          data: this.formValidate,
          ok: (data) =>{
            this.oss.showMessage({type: 'success', content: '数据库连接正确'});
            this.$emit("getDBConfigList",'');
          },
          // err: (error) => {
          //   this.oss.showModal({
          //     type: 'error',
          //     title: '异常提示',
          //     content: '数据库连接有误,'+error
          //   });
          // }
        })
      },
       testByConnName(){
        var self = this;
        if(self.formValidate.connName !== null){
          this.oss.post({
            url: '/sys/dbConfig/validName',
            data: {'connName': self.formValidate.connName},
            ok(data) {

            },
            // err(error) {
            //   self.oss.showModal({
            //     type: 'error',
            //     title: '异常提示',
            //     content: '数据库连接名称不可用'
            //   });
            // }
          })
        }
      },
      compare(){
        if(this.formValidate.maxTotal<this.formValidate.initialSize){
          this.oss.showModal({
              type: 'error',
              title: '异常提示',
              content: '最大连接池大小不得小于初始化连接池大小'
          });
        }
      },
      changeDBType(){
        if(this.formValidate.connType==='jdbc'){
          switch(this.modal.type) {
          case 'add':
            this.getCodeDetailByType(this.formValidate.dbType);
            break;
          case 'edit':
            if(this.isFirst) {
              this.isFirst = false;
            }else {
              this.getCodeDetailByType(this.formValidate.dbType);
            }
            break;
          }
        }
      },
      changeConnType(val){
        if(val!=='jdbc'){
          this.formValidate.url='';
          this.formValidate.driverClass='';
        }
      },
      getCodeDetailByType(val) {
        let self = this;
        this.oss.get({
          url: '/sys/code/findCodeDetailByType',
          data: {'typeCodes': 'dbType'},
          ok(data,page,code) {
            if(val!=undefined){
              self.formValidate.url=data.dbType[val].attr2;
              self.formValidate.driverClass=data.dbType[val].attr1;
            }

          },
          // err(error) {
          //   self.oss.showModal({
          //     type: 'error',
          //     title: '异常提示',
          //     content: '系统异常,'+error
          //   });
          // }
        });
      }
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/common";

  .modal_j {

    .ivu-col-span-12 {
      display: inline-block;
      width: 49%;
      float: inherit;
    }
    .ivu-modal {
      .ivu-modal-content {
        padding: 0 20px 10px 20px;
        .ivu-modal-close{
          z-index:99;
        }
        .ivu-modal-body {
          .p(70px 16px 20px 16px);
          h3{
            position: absolute;
            height: 50px;
            width: calc(100% - 32px);
            top: 0;
            left: 16px;
            bottom: 22px;
            line-height: 50px;
            font-size: 16px;
            border-bottom: 1px solid #e6e6e6;
            margin-bottom: 18px;
            .ivu-icon{
              margin-left:10px;
              margin-right:5px;
            }
          }
          .ivu-form{
            .ivu-col .ivu-date-picker{
              .w(100%);
            }
            .btns{
              .ivu-form-item-content{
                text-align:center;
                .ivu-btn-warning{
                  margin-right:25px;
                  margin-left:-50px;
                }
                .ivu-btn-primary{
                  margin-right:25px;
                  margin-left:0px;
                }
                .ivu-btn-default{
                  margin-right:25px;
                  margin-left:0px;
                }
              }
            }
          }
        }
      }
      .ivu-modal-footer {
        text-align: center;
      }
      .kuozhan{
        width: 100%;
      }
      .shuxing{
        width: 19.2%;
      }
    }
    .jiben_hr{
      width:100%;
      text-align:left;
      margin-right:15px;
      margin-top: -13px;
      margin-bottom: 6px;
      .title {
        font-size: 14px;
        margin: 0px 10px 0px 10px;
      }
    }
    .jiben_hr2{
      width:100%;
      text-align:left;
      margin-right:15px;
      margin-top: -20px;
      margin-bottom: 8px;
    }
    .b_hrLine{
      vertical-align:middle;
      display:inline-block;
      width: 5%;
      border: 0;
      color: #babcbe;
      background-color: #babcbe;
      height: 1px
    }
    .a_hrLine{
      vertical-align:middle;
      display:inline-block;
      width: 80%;
      border: 0;
      color: #babcbe;
      background-color: #babcbe;
      height: 1px
    }
    .c_hrLine{
      vertical-align:middle;
      display:inline-block;
      width: 100%;
      border: 0;
      color: #babcbe;
      background-color: #babcbe;
      height: 1px
    }
  }
</style>
