<template>
    <Modal class="roleAddEditModal" width="600" v-model="showModal"  @on-cancel="reset" ok-text="保存">
      <h3>
        <Icon :type="modal.icon" size="18"></Icon>
        {{modal.text}}
      </h3>
      <Form ref="formModal" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="24">
            <FormItem label="角色名称" prop="name">
              <Input v-model="formValidate.name" placeholder="请输入角色名称"></Input>
            </FormItem>
          </Col>
          <Col span="24">
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
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'model',
    props:['codeList','modal','formValidate','ruleValidate'],
    data() {
      return {
        showModal:false,
        modalLoading:true,
        loading: true
      }
    },
    methods:{
      save(){
        this.$emit("save",{formData:this.formValidate,type:this.modal.type});
      },
      reset(){
        this.$emit("reset",{formData:this.formValidate});
      }
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/common";

  .roleAddEditModal {
    .ivu-modal-footer {
      text-align: center;
    }
  }
</style>
