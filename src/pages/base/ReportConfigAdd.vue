<template>
    <div id="modal">
        <Modal class="RptCfgAddmodal" :mask-closable="false" width="600" v-model="isshow"  @on-cancel="quit"  ok-text="保存">
            <h3>
                <Icon :type="modal.icon" size="18"></Icon>
                {{modal.text}}
            </h3>
            <Form ref="reportCfgForm" :model="reportConfig" :rules="ruleReportConfig" :label-width="80">
                <Row>
                    <Col span="12" pull="1">
                        <FormItem label="报表代码" prop="reportCode">
                            <Input v-model="reportConfig.reportCode"  placeholder="请输入报表代码" ></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="报表名称" prop="reportName">
                            <Input v-model="reportConfig.reportName" placeholder="请输入报表名称"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12" pull="1">
                        <FormItem label="是否分页">
                            <RadioGroup v-model="reportConfig.pageFlag">
                                <Radio v-for="(key,value) in codes.pageFlag" :label="value" :key="value"><span>{{key}}</span></Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="分页大小">
                            <Select  v-model="reportConfig.pageSize">
                                <Option v-for="item in pageSizeList" :value="item.value" :key="item.value">{{item.label}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12" pull="1">
                        <FormItem label="数据源">
                            <Select v-model="reportConfig.dataSource"placeholder="请选择数据源信息">
                                <Option v-for="item in dataSourceList" :value="item.value" :key="item.value">{{item.label}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="状态">
                            <RadioGroup v-model="reportConfig.status">
                                <Radio v-for="(key,value) in codes.status" :label="value" :key="value"><span>{{key}}</span></Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>

                    <Col span="24" pull="1">
                        <FormItem label="SQL脚本" prop="sqlText">
                            <Input v-model="reportConfig.sqlText" type="textarea" placeholder="请输入sql脚本" :autosize="{minRows:3,maxRows:6}"></Input>
                        </FormItem>
                    </Col>
                    <Col span="24" pull="1">
                        <FormItem label="备注">
                            <Input v-model="reportConfig.remark" type="textarea" :autosize="{minRows:3,maxRows:6}"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
          <div slot="footer" class="btns">
            <Button type="primary" @click="submit">保存</Button>
          </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isshow : false,
                pageSizeList : [
                    {value : 10, label : '10'},
                    {value : 20, label : '20'},
                    {value : 30, label : '30'},
                    {value : 40, label : '40'}
                ],
                ruleReportConfig : {
                    reportCode : [
                        { required: true, message: '报表代码不能为空', trigger: 'blur' }
                    ],
                    reportName : [
                        { required: true, message: '报表名称不能为空', trigger: 'blur' }
                    ],
                    sqlText : [
                        { required: true, message: 'sql脚本不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submit() {
                let self = this;
                this.$refs['reportCfgForm'].validate((valid) => {
                    if(valid) {
                        this.oss.post({
                            url : '/sys/rptConfig/' + this.modal.type,
                            data : {
                                'id' : self.reportConfig.id,
                                'reportCode' : self.reportConfig.reportCode,
                                'reportName' : self.reportConfig.reportName,
                                'pageFlag' : self.reportConfig.pageFlag,
                                'pageSize' : self.reportConfig.pageSize,
                                'dataSource' : self.reportConfig.dataSource,
                                'sqlText' : self.reportConfig.sqlText,
                                'status' : self.reportConfig.status,
                                'remark' : self.reportConfig.remark
                            },
                            ok(data,page,code) {
                                self.oss.showMessage({type: 'success', content: '操作成功'});
                                self.$emit('reload','');
                            }
                        });
                        self.quit();
                    }else {
                        this.$Message.info("请按提示进行操作！");
                    }
                });

            },
            quit() {
                this.reportConfig.id = '';
                this.reportConfig.reportCode = '';
                this.reportConfig.reportName = '';
                this.reportConfig.pageFlag = '1';
                this.reportConfig.pageSize = '10';
                this.reportConfig.dataSource = '';
                this.reportConfig.sqlText = '';
                this.reportConfig.createUser = '';
                this.reportConfig.createTime = '';
                this.reportConfig.modifyUser = '';
                this.reportConfig.modifyTime = '';
                this.reportConfig.status = '1';
                this.reportConfig.delFlag = '';
                this.reportConfig.remark = '';
                this.$refs.reportCfgForm.resetFields();
                this.isshow = false;
            }
        },
        props: ['dataSourceList','codes','reload','reportConfig','modal']
    }
</script>

<style lang="less">
        @import "./../../assets/css/common";

        .RptCfgAddmodal {
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
                  /* background: red; */
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
                  .btns2{
                    text-align:right;
                      .ivu-btn-default{
                        margin-right:25px;
                        margin-left:-50px;
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

