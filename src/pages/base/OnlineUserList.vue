
<template>
  <div id="onlineuser">
      <Row class="search_wrapper">
        <Form :label-width="60">
          <FormItem  label="姓名" >
            <Input clearable class="inputs" v-model="searchModel.name"  size="small" placeholder="请输入登录姓名"/>
          </FormItem>
          <FormItem  label="账号" >
            <Input clearable class="inputs"  size="small" v-model="searchModel.account" placeholder="请输入登录账号"/>
          </FormItem>
        <Button type="primary" shape="circle" @click="search" style="margin-left:50px">查&nbsp;&nbsp;询</Button>
        </Form>
      </Row>
      <div>
        <Row style="height:10px;"></Row>
      </div>
      <div class="table_wrapper">
      <div class="topcheer-oss-table topcheer-oss-table-without-btn online-userlist">
      <Table class="table"
             size="small"
             :loading="loading"
             :columns="columns"
             :data="dataList"
             height="635"
      />
      </div>
      </div>
  </div>
</template>

<script>
import expandRow from "./OnlineUserListOpen.vue";
export default {
  name: "OnlineUserList",
  components: { expandRow },
  data() {
    return {
      loadingStatus: false,
      loading: true,
      columns: [
        {
          type: "expand",
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                //父组建传子组建
                row: params.row //获取当前信息中的一行信息
              },
              on:{
                refreshData:()=>{
                  this.refreshData();
                }
              }
            });
          }
        },
        { type: "index", title: "序号", width: 70 }, //type:'序号固定不变'
        { key: "id", title: "ID", align: "center" },
        { key: "account", title: "登录账号", align: "center" },
        { key: "name", title: "姓名", align: "center" },
        { key: "OnlineTerminalNumber", title: "终端在线数", align: "center" },
        { key: "startTimestamp", title: "登录时间", align: "center" }
      ],
      searchModel: {
        name: "", //姓名
        account: "" //账号
      },
      searchParams: {},

      dataList: []
    };
  },
  methods: {
    refreshData(searchParams, self) {
      //重新加载数据 刷新
      var self = this;
      self.loading = true;
      this.oss.get({
        url: "sys/user/onLineUser",
        data: searchParams,
        ok(data) {
          self.dataList = [];
          data.forEach(a => {
            //遍历数组
            let onLineAccount = {};
            onLineAccount.id = a.id;
            onLineAccount.account = a.account;
            onLineAccount.name = a.name;
            onLineAccount.onLineInfoList = a.onLineInfoList;
            onLineAccount.startTimestamp =
              a.onLineInfoList[a.onLineInfoList.length - 1].startTimestamp;
            onLineAccount.OnlineTerminalNumber = a.onLineInfoList.length;
            self.dataList.push(onLineAccount);
          });
        },
        finish() {
          self.loading = false;
        }
      });
    },
    search() {
      Object.assign(this.searchParams, this.searchModel);
      this.refreshData(this.searchParams, this);
    }
  },

  mounted() {
    this.refreshData(this.searchParams, this);
  }
};
</script>

<style scoped>
.btn-opeater {
  margin-bottom: 30px;
}
</style>
<style lang="less">
@import "./../../assets/css/common";
// @import "./../../assets/css/content";

#onlineuser {
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
  .ivu-table-wrapper {
    border: "";
    border-left: 1px solid #e6e6e6;
    border-top: 1px solid #e6e6e6;
  }
  .table,.ivu-table{
      border-radius:10px!important;
    }
  .ivu-table-expanded-cell {
    // .p(0);
    boder-bottom: none;
  }
  .topcheer-oss-table{
    &.online-userlist{
      border:0;
      .ivu-table-wrapper{
        .h(100%)!important;
      }
    }
  }
}
</style>
