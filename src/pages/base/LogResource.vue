<template>
  <div id="logResource">
    <Row class="search_wrapper">
      <Form :label-width="80">
          <FormItem  label="IP" :label-width="40">
            <Input  clearable v-model="searchParams.ipAddr" size="small" style=" width:120px" placeholder="请输入IP地址"/>
          </FormItem>
          <FormItem  label="访问用户">
            <Input  clearable v-model="searchParams.account" size="small" style="width:120px" placeholder="请输入用户账号"/>
          </FormItem>
          <FormItem  label="结果" :label-width="60">
            <Select class="selects" v-model="searchParams.result" size="small" @on-change="selectStatus" placeholder="请选择结果类型" style="width:120px">
              <Option  value="">所有类型</Option>
              <Option v-for="(item,index) in codes.result" :value="index" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem  label="开始时间">
            <DatePicker v-model="searchParams.beginTime" format="yyyy-MM-dd" type="date" placeholder="请选择开始时间" size="small" style="width:130px"></DatePicker>
          </FormItem>
          <FormItem  label="结束时间">
            <DatePicker v-model="searchParams.endTime" format="yyyy-MM-dd" type="date" placeholder="请选择结束时间" size="small" style="width:130px"></DatePicker>
          </FormItem>
          <Button type="primary" shape="circle" @click="search" style="margin-left:50px">查&nbsp;&nbsp;询</Button>
      </Form>
    </Row>
    <div>
      <Row style="height:10px;"></Row>
    </div>
    <div class="table_wrapper">
       <div class="topcheer-oss-table topcheer-oss-table-without-btn" ref="topcheerOssTable">
        <Table class=""  :loading="loading" :height="tableHeight" :columns="columns" :data="dataList" size="small"
              @on-row-dblclick="showRowDataDetail" highlight-row >
          <div slot="footer" class="page_footer">
            <Page class="page" size="small" v-if="total>0" placement="top" @on-change="handlePage" @on-page-size-change="handlePageSize"  :total="total"
                  :current="searchParams.current" :page-size="searchParams.size" :page-size-opts="oss.pageSizeOpts" show-elevator show-sizer show-total></Page>
          </div>
        </Table>
      </div>
    </div>

  </div>
</template>

<script>
  let currentPage = 1;  //当前页数
  let codeList = {};
  let pageSize = 10;
  export default {
    name: 'LogResource',
    data() {
      return {
        loading: false,
        columns: [
          {
            title: '序号', width: 80, align: 'center',
            render: (h, params) => {
              return h('div', (params.index + 1) + pageSize * (currentPage - 1));
            }
          },
          {key: 'account', title: '访问用户', width: 150, align: 'center'},
          {key: 'ipAddr', title: 'IP地址', width: 150, align: 'center'},
          {key: 'osName', title: '操作系统', width: 150, align: 'center'},
          {key: 'browser', title: '浏览器', width: 150, align: 'center'},
          {key: 'uri', title: '请求URI', width: 270, align: 'center'},
          {key: 'method', title: '请求方式', width: 150, align: 'center'},
          {key: 'isAjax', title: '是否Ajax', width: 120, align: 'center', render: (h, params) => {
            return h('span', params.row.isAjax === '' ? '' : codeList['isAjax'][params.row.isAjax])
            }, align: 'center'
          },
          {key: 'result', title: '结果', width: 120, render: (h, params) => {
            return h('span', params.row.result === '' ? '' : codeList['result'][params.row.result])
            }, align: 'center'
          },
          {key: 'sessionId', title: '会话ID', width: 270,align:'center'},
          {key: 'beginTime', title: '开始时间', width: 150, align: 'center'},
          {key: 'endTime', title: '结束时间', width: 150, align: 'center'},
          {key: 'costMillis', title: '耗费时间(毫秒)', width: 150, align: 'center'},
          {key: 'userAgent', title: 'UserAgent', width: 270,ellipsis:true, align: 'center'},
          {key: 'referer', title: '链接来源', width: 270, align: 'center',ellipsis:true},
          {key: 'createTime', title: '创建时间', width: 150, align: 'center'},
          {key: 'remark', title: '备注', width: 150, align: 'center'},
        ],
        dataList: [],
        tableHeight: '', //默认表格的高度
        total: 0,
        size: 0,   //每页大小
        codes:[],
        searchParams: {
         current: 1,   //当前页
          size: 10,     //每页大小
          ipAddr : '',
          account :'',
          beginTime :'',
          endTime :'',
          result:''
        },
      }
    },
    methods: {
     refreshData(searchParams, self) {
        var self = this;
        self.loading = true;
        this.oss.get({
          url: '/sys/logResource/list',
          data: self.searchParams,
          ok(data, page, code) {
            codeList = code;
            self.codes=code;
            self.dataList = data;
            self.total = page.total;
            self.size = page.size;
            self.loading = false;
            self.oss.setTableHeight({
              el: self,
              topHeight: 150,
              size: self.size
            });
          },
          err(error) {
            self.loading = false;
          }
        });
      },
      handlePage(val) {
        this.searchParams.current = val;
        currentPage=val;
        this.refreshData(this.searchParams,this);
      },
      handlePageSize(val) {
        this.searchParams.size = val;
        pageSize = val;
        this.refreshData(this.searchParams,this);
      },
      selectStatus(val){
        this.searchParams.result=val;
      },
      formatDate(date){
        var y=date.getFullYear();
        var m=date.getMonth()+1;
        m = m < 10 ? '0' + m :m;
        var d=date.getDate();
        d = d < 10 ? '0' + d :d;
        return y + '-' + m + '-' + d;
      },
      search(){
          //Object.assign(this.searchParams, this.searchModel);
          if(this.searchParams.endTime !=='') {
            this.searchParams.endTime = this.formatDate(this.searchParams.endTime) + ' 23:59:59';
            this.searchParams.current=1;
            currentPage=1;
            this.refreshData(this.searchParams,this);
            this.searchParams.endTime=new Date(this.searchParams.endTime);
          }
          this.searchParams.current=1;
            currentPage=1;
            this.refreshData(this.searchParams,this);
      },
      showRowDataDetail(row){
        this.oss.showModal({
          type: 'info',
          title: '访问日志详细信息',
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
    mounted() {
      this.refreshData(this.searchParams, this);
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/common";
  // @import "./../../assets/css/content";
  #logResource{
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
