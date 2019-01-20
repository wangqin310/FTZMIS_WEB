<template>
  <div id="system">
    <!-- 报表 -->
    <Row class="search_wrapper" :gutter="5" v-show="showChart">
      <Col :xs="{ span: 6}">
      <span class="text">日期查询</span>
      <DatePicker v-model="searchModel.startMonth" format="yyyyMM" type="month" @on-change="searchModel.startMonth=$event" placeholder="开始日期" size="small" style="width: 90px" />
      <DatePicker v-model="searchModel.endMonth" format="yyyyMM" type="month" @on-change="searchModel.endMonth=$event" placeholder="结束日期" size="small" style="width: 90px" />
      </Col>
      <Col :xs="{ span: 4}">
      <Label class="labels">用户账号</Label>
      <Input clearable class="inputs" v-model="searchModel.userAccount" size="small" placeholder="输入用户账号"/>
      </Col>
      <Col :xs="{ span: 4}">
      <Label class="labels">用户姓名</Label>
      <Input clearable class="inputs" v-model="searchModel.userName" size="small" placeholder="输入用户姓名"/>
      </Col>
      <Col :xs="{ span: 4}">
      <Label class="labels">菜单名称</Label>
      <Input clearable class="inputs" v-model="searchModel.resourceName" size="small" placeholder="输入菜单名称"/>
      </Col>

      <Col :xs="{ span: 3}">
      <Label class="labels">终端</Label>
      <Select v-model="searchModel.deviceType" style="width:100px" size="small">
        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
      </Col>
      <Col :xs="{ span: 3}" :lg="{span:1,offset:2}">
      <Button type="primary" shape="circle" @click="search">查&nbsp;&nbsp;询</Button>
      </Col>
    </Row>
    <!-- 柱状图 -->
    <Row class="search_wrapper" :gutter="5" v-show="!showChart">
      <Col :xs="{ span: 6}">
      <span class="text">日期查询</span>
      <DatePicker v-model="searchModela.startDate"  type="date" @on-change="searchModela.startDate=$event" placeholder="开始日期" size="small" style="width: 100px" />
      <DatePicker v-model="searchModela.endDate"  type="date" @on-change="searchModela.endDate=$event" placeholder="结束日期" size="small" style="width: 100px" />
      </Col>
      <Col :xs="{ span: 4}">
      <Label class="labels">用户账户</Label>
      <Input clearable class="inputs" v-model="searchModela.userAccount" size="small" placeholder="输入用户账号"/>
      </Col>

      <Col :xs="{ span: 4}">
      <Label class="labels">用户名称</Label>
      <Input clearable class="inputs" v-model="searchModela.userName" size="small" placeholder="输入用户姓名"/>
      </Col>
      <Col :xs="{ span: 4}">
      <Label class="labels">终端</Label>
      <Select v-model="searchModela.deviceType" style="width:100px" size="small">
        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
      </Col
      <Col :xs="{ span: 3}" :lg="{span:3,offset:4}">
      <Button type="primary" size="small" shape="circle" @click="searcha">查&nbsp;&nbsp;询</Button>
      </Col>
    </Row>
   <ButtonGroup vertical:false >
        <Button type="default" icon="md-stats" size="large" @click="showChart=false">图表</Button>

        <Button type="default" icon="ios-list-box-outline" size="large"  @click="showChart=true">表格</Button>
    </ButtonGroup>
    <div class="table_wrapper" v-show="showChart">
      <div class="topcheer-oss-table topcheer-oss-table-without-btn time-task">
        <Table  ref="selection" @on-row-dblclick="showRowDataDetail" :loading="loading" :columns="columns" :data="taskList"
                highlight-row >
           <div slot="footer" class="page_footer" >
             <Page class="page" v-if="totalSize>0" @on-change="pageFn" @on-page-size-change="pageSizeFn" :total="totalSize"
             :current="searchParams.current" show-elevator show-sizer show-total></Page>
           </div>

        </Table>
      </div>
    </div>

    <div class="user_modal" ref="userModal" v-show="!showChart">

    </div>
  </div>
</template>

<script>
let codes = {};
let currentPage = 1; //当前页数
let pageSize = 10;
import echarts from "echarts";
export default {
  name: "SystemFunctionUsageStatistics",
  data() {
    return {
      date: "",
      loading: true,
      chartsNameList: [], //存储每个柱状图名字89
      chartsVisitCountList: [], //存储柱状图
      model1: "",
      searchIssueDate: "",
      cityList: [
        {
          value: "C",
          label: "PC端用户"
        },
        {
          value: "M",
          label: "移动端用户"
        }
      ],
      columns: [

        {
              title:'序号',
              width:100,
              align:'center',
              render:(h, params) => {
                return h('div', (params.index + 1) + this.searchParams.size * (this.searchParams.current - 1));
              }
            },
        {
          title: "用户",
          align: "center",
          render: (h, params) => {
            var self = this;
            return h("div", [
              h(
                "span",
                {},
                "(" + params.row.userAccount + ")" + params.row.userName
              )
            ]);
          }
        },
        { key: "resourceName", title: "菜单名称", align: "center" },
        { key: "visitCount", title: "访问次数", align: "center" },
        { key: "deviceType", title: "终端", align: "center" ,render: (h, params) => {
            return h('span', params.row.deviceType == '' ? '' : codes['deviceType'][params.row.deviceType])
          }
        }
      ],
      taskList: [],
      totalSize: 0,
      loading: true,
      searchModel: {
        userAccount: "", //名称
        userName: "", //数据库名称
        resourceName: "", //菜单名称
        osType: "", //终端类型
        startMonth: "", //开始月份
        endMonth: "" ,//结束月份
      },
      searchModela: {
        userAccount: "",
        userName: "",
        deviceType: "",
        startDate: "",
        endDate: ""
      },
      searchParams: {
        //查询条件
        current: 1,
        size: 10,
        userAccount: "",
        userName: "",
        resourceName: "",
        osType: "",
        startMonth: "",
        endMonth: ""
      },
      chooseList: [],
      aaa: false,
      showChart: false,
      dataParams: {
        startDate: "",
        endDate: "",
        userAccount: "",
        userName: "",
        deviceType: "C"
      },

      myChart: null,
      dataList:[],
      dataShow: [],
      nameList: [],
      valueList: [],

    };
  },

  methods: {
     showRowDataDetail(row){
        this.oss.showModal({
          type: 'info',
          title: '系统功能使用统计表',
          width: 500,
          okText: '关闭',
          render: (h) => {
            return h('tableRowDataDetail', {
              props: {
                columns: this.columns,
                dataRow: row,
                codes: {}
              }
            })
          }
        });
      },
  getData() {
      var self = this;
      this.oss.get({
        url: "/sys/rpt/findMenuCount",
        data: self.dataParams,
        ok(data, page, code) {
          self.dataShow.push(data);
          self.showEcharts();
        }
      });
  },

  initECharts() {
    let self  = this;
    this.myChart = echarts.init(this.$refs.userModal);
    this.myChart.on('click', params => {
      let menuInfo = self.dataShow.slice(-1)[0][params.dataIndex];
      if(menuInfo && menuInfo.children.length > 0) {
        self.dataShow.push(menuInfo.children);
        self.showEcharts();
      }
    });
  },

  showEcharts() {
    let self = this;
    self.nameList.length = 0;
    self.valueList.length = 0;

    this.dataShow.slice(-1)[0].forEach(item => {
      self.nameList.push(item.name);
      self.valueList.push(item.visitCount);
    });
    var option = {
      title: {
        text: "系统功能使用监控",
        padding: [25,50,45,59],
        subtext: "系统功能使用统计表",
        subtextStyle: {
          fontWeight: 'normal',
          color: '#0000000',
          fontSize: '15',
        },
      },
      grid: { //修改图表位置
                    top: '15%',
                    left: '5%',
                    right: '7%',
                    bottom: '1%',
                    containLabel: true
                  },
      tooltip: {
        trigger: "axis"
      },
      toolbox: {
        x:980,
        y:30,
        right: 40,
        show: true,
        feature: {
            myTool1: {
              show: true,
              title: '返回上一级',
              icon: 'image://./../../../static/crm/left109.png',
              onclick: function (){
                if(self.dataShow.length > 1) {
                  self.dataShow.pop();
                  self.showEcharts();
                }
              }
          },

          mark: { show: true },
          magicType: { show: true, type: ["line", "bar"] },
          saveAsImage: {show: true}
        }
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          data: self.nameList
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          barWidth : 80,//柱图宽度
          barMaxWidth:80,
          name: "菜单",
          type: "bar",
          data: self.valueList,
          markPoint: {
            data: [
              { type: "max", name: "最大值" },
              { type: "min", name: "最小值" }
            ]
          },
          markLine: {
            data: [{ type: "average", name: "平均值" }]
          }
        }
      ]
      };
      this.myChart.setOption(option);
    },

    getTaskList(searchParams, self) {
      //获取数据
      this.oss.get({
        url: "/sys/rpt/findUserMenu",
        data: searchParams,
        ok(data, page, code) {
          codes = code;
          self.codeList = code;
          self.loading = false;
          self.totalSize = page.total;
          self.taskList = data;
        }
      });
    },
    /**
     * 点击切换当前页码：
     * @param val：当前页码
     */
    pageFn(val) {
      this.searchParams.current = val;
      currentPage = val;
      this.loading = true;
      this.getTaskList(this.searchParams, this);
    },
    /**
     * 点击显示每页条数：
     * @param val：每页条数
     */
    pageSizeFn(val) {
      this.searchParams.size = val;
      pageSize = val;
      this.loading = true;
      this.getTaskList(this.searchParams, this);
    },
    /**
     * 查询：
     */
    search() {
      this.searchParams.current = 1;
      currentPage = 1;
      Object.assign(this.searchParams, this.searchModel);
      this.getTaskList(this.searchParams, this);
    },
    searcha() {
      Object.assign(this.dataParams, this.searchModela);
      this.getData();

    },
    /**
     * 切换在线终端
     */
    selectOsType(val) {
      this.searchParams.osType = val;
    }
  },
  mounted() {
    this.getTaskList(this.searchParams, this);
    this.getData(this.dataParams, this);
    this.initECharts();
  }
};
</script>

<style lang="less">
@import "./../../assets/css/common";
// @import "./../../assets/css/content";
#system {
  .w(100%);
  .h(100%);
  .user_modal {
    .w(100%);
    .h(80%);
    .b(white;);
    z-index: 99;
  }
  .ivu-btn-circle {
    padding: 5px 15px 6px;
  }
}
.ivu-modal {
  .ivu-modal-confirm-body div {
    word-break: break-all;
  }
}
</style>







