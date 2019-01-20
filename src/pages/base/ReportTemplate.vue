<template>
    <div id="rptTemplate">
        <div class="rptTemplate_search_wrapper" v-if="isQuery">
            <div class="search_top">
                <div class="search_condition">
                    <Form :label-width="100">
                        <Row :gutter="24">
                            <Col span="6" v-for="(item,index) in queryList1" :key="index">
                            <FormItem :label="item.paramDesc" prop="name">
                                <Input v-if="item.isRange == '0' && (item.paramType.toLowerCase() == 'string' || item.paramType.toLowerCase() == 'number')"
                                style="width: 200px" v-model="queryValidateList[item.paramName.toLowerCase()]"
                                    :placeholder="item.paramText" clearable></Input>

                                <DatePicker v-if="item.isRange == '0'&& item.paramType.toLowerCase() == 'date'" :placeholder="item.paramText" type="date"
                                style="width: 200px"
                                    v-model="queryValidateList[item.paramName.toLowerCase()]" format="yyyy-MM-dd" @on-change="queryValidateList[item.paramName.toLowerCase()]=$event"
                                    clearable/>

                                <DatePicker v-if="item.isRange == '1' && item.paramType.toLowerCase() == 'date'" type="daterange" v-model="queryValidateList[item.paramName.toLowerCase()]"
                                :placeholder="item.paramText" style="width: 200px"  format="yyyy-MM-dd" @on-change="queryValidateList[item.paramName.toLowerCase()]=$event" clearable/>

                                <Select v-if="item.paramType.toLowerCase() == 'selected' && item.defaultValue != ''" :placeholder="item.paramText" clearable filterable v-model="queryValidateList[item.paramName.toLowerCase()]" style="width:200px">
                                    <Option v-for="(item,index) in dicts[item.defaultValue]" :value="index" :key="index">{{item}}</Option>
                                </Select>

                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div class="btn_wrapper">
                    <Button class="btn" type="primary" size="small" @click="searchBtnFn">查&nbsp;&nbsp;&nbsp;&nbsp;询</Button>

                    <div v-if="queryList2.length > 0" class="search_more_wrapper" @click="rptToggle">
                        <a href="javascript:;" class="search_more_btn">高级查询<i :class="rptSearchMore.arrow"></i></a>
                    </div>
                </div>
            </div>
            <div v-if="rptSearchMore.showMore">
                <div class="search_more supervisor">
                    <Form :label-width="100">
                        <Row :gutter="24">
                            <Col span="6" v-for="(item,index) in queryList2" :key="index">
                                <FormItem :label="item.paramDesc" prop="name">
                                    <Input v-if="item.isRange == '0' && (item.paramType.toLowerCase() == 'string' || item.paramType.toLowerCase() == 'number')"
                                    style="width: 200px" v-model="queryValidateList[item.paramName]"
                                        :placeholder="item.paramText" clearable></Input>

                                    <Date-picker v-if="item.isRange == '0'&& item.paramType.toLowerCase() == 'date'" :placeholder="item.paramText" type="date"
                                    style="width: 200px"
                                        v-model="queryValidateList[item.paramName]" format="yyyy-MM-dd" @on-change="queryValidateList[item.paramName]=$event"
                                        clearable></Date-picker>

                                    <Date-picker v-if="item.isRange == '1' && item.paramType.toLowerCase() == 'date'" type="daterange" v-model="queryValidateList[item.paramName]"
                                    :placeholder="item.paramText" style="width: 200px"  format="yyyy-MM-dd" @on-change="queryValidateList[item.paramName]=$event" clearable></Date-picker>

                                    <Select v-if="item.paramType.toLowerCase() == 'selected' && item.defaultValue != ''" :placeholder="item.paramText" filterable v-model="queryValidateList[item.paramName]" style="width:200px">
                                        <Option value=""></Option>
                                        <Option v-for="(item,index) in dicts[item.defaultValue]" :value="index" :key="index">{{item}}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </div>
        <div class="btn_wrapper">
             <!-- 按钮组件 -->
            <page-button-list v-if="$route.query.ReportCode!='310101'" @btnClick="clickBtn" :reportCode="$route.query.ReportCode"></page-button-list>
            <!-- <ul class="btns_ul">
                <li class="btns_li" v-for="(item,index) in btnList" :key="index">
                    <Button :type="item.type" :icon="item.icon" @click="clickBtn(item)">{{item.text}}</Button>
                </li>
            </ul> -->
            <ButtonGroup vertical:false :style="{top:$route.query.ReportCode=='310101'? '5px':'17px'}">
                <Button v-if="chartsData.length>0" type="default" icon="md-stats" size="large" @click="showChart=true" ></Button>
                <Button v-if="chartsData.length>0" type="default" icon="ios-list-box-outline" size="large"  @click="showChart=false"></Button>
                <Button type="primary" @click="importData">导入数据</Button>
                <Button type="primary" @click="exportBtnFn">导出当前页</Button>
                <Button type="primary" @click="exportAllBtnFn">导出全部</Button>
            </ButtonGroup>
        </div>
        <div class="table_wrapper">
            <div class="tableList" v-show="!showChart || dataList.length == 0">
                <div class="topcheer-oss-table topcheer-oss-table-without-btn" ref="topcheerOssTable">
                    <Table :loading="loading" :columns="columns" :data="dataList" @on-selection-change="chooseData" size="small" highlight-row>
                    <div slot="footer" class="page_footer">
                        <Page v-if="pageFlag"  class="page" size="small" placement="top" @on-change="handlePage" @on-page-size-change="handlePageSize"  :total="total"
                            :current="current" :page-size="size" show-elevator show-sizer show-total></Page>
                    </div>
                    </Table>
                </div>
            </div>
            <Row class="chartList" v-if="showChart && dataList.length>0">
                <Col :span="chartsData.length==1?'24':'12'" v-for="(item,index) in chartsData" :key="index">
                    <div class="chart">
                        <div class="chartTitle">{{item.chartTitle}}</div>
                        <div class="myChart" :id="'myChart_'+index"></div>
                    </div>
                </Col>
            </Row>
        </div>
        <ReportTemplateAddEdit ref="addEditModal" :modal="modal" :formValidate="formValidate" :columns="columns" :dicts="dicts" :formatsData="formatsData" @save="save" @reset="reset"></ReportTemplateAddEdit>   
    </div>
</template>

<script>
    import ReportTemplateAddEdit from './ReportTemplateAddEdit.vue'
    import pageButtonList from '@/components/PageButtonList.vue'

    // 引入基本模板
    let echarts = require('echarts/lib/echarts')
    // 引入柱状图组件
    require('echarts/lib/chart/bar')
    // 引入提示框和title组件
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/title')

    let formats = {};
    let orderByFiledList = [];
    let titleList = [];
    let columnList = [];
    let testData =  {
		"recordList": [
			["2018-01-23", "6af871f4c1ea44688293622679b2835e20180108113604886297046484959476", "1", "2018-01-13", 9889, 259, 212, 0, 0, 0, "2018-01-23 00:00:02"],
			["2018-01-23", "6af871f4c1ea44688293622679b2835e20180108113604886297046484959476", "0", "2018-01-18", 9632, 573, 384, 0, 0, 0, "2018-01-23 00:00:02"],
			["2018-01-23", "6af871f4c1ea44688293622679b2835e20180108113604886297046484959476", "0", "2018-01-20", 8539, 935, 130, 0, 0, 0, "2018-01-23 00:00:02"],
			["2018-01-23", "6af871f4c1ea44688293622679b2835e20180108113604886297046484959476", "1", "2018-01-19", 7751, 363, 263, 0, 0, 0, "2018-01-23 00:00:02"],
			["2018-01-23", "6af871f4c1ea44688293622679b2835e20180108113604886297046484959476", "1", "2018-01-11", 6904, 710, 553, 0, 0, 0, "2018-01-23 02:00:02"],
			["2018-01-23", "6af871f4c1ea44688293622679b2835e20180108113604886297046484959476", "0", "2018-01-22", 6512, 216, 623, 0, 0, 0, "2018-01-23 00:00:02"],
			["2018-01-23", "6af871f4c1ea44688293622679b2835e20180108113604886297046484959476", "1", "2018-01-15", 4795, 907, 500, 0, 0, 0, "2018-01-23 00:00:02"],
			["2018-01-23", "6af871f4c1ea44688293622679b2835e20180108113604886297046484959476", "1", "2018-01-15", 4366, 451, 141, 0, 0, 0, "2018-01-23 00:00:02"],
			["2018-01-23", "6af871f4c1ea44688293622679b2835e20180108113604886297046484959476", "0", "2018-01-12", 4250, 441, 262, 0, 0, 0, "2018-01-23 00:00:02"],
			["2018-01-23", "6af871f4c1ea44688293622679b2835e20180108113604886297046484959476", "0", "2018-01-12", 3883, 989, 475, 0, 0, 0, "2018-01-23 00:04:02"],
			["2018-01-23", "6af871f4c1ea44688293622679b2835e20180108113604886297046484959476", "0", "2018-01-12", 3716, 256, 939, 0, 0, 0, "2018-01-23 00:00:02"],
			["2018-01-23", "6af871f4c1ea44688293622679b2835e20180108113604886297046484959476", "0", "2018-01-08", 3299, 332, 407, 0, 0, 0, "2018-01-23 13:02:02"],
			["2018-01-23", "6af871f4c1ea44688293622679b2835e20180108113604886297046484959476", "1", "2018-01-09", 3117, 599, 947, 0, 0, 21, "2018-01-23 00:00:02"],
			["2018-01-23", "6af871f4c1ea44688293622679b2835e20180108113604886297046484959476", "0", "2018-01-08", 3071, 511, 512, 0, 0, 14, "2018-01-23 00:00:02"],
			["2018-01-23", "6af871f4c1ea44688293622679b2835e20180108113604886297046484959476", "1", "2018-01-21", 1393, 284, 320, 0, 0, 0, "2018-01-23 00:00:02"]
		],
		"titleList": ["rpt_date", "access_token", "prod_type", "apply_date", "apply_count", "agree_count", "deny_count", "recheck_count", "risk_count", "exception_count", "create_time"],
		"page": {
			"current": 1,
			"total": 15,
			"pages": 1,
			"size": 1000000
		}
	}
    export default {
        name: 'ReportTemplate',
        data() {
            return {
                rptSearchMore:{
                    arrow:'iconfont icon-xiangxiajiantou',   //高级查询箭头
                    showMore:false
                },
                classJson:{
                    btnLabelActive:true
                },
                chartSize: null,
                showChart:true,
                reportId: null,
                reportName: '',
                orgList: [],
                managerId: null,
                dataPermStr: null,
                //报表head部分
                loading: false,
                columns: [],
                dataList: [],
                pageFlag: false,
                current: 1,
                size: 10,
                total: 0,
                sqlText: '',
                dataSource: '',
                orderByStr: ' order by ',
                isQuery: false,
                queryList1: [],
                queryList2: [],
                queryValidateList: {},
                rangeMap: {},
                notRangeMap: {},
                permType: 0,
                typeCodeList:[],
                dicts:{},
                rankSql : '',
                rankTypeCode:'',
                exportType:'',
                echarts: [],
                chartsData:[],
                // btnList: [
                //     //按钮列表
                //     { text: "新 增", icon: "md-add", type: "primary", name: "add" },
                //     { text: "修 改", icon: "md-create", type: "primary", name: "edit" },
                //     { text: "删 除", icon: "md-close", type: "error", name: "delete" }
                // ],
                modal: {
                    text: '',  //弹框标题：新增还是编辑
                    type: '',   //add:新增，edit：编辑
                    icon: ''
                },
                chooseList: [],
                formatsData: {},    //下拉数据
                formValidate: {},
                rptCode: ''
            }
        },
        components: {
            ReportTemplateAddEdit,
            pageButtonList
        },
        watch: {
            $route() {
                this.clearPage();
            }
        },
        methods: {
            showPieCharts(echart, chartIndex) {
                if(!this.showChart) {
                    return;
                }
                let myChart = echarts.init(document.getElementById(chartIndex));
                myChart.clear();
                // console.log(echart.pieSeriesData);
                myChart.setOption({
                    tooltip : {
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true },
                            magicType: { show: true, },
                            saveAsImage: {show: true}
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        top: 30,
                        left: 'right',
                        data:echart.legendList
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '5%',
                        containLabel: true
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '70%',
                            center: ['50%', '50%'],
                            data: echart.pieSeriesData
                        }
                    ]
                 });
            },
            drawChart(echart, chartIndex) {
                if(!this.showChart) {
                    return;
                }
                var self = this;
                let myChart = echarts.init(document.getElementById(chartIndex));
                myChart.clear();
                 myChart.setOption({
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        textStyle: {
                            align: 'left'
                        }
                    },
                    toolbox: {
                        show: true,
                        right: 20,
                        feature: {
                            restore: { show: true },
                            saveAsImage: {show: true}
                        }
                    },
                    legend: {
                        top: 30,
                        data:echart.legendList
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : echart.xAxisData
                        }
                    ],
                    dataZoom: [{
                        type: 'inside',
                        show: true,
                        xAxisIndex: [0],
                        bottom: 0,
                        start: 0,
                        end: 100 //初始化滚动条
                    }],
                    yAxis : [
                        {
                            type : 'value',
                            nameLocation: 'middle'
                        }
                    ],
                    series: echart.seriesData
                 });
            },
            rptToggle(){
                this.rptSearchMore.showMore=!this.rptSearchMore.showMore;
                if(this.rptSearchMore.showMore){
                    this.rptSearchMore.arrow='iconfont icon-xiangshangjiantou';
                }else{
                    this.rptSearchMore.arrow='iconfont icon-xiangxiajiantou';
                }
            },
            labelClick(val){
                if(typeof val.checked=='undefined'){
                this.$set(val,'checked',true);
                }else{
                this.$delete(val,'checked');
                }
            },
            clearPage() {
                formats = {};
                orderByFiledList = [];
                this.dicts = {};
                this.loading = false;
                this.columns = [];
                this.dataList = [];
                this.pageFlag = false;
                this.current = 1;
                this.size = 10;
                this.total = 0;
                this.sqlText = '';
                this.dataSource = '';
                this.orderByStr = ' order by ';
                this.queryText = '';
                this.isQuery = false;
                this.queryList1 = [];
                this.queryList2 = [];
                this.queryValidateList = {};
                this.rangeMap = {};
                this.notRangeMap = {};
                this.permType = 0;
                this.typeCodeList=[];
                this.echarts = [];
                titleList = [];
                columnList = [];
                this.exportType = '';
                // let rptCode = this.$route.query.ReportCode; 
                this.rptCode = this.$route.query.ReportCode;   
                this.loadData(this.rptCode);
                this.formatsData = formats;
            },

            //加载初始化页面
            loadData(reportCode) {
                let self = this;
                this.oss.get({
                    url: '/sys/rptConfig/list',
                    data: { 'reportCode': reportCode },
                    ok(data, page, code) {
                      if (data.length == 0) {
                            //说明不存在当前code值的报表
                            self.oss.showModal({ type: 'warning', title: '报表提示', content: '编号为"' + reportCode + '"的报表不存在' });
                        } else if (data[0].status == 0) {
                            //状态为0表示该报表未启用
                            self.oss.showModal({ type: 'warning', title: '报表提示', content: '编号为"' + reportCode + '"的报表尚未启用' });
                        } else {
                            self.sqlText = data[0].sqlText;
                            self.dataSource = data[0].dataSource;
                            self.pageFlag = data[0].pageFlag == 0 ? false : true;
                            if (self.pageFlag) {
                                self.size = data[0].pageSize;
                            }
                            self.reportName = data[0].reportName;
                            self.reportId = data[0].id;
                            self.getQueryListById(data[0].id);
                        }
                    },
                    err(message, detailmsg) {
                    }
                });
            },
            findReportChartConfig(id) {
                var self = this;
                this.oss.get({
                    url: '/sys/repotChartConfig/list',
                    data: { 'reportId': id, orderBy: 'chart_sort' },
                    ok(data, page, code) {
                      self.$nextTick(function(){
                        self.chartsData=data;
                        if(data && data.length > 0) {
//                          self.coverChartData(data);
                        } else {
                          self.showChart = false;
                        }
                      })
                    }
                })
            },
            coverChartData(data) {
                var self = this;
                this.echarts = [];
                data.map((item) => {
                    var echart = {};
                    var legendList = item.valFieldName ? item.valFieldName.split(',') : []; // 图例字段
                    var legendFieldList = item.valField.split(',');
                    if(item.chartType == 'BAR') {  //柱状图
                        var xAxis = self.getBarXAxisData(item.dimField).sort(); // 获取X轴数据
                        echart.xAxisData = xAxis;
                        echart.type = 'BAR';
                        var seriesData = [];
                        // 获取显示数据
                        legendList && legendList.map((legend, index) => {
                            var series = {name: legend, type: 'bar'};
                            series.data = self.getXAxisDataList(xAxis, legendFieldList, index, item.dimField);
                            seriesData.push(series);
                        });
                        echart.seriesData = seriesData
                    } else if(item.chartType == 'PIE') {    // 饼图
                        var pieSeriesData = [];
                        echart.type = 'PIE';
                        legendList && legendList.map((legend, index) => {
                            pieSeriesData.push({value: self.getPieSeriesData(legendFieldList, index), name:legend });
                        });
                        echart.pieSeriesData = pieSeriesData
                    }
                    echart.legendList = legendList;
                    echart.chartTitle = item.chartTitle;
                    self.echarts.push(echart);
                });
                if(self.echarts.length > 0) {
                    self.echarts.map((echart, index) => {
                        if(echart.type == 'BAR') {
                            self.drawChart(echart, 'myChart_'+index);
                        } else {
                            self.showPieCharts(echart, 'myChart_'+index);
                        }
                    });
                }
            },
            getPieSeriesData(legendFieldList, legendIndex) {
                var data = 0;
                this.dataList.map((repData) => {
                    var repData = repData[legendFieldList[legendIndex]];
                    if(repData) {
                        if(typeof repData == 'string') {
                            repData = repData.replace(/,/g,'');
                        }
                        data += Number.parseFloat(repData);
                    }
                })
                return data;
            },
            getXAxisDataList(xAxis, legendFieldList, legendIndex, dimField) {
                var xAxisData = [];
                xAxis.map((x) => {
                    var data = 0;
                    this.dataList.map((repData) => {
                        if(x == repData[dimField]) {
                            var repData = repData[legendFieldList[legendIndex]];
                            if(repData) {
                                if(typeof repData == 'string') {
                                    repData = repData.replace(/,/g,'');
                                }
                                data += Number.parseFloat(repData);
                            }
                        }
                    })
                    xAxisData.push(data);
                });
                return xAxisData;
            },
            getBarXAxisData(dimField) {
                var XAxisData = [];
                this.dataList.map((data) => {
                    if(XAxisData.indexOf(data[dimField]) == -1) {
                        XAxisData.push(data[dimField]);
                    }
                });
                return XAxisData;
            },
            /**
            *
            *获取当前报表的查询条件部分的信息，如果没有的话，说明当前报表没有查询部分
            */
            getQueryListById(reportId) {
                let self = this;
                self.oss.get({
                    url: '/sys/rptConfig/reportQueryList',
                    data: { reportId: reportId },
                    ok(data) {
                        if (data.length > 0) {
                            data.forEach(ele => {
                                if(ele.paramWidth != '' && ele.paramWidth != null) {
                                    ele.paramWidth += 'px';
                                }
                                if (ele.paramType.toLowerCase() == 'fixed') {
                                    if (ele.paramName == '数据权限') {
                                        self.permType = 1;
                                    } else if (ele.paramName == '数据权限（排名）') {
                                        let rankStr = ele.defaultValue;
                                        let beginIndex = rankStr.indexOf("=");
                                        rankStr = rankStr.substring(0,beginIndex+1);
                                        self.rankSql = rankStr + "'" + self.rankTypeCode + "'";
                                        self.permType = 2;
                                    }
                                } else {
                                    self.isQuery = true;
                                    if(ele.paramType.toLowerCase() == 'selected'&& ele.defaultValue != '' && (!self.isContain(self.typeCodeList,ele.defaultValue))) {
                                        self.typeCodeList.push(ele.defaultValue);
                                    }
                                    if(self.queryList1.length < 8) {
                                        self.queryList1.push(ele);
                                    }else {
                                        self.queryList2.push(ele);
                                    }
                                    if (ele.isRange == '1') {
                                        //日期控件开启range之后可以得到一个数组
                                        self.rangeMap[ele.paramName.toLowerCase()] = ele.paramType.toLowerCase();
                                    } else {
                                        self.notRangeMap[ele.paramName.toLowerCase()] = ele.paramType.toLowerCase();
                                    }

                                    if (ele.paramType.toLowerCase() == 'number') {
                                        self.queryValidateList[ele.paramName.toLowerCase()] = ele.defaultValue == '' ? null : ele.defaultValue;
                                    } else {
                                        self.queryValidateList[ele.paramName.toLowerCase()] = ele.defaultValue != '' ? ele.defaultValue : null;
                                    }
                                }
                            });
                        }
                        self.getFieldListById(reportId);
                    }
                });
            },
            /*
            *查询当前报表的显示列信息
            *
            */
            getFieldListById(reportId) {
                let self = this;
                self.loading = true;
                this.oss.get({
                    url: '/sys/rptConfig/findFiledList',
                    data: { 'reportId': reportId },
                    ok(data) {
                        if (data.length > 0) {
                            formats["codeParse"] = {};
                            formats["timeParse"] = {};
                            formats["numParse"] = {};          
                            data.forEach((element, index) => {
                                //isShow为0表示该项不显示
                                if (element.isShow == 1 && index <= data.length - 1) {
                                    let width = element.fieldWidth != '' && element.fieldWidth != null ? element.fieldWidth : 150;
                                    let alignText = 'center';
                                    if (element.textAlign.toLowerCase() != 'auto') {
                                        alignText = element.textAlign;
                                    } else {
                                        alignText = element.dataType.toLowerCase() == 'string' ? 'left' : (element.dataType.toLowerCase() == 'date' ? 'center' : 'right');
                                    }
                                    titleList.push(element.fieldName);
                                    columnList.push(element.fieldCode.toLowerCase());
                                    self.columns.push({ 'key': element.fieldCode.toLowerCase(), 'title': element.fieldName, 'width': width, 'align': alignText });
                                }

                                //表示该项是用于升降排序
                                if (element.sortNumber > 0 && element.sortType != 'no') {
                                    orderByFiledList[element.sortNumber] = element.fieldCode.toLowerCase() + " " + element.sortType;
                                }

                                //记录需要进行格式化的filed
                                //typecode不为空，说明当前项需要进行系统code转义
                                if (element.typeCode != "") {
                                    self.typeCodeList.push(element.typeCode);
                                    formats["codeParse"][element.fieldCode.toLowerCase()] = element.typeCode;
                                    //dataFormat不为空，说明当前项需要进行格式转换，可能是日期转换，可能是数字转换
                                } else {
                                    if (element.dataFormat != "") {
                                        if (element.dataType.toLowerCase() == "date") {
                                            formats["timeParse"][element.fieldCode.toLowerCase()] = element.dataFormat;
                                        } else if (element.dataType.toLowerCase() == "integer" || element.dataType.toLowerCase() == "double" || element.dataType.toLowerCase() == "number") {
                                            formats["numParse"][element.fieldCode.toLowerCase()] = element.dataFormat;
                                        }
                                    }
                                }
                               
                            });     
                            //添加选中框
                            self.columns.unshift({type: 'selection', width: 60, align: 'center'});  
                            if (self.typeCodeList.length > 0) {
                                self.getCodes(self.typeCodeList.toString());
                            } else {
                                let isExport = false;
                                self.spliceSqlQuery(isExport);
                            }
                        }
                    },
                    finish() {
                        self.loading = false;
                    }
                });
            },
            //获取指定code的信息
            getCodes(typecodes) {
                let self = this;
                this.oss.get({
                    url: '/sys/code/findCodeByType',
                    data: { 'typeCodes': typecodes },
                    ok(data) {
                        self.dicts = data;
                        self.setSqlText();
                    }
                });
            },
            setSqlText() {
                if (orderByFiledList.length > 0) {
                    orderByFiledList.forEach((element, index) => {
                        this.orderByStr += element + ",";
                    });
                    this.orderByStr = this.orderByStr.substring(0, this.orderByStr.length - 1);
                }
                let isExport = false;
                this.spliceSqlQuery(isExport);
            },
            //拼接sql查询条件部分
            spliceSqlQuery(isExport) {
                let self = this;
                self.queryText = '';
                self.loading = true;
                let isFirst = true;
                if (self.isQuery) {
                    for (let key in self.queryValidateList) {
                        if (self.queryValidateList[key] != '') {
                            if (key in self.notRangeMap) {
                                let eleType = self.notRangeMap[key];
                                switch (eleType) {
                                    case 'string':
                                        if (self.queryValidateList[key] != null) {
                                            if (!isFirst) {
                                                self.queryText += ' and ';
                                            }
                                            isFirst = false;
                                            self.queryText += " " + key + " like '%" + self.queryValidateList[key] + "%'";
                                        }
                                        break;
                                    case 'number':
                                        let regex = /^(0|[1-9][0-9]*)(\.\d{1,3})??$/;
                                        if (regex.test(self.queryValidateList[key])) {
                                            if (!isFirst) {
                                                self.queryText += ' and ';
                                            }
                                            isFirst = false;
                                            self.queryText += " " + key + " = " + self.queryValidateList[key];
                                        }
                                        break;
                                    case 'date':
                                        if(self.queryValidateList[key] != null) {
                                            if (!isFirst) {
                                                self.queryText += ' and ';
                                            }
                                            isFirst = false;
                                            self.queryText += " " + key + " = '" + self.queryValidateList[key] + "'";
                                        }
                                        break;
                                }
                            } else if (key in self.rangeMap) {
                                if (self.queryValidateList[key][0] != '') {
                                    switch (self.rangeMap[key]) {
                                        case 'date':
                                            if (!isFirst) {
                                                self.queryText += ' and ';
                                            }
                                            isFirst = false;
                                            self.queryText += " " + key + " between '" + self.queryValidateList[key][0] + "' and '" + self.queryValidateList[key][1] + "'";
                                            break;

                                    }
                                }
                            }
                        }
                    }
                }
                if(isExport) {
                    this.excelDownLoad();
                }else {
                    this.getReportData();
                }
            },

            getReportData() {
                this.size = this.pageFlag ? this.size : 1000000;
                let self = this;
                self.orderByStr = self.orderByStr == ' order by ' ? '' : self.orderByStr;

                this.oss.post({
                    url: '/sys/rptConfig/query',
                    data: { "connName": self.dataSource, "querySql": self.sqlText, "queryText": self.queryText, "orderByText": self.orderByStr, "permType": self.permType, 'rankSql': self.rankSql, "current": self.current, "size": self.size },
                    ok(data) {
                        if (self.pageFlag) {
                            self.current = data.page.current;
                            self.size = data.page.size;
                            self.total = data.page.total;
                        }
                        let lastData = [];
                        for (let i = 0; i < data.recordList.length; i++) {
                            let currentRecord = data.recordList[i];
                            lastData[i] = {};
                            for (let k = 0; k < data.titleList.length; k++) {
                                lastData[i][data.titleList[k].toLowerCase()] = currentRecord[k];
                            }
                        }
                        var dataLength = self.dataFormats(lastData);
                        if(dataLength > 0 && self.showChart) {
                            self.findReportChartConfig(self.reportId);
                        }
                    },
                    err(message, detailmsg) {
                        self.loading = false;
                    }
                });
                // self.current = testData.page.current;
                // self.size = testData.page.size;
                // self.total = testData.page.total;
                // let lastData = [];
                // for (let i = 0; i < testData.recordList.length; i++) {
                //     let currentRecord = testData.recordList[i];
                //     lastData[i] = {};
                //     for (let k = 0; k < testData.titleList.length; k++) {
                //         lastData[i][testData.titleList[k].toLowerCase()] = currentRecord[k];
                //     }
                // }
                // var dataLength = self.dataFormats(lastData);
                // if(dataLength > 0 && self.showChart) {
                //     self.findReportChartConfig(self.reportId);
                // }
            },
            //刷新
            refreshData() {
                this.current = 1;
            },
            handlePage(value) {
                this.current = value;
                this.getReportData();
            },
            handlePageSize(value) {
                // this.current = 1;
                this.size = value;
                this.getReportData();
            },
            //格式化数据
            dataFormats(data) {
                let self = this;
                data.forEach(element => {
                    for (let key in element) {
                        if (key in formats["codeParse"] && formats["codeParse"][key] in self.dicts && element[key] != '') {
                            element[key] = self.dicts[formats["codeParse"][key]][element[key]];
                        } else if (key in formats["timeParse"] && element[key] != '') {
                            element[key] = this.dateFormats(element[key], formats["timeParse"][key]);
                        } else if (key in formats["numParse"] && element[key] != '') {
                            element[key] = this.numeral(element[key]).format(formats["numParse"][key]);
                        }
                    }
                });

                this.dataList = data;
                this.loading = false;
                return data.length;
            },
            //日期格式化
            dateFormats(date, fmt) {
                date = new Date(date);
                let o = {
                    "M+": date.getMonth() + 1, //月份
                    "d+": date.getDate(), //日
                    "h+": date.getHours(), //小时
                    "H+": date.getHours(), //小时
                    "m+": date.getMinutes(), //分
                    "s+": date.getSeconds(), //秒
                    "S": date.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            },
            isContain(arr,ele) {
                let isContains = false;
                arr.forEach(item => {
                    if(item == ele) {
                        isContains = true;
                    }
                });
                return isContains;
            },
            /*查询按钮事件  */
            searchBtnFn() {
                let isExport = false;
                this.current = 1;
                this.spliceSqlQuery(isExport);
            },
            // 导入数据
            importData() {

            },

            /* 点击导出全部按钮事件 */
            exportAllBtnFn() {
                let isExport = true;
                this.exportType = 'all';
                this.spliceSqlQuery(isExport);
            },
            // 导出当前页数据
            exportBtnFn() {
                let isExport = true;
                this.exportType = 'current';
                this.spliceSqlQuery(isExport);
            },
            /* 导出事件 */
            excelDownLoad() {
                let self = this;
                let pageSize = null;
                let pageNum = null;
                if(this.exportType == 'current'){
                    pageSize = this.size;
                    pageNum = this.current;
                }
                self.orderByStr = self.orderByStr == ' order by ' ? '' : self.orderByStr;
                this.oss.post({
                    url: '/sys/rptConfig/exportExcel',
                    data: {
                        "connName": self.dataSource,
                        "querySql": self.sqlText,
                        "queryText": self.queryText,
                        "orderByText": self.orderByStr,
                        "permType": self.permType,
                        "rankSql" : self.rankSql,
                        "titleList" : JSON.stringify(titleList),
                        "columnList" : JSON.stringify(columnList),
                        "columnCodeList" : JSON.stringify(formats["codeParse"]),
                        "pageSize":pageSize,
                        "pageNum":pageNum
                    },
                    action : 'download',
                    ok(data) {
                        self.loading = false;
                    },
                    err(message, detailmsg) {

                    }
                })
            },
            chooseData(val) {
                this.chooseList = val;
                for(var k in this.chooseList[0]) {
                   if (formats['codeParse'].hasOwnProperty(k)){
                        for(var key in this.dicts[formats['codeParse'][k]]) {
                            if (this.dicts[formats['codeParse'][k]][key] == this.chooseList[0][k]) {
                                this.chooseList[0][k] = key;
                            }
                        }
                   }
                }
            },
            clickBtn(item) {
                switch(item.code) {
                    /**
                    * 点击添加按钮时的操作：
                    * @param code：值为add
                    */
                    case 'add':
                    this.modal.text = '新增用户';
                    this.modal.type = 'add';
                    this.modal.icon = 'md-person-add';
                    this.$refs.addEditModal.$refs.formModal.resetFields();
                    this.$refs.addEditModal._data.showModal = true;
                    this.formValidate = {};
                    break;
                    /**
                    * 点击编辑按钮时的操作：
                    * @param code：值为edit
                    */
                    case 'edit':
                    this.modal.text = '编辑用户';
                    this.modal.type = 'edit';
                    this.modal.icon = 'ios-create';
                    if (this.chooseList.length == 0) {
                        this.oss.showMessage({type: 'warning', content: '请选择一条数据'});
                    } else if (this.chooseList.length > 1) {
                        this.oss.showMessage({type: 'warning', content: '只能选择一条数据'});
                    } else {
                        this.formValidate = JSON.parse(JSON.stringify(this.chooseList[0]));
                        this.$refs.addEditModal._data.showModal = true;
                    }
                    break;
                    /**
                    * 点击删除按钮时的操作：
                    * @param code：值为delete
                    */
                    case 'delete':
                    if (this.chooseList.length == 0) {
                        this.oss.showMessage({type: 'warning', content: '请选择要删除的数据'});
                    } else {

                    }
                    break;
                }
            },
            reset(val) {
                this.$refs.addEditModal.$refs.formModal.resetFields();
            },
            save(val) {
                
            }
        },
        created() {
            let currentUser = this.oss.getGlobalData('currentUser');
            this.rankTypeCode = currentUser.positionClass;
            this.clearPage();
        },
        updated:function(){
          if(this.chartsData&&this.chartsData.length>0){
            this.coverChartData(this.chartsData);
          }
        }
    }

</script>

<style lang="less">
    @import "./../../assets/css/common";
    #rptTemplate {
        .w(100%);
        .h(100%);
        overflow-y: auto;
        .rptTemplate_search_wrapper {
            .w(100%);
            .b(#fff);
            .p(15px 20px 10px 20px);
            border-radius: 10px;
            border: 1px solid #e6e6e6;
            box-sizing: border-box;
            -webkit-box-shadow: 4px 4px 3px #e6e6e6;
            -moz-box-shadow: 4px 4px 3px #e6e6e6;
            box-shadow: 4px 4px 3px #e6e6e6;
            .search_top {
                .w(100%);
                margin-bottom: 8px;

                position: relative;

                .search_condition {
                    .w(85%);
                    .h(100%);
                    display:inline-block;

                    .ivu-form {
                        .w(100%);
                        .h(100%);
                        .ivu-row {

                            .h(50px);
                            .ivu-col {
                                .h(100%);
                                .ivu-form-item {
                                    margin-bottom: 6px;
                                    margin-top: 6px;
                                }
                                &.issue_date {
                                    .ivu-col {
                                        .p(0);
                                        .ivu-date-picker {
                                            .w(84%);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                .btn_wrapper {

                    position: absolute;
                    width: 6px;
                    height: 24px;
                    top:50%;
                    right: calc(7% - 3px);
                        text-align: center;
                        -webkit-transform: translate(-50%, -50%);
                        -moz-transform: translate(-50%, -50%);
                        -ms-transform: translate(-50%, -50%);
                        -o-transform: translate(-50%, -50%);
                        transform: translate(-50%, -50%);
                        .btn {
                            margin-bottom: 5px;
                            .p(2px 14px) !important;
                            border-radius: 12px;
                        }

                        .search_more_wrapper {
                            width: 75px;
                            .search_more_btn {
                                color: @darkBlue;
                                .f-s(12px);
                                width: 100%;
                                line-height: 100%;
                                .iconfont {
                                    .f-s(12px);
                                    margin-left: 3px;
                                }
                            }
                        }
                    }

                .clearFix:after {
                    display: block;
                    visibility: hidden;
                    clear: both;
                    height: 0;
                    content: '';
                    zoom: 1;
                }
            }
            .search_more {
                position: relative;
                margin-top: 10px;
                padding-top: 25px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                border-top: 1px dashed #d1d2d3;
            }
        }
        .btn_wrapper{
            text-align: right;
            margin-top: 10px;
            margin-right: 10px;
            .btns_ul {
                width: 50%;
                float: left;
                overflow: hidden;
                .btns_li {
                    float: left;
                }
            }
            .ivu-btn-group {
                top: 17px;
            }
        }
        .table_wrapper{
            .w(100%);
            .h(100%);
            margin-top: 10px;
            .chartList{
                .w(100%);
                .h(100%);
                text-align: center;
                .chart{
                    .w(98%);
                    .h(450px);
                    background: #fff;
                    border: 1px solid#e6e6e6;
                    border-radius: 3px;
                    margin-right: 15px;
                    margin-bottom: 15px;
                    box-shadow:1px 1px 6px #e6e6e6;
                    .chartTitle{
                        height: 32px;
                        line-height: 32px;
                        padding-left: 15px;
                        text-align: left;
                        font-size: 14px;
                        border-bottom: 1px solid #e6e6e6;
                    }
                    .myChart {
                        .h(~"calc(100% - 32px)");
                        .w(100%);
                        padding: 5px;
                        box-sizing: border-box;
                    }
                }

            }
        }
   
    }
</style>
