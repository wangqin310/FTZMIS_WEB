<template>
  <div id="modal" style="min-width:600px;overflow:auto" >
    <Modal class="modal_j" width="600"  v-model="showModal"  @on-cancel="reset" ok-text="保存">
      <h3>
        <Icon :type="modal.icon" size="18"></Icon>
        {{modal.text}}
      </h3>
      <Form ref="formModal" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="12" >
          <FormItem label="类型代码" prop="typeCode">
            <Input v-model="formValidate.typeCode" placeholder="请输入类型代码"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="类型名称" prop="typeName">
            <Input v-model="formValidate.typeName" placeholder="请输入类型名称"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="条目代码" prop="itemCode">
            <Input v-model="formValidate.itemCode" placeholder="请输入条目代码"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="条目名称" prop="itemName">
            <Input v-model="formValidate.itemName" placeholder="请输入条目名称"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="系统代码" prop="systemCode">
            <Select class="selects" v-model="formValidate.systemCode" >
              <Option v-for="(item,index) in codeList.systemCode" :value="index" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12" >
          <FormItem label="条目排序" prop="itemSort">
            <InputNumber style="width:180.72px"  v-model="formValidate.itemSort" placeholder="请输入条目排序"></InputNumber>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <FormItem label="扩展属性" class="kuozhan" >
            <Input class="shuxing" v-model="formValidate.attr1" placeholder="属性1"></Input>
            <Input class="shuxing" v-model="formValidate.attr2" placeholder="属性2"></Input>
            <Input class="shuxing" v-model="formValidate.attr3" placeholder="属性3"></Input>
            <Input class="shuxing" v-model="formValidate.attr4" placeholder="属性4"></Input>
            <Input class="shuxing" v-model="formValidate.attr5" placeholder="属性5"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24" >
          <FormItem label="备注" prop="remark">
            <Input v-model="formValidate.remark" type="textarea" style="width:444.5px" :autosize="{minRows:4,maxRows:6}"
                     placeholder="请在此输入您的备注信息"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" class="btns">
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
          typeCode:[
            { required: true, message: '类型代码不能为空', trigger: 'blur' }
          ],
          typeName:[
            { required: true, message: '类型名称不能为空', trigger: 'blur' }
          ],
          itemCode:[
            { required: true, message: '条目代码不能为空', trigger: 'blur' }
          ],
          itemName:[
            { required: true, message: '条目名称不能为空', trigger: 'blur' }
          ],
          systemCode:[
            { required: true, message: '系统代码不能为空', trigger: 'blur' }
          ]
        },
      }
    },
    methods:{
      save() {
        /**
         * 新增与编辑代码：
         */
        this.$refs.formModal.validate(valid => {
          if (valid) {
            this.oss.post({
              url: this.modal.type == 'add' ? '/sys/code/add' : '/sys/code/edit',
              data: this.formValidate,
              ok: (data) => {
                this.oss.showMessage({ type: 'success', content: this.modal.type == 'add' ? '数据添加成功': '数据编辑成功' });
                this.$emit("getCodeList",'');
                this.showModal = false;
              },
              err: (error) =>{
                this.oss.showModal({
                    type: 'confirm',
                    title: '失败提醒',
                    content: this.modal.type == 'add' ? '数据添加失败': '数据编辑失败'
                });
              }
            });
          }
        });
      },
      reset(){
        this.$refs.formModal.resetFields();
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
