<template>
    <div id="sqlquery">
        <Row class="search_wrapper">
            <Form :label-width="90">
                <FormItem  label="数据库连接" >
                    <Select class="select" v-model="databaseLink" @on-change="changeSelect" style="width:130px;" size="small">
                        <Option v-for="item in connNameList" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                    <Tooltip placement="bottom" style="margin-left:13px">
                        <Icon type="md-information-circle"></Icon>
                        <div slot="content">
                            <p>连接名称 <i>{{connName1}}</i></p>
                            <p>连接类型 <i>{{connType1}}</i></p>
                            <p>URL <i>{{url1}}</i></p>
                            <p>用户名 <i>{{username1}}</i></p>
                        </div>
                    </Tooltip>
                </FormItem>
                <FormItem  label="数据库类型" >
                    {{dbType1}}
                </FormItem>
                <FormItem  label="最大行数" :label-width="80">
                    <Input type="text" class="maxline" v-model="limit1" style="width:130px;" size="small"></Input>
                </FormItem>
                <Button type="primary" shape="circle" @click="executeSql" style="margin-left:50px">执&nbsp;&nbsp;行</Button>
                <Button v-if="currentTab!=='sqlInfo'" type="primary" shape="circle" @click="exportResult" style="margin-left:50px">导&nbsp;&nbsp;出</Button>
            </Form>
        </Row>
        <div>
            <Row style="height:10px;"></Row>
        </div>
        <div>
            <Input  type="textarea" style="height:140px; width:100%;" v-model="sql" :autosize="{minRows:6,maxRows:6}"></Input>
        </div>
        <div>
            <Row style="height:8px;"></Row>
        </div>
        <div class="tab_wraapper">
            <Tabs type="card" v-model="currentTab">
                <TabPane label="信息" class="tabPane" name="sqlInfo">
                    <div v-for="item in sqlExecuteList" :key="item.index">
                        <div v-if="success===true">
                            <p>{{item.sqlContent}}</p>
                            <p><Icon type="ios-arrow-forward"></Icon>{{item.success}}</p>
                            <p><Icon type="ios-arrow-forward"></Icon>beginTime:{{item.beginTime}}</p>
                            <p><Icon type="ios-arrow-forward"></Icon>endTime:{{item.endTime}}</p>
                            <p><Icon type="ios-arrow-forward"></Icon>耗时:{{item.costMillis}}ms</p>
                            <p v-if="item.sqlType!=='Select'"><Icon type="ios-arrow-forward"></Icon>受影响行数:{{item.affectedRows}}</p>
                            <p v-if="item.sqlType==='Select'"><Icon type="ios-arrow-forward"></Icon>总行数:{{item.length}}</p>
                            <br/>
                        </div>
                        <div v-if="success===false">
                            <p><Icon type="ios-arrow-forward"></Icon>{{item.errorMsg}}</p>
                        </div>
                    </div>
                </TabPane>
                <TabPane :label="'Result'+(index+1)"  animate="false" class="tabPane" v-for="(item,index) in newArr" :name="sqlContent1[index] + ' -- ' + index" :key="index" >
                    <div class="topcheer-oss-table .ivu-table-wrapper .ivu-table-body .sql_body" ref="content">
                        <Table size="small" @on-row-dblclick="showRowDataDetail"  :columns="columnsArr[index]" :data="newArr[index]"  highlight-row />
                    </div>
                </TabPane>
            </Tabs>
             <Spin size="large" fix v-if="spinShow"></Spin>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'SqlQuery',
        data() {
            return {
                spinShow:null,
                dbConfigList :{},
                connNameList :[],
                databaseLink:'',
                connName1 : '',
                connType1 : '',
                url1 : '',
                username1 : '',
                dbType1 : '',
                limit1 : '100',
                sql : '',
                sqlExecuteList:[],
                columns: [],
                tableTitleList:[],
                tableDataList: [],
                newArr:[],
                columnsArr:[],
                success: false,
                selectResult1 :{},
                sqlContent1 :[],
                currentTab: 'sqlInfo',
                modal1 : false,
                codeList:{}
            }
        },
        methods: {
            refreshData() {
                var self = this;
                this.oss.get({
                    url:'/sys/dbConfig/list',
                    data:{current:1,size:1000},
                    ok(data) {
                        data.forEach(element => {
                            //数据库连接名称数组--用于select-option循环
                            self.connNameList.push({value : element.connName,label:element.connName});
                            //select-option的默认值
                            // self.databaseLink=self.connNameList[0].value;
                           if(!(element.connName in self.dbConfigList)) {
                                self.dbConfigList[element.connName] = [];
                            }
                            //dbConfigList是个对象，放入需要的字段信息
                            self.dbConfigList[element.connName].push({ connName :element.connName,
                                                                  connType :element.connType,
                                                                  url :element.url,
                                                                  username :element.username,
                                                                  dbType :element.dbType});
                        });
                    }
                });
            },
            //select-option绑定的信息（需要优化）
            changeSelect(val){
                let self = this;
                self.connName1 = self.dbConfigList[val][0]["connName"];
                self.connType1 = self.dbConfigList[val][0]["connType"];
                self.url1 = self.dbConfigList[val][0]["url"];
                self.username1 = self.dbConfigList[val][0]["username"];
                self.dbType1 = self.dbConfigList[val][0]["dbType"];
                //select-option的默认值
                // self.databaseLink=self.connNameList[1].value;
            },
            //执行sql
            executeSql(){
                this.spinShow=true;
                //每次刷新将数组清空
                //执行sql返回的基本信息（不是查询数据）
                this.sqlExecuteList = [];
                //执行sql返回的查询数据（表身）
                this.newArr=[];
                //执行sql返回的查询数据（表头）
                this.columnsArr=[];
                this.sqlContent1=[];
                var self = this;
                this.oss.post({
                    url:'/sys/sql/execute',
                    //参数
                    data:{connName:self.connName1,
                          sqlContent:self.sql,
                          limit:self.limit1},
                    ok(data) {
                        self.success=true;
                        data.forEach(element => {
                            //根据查询结果集是否为NULL向sqlExecuteList插基本信息
                            if(element.selectResult!==null){
                                self.sqlExecuteList.push({
                                                        beginTime : element.beginTime,
                                                        endTime : element.endTime,
                                                        costMillis : element.costMillis ,
                                                        length : element.selectResult.recordList.length,
                                                        sqlContent : element.sqlContent,
                                                        sqlType : element.sqlType,
                                                        success:'OK;'});
                            }else{
                                 self.sqlExecuteList.push({
                                                      affectedRows : element.affectedRows,
                                                      beginTime : element.beginTime,
                                                      endTime : element.endTime,
                                                      costMillis : element.costMillis,
                                                      sqlContent : element.sqlContent,
                                                      sqlType : element.sqlType,
                                                      success:'OK;'});

                            }
                            //拿到sql结果集，如果不为NULL则执行下面
                            self.selectResult1=element.selectResult;
                            if(self.selectResult1!==null){
                                //将所有结果集中的titleList数组放入一个数组中
                                self.tableTitleList.push({
                                    titleList1 :element.selectResult.titleList
                                });
                                //循环tableTitleList
                                self.tableTitleList.forEach(element=>{
                                    self.columns = [];
                                    //将每一个titleList数组循环将其title放入columns数组中
                                    element.titleList1.forEach(element=>{
                                        self.columns.push({key: element, title: element,width:160,align: 'center',ellipsis:true});
                                    });
                                });
                                //将colums放入columnsArr数组中
                                self.columnsArr.push(self.columns);
                                //执行时清空
                                self.tableDataList = [];
                                //循环recordList
                                element.selectResult.recordList.forEach(r => {
                                    //空对象
                                    var d = {};
                                    element.selectResult.titleList.forEach((t,i) => {
                                        //每次循环给对象d一个属性，属性值是titleList[index]
                                        d[t] = r[i];
                                    });
                                    //将对象d放入tableDataList
                                    self.tableDataList.push(d);
                                });
                                //将所有的tableDataList放入数组中
                                self.newArr.push(self.tableDataList);
                                self.sqlContent1.push(element.sqlContent);
                            }
                        });
                        self.spinShow=false;
                    },
                    err(message,detailmsg){
                         self.spinShow=false;
                        self.success=false;
                        self.sqlExecuteList.push({
                            errorMsg : message,
                        });

                    }
                });

            },
            /**
             * 双击当前行显示详情
             */
            showRowDataDetail(row){
                this.oss.showModal({
                type: 'info',
                title: '详细信息',
                width: 500,
                okText: '关闭',
                render: (h) => {
                    return h('tableRowDataDetail', {
                    props: {
                        columns: this.columns,
                        dataRow: row,
                        codes: this.codeList
                    }
                    })
                }
                });
            },
            exportResult(){
                var self=this;
                this.oss.post({
                    action: "download",
                    url:'sys/excel/export',
                    data:{connName:self.connName1,
                        sqlContent:self.currentTab,
                        limit:self.limit1},

                    ok(data){
                    },

                });
            }
        },
        created() {
            this.refreshData();
        }
    }
</script>
<style lang="less">
      @import "./../../assets/css/common";
      // @import "./../../assets/css/content";
  #sqlquery{
    .w(100%);
    .h(100%);
    .topcheer-oss-table .ivu-table-wrapper .ivu-table-body {
        min-height: calc(100% - 32px);
        max-height: calc(100% - 32px);
        overflow: auto;
        }
    .tab_wraapper{
        position:relative;
        .h(calc(~"100% - 228px"));
        .ivu-tabs{
            .h(100%);
            .ivu-tabs-content {
                .h(100%);
            }
        }
    }
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
