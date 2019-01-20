<template>
  <div id="modal">
    <Modal class="modal" width="600px" v-model="showModal"  @on-cancel="reset"  ok-text="保存">
      <h3>
        <Icon :type="modal.icon" size="18"></Icon>
        {{modal.text}}
      </h3>
      <Form ref="formModal" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <Row>
          <Col span="24">
            <FormItem label="文件名" prop="fileName">
              <Input v-model="formValidate.fileName" placeholder="请输入文件名"></Input>
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
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "model",
  props: ["codeList", "modal", "formValidate", "ruleValidate"],
  data() {
    return {
      showModal: false,
      modalLoading: true,
      loading: true,
            }
  },
  methods: {
    save() {
      this.$emit("save", {
        formData: this.formValidate,
        type: this.modal.type
      });
    },
    reset() {
      this.$emit("reset", { formData: this.formValidate });

    }
  }
};
</script>

<style lang="less">
@import "./../../assets/css/common";

.modal {
  .ivu-col-span-12 {
    display: inline-block;
    width: 49%;
    float: inherit;
  }
  .ivu-modal {
    .ivu-modal-content {
      padding: 0 20px 10px 20px;
      .ivu-modal-close {
        z-index: 99;
      }
      .ivu-modal-body {
        .p(70px 16px 20px 16px);
        h3 {
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
          .ivu-icon {
            margin-left: 10px;
            margin-right: 5px;
          }
        }
        .ivu-form {
          .ivu-col .ivu-date-picker {
            .w(100%);
          }
          .btns {
            .ivu-form-item-content {
              text-align: center;
              .ivu-btn-default {
                margin-right: 25px;
                margin-left: -50px;
              }
            }
          }
        }
      }
    }
    .ivu-modal-footer {
      text-align: center;
    }
  }
}
</style>



