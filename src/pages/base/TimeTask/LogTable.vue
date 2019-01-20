<template>
  <div class="work_table">
    <div class="table_wrapper">
      <div class="topcheer-oss-table topcheer-oss-table-without-btn time-task">
        <Table :loading="log.loading"
                highlight-row size="small" :columns="log.column" :data="log.data"  @on-row-dblclick="showRowDataDetail">
          <div slot="footer" class="page_footer">
            <Page :total="log.totalSize" placement="top" show-sizer show-total @on-change="logPageFn"  @on-page-size-change="logPageSizeFn" :page-size-opts="oss.pageSizeOpts" size="small"/>
          </div>
        </Table>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props:['jobId'],
  data() {
    return{
       log:{
         current:1,
         size:5,
        column: [
          {
              title:'序号',
              width:100,
              align:'center',
              render:(h, params) => {
                return h('div', (params.index + 1) + this.log.size * (this.log.current - 1));
              }
            },
          {key: 'result', title: '结果',width:100,   render: (h, params) => {
            return h('span',
            params.row.result === '' ? '' : this.log.codeList['result'][params.row.result]
            )
            }, align: 'center'
          },
          {key: 'beginTime', title: '开始时间', width:180,  align: 'center',sortable: true},
          {key: 'endTime', title: '结束时间', width:180,  align: 'center'},
          {key: 'costMillis', title: '耗费时间(毫秒)',width:180,  align: 'center'},
          {key: 'errorInfo', title: '异常信息',  ellipsis:true, align: 'center'},
          {key: 'remark', title: '备注',  align: 'center',width:200}
        ],
        codeList:{},
        data:[],
        totalSize:0,
        loading:false
      },
    }
  },
  watch:{
    jobId:function(val){
      this.logData(val);
    }
  },
  methods:{
    logData(val) {
        var self = this;
        self.log.loading = true;
        this.oss.get({
          url: '/sys/logQuartz/list',
          data:{
            current:self.log.current,
            size:self.log.size,
            jobId:val
          },
          ok(data, page, code) {
            self.log.codeList = code;
            self.log.data = data;
            self.log.totalSize = page.total;
            self.log.pageSize = page.pageSize;
            self.log.loading = false;
          },
          err(error) {
            self.log.loading = true;
          }
        });
      },
      logPageFn(val){
        this.log.current=val;
        this.logData(this.jobId);
      },
      logPageSizeFn(val){
        this.log.size=val;
        this.logData(this.jobId);
      },
      showRowDataDetail(row){
        this.oss.showModal({
          type: 'info',
          title: '作业日志',
          width: 500,
          okText: '关闭',
          render: (h) => {
            return h('tableRowDataDetail', {
              props: {
                columns: this.log.column,
                dataRow: row,
                codes: {}
              }
            })
          }
        });
      },
  },
  mounted(){
    this.logData();
  }

}
</script>

<style lang="less">
  @import "./../../../assets/css/common";
  // @import "./../../../assets/css/content";

  .work_table {

  }
</style>




