<template>
    <div>
        <Modal class="chartAdd" title="编辑报表图表属性" width="600" v-model="show" :mask-closable="false">
            <Form ref="chartAddForm" :model="chartParam" :rules="formRuleValidate" :label-width="110">
                <Row>
                    <Col span="12">
                        <FormItem label="图表标题" prop="chartTitle">
                            <Input v-model="chartParam.chartTitle"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="图表类型" prop="chartType">
                            <Select v-model="chartParam.chartType">
                                <Option v-for="(item, index) in chartType" :value="index" :key="index">{{item}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="统计维度字段" prop="dimField">
                            <Input v-model="chartParam.dimField" icon="ios-search" readonly @on-click="showFields('dim')"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="数值字段" prop="valField">
                            <Input v-model="chartParam.valField" icon="ios-search" readonly @on-click="showFields('val')"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="数值字段名称" prop="valFieldName">
                            <Input v-model="chartParam.valFieldName" readonly/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem v-if="false" label="图表排序" prop="chartSort">
                            <InputNumber :max="10" :min="0" :step="1" v-model="chartParam.chartSort"/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="default" @click="reset">重置</Button>
                <Button type="primary" @click="save">提交</Button>
            </div>
        </Modal>
        <Modal class="chartAddFields" title="添加属性" v-model="fieldsShow" :mask-closable="false">
            <Table size="small" highlight-row :columns="columns" :data="fieldsList" @on-selection-change="selectedFields"/>
            <div slot="footer">
                <Button type="primary" @click="saveFields">提交</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    name: 'chartConfigAddEdit',
    props: ['reportId', 'queryChartList'],
    data() {
        return {
            show: false,
            fieldsShow: false,
            codeList: {},
            chartType: {},
            fieldsType: '',
            chartParam: {
                reportId: null,
                chartTitle: '',
                chartType: '',
                dimField: '',
                valField: '',
                valFieldName: '',
                chartSort: 0
            },
            formRuleValidate: {
                chartTitle: [{ required: true, message: '图表标题不能为空', trigger: 'blur' }],
                chartType: [{ required: true, message: '图表类型不能为空', trigger: 'blur' }],
                dimField: [{ required: true, message: '统计维度字段不能为空', trigger: 'blur' }],
                valField: [{ required: true, message: '数值字段不能为空', trigger: 'blur' }],
                valFieldName: [{ required: true, message: '数值字段名称不能为空', trigger: 'blur' }]
            },
            columns: [
                { type: 'selection', width: 60, align: 'center' },
                { 
                    title : '序号', width: 60, align: 'center',
                    render: (h, params) => {
                        return h('div', (params.index + 1));
                    }
                },
                { key : 'fieldCode', title : '字段代码', width: 120, align: 'center' },
                { key : 'fieldName', title : '字段名称', width: 135, align: 'center' },
                {key: 'dataType', title : '参数类型', width: 110,align: 'center',
                    render:(h,params)=>{
                        return h('span', params.row.dataType == '' ? '' : this.codeList['dataType'][params.row.dataType])
                    }
                },
            ],
            fieldsList: [],
            backUpFieldsList: [],
            selectedFieldList: []
        }
    },
    methods: {
        showFields(val) {
            this.fieldsType = val;
            if(this.fieldsList.length == 0) {
                this.getFieldsList(() => {this.echoFields(val)});
            } else {
                this.echoFields(val);
            }
        },
        echoFields(val) {
            this.fieldsList = JSON.parse(JSON.stringify(this.backUpFieldsList));
            // 已选择的list需要做回显
            if(val == 'dim' && this.chartParam.dimField) {
                var dimFields = this.chartParam.dimField.split(',');
                this.fieldsList.map(item => {
                    if(dimFields.indexOf(item.fieldCode) != -1) {
                        item._checked = true;
                    }
                });
            } else if(val == 'val' && this.chartParam.valField) {
                var valFields = this.chartParam.valField.split(',');
                this.fieldsList.map(item => {
                    if(valFields.indexOf(item.fieldCode) != -1) {
                        item._checked = true;
                    }
                });
            }
            this.fieldsShow = true;
        },
        getFieldsList(callback) {
            this.oss.get({
                url : '/sys/rptConfig/findFiledList',
                data : {reportId : this.reportId},
                ok: (data, page, code) =>{
                    if(data.length == 0) {
                        self.oss.showMessage({type: 'warning', content: '当前报表尚未配置filed信息！'});
                    }else {
                        this.backUpFieldsList = data;
                        this.codeList = code;
                    }
                },
                finish() {
                    callback();
                    this.fieldsShow = true;
                }
            });
        },
        selectedFields(val) {
            this.selectedFieldList = val;
        },
        saveFields() {
            if(this.selectedFieldList.length == 0) {
                this.oss.showMessage({type: 'warning', content: '您当前没有选择字段'});
                return;
            }
            var fields = [];
            var values = [];
            this.selectedFieldList.map(item => {
                fields.push(item.fieldCode);
                values.push(item.fieldName);
            });
            if(this.fieldsType == 'dim') {
                this.chartParam.dimField = fields.toString();
            } else if(this.fieldsType == 'val') {
                this.chartParam.valField = fields.toString();
                this.chartParam.valFieldName = values.toString();
            }
            this.fieldsShow = false;
        },
        save() {
            var type = 'edit';
            if(!this.chartParam.id) {
                type = 'add';
            }
            this.$refs.chartAddForm.validate((valid) => {
                if(valid) {
                    this.chartParam.reportId= this.reportId;
                    this.oss.post({
                        url: type=='add' ? '/sys/repotChartConfig/add' : '/sys/repotChartConfig/edit',
                        data: this.chartParam,
                        ok: (data, page, code) => {
                            this.chartList = data;
                            this.oss.showMessage({type: 'success', content: type=='add' ? '添加成功' : '修改成功'});
                        },
                        finish: () => {
                            this.queryChartList(this.reportId);
                            this.reset();
                            this.show = false;
                        }
                    });
                }
            })
        },
        reset() {
            this.$refs.chartAddForm.resetFields();
        }
    }
}
</script>
<style>

</style>


