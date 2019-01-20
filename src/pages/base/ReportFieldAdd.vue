<template>
    <div width="600" height="400">
        <Modal v-model="modal" :title="title" width="600" @on-cancel="fieldCancel" :mask-closable="false">
            <Form :model="reportFiledConfig" :label-width="100" ref="fieldForm" :rules="ruleRptField">
                <Row>
                    <Col span="12">
                    <FormItem label="字段代码" prop="fieldCode">
                        <Input element-id="flfcode"   v-model="reportFiledConfig.fieldCode" placeholder="请输入字段代码"></Input>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="字段名称" prop="fieldName">
                        <Input v-model="reportFiledConfig.fieldName" @on-focus="isSetFocus=false" placeholder="请输入字段名称"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <FormItem label="是否展示">
                        <RadioGroup v-model="reportFiledConfig.isShow" @on-change="isSetFocus=false">
                            <Radio v-for="(key,value) in dictes.isShow" :label="value" :key="value">{{key}}</Radio>
                        </RadioGroup>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="是否查询条件">
                        <RadioGroup v-model="reportFiledConfig.isQuery" @on-change="isSetFocus=false">
                            <Radio v-for="(key,value) in dictes.isQuery" :label="value" :key="value">{{key}}</Radio>
                        </RadioGroup>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <FormItem label="数据类型">
                        <Select v-model="reportFiledConfig.dataType" placeholder="请选择数据类型信息" @on-change="isSetFocus=false">
                            <Option v-for="(key,value) in dictes.dataType" :value="value" :key="value">{{key}}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="代码类型">
                        <Input v-model="reportFiledConfig.typeCode" @on-focus="isSetFocus=false"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <FormItem label="数据显示格式">
                        <Input v-model="reportFiledConfig.dataFormat" @on-focus="isSetFocus=false"></Input>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="数据对齐方式">
                        <Select v-model="reportFiledConfig.textAlign" placeholder="请选择数据类型信息" @on-change="isSetFocus=false">
                            <Option v-for="(key,value) in dictes.textAlign" :value="value" :key="value">{{key}}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span="12">
                    <FormItem label="排序序号">
                        <Input v-model="reportFiledConfig.sortNumber" @on-focus="isSetFocus=false"></Input>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="排序类型">
                        <Select v-model="reportFiledConfig.sortType" @on-change="isSetFocus=false">
                            <Option v-for="(key,value) in dictes.sortType" :value="value" :key="value">{{key}}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <FormItem label="字段显示宽度" prop="fieldWidth">
                        <Input v-model="reportFiledConfig.fieldWidth" @on-focus="isSetFocus=false"></Input>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="fieldSubmit">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script scoped>
    export default {
        data() {
            return {
                isSetFocus : true,
                title: '',
                modal: false,
                opertypes: '',
                dictes: {},
                ruleRptField: {
                    fieldCode: [
                        { required: true, message: '字段代码不能为空', trigger: 'blur' }
                    ],
                    fieldName: [
                        { required: true, message: '字段名称不能为空', trigger: 'blur' }
                    ],
                    fieldOrder: [
                        { type: 'string', pattern: /^\d+$/, message: '显示顺序为非负整数', trigger: 'blur' }
                    ],
                    fieldWidth: [
                        { type: 'string', pattern: /^\d+$/, message: '字段宽度为非负整数', trigger: 'blur' }
                    ]
                },
                reportFiledConfig: {
                    id: '',
                    reportId: '',
                    fieldCode: '',
                    fieldName: '',
                    isShow: '1',
                    fieldOrder: '',
                    fieldWidth: '',
                    typeCode: '',
                    dataType: 'string',
                    dataFormat: '',
                    textAlign: 'auto',
                    sortNumber: '0',
                    sortType: 'asc',
                    isQuery: '0',
                    createUser: '',
                    createTime: ''
                }
            }
        },
        props: ['pushfield', 'editfield'],
        methods: {
            fieldSubmit() {
                let self = this;
                this.$refs['fieldForm'].validate((valid) => {
                    if (valid) {
                        let temp_val = this.opertypes == 'add' ? 'pushfield' : 'editfield';
                        this.$emit(temp_val, JSON.stringify(self.reportFiledConfig));
                        self.fieldCancel();
                    } else {
                        this.$Message.info("请按提示进行操作！");
                    }
                });
            },
            fieldCancel() {
                this.reportFiledConfig.id = '';
                this.reportFiledConfig.reportId = '';
                this.reportFiledConfig.fieldCode = '';
                this.reportFiledConfig.fieldName = '';
                this.reportFiledConfig.isShow = '1';
                this.reportFiledConfig.fieldOrder = '';
                this.reportFiledConfig.fieldWidth = '';
                this.reportFiledConfig.typeCode = '';
                this.reportFiledConfig.dataType = 'string';
                this.reportFiledConfig.dataFormat = '';
                this.reportFiledConfig.textAlign = 'auto';
                this.reportFiledConfig.sortNumber = '0';
                this.reportFiledConfig.sortType = 'asc';
                this.reportFiledConfig.isQuery = '0';
                this.reportFiledConfig.createUser = '';
                this.reportFiledConfig.createTime = '';
                this.$refs.fieldForm.resetFields();
                this.isSetFocus = true;
                this.modal = false;

            },
            // getCodes() {
            //     this.oss.get({
            //         url: '/sys/code/findCodeByType',
            //         data: { 'typeCodes': 'isQuery,sortType,textAlign,isShow,dataType' },
            //         ok:(data, page, code) =>{
            //             this.dictes = data;
            //         }
            //     });
            // },
            setFiledInfo(val) {
                let parseField = JSON.parse(val);
                for (let key in this.reportFiledConfig) {
                    if (parseField[0][key] == null) {
                        this.reportFiledConfig[key] = '';
                    } else {
                        this.reportFiledConfig[key] = parseField[0][key] + "";
                    }
                }

            }
        },
        // updated () {
        //     if(this.isSetFocus) {
        //         this.getCodes();
        //     }
        // }
    }
</script>
