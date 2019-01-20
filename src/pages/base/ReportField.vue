<template>
    <div>
        <Modal v-model="modal" :title="title" width="800" @on-cancel="cancel" :mask-closable="false">
            <ul class="btns_ul">
                <li class="btns_li">
                    <Button type="primary" @click="addCfgField"><Icon type="md-add"></Icon> 新 增</Button>
                </li>
                <li class="btns_li">
                    <Button type="primary" :disabled="fieldSelectList.length==1 ? false:'disabled'" @click="editCfgField"><Icon type="md-create"></Icon> 修 改</Button>
                </li>
                <li class="btns_li">
                    <Button type="primary" :disabled="fieldSelectList.length == 0 ? 'disabled':false"  @click="delCfgField"><Icon type="md-close"></Icon> 删 除</Button>
                </li>
                <li class="btns_li">
                    <Button type="primary" @click="getReportConfigFieldList"><Icon type="ios-browsers"></Icon> 获 取</Button>
                </li>
                <li class="btns_li">
                    <Button type="primary" @click="upMove" :disabled="fieldSelectList.length==1 ? false:'disabled'"><Icon type="md-arrow-round-up"></Icon> 上 移</Button>
                </li>
                <li class="btns_li">
                    <Button type="primary" @click="downMove" :disabled="fieldSelectList.length==1 ? false:'disabled'"><Icon type="md-arrow-round-down"></Icon> 下 移</Button>
                </li>
            </ul>
            <Table ref="fieldTab" stripe border highlight-row  :loading="loading2" :columns="columnes" :data="fieldlist" height="350"  @on-select="handlerFieldSelect" @on-select-cancel="handlerFieldSelect" @on-select-all="handlerFieldSelect"/>
            <div slot="footer">
                <Button type="primary" size="large" @click="submit">确定</Button>
            </div>
        </Modal>
        <addOrEditCfgField ref="addOrEditField" @pushfield="pushFieldInfo" @editfield="editFieldInfo" ></addOrEditCfgField>
    </div>
</template>

<script>
     import addOrEditCfgField from '@/pages/base/ReportFieldAdd'
    let dicts = {};
    export default {
        data() {
            return {
                modal: false,
                title : '',
                loading2 : false,
                fieldlist : [],
                columnes :[
                    { type : 'selection', width : 60, align: 'center' },
                    { key : 'fieldOrder', title : '序号', width : 70, align: 'center'},
                    { key : 'fieldCode', title : '字段代码', width: 180, align: 'center' },
                    { key : 'fieldName', title : '字段名称', width: 90, align: 'center' },
                    { key : 'isShow', align: 'center', title : '是否展示', width: 90, render : (f,obj) => {
                        return dicts['isShow'][obj.row.isShow]!="" ? f('span',dicts['isShow'][obj.row.isShow]) : "";
                    } },
                    { key : 'fieldWidth', title : '字段显示宽度', width : 120, align: 'center'},
                    { key : 'typeCode', title : '代码类型', width : 90, align: 'center'},
                    { key : 'dataType', align: 'center', title : '数据类型', width : 90, render : (f,obj) => {
                        return obj.row.dataType in dicts['dataType'] ? f('span',dicts['dataType'][obj.row.dataType.toLowerCase()]) : f('span',dicts['dataType']['string']);
                    }},
                    { key : 'dataFormat', title : '数据显示格式', width : 120, align: 'center'},
                    { key : 'textAlign', align: 'center', title : '数据对齐方式', width : 120, render : (f,obj) => {
                        return obj.row.textAlign != "" ? f('span',dicts['textAlign'][obj.row.textAlign.toLowerCase()]) : "";
                    }},
                    { key : 'sortNumber', align: 'center', title : '排序序号', width : 90},
                    { key : 'sortType', align: 'center', title : '排序类型', width : 90, render : (f,obj) => {
                        return obj.row.sortType != "" ? f('span',dicts['sortType'][obj.row.sortType.toLowerCase()]) : "";
                    }},
                    { key : 'isQuery', align: 'center', title : '是否查询条件', width : 120, render : (f,obj) => {
                        return obj.row.isQuery != "" ? f('span',dicts['isQuery'][obj.row.isQuery]) : "";
                    }}
                ],
                reportId : '',
                fieldSelectList : [],
                maxIndex : 0
            }
        },
        props: ['currentRptCfg'],
        methods: {
            cancel() {
                this.fieldlist = [];
                this.maxIndex = 0;
                this.modal = false;
            },
            handlerFieldSelect(value) {
                this.fieldSelectList = value;
            },
            loadData() {
                let self = this;
                self.loading2 = true;
                this.oss.get({
                    url : '/sys/rptConfig/findFiledList',
                    data : {'reportId' : self.reportId},
                    ok(data) {
                        if(data.length == 0) {
                          self.oss.showMessage({type: 'warning', content: '当前报表尚未配置filed信息！'});
                        }else {
                          self.fieldListSort(data);
                        }
                    },
                    finish() {
                      self.loading2 = false;
                    }
                });
            },
            addCfgField() {
                this.$refs.addOrEditField.modal = true;
                this.$refs.addOrEditField.title = "添加单表维护字段";
                this.$refs.addOrEditField.opertypes = "add";
                console.log(dicts);
                this.$refs.addOrEditField.dictes=dicts;
            },
            editCfgField() {
                if(this.fieldSelectList.length == 0) {
                    this.$Message.info("请选择要操作的数据！");
                }else if(this.fieldSelectList.length > 1) {
                    this.$Message.info("请选择一条数据！");
                }else {
                    this.$refs.addOrEditField.modal = true;
                    this.$refs.addOrEditField.title = "修改单表维护字段";
                    this.$refs.addOrEditField.opertypes = "edit";
                    this.$refs.addOrEditField.dictes=dicts;
                    this.$refs.addOrEditField.setFiledInfo(JSON.stringify(this.fieldSelectList));
                }
            },
            delCfgField() {

                if(this.fieldSelectList.length == 0) {
                    this.$Message.info("请选择要操作的数据！");

                }else {
                    let temp_list = [];
                    this.fieldlist.forEach(element => {
                        if(!(this.isContain(this.fieldSelectList,element))) {
                            temp_list.push(element);
                        }
                    });
                    this.fieldListSort(temp_list);
                }
            },
            getCodes() {
                let self = this;
                this.oss.get({
                    url : '/sys/code/findCodeByType',
                    data : {'typeCodes':'isQuery,sortType,textAlign,isShow,dataType'},
                    ok(data,page,code) {
                        dicts = data;
                    }
                });
            },
            isContain(list,value) {
                let f = false;
                list.forEach(element => {
                    if(value.fieldCode == element.fieldCode) {
                        f = true;
                    }
                });
                return f;
            },
            validFieldInfo() {
                if(this.fieldlist.length == 0) {
                  this.oss.showMessage({type: 'warning', content: '字段信息不能为空'});
                  return false;
                }else {
                    let flag = true;
                    this.fieldlist.forEach(element => {
                        if(element.fieldCode == "" || element.fieldCode == null || element.fieldName == "" || element.fieldName == null) {
                            flag = false;
                        }else {
                            element.reportId = this.reportId;
                        }
                    });
                    if(!flag) {
                      this.oss.showMessage({type: 'warning', content: '字段代码或字段名称不能为空'});
                    }
                    return flag;
                }
            },
            submit() {
                let self = this;
                let f = this.validFieldInfo();
                if(f) {
                    this.oss.post({
                        url : '/sys/rptConfig/editField',
                        data : {'reportId' : self.reportId, 'reportFieldInfo' : JSON.stringify(self.fieldlist)},
                        ok(data,page,code) {
                            self.oss.showMessage({type: 'success', content: '修改成功'});
                            self.cancel();
                        }
                    });
                }
            },
            pushFieldInfo(val) {
                let obj_field = JSON.parse(val);
                obj_field.fieldOrder = ++this.maxIndex;
                this.fieldlist.push(obj_field);
            },
            editFieldInfo(value) {
                let temp_field = JSON.parse(value);
                this.fieldlist.forEach(element => {
                    if(element.fieldOrder == temp_field.fieldOrder) {
                        for(var key in element) {
                            element[key] = temp_field[key];
                        }
                    }
                });
                this.$refs.fieldTab.selectAll(false);
                this.fieldSelectList = [];
            },
            getReportConfigFieldList() {
                let self = this;
                let sql = this.currentRptCfg.sqlText;
                let dataSource = this.currentRptCfg.dataSource;
                if(sql === "") {
                     self.oss.showModal({type: 'warning', title: '报表字段配置', content: 'sql脚本不能为空！'});
                }else {
                    self.loading2 = true;
                    this.oss.post({
                        url : '/sys/rptConfig/queryFieldInfo',
                        data : {'connName': dataSource, 'querySql' : sql},
                        ok(data,page,code) {
                            if(data.length == 0) {
                              this.oss.showMessage({type: 'warning', content: '请检查sql配置是否正确，未查找到相应数据'});
                            }else {
                                self.fieldlist = data;
                                self.maxIndex = data.length;
                            }
                        },
                        finish() {
                            self.loading2 = false;
                        }
                    });
                }
            },
            fieldListSort(data) {
                let i = 1;
                this.fieldlist = [];
                data.forEach(item => {
                    item.fieldOrder = i++ ;
                    if(typeof item._checked !='undefined'||item._checked==true) {
                        item._checked = false;
                    }
                    this.fieldlist.push(item);
                });
                this.maxIndex = data.length;
                this.loading2 = false;
            },
            upMove() {
                let indexNum = this.fieldSelectList[0].fieldOrder - 1;
                if(indexNum > 0) {
                    let targetField =  JSON.parse(JSON.stringify(this.fieldlist[indexNum]));
                    let prevousField = JSON.parse(JSON.stringify(this.fieldlist[indexNum - 1]));
                    this.exchangeFieldInfo(targetField,prevousField,indexNum-1);
                }
            },
            downMove() {
                let indexNum = this.fieldSelectList[0].fieldOrder - 1;
                if(indexNum < this.fieldlist.length - 1) {
                    let targetField =  JSON.parse(JSON.stringify(this.fieldlist[indexNum + 1]));
                    let prevousField = JSON.parse(JSON.stringify(this.fieldlist[indexNum]));
                    this.exchangeFieldInfo(targetField,prevousField,indexNum+1);
                }

            },
            exchangeFieldInfo(target,exchange,indexs) {
                let index = target.fieldOrder - 1;
                let index2 = exchange.fieldOrder - 1;
                for(let k in target) {
                    this.fieldlist[index2][k] = target[k];
                    this.fieldlist[index][k] = exchange[k];
                }

                this.fieldlist[index2]['fieldOrder'] = index2 + 1;
                this.fieldlist[index]['fieldOrder'] = index + 1;
                this.fieldSelectList = [];
                this.fieldSelectList.push(this.fieldlist[indexs]);
                this.fieldlist.forEach(item => {
                    if(typeof item._checked !='undefined'||item._checked==true) {
                        item._checked = false;
                    }
                });
                this.$set(this.fieldlist[indexs],'_checked',true);

            }
        },
        components: {
            addOrEditCfgField
        }
    }
</script>
<style lang="less">
    @import "./../../assets/css/common";
    // @import "./../../assets/css/content";
</style>

