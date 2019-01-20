<template>
    <div id="ReportConfig">
        <Row class="search_wrapper">
            <Form :label-width="80">
                <FormItem  label="报表名称" >
                    <Input clearable v-model="rptName" placeholder="请输入报表名称" size="small" style="width:120px"></Input>
                </FormItem>
                <Button type="primary" shape="circle" @click="refreshData" style="margin-left:50px">查&nbsp;&nbsp;询</Button>
            </Form>
        </Row>
        <!-- 按钮组件 -->
        <page-button-list @btnClick="clickBtn" :datakey="$route.query.datakey"></page-button-list>

        <!-- <ul class="btns_ul">
          <li class="btns_li" v-for="(item,index) in $root.btnList" :key="index"> -->
            <!-- @click="addReportConfig"  -->
              <!-- <Button :type="item.type" :disabled="(item.name=='edit'&&(selectList.length==0||selectList.length>=2))||(item.name=='delete'&&selectList.length==0)?'disabled':false" :icon="item.icon" @click="clickBtn(item.name)" >{{item.text}}</Button>
          </li> -->
            <!-- <li class="btns_li">
                <Button type="primary" @click="addReportConfig">
                    <Icon type="md-add"></Icon> 新 增</Button>
            </li>
            <li class="btns_li">
                <Button type="primary" :disabled="selectList.length==1 ? false:'disabled'" @click="editReportConfig">
                    <Icon type="md-create"></Icon> 修 改</Button>
            </li>
            <li class="btns_li">
                <Button type="primary" :disabled="selectList.length==0 ? 'disabled':false" @click="delReportConfig">
                    <Icon type="md-close"></Icon> 删 除</Button>
            </li>
            <li class="btns_li">
                <Button type="primary" :disabled="selectList.length==1 ? false:'disabled'" @click="editReportConfigField">
                    <Icon type="ios-create"></Icon> 编辑报表配置</Button>
            </li>
            <li class="btns_li">
                <Button type="primary" :disabled="selectList.length==1 ? false:'disabled'" @click="editReportQuery">
                    <Icon type="ios-create"></Icon> 编辑查询配置</Button>
            </li>
            <li class="btns_li">
                <Button type="primary" :disabled="selectList.length==1 ? false:'disabled'" @click="editReportChart">
                    <Icon type="ios-create"></Icon> 编辑图表配置</Button>
            </li> -->
        <!-- </ul> -->
        <div class="table_wrapper">
            <div class="topcheer-oss-table topcheer-oss-table-without-btn" ref="topcheerOssTable">
                <Table class=""  :loading="loading" :columns="columns" :height="tableHeight" :data="dataList" size="small"
                    @on-selection-change="handlerSelect"  @on-row-dblclick="showRowDataDetail" highlight-row >
                <div slot="footer" class="page_footer">
                    <Page class="page" size="small" v-if="total>0" placement="top" @on-change="handlePage" @on-page-size-change="handlePageSize"  :total="total"
                        :current="current" :page-size="size" :page-size-opts="oss.pageSizeOpts" show-elevator show-sizer show-total></Page>
                </div>
                </Table>
            </div>
        </div>

        <cfg ref="rptCfg" :dataSourceList="dataSourceList" :codes="codes" :reportConfig='reportConfig' @reload="refreshData" :modal="modal"></cfg>
        <field ref="filedCfg" :currentRptCfg="currentRptCfg"></field>
        <rptQuery ref="rptQuery"></rptQuery>
        <ReportChartConfig ref="reportChartConfig"/>
    </div>
</template>

<script>
    import cfg from '@/pages/base/ReportConfigAdd'
    import field from '@/pages/base/ReportField'
    import rptQuery from '@/pages/base/ReportQuery'
    import ReportChartConfig from '@/pages/base/ReportChartConfig'
    import pageButtonList from '@/components/PageButtonList.vue'

    let codeList = {};
    export default {
        name: 'ReportConfig',
        data() {
            return {
              //  btnList: [   //按钮列表
              //    {text: '新 增', icon: 'md-add', type: 'primary', name: 'add'},
              //    {text: '修 改', icon: 'md-create', type: 'primary', name: 'edit'},
              //    {text: '删 除', icon: 'md-close', type: 'error', name: 'delete'},
              //    {text: '编辑报表配置', icon: 'ios-create', type: 'primary', name: 'report'},
              //    {text: '编辑查询配置', icon: 'ios-create', type: 'primary', name: 'query'},
              //    {text: '编辑图表配置', icon: 'ios-create', type: 'primary', name: 'chart'},
              //  ],
                loading: false,
                rptName: '',
                total: 0,
                size: 0,  //每页大小
                current: 1,
                codes: {},
                size: 10,
                columns: [
                    { type: 'selection', width: 60, align: 'center' },
                    { key: 'reportCode', title: '报表代码', width: 100, align: 'center' },
                    { key: 'reportName', title: '报表名称', width: 180, align: 'center' },
                    {
                        key: 'pageFlag', align: 'center', title: '是否分页', width: 100, render: (h, params) => {
                            return h('span', codeList['pageFlag'][params.row.pageFlag]);
                        }
                    },
                    { key: 'pageSize', title: '分页大小', width: 100, align: 'center' },
                    { key: 'dataSource', title: '数据源', width: 140, align: 'center' },
                    {
                        key: 'sqlText', title: 'SQL脚本', width: 120, align: 'center', render: (f, obj) => {
                            return f('Button', {
                                props: {
                                    size: "small",
                                    type: "primary",
                                },
                                on: {
                                    click: () => {
                                        this.oss.showModal({type: 'message', content:`<pre style="word-break:break-all;white-space:normal">${obj.row.sqlText}</pre>`});
                                    }
                                }
                            }, '查看');
                        }
                    },
                    { key: 'createUser', title: '创建人员', width: 100, align: 'center' },
                    { key: 'createTime', title: '创建时间', width: 150, align: 'center' },
                    { key: 'modifyUser', title: '修改人员', width: 100, align: 'center' },
                    { key: 'modifyTime', title: '修改时间', width: 150, align: 'center' },
                    {
                        key: 'status', align: 'center', title: '是否有效', width: 120, render: (h, params) => {
                            return h("span", codeList['status'][params.row.status]);
                        }
                    },
                    { key: 'remark', align: 'center', title: '备注', width: 200 }
                ],
                dataList: [],
                tableHeight: '',  //默认表格的高度
                //配置数据源下拉框用
                dataSourceList: [],
                //记录保存被选中的行
                selectList: [],
                //子组件的data部分
                reportConfig: {
                    id: '',
                    reportCode: '',
                    reportName: '',
                    pageFlag: '1',
                    pageSize: '10',
                    dataSource: '',
                    sqlText: '',
                    createUser: '',
                    createTime: '',
                    modifyUser: '',
                    modifyTime: '',
                    status: '1',
                    delFlag: '',
                    remark: ''
                },
                isshows: false,
                modal: {
                    text: '',  //弹框标题：新增还是编辑
                    type: '',   //add:新增，edit：编辑
                    icon: ''
                },
                currentRptCfg: {}
            }
        },
        components: {
            cfg,
            field,
            rptQuery,
            ReportChartConfig,
            pageButtonList
        },
        methods: {
            //获取数据库选项
            getDataSource() {
                var self = this;
                this.oss.get({
                    url: '/sys/dbConfig/listConnName',
                    ok(data) {
                        data.forEach(element => {
                            self.dataSourceList.push({ value: element, label: element});
                        });
                        self.loadData();
                    },
                    // err(data) {
                    //     alert(data);
                    // }
                });
            },
            //加载数据
            loadData() {
                var self = this;
                self.selectList = [];
                self.loading = true;
                this.oss.get({
                    url: '/sys/rptConfig/list',
                    data: { 'reportName': self.rptName, 'current': self.current, 'size': self.size },
                    ok(data, page, code) {
                        self.dataList = data;
                        self.total = page.total;
                        self.size = page.size;
                        self.size = page.size;
                        codeList = code;
                        self.codes = code;
                        self.loading = false;
                        self.oss.setTableHeight({
                          el: self,
                          size: self.size
                        });
                    },
                    finish() {
                        self.loading = false;
                    }
                });
            },
            //刷新
            refreshData() {
                this.current = 1;
                this.size = 10;
                this.loadData();
            },
            //分页翻页事件
            handlePage(value) {
                this.current = value;
                this.loadData();
            },
            //分页组件设置每页显示条数事件
            handlePageSize(value) {
                this.size = value;
                this.loadData();
            },
            clickBtn(item) {
              switch(item.code) {
                case 'add':
                  this.addReportConfig();
                  break;
                case 'edit':
                  this.editReportConfig();
                  break;
                case 'delete':
                  this.delReportConfig();
                  break;
                case 'editReportConfigField':
                  this.editReportConfigField();
                  break;
                case 'editReportQuery':
                  this.editReportQuery();
                  break;
                case 'editReportChart':
                  this.editReportChart();
                  break;
              }
            },
            // 新增报表
            addReportConfig() {
                this.$refs.rptCfg.$refs.reportCfgForm.resetFields();
                this.$refs.rptCfg.isshow = true;

                this.modal.text = '新增单表维护';
                this.modal.type = 'add';
                this.modal.icon = 'ios-add-circle';
            },
            //编辑报表
            editReportConfig() {
                if (this.selectList.length == 1) {
                  this.modal.text = '编辑单表维护';
                  this.modal.type = 'edit';
                  this.modal.icon = 'ios-create';

                  this.$refs.rptCfg.isshow = true;
                  for (let key in this.selectList[0]) {
                      this.reportConfig[key] = this.selectList[0][key];
                  }
                } else if (this.selectList.length > 1 ) {
                  this.oss.showMessage({type: 'warning', content: '只能选择一条数据'});
                } else {
                  this.oss.showMessage({type: 'warning', content: '请选择一条数据'})
                }
            },
            //删除报表
            delReportConfig() {
                if (this.selectList.length == 0) {
                    this.oss.showMessage({type: 'warning', content: '请选择一条数据'})
                } else {
                    this.$Modal.confirm({
                        type: 'warning',
                        title:'删除确认',
                        content : '确认删除所选的'+ this.selectList.length +'条数据吗？',
                        closable:true,
                        onOk : () => {
                            let ids = [];
                            let self = this;
                            this.selectList.forEach(element => {
                                ids.push(element.id);
                            });
                            this.oss.post({
                                url: '/sys/rptConfig/delete',
                                data: { 'id': ids.toString() },
                                ok(data) {
                                    self.oss.showMessage({type: 'success', content: '删除成功'});
                                    self.loadData();
                                }
                            });

                        }
                    });
                }

            },
            handlerSelect(value) {
                this.selectList = [];
                this.selectList = value;
            },
            editReportConfigField() {
                if (this.selectList.length == 1) {
                  this.currentRptCfg = this.selectList[0];
                  this.$refs.filedCfg.fieldSelectList = [];
                  this.$refs.filedCfg.reportId = this.selectList[0].id;
                  this.$refs.filedCfg.loadData();
                  this.$refs.filedCfg.getCodes();
                  this.$refs.filedCfg.modal = true;
                } else if (this.selectList.length > 1 ) {
                    this.oss.showMessage({type: 'warning', content: '只能选择一条数据'});
                } else {
                  this.oss.showMessage({type: 'warning', content: '请选择一条数据'})
                }
            },
            editReportQuery() {
                if (this.selectList.length == 1) {
                  this.$refs.rptQuery._data.reportId = this.selectList[0].id;
                  this.$refs.rptQuery._data.rptQueryShowModal = true;
                  this.$refs.rptQuery.getRptQueryInfo();
                } else if (this.selectList.length > 1 ) {
                    this.oss.showMessage({type: 'warning', content: '只能选择一条数据'});
                } else {
                  this.oss.showMessage({type: 'warning', content: '请选择一条数据'})
                }
            },
            // 编辑报表属性配置
            editReportChart() {
                if (this.selectList.length == 1) {
                  this.$refs.reportChartConfig.show = true;
                  this.$refs.reportChartConfig.reportId = this.selectList[0].id;
                  this.$refs.reportChartConfig.queryChartList(this.selectList[0].id);
                } else if (this.selectList.length > 1 ) {
                    this.oss.showMessage({type: 'warning', content: '只能选择一条数据'});
                } else {
                  this.oss.showMessage({type: 'warning', content: '请选择一条数据'})
                }
            },
            /**
             * 双击当前行显示详情
             */
            showRowDataDetail(row){
                this.oss.showModal({
                type: 'info',
                title: '报表配置详细信息',
                width: 500,
                okText: '关闭',
                render: (h) => {
                    return h('tableRowDataDetail', {
                    props: {
                        columns: this.columns,
                        dataRow: row,
                        codes: codeList
                    }
                    })
                }
                });
            },
        },
        created() {
          this.getDataSource();
        }
    }
</script>

<style lang="less">
    @import "./../../assets/css/common";
    // @import "./../../assets/css/content";

    #ReportConfig {
        .w(100%);
        .h(100%);
        .ivu-form{
        height: 100%;
        display: flex;
        align-items: center;
        }
        .ivu-form-item{
        margin-bottom: 0px;
        }
    }
</style>
