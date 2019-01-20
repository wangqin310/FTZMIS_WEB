<template>
  <div id="TimedTask">
    <Row class="search_wrapper">
      <Form :label-width="80">
          <FormItem  label="名称查询" >
            <Input clearable class="inputs" v-model="searchModel.jobName" size="small" placeholder="请输入名称" style=" width:120px"/>
          </FormItem>
          <FormItem  label="全类名称" >
            <Input clearable class="inputs" v-model="searchModel.className" size="small" placeholder="请输全类名称" style=" width:120px"/>
          </FormItem>
          <Button type="primary" shape="circle" @click="search" style="margin-left:50px">查&nbsp;&nbsp;询</Button>
      </Form>
    </Row>
    <ul class="btns_ul">
      <li class="btns_li" v-for="(item,index) in btnList" :key="index">
        <Button :type="item.type" :icon="item.icon" :disabled="(item.name=='edit'&&(deleteId.length==0||deleteId.length>=2))||(item.name=='delete'&&deleteId.length==0)?'disabled':false"  @click="clickBtn(item.name)">{{item.text}}</Button>
      </li>
      <li class="btns_li" style="padding-left: 20px; border-left: 1px dashed #e6e6e6;">
        <Button  style="background:#2d8cf0; color:#fff; margin-left:30px;" @click="pause">暂停任务</Button>
        <Button  style="background:#2d8cf0; color:#fff; margin-left:30px;" @click="resume">恢复任务</Button>
        <Button  style="background:#2d8cf0; color:#fff; margin-left:30px;" @click="runNow">立刻运行</Button>
      </li>
    </ul>

    <div class="table_wrapper">
      <div class="topcheer-oss-table topcheer-oss-table-without-btn time-task">
        <Table ref="selection" @on-row-dblclick="showRowDataDetail" :loading="work.loading" :columns="work.column" :data="work.data"
               @on-selection-change="chooseData" highlight-row size="small" >
          <div slot="footer" class="page_footer">
            <Page class="page" v-if="work.totalSize>0" placement="top" @on-change="pageFn" @on-page-size-change="pageSizeFn" :total="work.totalSize"
              show-elevator show-sizer show-total size="small" ></Page>
          </div>
        </Table>
      </div>

    </div>
     <div class="table_wrapper">
      <div class="topcheer-oss-table topcheer-oss-table-without-btn time-task">
        <Table :loading="log.loading"
                highlight-row size="small"  :columns="log.column" :data="log.data">
          <div slot="footer" class="page_footer">
            <Page :total="log.totalSize" show-sizer show-total @on-change="logPageFn"  @on-page-size-change="logPageSizeFn"  size="small"/>
          </div>
        </Table>
      </div>
    </div>
    <task-add-edit class="addEditModal" ref="addEditModal" :codeList="codeList"
                   :formValidate="formValidate" :ruleValidate="ruleValidate" :modal="modal" @save="save" @reset="reset"></task-add-edit>
  </div>
</template>

<script>
import TaskAddEdit from "./TimedTaskAdd.vue";

let codes = {};
export default {
  data() {
    return {
      date: "",
      work:{
        loading: false,
        totalSize: 0,
        column: [
        { type: "selection", width: 80, align: "center" },
        {
          title: "序号",
          width: 50,
          align: "center",
          render: (h, params) => {
            return h("div", params.index + 1 + this.searchParams.size * (this.searchParams.current - 1));
          }
        },
        { key: "jobName", title: "名称",width:90, align: "center" },
        { key: "className", title: "全类名",width:240, align: "center" },
        { key: "cronExpression", title: "CRON表达式",width:100, align: "center" },
        { key: "createUser", title: "创建人员",width:90, align: "center" },
        { key: "createTime", title: "创建时间",width:150, align: "center" },
        { key: "modifyUser", title: "修改人员",width:90, align: "center" },
        { key: "modifyTime", title: "修改时间",width:150, align: "center" },
        {
          title: "运行状态",
          align: "center",
          width:80,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.runStatus == "0"
                  ? "未启动"
                  : params.row.runStatus == "1" ? "运行中" : "暂停"
              )
            ]);
          }
        },
        {
          key: "status",
          title: "状态",
          width:100,
          align: "center",
          render: (h, params) => {
            return h(
              "i-switch",
              {
                props: {
                  size: "large",
                  value:
                    params.row.status != null && params.row.status == 0
                      ? false
                      : true
                },
                on: {
                  "on-change": val => {
                    var self = this;
                    var arr = [];
                    arr.push(params.row.id);
                    if (!val) {
                      this.oss.post({
                        url: "/sys/quartz/disable",
                        data: {
                          id: arr.toString()
                        },
                        ok(data, page, code) {
                          self.$Message.info("禁用成功");
                          self.getTaskList(self.searchParams, self);
                        }
                      });
                    } else {
                      this.oss.post({
                        url: "/sys/quartz/enable",
                        data: {
                          id: arr.toString()
                        },
                        ok(data, page, code) {
                          self.$Message.info("启用成功");
                          self.getTaskList(self.searchParams, self);
                        }
                      });
                    }
                  }
                }
              },
              [
                h(
                  "span",
                  {
                    slot: "open"
                  },
                  "启用"
                ),
                h(
                  "span",
                  {
                    slot: "close"
                  },
                  "禁用"
                )
              ]
            );
          }
        },
        { key: "remark", title: "备注",width:130, align: "center", ellipsis: true }
      ],
        data:[]
      },
       log:{
        loading:false,
        totalSize: 0,
        codeList:{},
        column: [
          {key: 'jobId', title: '作业id', width: 150, align: 'center'},
          {key: 'result', title: '结果', width: 134, render: (h, params) => {
            return h('span',
            params.row.result === '' ? '' : this.log.codeList['result'][params.row.result]

            )
            }, align: 'center'
          },
          {key: 'errorInfo', title: '异常信息', width: 270, ellipsis:true, align: 'center'},
          {key: 'beginTime', title: '开始时间', width: 150, align: 'center'},
          {key: 'endTime', title: '结束时间', width: 150, align: 'center'},
          {key: 'costMillis', title: '耗费时间(毫秒)', width: 150, align: 'center'},
          {key: 'remark', title: '备注', width: 150, align: 'center',width:200}
        ],
        data:[]
      },

       btnList: [
         //按钮列表
         { text: "新 增", icon: "md-add", type: "primary", name: "add" },
         { text: "修 改", icon: "md-create", type: "primary", name: "edit" },
         { text: "删 除", icon: "md-close", type: "error", name: "delete" }
       ],
      taskList: [],
      totalSize: 0,
      loading: true,
      searchModel: {
        jobName: "",
        className: "",
        status: ""
      },
      logParams:{
        current:1,
        size:10,
        result:null,
        beginTime:'',
        endTime:'',
        costMillis:''
      },
      searchParams: {
        current: 1,
        size: 10,
        jobName: "",
        className: "",
        runStatus: ""
      },
      deleteId: [],
      codeList: [],
      formValidate: {
        jobName: "",
        className: "",
        cronExpression:"",
        status:null,
        remark: ""
      },
      modal: {
        text: "", //弹框标题：新增还是编辑
        type: "", //add:新增，edit：编辑
        icon: ""
      },
      ruleValidate: {
        //验证表单数据不能为空
        jobName: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        className: [{ required: true, message: "全类名不能为空", trigger: "blur" }],
        cronExpression: [{ required: true, message: "CRON表达式不能为空", trigger: "blur" }]
      },
      chooseList: [],
      aaa: false
    };
  },
  components: {
    TaskAddEdit,
  },

  methods: {
    pause() {
      var self = this;
      this.oss.post({
        url: "/sys/quartz/pause",
        data: { id: self.deleteId.toString() },
        ok(data, page, code) {
          self.$Message.info("执行成功");
        },
        // err(err) {
        //   if (err.errcode == 0) {
        //   }
        // }
      });
    },
    showRowDataDetail(row){
        this.oss.showModal({
          type: 'info',
          title: '任务调度配置',
          width: 500,
          okText: '关闭',
          render: (h) => {
            return h('tableRowDataDetail', {
              props: {
                columns: this.work.column,
                dataRow: row,
                codes: {}
              }
            })
          }
        });
      },
    resume() {
      var self = this;
      this.oss.post({
        url: "/sys/quartz/resume",
        data: { id: self.deleteId.toString() },
        ok(data, page, code) {
          self.$Message.info("执行成功");
        },
        // err(err) {
        //   if (err.errcode == 0) {
        //   }
        // }
      });
    },
    runNow() {
      var self = this;
      this.oss.post({
        url: "/sys/quartz/runNow",
        data: { id: self.deleteId.toString() },
        ok(data, page, code) {
          self.$Message.info("执行成功");
          self.getTaskList(self.searchParams, self);
          self.refreshData(self.logParams);
        },
        err(err) {
          self.$Message.info("执行失败");
        }
      });
    },
    getTaskList(searchParams, self) {//获取数据
    self.work.loading = true;
      this.oss.get({
        url: "/sys/quartz/list",
        data: searchParams,
        ok(data, page, code) {
          codes = code;
          self.codeList = code;
          self.work.loading = false;
          self.work.totalSize = page.total;
          self.work.data = data;
        }
      });
    },
    refreshData(logParams) {
        var self = this;
        self.log.loading = true;
        this.oss.get({
          url: '/sys/logQuartz/list',
          data: logParams,
          ok(data, page, code) {
            self.log.codeList = code;
            self.log.data = data;
            self.log.totalSize = page.total;
            self.log.loading = false;
          },
          err(error) {
            self.log.loading = true;
          }
        });
      },

    clickBtn(name) {
      switch (name) {
        case "add":
          this.modal.text = "新增作业";
          this.modal.type = "add";
          this.modal.icon = "md-person-add";
          this.$refs.addEditModal._data.showModal = true;
          this.$refs.addEditModal.$refs.formModal.resetFields();
          break;
          case "edit":
          this.modal.text = "编辑作业";
          this.modal.type = "edit";
          this.modal.icon = "ios-create";
          var self = this;
          if (this.chooseList.length == 1) {
            this.$refs.addEditModal._data.showModal = true;
            this.formValidate = {
              id: this.chooseList[0].id,
              jobName: this.chooseList[0].jobName,
              className: this.chooseList[0].className,
              cronExpression: this.chooseList[0].cronExpression,
              status: this.chooseList[0].status,
              remark: this.chooseList[0].remark
            };
          }
          break;
        /**
         * 点击删除按钮时的操作：
         * @param name：值为edit
         */
        case "delete":
          this.delete();
          break;
      }
    },
    /**
     * 删除数据
     */
    delete() {
      var self = this;
      this.oss.post({
        url: "/sys/quartz/delete",
        data: { id: self.deleteId.toString() },
        ok(data) {
          for (var i = 0; i <= self.deleteId.length; i++) {
            self.taskList.map((item, index) => {
              if (self.deleteId[i] == item.id) {
                self.taskList.splice(index, 1);
              }
            });
          }
          if (self.taskList.length == 0) {
            self.searchParams.current -= 1;
          }
          self.getTaskList(self.searchParams, self);
          self.totalSize = self.totalSize - self.deleteId.length;
          self.chooseList = [];
          self.deleteId = [];
        }
      });
    },

    /**
     * 选中的数据
     */
    chooseData(val) {
      this.chooseList = val;
      this.deleteId = [];
      var self = this;
      this.chooseList.map(item => {
        self.deleteId.push(item.id);
      });
    },

    /**
     * 点击切换当前页码：
     * @param val：当前页码
     */
    pageFn(val) {
      this.searchParams.current = val;
      this.loading = true;
      this.getTaskList(this.searchParams, this);
    },
    /**
     * 日志分页：点击切换当前页码：
     * @param val：当前页码
     */
    logPageFn(val) {
      this.log.loading = true;
      this.logParams.current=val;
      this.refreshData(this.logParams);
    },
    /**
     * 点击显示每页条数：
     * @param val：每页条数
     */
    pageSizeFn(val) {
      this.searchParams.size = val;
      this.work.loading = true;
      this.getTaskList(this.searchParams, this);
    },
/**
     * 点击显示每页条数：
     * @param val：每页条数
     */
    logPageSizeFn(val) {
      this.logParams.size = val;
      this.log.loading = true;
      this.refreshData(this.logParams);
    },
    /**
     * 点击显示每页条数：
     * @param val：每页条数
     */
    save(val) {
      var self = this;
      /**
       * 新增用户：
       */
      if (val.type == "add") {
        this.$refs.addEditModal.$refs.formModal.validate(valid => {
          if (valid) {
            this.oss.post({
              url: "/sys/quartz/add",
              data: val.formData,
              ok(data) {
                self.getTaskList(self.searchParams, self);
                self.$refs.addEditModal.showModal = false;
                self.chooseList = [];
                self.deleteId = [];
                self.oss.showMessage({
                  type: "success",
                  content: "用户添加成功"
                });
              }
            });
          }
        });
      } else if (val.type == "edit") {
        /**
         * 编辑角色：
         */
        this.$refs.addEditModal.$refs.formModal.validate(valid => {
          if (valid) {
            this.oss.post({
              url: "/sys/quartz/edit",
              data: val.formData,
              ok(data) {
                self.oss.showMessage({
                  type: "success",
                  content: "用户修改成功"
                });
                self.getTaskList(self.searchParams, self);
                self.$refs.addEditModal.showModal = false;
                self.chooseList = [];
                self.deleteId = [];
              }
            });
          }
        });
      }
    },
    /**
     * 重置
     * @param val
     */
    reset(val) {
      this.$refs.addEditModal.$refs.formModal.resetFields();
    },
    /**
     * 查询：
     */
    search() {
      this.searchParams.current=1;
      currentPage=1;
      Object.assign(this.searchParams, this.searchModel);
      this.getTaskList(this.searchParams, this);
    }
  },

  mounted() {
    this.getTaskList(this.searchParams, this);
    this.refreshData(this.logParams);
  }
};
</script>

<style lang="less">
@import "./../../assets/css/common";
// @import "./../../assets/css/content";
#TimedTask {
  .w(100%);
  .h(60%);
  .ivu-form {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .ivu-form-item {
    margin-bottom: 0px;
  }
  .ivu-modal {
    width: 900px !important;
    .ivu-modal-confirm-body div {
      word-break: break-all;
    }
  }
}
</style>
