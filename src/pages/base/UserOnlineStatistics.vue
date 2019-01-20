<template>
  <div id="OnlineStatistics">
    <div class="cus_private_search_wrapper">
    <div class="search_top clearFix">
        <div class="search_condition">
          <Form :label-width="80">
            <Row :gutter="24" style="margin-left:-50px;margin-right:0px">
              <Col span="6" class="j_col">
                <FormItem>
                  <Select v-model="statType" size="small" style="width:130px">
                    <Option value="user">按用户统计</Option>
                    <Option value="org">按机构统计</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6" v-if="statType==='org'" class="j_col">
                <FormItem  label="机构名称" >
                  <Input clearable v-model="params.orgName" size="small" style="width:130px" placeholder="请输入机构名称"/>
                </FormItem>
              </Col>
              <Col span="6" v-if="statType==='org'" class="j_col">
                <FormItem  label="机构编码" >
                  <Input clearable v-model="params.orgCode" size="small" style="width:130px" placeholder="请输入机构编码"/>
                </FormItem>
              </Col>
              <Col span="6" v-if="statType==='user'" class="j_col">
                <FormItem  label="用户姓名"   >
                  <Input clearable v-model="params.userName" size="small" style="width:130px" placeholder="请输入用户名"/>
                </FormItem>
              </Col>
              <Col span="6" v-if="statType==='user'" class="j_col">
                <FormItem  label="用户账号"  >
                  <Input clearable v-model="params.userAccount" size="small" style="width:130px" placeholder="请输入用户账号"/>
                </FormItem>
              </Col>
              <Col span="6">&nbsp;</Col>
              <Col span="6" class="j_col">
                <FormItem>
                  <Select class="selects" v-model="params.deviceType" size="small" @on-change="changeSelect" placeholder="请选择终端类型" style="width:130px">
                    <Option  value="">所有类型</Option>
                    <Option v-for="(item,index) in codes.deviceType" :value="index" :key="index">{{ item }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6" class="j_col">
                <FormItem  label="开始月份">
                  <DatePicker v-model="params.startMonth" format="yyyyMM" type="month" @on-change="params.startMonth=$event" placeholder="请输入开始月份" size="small" style="width: 130px" />
                </FormItem>
              </Col>
              <Col span="6" class="issue_date j_col" >
                <FormItem  label="结束月份">
                  <DatePicker v-model="params.endMonth" format="yyyyMM" type="month" @on-change="params.endMonth=$event" placeholder="请输入结束月份" size="small" style="width: 130px" />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div class="right_Wrapper">
          <div class="btn_wrapper">
            <Button type="primary" shape="circle" @click="getData">查&nbsp;&nbsp;询</Button>
          </div>
        </div>
      </div>
      </div>
    <div>
      <Row style="height:10px;"></Row>
    </div>
    <div >
      <div >
        <Table border highlight-row :loading="loading" :columns="columns" :data="dataList" size="small" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UserOnlineStatistics',
  data() {
      return {
        loading: false,
        dataList: [],
        codes:[],
        statType: 'user',
        statConfig: {
          user: {
            url: '/sys/rpt/findUserOnline',
            code: 'userAccount',
            name: 'userName',
            col: {title: '用户姓名（账号）', key: 'userName', align: 'center', width: 145}
          },
          org: {
            url: '/sys/rpt/findOrgOnline',
            code: 'orgCode',
            name: 'orgName',
            col: {title: '机构名称（编码）', key: 'orgName', align: 'center', width: 145}
          }
        },
        params: {
            orgName: '',
            orgCode: '',
            userAccount: '',
            userName: '',
            startMonth: '',
            endMonth: '',
            deviceType:''
        }
      }
    },
    methods: {
      getData(){
        let self = this;
        self.loading = true;
        //生成表格列标题
        let columnsTemp = [];
        columnsTemp.push(self.statConfig[self.statType].col);
        //生成月份列表
        let monthList = [];
          let startDate;
          let endDate;
        if((self.params.startMonth!=='')&&(self.params.endMonth!=='')){
          startDate = self.moment(self.params.startMonth, 'YYYYMM');
          endDate = self.moment(self.params.endMonth, 'YYYYMM').add(1, 'M');
        }else if((self.params.startMonth==='')&&(self.params.endMonth==='')){
          startDate = self.moment(this.moment().subtract(11, 'M').format('YYYYMM'), 'YYYYMM');
          endDate = self.moment(this.moment().format('YYYYMM'), 'YYYYMM').add(1, 'M');
        }else{
          alert('请输入开始或结束时间');
        }
        while(startDate.isBefore(endDate)) {
          monthList.push({title: startDate.format('YYYYMM'), key: startDate.format('YYYYMM'), align: "center"});
          startDate.add(1, 'M');
        }
        columnsTemp.push({title: '时长（Min）', key: 'onlineMinutes', align: 'center', children: monthList.reverse()});
        self.columns = columnsTemp;
        //获取数据
        this.oss.get({
            url: self.statConfig[self.statType].url,
            data: self.params,
            ok(data,page,code) {
              self.codes=code;
              let dataListTemp = [];
              data.forEach(rec => {
                let d = {};
                let name = rec[self.statConfig[self.statType].name] + '(' + rec[self.statConfig[self.statType].code] + ')';
                let flag = false;
                dataListTemp.forEach(r => {
                  if(r[self.statConfig[self.statType].name] === name) {
                    r[rec.statMonth] = rec.onlineMinutes;
                    flag = true;
                  }
                });
                if(!flag) {
                  d[self.statConfig[self.statType].name] = name;
                  d[rec.statMonth] = rec.onlineMinutes;
                  dataListTemp.push(d);
                }
              });
              self.dataList = dataListTemp;
            },
            finish(error) {
              self.loading = false;
            }
        });
    },
    changeSelect(val){
      this.params.deviceType=val;
    },
  },
  created() {
    this.getData();
  }
}
</script>
<style lang="less">
  @import "./../../assets/css/common";
  // @import "./../../assets/css/content";
  #OnlineStatistics{
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
    .cus_private_search_wrapper{
      .h(100px);
      .w(100%);
      .b(#fff);
      .p(15px 20px 10px 20px);
      border-radius:10px;
      border:1px solid #e6e6e6;
      min-height:90px;
      box-sizing:border-box;
      -webkit-box-shadow: 4px 4px 3px #e6e6e6;
      -moz-box-shadow: 4px 4px 3px #e6e6e6;
      box-shadow: 4px 4px 3px #e6e6e6;
      .search_top{
        .w(100%);
        .h(90px);
        margin-bottom:8px;
        .search_condition{
          width:830px;
          .h(90px);
          float:left;
          .ivu-form{
            .w(100%);
            .h(100%);
            .ivu-row{
              .h(45px);
              .ivu-col{
                .h(100%);
                .ivu-form-item{
                  margin-bottom:0;
                  margin-top:-30px;
                  .ivu-date-picker{
                    .w(50%);
                  }
                }
              }
            }
          }
        }
        .right_Wrapper{
          position:relative;
          .w(15%);
          .h(90px);
          float:left;
          margin-left: -230px;
          .btn_wrapper{
            position:absolute;
            .w(70px);
            top:38%;
            left:50%;
            text-align: center;
            -webkit-transform: translate(-50%,-50%);
            -moz-transform: translate(-50%,-50%);
            -ms-transform: translate(-50%,-50%);
            -o-transform: translate(-50%,-50%);
            transform: translate(-50%,-50%);
          }
        }
        .clearFix:after{
          display:block;
          visibility: hidden;
          clear:both;
          height:0;
          content:'';
          zoom:1;
        }
      }
    }
    .j_col{
      padding-left: 0px;
      padding-right: 0px;
      width: 220px;
    }
    .j_row{

    }
  }
</style>

