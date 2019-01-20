<template>
    <div>
        <Modal v-model="rptQueryShowModal" :title="title" width="800" @on-cancel="rptQueryModalClose" :mask-closable="false">
            <div>
                <ul class="btns_ul">
                    <li class="btns_li" v-for="(item,index) in rptQueryBtnList" :key="index">
                      <Button :type="item.type" :disabled="(item.name=='edit'&&rptQuerySelectedList.length!=1)||(item.name=='delete'&&rptQuerySelectedList.length==0)?'disabled':false" :icon="item.icon" @click="clickRptQueryBtn(item.name)">{{item.text}}</Button>
                    </li>
                    <li class="btns_li">
                        <Button type="primary" @click="queryUpMove" :disabled="rptQuerySelectedList.length==1 ? false:'disabled'"><Icon type="md-arrow-round-up"></Icon> 上 移</Button>
                    </li>
                    <li class="btns_li">
                        <Button type="primary" @click="queryDownMove" :disabled="rptQuerySelectedList.length==1 ? false:'disabled'"><Icon type="md-arrow-round-down"></Icon> 下 移</Button>
                    </li>
                </ul>
            </div>
            <div>
                <Table ref="queryTab" stripe border highlight-row  :loading="queryTabLoading" :columns="rptQueryTabColumnes" :data="rptQueryDataList" height="350" @on-selection-change="chooseQueryData"/>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="rptQuerySubmit">确定</Button>
            </div>
        </Modal>
        <rptQueryAddEdit ref="rptQueryAdd" :paramTypeCodes="paramTypeCodes" :queryFormValidate="queryFormValidate" :operType="operType" @rptQueryAddFormSubmit="rptQueryAddFormSubmit" @rptQueryAddFormRest="rptQueryAddFormRest"></rptQueryAddEdit>
    </div>
</template>

<script>
    import rptQueryAddEdit from '@/pages/base/ReportQueryAddEdit'

    let sortNum = 0;
    let rptQueryCodes= {};
    export default {
        data () {
            return {
                title:'',
                rptQueryShowModal: false,
                rptQueryBtnList:[
                    {text: '新 增', icon: 'md-add', type: 'primary', name: 'add'},
                    {text: '修 改', icon: 'md-create', type: 'primary', name: 'edit'},
                    {text: '删 除', icon: 'md-close', type: 'error', name: 'delete'}
                ],
                rptQuerySelectedList:[],
                queryTabLoading:false,
                reportId:null,
                rptQueryTabColumnes:[
                    {type:'selection',width:60,align:'center'},
                    {key: 'paramSort', title : '序号', width: 80,align: 'center'},
                    {key: 'paramName', title : '参数名称', width: 120,align: 'center'},
                    {key: 'paramDesc', title : '参数描述', width: 120,align: 'center'},
                    {key: 'paramType', title : '参数类型', width: 120,align: 'center',render:(f,obj)=>{
                        return obj.row.paramType != '' && obj.row.paramType in rptQueryCodes['dataType'] ? f('span',rptQueryCodes['dataType'][obj.row.paramType]) : '';
                    }},
                    {key: 'paramWidth', title : '控件宽度', width: 120,align: 'center'},
                    {key: 'paramText', title : '控件内部提示文本', width: 200,align: 'center'},
                    {key: 'isRange', title : '是否范围查询', width: 120,align: 'center',render: (f,obj) => {
                        return obj.row.isRange != '' && obj.row.isRange in rptQueryCodes['isQuery'] ? f('span',rptQueryCodes['isQuery'][obj.row.isRange]) : '';
                    }},
                    {key: 'defaultValue', title : '默认值', width: 160,align: 'center'},
                    {key: 'createUser', title : '创建人员', width: 120,align: 'center'},
                    {key: 'createTime', title : '创建时间', width: 150,align: 'center'},
                    {key: 'remark', title : '备注', width: 200,align: 'center'}
                ],
                rptQueryDataList:[],
                paramTypeCodes : {},
                queryFormValidate:{
                    id:null,
                    reportId : self.reportId,
                    paramName : '',
                    paramDesc : '',
                    paramType : 'string',
                    paramWidth : null,
                    paramText : '',
                    paramSort : null,
                    isRange : '0',
                    defaultValue : '',
                    remark : ''
                },
                operType:''
            }
        },
        components: {
            rptQueryAddEdit
        },
        methods: {
            getRptQueryInfo() {
                let self= this;
                this.oss.get({
                    url:'/sys/rptConfig/rptQueryList',
                    data: {reportId : self.reportId},
                    ok(data,page,code) {
                        if(data.length > 0) {
                            data.forEach(item => {
                                item.paramSort = ++sortNum;
                            });
                        }
                        self.rptQueryDataList = data;
                        code['dataType']['fixed'] = '固定值';
                        code['dataType']['selected'] = '下拉框';
                        self.paramTypeCodes = code;
                        rptQueryCodes = code;
                    }
                });
            },
            rptQueryModalClose() {
                this.rptQueryShowModal = false;
                this.rptQuerySelectedList = [];
                this.rptQueryDataList = [];
                sortNum = 0;

            },
            clickRptQueryBtn(name) {
                switch(name) {
                    case 'add':
                        this.rptQueryAddFormRest();
                        this.operType = 'add';
                        this.$refs.rptQueryAdd._data.queryFormAddTitle='添加单表查询配置';
                        this.$refs.rptQueryAdd._data.rptQueryFormShowModal = true;
                        break;
                    case 'edit':
                        this.rptQueryAddFormRest();
                        this.operType = 'edit';
                        let currentChooseData = this.rptQuerySelectedList[0];
                        this.queryFormValidate = {
                            id : currentChooseData.id,
                            reportId : currentChooseData.reportId,
                            paramName : currentChooseData.paramName,
                            paramDesc : currentChooseData.paramDesc,
                            paramType : currentChooseData.paramType,
                            paramWidth : currentChooseData.paramWidth + '',
                            paramText : currentChooseData.paramText,
                            paramSort : currentChooseData.paramSort,
                            isRange : currentChooseData.isRange,
                            defaultValue : currentChooseData.defaultValue,
                            remark : currentChooseData.remark
                        };
                        this.$refs.rptQueryAdd._data.queryFormAddTitle='编辑单表查询配置';
                        this.$refs.rptQueryAdd._data.rptQueryFormShowModal = true;
                        break;
                    case 'delete':
                        let self = this;
                        self.oss.showModal({
                            type: 'warning',
                            title:'删除确认',
                            content : '确认删除该数据吗？',
                            closable:true,
                            onOk : () => {
                                let tempList = [];
                                self.rptQueryDataList.forEach(element => {
                                    if(!self.isContain(self.rptQuerySelectedList,element)) {
                                        tempList.push(element);
                                    }
                                });
                                sortNum = 0;
                                tempList.forEach(ele => {
                                    ele.paramSort = ++sortNum;
                                });
                                self.rptQueryDataList = tempList;
                                self.rptQuerySelectedList = [];
                            }
                        });
                        break;
                }
            },
            chooseQueryData(val) {
                this.rptQuerySelectedList = val;
            },
            rptQueryAddFormSubmit(val) {
                let currentData = JSON.parse(val.formValidate);
                switch(val.operType) {
                    case 'add':
                        currentData.paramSort = ++ sortNum;
                        this.rptQueryDataList.push(currentData);
                        break;
                    case 'edit':
                        this.rptQueryDataList.forEach(element => {
                            if(element.paramSort == currentData.paramSort) {
                                element.paramName = currentData.paramName;
                                element.paramDesc = currentData.paramDesc;
                                element.paramType = currentData.paramType;
                                element.paramWidth = currentData.paramWidth;
                                element.paramText = currentData.paramText;
                                element.isRange = currentData.isRange;
                                element.defaultValue = currentData.defaultValue;
                                element.remark = currentData.remark;
                            }
                        });
                        this.rptQuerySelectedList = [];
                        break;
                }
            },
            rptQueryAddFormRest() {
                this.$refs.rptQueryAdd.$refs.rptQueryForm.resetFields();
            },
            rptQuerySubmit() {
                if(this.rptQueryDataList.length <= 0) {
                    this.oss.showMessage({type:'warning',content:'没有可添加内容信息'});
                }else {
                    let self = this;
                    self.oss.post({
                        url:'/sys/rptConfig/saveQueryInfo',
                        data:{'reportId':self.reportId,'queryList':JSON.stringify(self.rptQueryDataList)},
                        ok(data,page,code) {
                            self.oss.showMessage({type: 'success', content: '操作成功'});
                            self.rptQueryModalClose();
                        }
                    });
                }
            },
            isContain(list,item) {
                let isContains = false;
                list.forEach(ele => {
                    if(ele.paramSort == item.paramSort) {
                        isContains = true;
                    }
                });
                return isContains;
            },
            queryUpMove() {
                let indexNum = this.rptQuerySelectedList[0].paramSort - 1;
                if(indexNum > 0) {
                    let targetQuery =  JSON.parse(JSON.stringify(this.rptQueryDataList[indexNum]));
                    let prevousQuery = JSON.parse(JSON.stringify(this.rptQueryDataList[indexNum - 1]));
                    this.exchangQueryInfo(targetQuery,prevousQuery,indexNum-1);
                }
            },
            queryDownMove() {
                let indexNum = this.rptQuerySelectedList[0].paramSort - 1;
                if(indexNum < this.rptQueryDataList.length - 1) {
                    let targetQuery =  JSON.parse(JSON.stringify(this.rptQueryDataList[indexNum + 1]));
                    let prevousQuery = JSON.parse(JSON.stringify(this.rptQueryDataList[indexNum]));
                    this.exchangQueryInfo(targetQuery,prevousQuery,indexNum+1);
                }
            },
            exchangQueryInfo(target,exchange,indexs) {
                let index = target.paramSort - 1;
                let index2 = exchange.paramSort - 1;
                for(let k in target) {
                    this.rptQueryDataList[index2][k] = target[k];
                    this.rptQueryDataList[index][k] = exchange[k];
                }
                this.rptQueryDataList[index2]['paramSort'] = index2 + 1;
                this.rptQueryDataList[index]['paramSort'] = index + 1;
                this.rptQuerySelectedList = [];
                this.rptQuerySelectedList.push(this.rptQueryDataList[indexs]);
                this.rptQueryDataList.forEach(item => {
                    if(typeof item._checked !='undefined'||item._checked==true) {
                        item._checked = false;
                    }
                });
                this.$set(this.rptQueryDataList[indexs],'_checked',true);

            }
        }
    }
</script>

<style lang="less">
    @import "./../../assets/css/common";
    // @import "./../../assets/css/content";
</style>
