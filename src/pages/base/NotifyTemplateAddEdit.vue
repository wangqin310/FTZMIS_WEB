<template>
  <div id="modal" style="min-width:600px;overflow:auto" >
    <Modal class="modal_j" width="600"  v-model="showModal"  @on-cancel="reset" ok-text="保存">
      <h3>
        <Icon :type="modal.icon" size="18"></Icon>
        {{modal.text}}
      </h3>
      <Form ref="formModal" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <Row>
          <Col span="12">
          <FormItem label="通知类型" prop="notifyType">
            <Select class="selects" v-model="formValidate.notifyType" placeholder="请选择通知类型" style="width:150px">
              <Option v-for="(item,index) in codeList.notifyType" :value="index" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="模板名称" prop="templateName">
            <Input v-model="formValidate.templateName" placeholder="请输入模板名称"  style="width:150px"></Input>
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem label="服务商模板ID" prop="templateId" >
            <Input v-model="formValidate.templateId" placeholder="请输入服务商模板ID"  style="width:415.5px"></Input>
          </FormItem>
          </Col>
          <Col span="24" >
          <FormItem label="模板内容" prop="templateContent">
            <Input v-model="formValidate.templateContent" type="textarea" style="width:415.5px" :autosize="{minRows:4,maxRows:6}"
                     placeholder="请在此输入您的模板内容"></Input>
          </FormItem>
          </Col>
           <Col span="24" >
          <FormItem label="备注" prop="remark">
            <Input v-model="formValidate.remark" type="textarea" style="width:415.5px" :autosize="{minRows:4,maxRows:6}"
                     placeholder="请在此输入您的备注信息"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" class="btns">
        <Button v-if="this.modal.type == 'add'" type="default" @click="reset">重置</Button>
        <Button type="primary" @click="save">保存</Button>
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
          notifyType:[
            { required: true, message: '通知类型不能为空', trigger: 'blur' }
          ],
          templateName:[
            { required: true, message: '模板名称不能为空', trigger: 'blur' }
          ],
          templateContent:[
            { required: true, message: '模板内容不能为空', trigger: 'blur' }
          ]
        },
      }
    },
    methods:{
      save() {
        var self = this;
        /**
         * 新增代码：
         */
        if (this.modal.type == 'add') {
            this.$refs.formModal.validate(valid => {
              if (valid) {
                this.oss.post({
                  url: '/sys/notifyTemplate/add',
                  data: self.formValidate,
                  ok(data) {
                    self.oss.showMessage({type: 'success', content: '模板添加成功'});
                    self.$emit('getNotifyTemplateList','');
                    self.showModal = false;
                  },
                  // err(error) {
                  //   self.oss.showModal({
                  //     type: 'confirm',
                  //     title: '失败提醒',
                  //     content: '模板添加失败',
                  //     onOk: () => {
                  //     },
                  //   });
                  // }
                });
            }
          });
        }
        /**
         * 编辑代码：
         */
        else if (this.modal.type == 'edit') {
          this.$refs.formModal.validate(valid => {
              if (valid) {
                this.oss.post({
                  url: '/sys/notifyTemplate/edit',
                  data: self.formValidate,
                  ok(data) {
                    self.oss.showMessage({type: 'success', content: '模板编辑成功'});
                    self.$emit('getNotifyTemplateList','');
                    self.showModal = false;
                  },
                  // err(error) {
                  //   self.oss.showModal({
                  //     type: 'confirm',
                  //     title: '失败提醒',
                  //     content: '模板编辑失败'
                  //   });
                  // }
                });
              }});
        }
      },
      /**
       * 重置
       *
       */
      reset() {
        this.$refs.formModal.resetFields();
      },
      change(status){
        if(status===true){
          this.formValidate.status=1;
        }else{
          this.formValidate.status=0;
        }
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
                .ivu-btn-default{
                  margin-right:25px;
                  margin-left:-50px;
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
  }
</style>
