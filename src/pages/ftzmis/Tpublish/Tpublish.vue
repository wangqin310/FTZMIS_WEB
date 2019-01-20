<template>
  <div id="Tpublish">
    <div class="search_wrapper">
      <div class="conleft">
        <span>申报日期</span> 
        <DatePicker v-model="searchParams.dateDt" type="date" format="yyyy-MM-dd" size="small" 
        @on-change="searchParams.dateDt=$event" style="width: 130px"></DatePicker>
        <Button type="primary" icon="ios-search" @click="search">查询</Button>
      </div>
      <div class="conright">
        <Button type="primary" icon="ios-trash-outline" @click="deleteMessageAlert">删除</Button>
        <Button type="primary" icon="ios-add-circle-outline" @click="findCodeAlert">一键生成</Button>
        <Button type="primary" icon="ios-analytics" @click="waitingToReportData">待报数据</Button>
        <Button type="primary" icon="ios-analytics-outline" @click="SendingOutData">下发数据</Button>
        <Button type="primary" icon="md-trending-up" @click="StartReportingAlert">开始上报</Button>
      </div>
    </div>
    <div>
      <Row style="height:10px;"></Row>
    </div>
    <div class="table_wrapper">
      <div class="topcheer-oss-table topcheer-oss-table-without-btn" ref="topcheerOssTable">
          <Table class="" ref="selection"  :loading="loading" @on-select="onSelect" @on-select-all="selectAll"
           @on-selection-change="selectionChange" :columns="columns" :height="tableHeight" :data="dataList" size="small" highlight-row >
            <div slot="footer" class="page_footer">
              <Page class="page" size="small" v-if="total>0" placement="top" @on-change="handlePage" @on-page-size-change="handlePageSize" 
                :total="total" :current="searchParams.current" :page-size="searchParams.size" :page-size-opts="oss.pageSizeOpts" 
                show-elevator show-sizer show-total></Page>
            </div>
          </Table>
      </div>
    </div>
    <!-- 一键生成对话框 -->
    <Modal  v-model="modal1"  title="上报确认-选择申报日期和报表" @on-ok="ok"  @on-cancel="cancel" ok-text='提交' cancel-text='关闭'>
        <span>申报日期</span> 
        <DatePicker v-model="findCodeDateDt" type="date" format="yyyy-MM-dd" size="small" 
        @on-change="findCodeDateDt=$event" style="width: 130px"></DatePicker>
        <Table  border ref="selection" :columns="columns2" :height="470" style="margin-top:10px" :data="findCodeArr" @on-select="onSelect" @on-select-all="selectAll"
           @on-selection-change="selectionChange"></Table>
    </Modal>
  </div>
</template>

<script>
let currentPage = 1;  //当前页数
let codeList = {};
let pageSize = 10;
export default{
      data(){
        return{
          loading: false,
          bookSrc:require('@/assets/images/book.png'),
          columns: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {key: 'msgid', title: '报文标识号', width: 260, align: 'center'},
            {key: 'rptId', title: '报文编号', width: 150 , align: 'center'},
            {key: 'rptNm', title: '报表名称', width: 180 , align: 'center'},
            {key: 'rptType', title: '报文类型', width: 120 , align: 'center', render: (h, params) => {
              return h('span',params.row.rptType=='1'?'1--新增':params.row.rptType=='2'?'2--修改':'3--删除')
              }},
            {key: 'dataDt', title: '报文日期', width: 180, align: 'center'},
            {key: 'createDt', title: '生成时间', width: 180, align: 'center'},
            {key: 'publishDt', title: '上报/接受时间', width: 180,  align: 'center'},
            {key: 'reXml', title: '报文', width: 70 , align: 'center', render: (h, params) => {
              return h('img', {
                domProps:{src:this.bookSrc},
                style:{cursor:'pointer'},
                on:{
                click: () => {
                      console.log(params.row.reXml);
                      this.$Modal.info({
                          title: '查看窗口',
                          content: `<xmp>${params.row.reXml}</xmp>`,
                          width:'580px'
                      })
                    }
                }
                })
              }},
            {key: 'publishStatus',  title: '状态', width: 90, align: 'center', render: (h, params) => {
              return h('span',{
                style:{color:params.row.rptType=='1'?'green':params.row.rptType=='2'?'red':'black'},
              },
              params.row.publishStatus=='0'?'未上报'
              :params.row.rptType=='1'?'上报成功'
              :params.row.rptType=='2'?'上报失败'
              :params.row.rptType=='3'?'上报中'
              :params.row.rptType=='4'?'已删除':'下发数据'

              )
              }},
            {key: 'reResult', title: '返回结果', width: 160, align: 'center'},
            {key: 'reInformation', title: '返回信息', width: 90 , align: 'center', render: (h, params) => {
              return h('img', {
                domProps:{src:this.bookSrc},
                style:{cursor:'pointer'},
                on:{
                click: () => {
                      console.log(params.row.reInformation);
                      this.$Modal.info({
                          title: '查看窗口',
                          content: `<xmp>${params.row.reInformation}</xmp>`,
                          width:'580px'
                      })
                    }
                }
                })
              }},
          ],
          searchParams: {
            current:1, //当前页
            size:10,     //每页大小
            dateDt:this.formatDate(new Date()),
            mode:'1',
          },
          dataList: [],
          tableHeight: '', //默认表格的高度
          codes:[],
          total: 0,
          size: 0,   //每页大小
          msgid:[],
          modal1: false,
          findCodeArr:[],
          findCodeDateDt:this.formatDate(new Date()),
          columns2:[
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {key: 'reportCode', title: '报文编号', width: 160, align: 'center'},
            {key: 'reportName', title: '报文名称', align: 'center'}
          ]
        }
      },
      methods:{
        // 刷新页面触发的方法
          refreshData() {
            this.loading = true;
            var param = this.searchParams;
            if(param.dateDt.toString().length!=10){
              param.dateDt = this.formatDate(param.dateDt);
            }
            this.oss.get({
              url: '/ftzmis/tpublish/listPublishRpts',
              data: param,
              ok:(data, page, code) =>{
                codeList = code;
                this.codes=code;
                console.log(data)
                this.dataList = data;
                this.total = page.total;
                this.size = page.size;
                this.loading = false;
                for (let i = 0; i < data.length; i++) {
                    if(data[i].publishStatus!='0'){
                        data[i]['_disabled']=true
                    }
                }
                this.oss.setTableHeight({
                  el: this,
                  topHeight: 150,
                  size: this.size
                });
              },
              err:(error) =>{
                this.loading = false;
              }
            });
        },
        // 获取已选项和刚选择的项，返回值为 selection 和 row
        onSelect(selection){
         var select=[]
         for (let i = 0; i < selection.length; i++) {
          //  select.push(selection[i].msgid)
          if(selection[i].msgid){
              select.push(selection[i].msgid)
           }else if(selection[i].reportCode){
              select.push(selection[i].reportCode)
           }
         }
           this.msgid=select
            console.log(this.msgid)
        },
        // 点击全选时触发，返回值为 selection，已选项
        selectAll(selection){
          var select=[]
         for (let i = 0; i < selection.length; i++) {
           if(selection[i].msgid){
              select.push(selection[i].msgid)
           }else if(selection[i].reportCode){
              select.push(selection[i].reportCode)
           }
         }
          this.msgid=select
          console.log(this.msgid)
        },
        // 只要选中项发生变化时就会触发，返回值为 selection，已选项
        selectionChange(selection){
          // console.log(selection)
           var select=[]
         for (let i = 0; i < selection.length; i++) {
          //  select.push(selection[i].msgid)
          if(selection[i].msgid){
              select.push(selection[i].msgid)
           }else if(selection[i].reportCode){
              select.push(selection[i].reportCode)
           }
         }
           this.msgid=select
            console.log(this.msgid)
        },
        // 删除报文提示
        deleteMessageAlert(self){
          
          this.$Modal.confirm({
                    title: '信息',
                    content: '<p>您确定要删除选中的报文吗？</p>',
                    onOk: () => {
                        this.deleteMessage()
                    },
                    onCancel: () => {
                        // this.$Message.info('取消');
                    }
                });
          
        },
        //删除报文
        deleteMessage(){
          this.loading = true;
          this.oss.post({
              url: '/ftzmis/tpublish/deletePublishRpts',
              data: {msgids:this.msgid.toString()},
              ok: (data, page, code) =>{
                this.$Message.info(data);
                this.loading = false;
                this.refreshData();

                this.oss.setTableHeight({
                  el: this,
                  topHeight: 150,
                  size: this.size
                });
              },
              err:(error) =>{
                this.loading = false;
              }
            });
        },
        // 一键生成弹框中的提交按钮和取消按钮
        ok () {
          this.oss.post({
              url: '/ftzmis/tpublish/generateReportXML',
              data: {
                declareDt:this.findCodeDateDt,
                reportCode:this.msgid.toString()
              },
              ok:(data, page, code) =>{
              },
              err:(error) =>{
                this.loading = false;
              }
            });
        },
        cancel () {
          // this.$Message.info('Clicked cancel');
         },
        //一键生成弹框
        findCodeAlert(){
          // if(this.findCodeArr != null && this.findCodeArr.length > 0) {
          //   return;
          // }
          this.loading = true;
          this.modal1=true,
          this.oss.get({
              url: '/sys/code/findCodeByType',
              data:{typeCodes: 'T_Report_Table'},
              ok:(data, page, code) =>{
                for (let i in data.T_Report_Table) {
                    this.findCodeArr.push({reportCode: i, reportName: data.T_Report_Table[i]});
                }
                console.log(this.findCodeArr)
                for (let j = 0; j < this.findCodeArr.length; j++) {
                  if(this.findCodeArr[i].reportCode=='310101'){
                    this.findCodeArr.splice(i,1)
                }
                }
                
                this.loading = false;
              },
              err:(error) =>{
                this.loading = false;
              }
            });
        },
        // 点击“查询”
        search(){
          // console.log(this.searchParams.dateDt);
          this.refreshData();
        },
        // 上报数据
        waitingToReportData(){
          this.refreshData();
        },
        // 下发数据
        SendingOutData(){
           this.loading = true;
            this.oss.get({
              url: '/ftzmis/tpublish/listPublishRpts',
              data: {
                current:1, //当前页
                size:10,     //每页大小
                dateDt:this.searchParams.dateDt,
                mode:'2'
              },
              ok:(data, page, code) =>{
                codeList = code;
                this.codes=code;
                console.log(data)
                this.dataList = data;
                this.total = page.total;
                this.size = page.size;
                this.loading = false;
                for (let i = 0; i < data.length; i++) {
                    if(data[i].publishStatus!='0'){
                        data[i]['_disabled']=true
                    }
                }
                this.oss.setTableHeight({
                  el: this,
                  topHeight: 150,
                  size: this.size
                });
              },
              err:(error) =>{
                this.loading = false;
              }
            });
        },
        // 开始上报提示
        StartReportingAlert(){
          if(this.msgid==''){
            this.$Modal.confirm({
                    title: '信息',
                    content: '<p>请先选择需要上报的报表!</p>',
                    onOk: () => {
                        // this.StartReporting()
                    },
                    onCancel: () => {
                        // this.$Message.info('取消');
                    }
                });
          }else{
            this.$Modal.confirm({
                    title: '信息',
                    content: '<p>您确定要开始上报报表？</p>',
                    onOk: () => {
                        this.StartReporting()
                    },
                    onCancel: () => {
                        // this.$Message.info('取消');
                    }
                });
          }
          
        },
        // 开始上报
        StartReporting(){
          // var a=[];
          // a.push(this.msgid.toString())
          var msgidString=[]
          for (let i = 0; i < this.msgid.length; i++) {
            msgidString[i]=this.msgid[i].toString()
          }
          console.log(msgidString)
           this.oss.post({
              url: '/ftzmis/tpublish/sendToMQ',
              data: {
                msgids:msgidString
              },
              ok:(data, page, code) =>{



                console.log(data)
                this.dataList = data;
                this.total = page.total;
                this.size = page.size;
                this.loading = false;
                for (let i = 0; i < data.length; i++) {
                    if(data[i].publishStatus!='0'){
                        data[i]['_disabled']=true
                    }
                }
                this.oss.setTableHeight({
                  el: this,
                  topHeight: 150,
                  size: this.size
                });
              },
              err:(error) =>{
                this.loading = false;
              }
            });
        },
        formatDate(date){
          // console.log(date);
          var y=date.getFullYear();
          var m=date.getMonth()+1;
          m = m < 10 ? '0' + m :m;
          var d=date.getDate();
          d = d < 10 ? '0' + d :d;
          // console.log(y + '-' + m + '-' + d)
          return y + '-' + m + '-' + d;
        }, 
        handlePage(val) {
          this.searchParams.current = val;
          currentPage=val;
          this.refreshData();
        },
        handlePageSize(val) {
          this.searchParams.size = val;
          pageSize = val;
          this.refreshData();
        },
      },
      mounted() {
      this.refreshData();
    }
  }

</script>

<style lang="less">
  @import "./../../../assets/css/common";
#Tpublish{
 width: 100%;
 height: 100%;
 .search_wrapper{
   .conleft{
     float: left;
   }
   .conright{
     float: right;
   }
 }

}
//  .ivu-modal-content{
//   height: 70vh;
//   .ivu-table-wrapper{
//     margin-top: 2vh;
//     .ivu-table-body{
//         max-height: 47vh;
//         overflow: scroll;
//     }
//     // height: 50vh;
//     // overflow: auto;
//   }
// }
</style>

