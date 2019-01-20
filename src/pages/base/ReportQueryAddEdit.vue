<template>
    <div width="600" height="400">
        <Modal :title="queryFormAddTitle" width="600" v-model="rptQueryFormShowModal" @on-cancel="queryFormRest"   >
            <Form ref="rptQueryForm":model="queryFormValidate" :rules="queryFormRuleValidate" :label-width="110">
                <Row>
                    <Col span="12" pull="1">
                        <FormItem label="参数名称" prop="paramName">
                            <Input v-model="queryFormValidate.paramName" placeholder="请输入参数名称" ></Input>
                        </FormItem>
                    </Col>

                    <Col span="12">
                        <FormItem label="参数描述" prop="paramDesc">
                            <Input v-model="queryFormValidate.paramDesc" placeholder="请输入参数描述" ></Input>
                        </FormItem>
                    </col>

                    <Col span="12" pull="1">
                        <FormItem label="参数类型" prop="paramType">
                            <Select v-model="queryFormValidate.paramType" placeholder="请选择参数类型" @on-change="isSetFocus=false">
                                <Option v-for="(key,value) in paramTypeCodes.dataType" :value="value" :key="value">{{key}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="控件宽度" prop="paramWidth">
                            <Input v-model="queryFormValidate.paramWidth" placeholder="请输入控件宽度" ></Input>
                        </FormItem>
                    </col>

                    <Col span="12" pull="1">
                        <FormItem label="是否范围查询" prop="isRange">
                            <i-switch v-model="queryFormValidate.isRange == '0' ? false : true" @on-change="switchChange">
                                <span v-for="(item,index) in isQuery" :slot="index == '0' ? 'close' : 'open'" :key="index" >{{item}}</span>
                            </i-switch>
                        </FormItem>
                    </Col>
                    <Col span="12" >
                        <FormItem label="默认值" prop="defaultValue">
                            <Input v-model="queryFormValidate.defaultValue" placeholder="请输入默认值" ></Input>
                        </FormItem>
                    </Col>
                    <Col span="12" pull="1">
                        <FormItem label="内部提示文本" prop="paramText">
                            <Input v-model="queryFormValidate.paramText" placeholder="请输入控件内部提示文本" ></Input>
                        </FormItem>
                    </col>
                    <Col span="24" pull="1">
                        <FormItem label="备注" prop="remark">
                          <Input v-model="queryFormValidate.remark" type="textarea" :autosize="{minRows:4,maxRows:6}"
                                 placeholder="请在此输入您的备注信息"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="queryFormSubmit">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                queryFormAddTitle:'',
                rptQueryFormShowModal: false,
                isQuery : {'1':'是','0':'否'},
                queryFormRuleValidate:{
                    paramName: [
                        { required: true, message: '参数名称不能为空', trigger: 'blur' }
                    ],
                    paramDesc: [
                        { required: true, message: '参数描述不能为空', trigger: 'blur' }
                    ],
                    paramWidth: [
                        { type: 'string', pattern: /^\d+$/, message: '控件宽度为非负整数', trigger: 'blur' }
                    ]
                },
                fixedParamDesc:['数据权限','数据权限（排名）']
            }
        },
        props: ['queryFormValidate','paramTypeCodes','operType'],
        methods: {
            switchChange(status) {
                this.queryFormValidate.isRange = status ? '1' : '0';
            },
            queryFormRest() {
                this.$emit('rptQueryAddFormRest','');
            },
            queryFormSubmit() {
                let self = this;
                this.$refs['rptQueryForm'].validate((valid) => {
                    if (valid ) {
                        if(self.verifyFixed()) {
                            self.$emit('rptQueryAddFormSubmit',{formValidate:JSON.stringify(this.queryFormValidate),operType:this.operType});
                            self.rptQueryFormShowModal = false;
                        }
                    } else {
                        this.$Message.info("请按提示进行操作！");
                    }
                });
            },
            verifyFixed() {
                let isPass = true;
                if(this.queryFormValidate.paramType == 'fixed') {
                    if(! this.verifyIsContain(this.fixedParamDesc,this.queryFormValidate.paramDesc)) {
                        this.oss.showModal({type: 'warning', title: '', content: '参数类型为固定值时，参数描述为“数据权限”或者“数据权限（排名）”'});
                        isPass = false;
                    }
                }else if(this.queryFormValidate.paramType == 'selected') {
                    if(this.queryFormValidate.defaultValue == '') {
                        this.oss.showModal({type: 'warning', title: '', content: '参数类型为下拉值时，默认值必须为它的代码值'});
                        isPass = false;
                    }
                }
                return isPass;
            },
            verifyIsContain(arr,ele) {
                let verifyContain = false;
                arr.forEach(item => {
                    if(item == ele) {
                        verifyContain = true;
                    }
                });
                return verifyContain;
            }

        }
    }
</script>

