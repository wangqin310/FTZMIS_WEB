<template>
  <div id="modal">
    <Modal class="modal" width="600px" v-model="showModal"  @on-cancel="reset"  ok-text="保存">
      <h3>
        <Icon :type="modal.icon" size="18"></Icon>
        {{modal.text}}
      </h3>
     <Form ref="formModal" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="12" class="connectName">
          <FormItem label="连接名称" prop="connName" >
            <Input :disabled="modal.type=='edit'?true:false" v-model="formValidate.connName" placeholder="请输入连接名称" @on-blur="blurFn" ></Input>
          </FormItem>
          <span class="linkHint" v-if="hintText!=''" :style="{color:hintText==''?'#62c655':'red'}" >{{hintText}}</span>
          </Col>
          <Col span="12" prop="connNamee">
          <FormItem label="连接类型" prop="connType">
            <Select v-model="formValidate.connType" style="width:180px" @on-change="aaa(formValidate.connType)">
              <Option v-for="(item,index) in codeList.ftpConnType" :value="index" :key="index">{{ item }}</Option>
             </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="主机" prop="host">
            <Input v-model="formValidate.host" placeholder="请输入主机"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="端口" prop="port">
            <Input v-model="formValidate.port" placeholder="请输入端口" ></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="用户名" prop="username">
            <Input v-model="formValidate.username" placeholder="请输入用户名"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="密码"  prop="username">
            <Input v-if="modal.type=='add'" v-model="formValidate.password" placeholder="密码"></Input>
            <Input v-else-if="modal.type=='edit'" type="password" v-model="formValidate.password" placeholder="密码"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
         <FormItem label="超时时长">
             <InputNumber :max="300" :min="1" v-model="formValidate.timeout" placeholder="请输入超时时长/s" style="width:180px;"></InputNumber>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="状态" >
            <i-switch size="large" v-model="status">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="24" >
          <FormItem label="备注" >
            <Input v-model="formValidate.remark" type="textarea" style="width:440px" :autosize="{minRows:4,maxRows:6}"
                     placeholder="请在此输入您的备注信息"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" class="btns" style="aling:center">
        <Button type="warning" @click="testConn">测试</Button>
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
      hintText: "",
      status: true,
      showModal: false,
      modalLoading: true,
      loading: true,
      cityList: [
        {
          value: "0",
          label: "ftp"
        },
        {
          value: "1",
          label: "sftp"
        }
      ],
      model1: ""
    };
  },
  watch: {
    status: function(val) {
      this.formValidate.status = val == true ? 1 : 0;
    }
  },
  methods: {
    aaa(val) {
      switch (val) {
        case "ftp":
          this.formValidate.port = "21";
          break;
        case "sftp":
          this.formValidate.port = "22";
          break;
      }
    },
    blurFn() {
      var self = this;
      if (self.formValidate.connName == "") {
        self.hintText = "";
        return;
      }
      this.oss.post({
        url: "/sys/ftpConfig/validName",
        data: {
          connName: self.formValidate.connName
        },
        ok(data, page, code) {
          self.hintText = "";
        },
        err(err) {
          self.hintText = "连接名已存在，请重新输入！";
        }
      });
    },
    testConn() {
      var self = this;
      this.oss.post({
        url: "/sys/ftpConfig/testConn",
        data: self.formValidate,
        ok(data, page, code) {
          self.oss.showMessage({ type: "success", content: "FTP连接成功" });
        },
        // err(err) {
        //   self.oss.showModal({ type: "error", content: err });
        // }
      });
    },
    save() {
      this.$emit("save", {
        formData: this.formValidate,
        type: this.modal.type
      });
    },
    reset() {
      this.$emit("reset", { formData: this.formValidate });
    },
    change(status) {
      this.$Message.info("开关状态：" + status);
    }
  }
};
</script>

<style lang="less">
@import "./../../assets/css/common";

#modal {
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
        .connectName {
          position: relative;
        }
        .linkHint {
          position: absolute;
          top: 36px;
          left: 80px;
        }
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
  }
}
</style>



