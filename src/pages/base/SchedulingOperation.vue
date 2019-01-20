<template>
  <div id="SchedulingOperation">
    <Row class="search_wrapper">
      <Form :label-width="80">
          <FormItem  label="名称查询" >
            <Input clearable class="inputs" v-model="searchModel.rptName" size="small" placeholder="请输入名称" style=" width:120px"/>
          </FormItem>
          <FormItem label="数据库类型" :label-width="90">
                  <Select  v-model="searchModel.dbType" style="width:130px" size="small">
                    <Option v-for="item in codeList.dbType" :value="item" :label="item" :key="item"/>
                  </Select>
                </FormItem>
          <Button type="primary" shape="circle" @click="search" style="margin-left:50px">查&nbsp;&nbsp;询</Button>
      </Form>
    </Row>
    <!-- 按钮组件 -->
     <page-button-list @btnClick="clickBtn" :datakey="$route.query.datakey">
      <li class="btns_li" style="padding-left: 20px; border-left: 1px dashed #e6e6e6;">
        <DatePicker type="daterange"  placeholder="运行日期" style="width: 200px" v-model='date'></DatePicker>
        <Button  type="primary" @click="runAll" :disabled="date[0]==''||date[1]==''?true:false">全部运行</Button>
        <Button  type="primary"  @click="runNow" :disabled="date[0]==''||date[1]==''||deleteId.length<=0?true:false">指定运行</Button>
      </li>
    </page-button-list>
    <!-- <ul class="btns_ul">
      <li class="btns_li" v-for="(item,index) in $root.btnList" :key="index">
        <Button :type="item.type" :icon="item.icon" :disabled="(item.name=='edit'&&(deleteId.length==0||deleteId.length>=2))||(item.name=='delete'&&deleteId.length==0)?'disabled':false"  @click="clickBtn(item.name)">{{item.text}}</Button>
      </li>

      <li class="btns_li" style="padding-left: 20px; border-left: 1px dashed #e6e6e6;">
        <DatePicker type="daterange"  placeholder="运行日期" style="width: 200px" v-model='date'></DatePicker>
        <Button  type="primary" @click="runAll" :disabled="date[0]==''||date[1]==''?true:false">全部运行</Button>
        <Button  type="primary"  @click="runNow" :disabled="date[0]==''||date[1]==''||deleteId.length<=0?true:false">指定运行</Button>
      </li>

    </ul> -->
    <div class="table_wrapper">
      <div class="topcheer-oss-table topcheer-oss-table-without-btn time-task" ref="topcheerOssTable">
        <Table ref="selection"  @on-row-dblclick="showRowDataDetail" :loading="work.loading" :height="tableHeight" :columns="work.column" :data="work.data"
               @on-selection-change="chooseData" highlight-row size="small" >
         <div slot="footer" class="page_footer">
           <Page class="page" placement="top" v-if="work.totalSize>0" @on-change="pageFn" @on-page-size-change="pageSizeFn" :total="work.totalSize" :page-size-opts="oss.pageSizeOpts" show-elevator show-sizer show-total size="small" ></Page>
         </div>
        </Table>
      </div>
    </div>
    <task-add-edit class="addEditModal" ref="addEditModal" :codeList="codeList"
                   :formValidate="formValidate" :ruleValidate="ruleValidate" :modal="modal" @save="save" @reset="reset"></task-add-edit>
  </div>
</template>

<script>
import TaskAddEdit from "./SchedulingOperationAdd.vue"
import pageButtonList from '@/components/PageButtonList.vue'

let codes = {};
let currentPage = 1; //当前页数
let pageSize = 10;
export default {
  name: 'SchedulingOperation', 
  data() {
    return {
      date: "",
      tableHeight: '', //默认表格的高度
      work:{
        loading: false,
        totalSize: 0,
        size: 0,  //每页大小
        column: [
        { type: "selection", width: 80, align: "center" },
        {
          title: "序号",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("div", params.index + 1 + this.searchParams.size * (this.searchParams.current - 1));
          }
        },
        { key: "rptName", title: "名称",width: 150, align: "center" },
        { key: "dbType", title: "数据库类型",width: 120, align: "center" },
        {
          key: "rptSql",
          title: "作业SQL语句",
          width: 120,
          align: "center",
          render: (f, obj) => {
            return f(
              "button",
              {
                style: {
                  width: "40px",
                  height: "26px",
                  lineHeight: "26px",
                  textAlign: "center",
                  color: "#fff",
                  border:"",
                  borderRadius: "10px",
                  background: "#2d8cf0"
                },
                on: {
                  click: $event => {
                    $event.stopPropagation();
                    this.oss.showModal({type: 'info',width:'950',title:'SQL脚本', content : `<pre>${obj.row.rptSql}</pre>`});
                  }
                }
              },
              "查看"
            );
          }
        },
        { key: "createUser", title: "创建人员",width: 150, align: "center" },
        { key: "createTime", title: "创建时间",width: 150, align: "center" },
        { key: "modifyUser", title: "修改人员",width: 150, align: "center" },
        { key: "modifyTime", title: "修改时间",width: 150, align: "center" },
        {
          key: "status",
          title: "状态",
          width: 120,
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
                        url: "/sys/rpt/disable",
                        data: {
                          id: arr.toString()
                        },
                        ok(data, page, code) {
                          self.oss.showMessage({type: 'success', content: '已禁用'});
                          self.getTaskList(self.searchParams, self);
                        }
                      });
                    } else {
                      this.oss.post({
                        url: "/sys/rpt/enable",
                        data: {
                          id: arr.toString()
                        },
                        ok(data, page, code) {
                          self.oss.showMessage({type: 'success', content: '已启用'});
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
        { key: "remark", title: "备注",width: 180, align: "center" }
      ],
        data:[]
      },
       log:{
        current:1,
        size:10,
        loading:false,
        totalSize: 0,
        codeList:{},
        data:[]
      },
      // btnList: [
      //   //按钮列表
      //   { text: "新 增", icon: "md-add", type: "primary", name: "add" },
      //   { text: "修 改", icon: "md-create", type: "primary", name: "edit" },
      //   { text: "删 除", icon: "md-close", type: "error", name: "delete" }
      // ],
      searchModel: {
        rptName: "",//名称
        dbType: "", //数据库名称
        status: "" //状态
      },
      searchParams: {
        //查询条件
        current: 1,
        size: 10,
        rptName: "",
        dbType: "",
        status: ""
      },
      deleteId: [], //选中的id集合
      codeList: [],
      formValidate: {
        rptName: "",
        dbType: "",
        remark: ""
      },
      modal: {
        text: "", //弹框标题：新增还是编辑
        type: "", //add:新增，edit：编辑
        icon: ""
      },
      ruleValidate: {//验证表单数据不能为空
        rptName: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        dbType: [
          { required: true, message: "数据库类型不能为空", trigger: "blur" }
        ],
        rptSql: [
          { required: true, message: "sql语句不能为空", trigger: "blur" }
        ]
      },
      chooseList: [],
      aaa: false
    };
  },

  components: {
    TaskAddEdit,
    pageButtonList
  },

  methods: {
    runAll() {
      var s = new Date(this.date[0]);//时间转换方法
      var e = new Date(this.date[1]);//时间转换方法
      var newS =
        s.getFullYear() +
        "" +
        (s.getMonth() + 1 < 10 ? "0" + (s.getMonth() + 1) : s.getMonth() + 1);//时间转换方法
      var newE =
        e.getFullYear() +
        "" +
        (e.getMonth() + 1 < 10 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1);//时间转换方法
      var self = this;
      this.oss.post({
        url: "/sys/rpt/runAllNow",
        data: {
          startMonth: newS,
          endMonth: newE
        },
        ok(data, page, code) {

          self.$Message.info("执行成功");
          self.getTaskList(self.searchParams, self);
        },
        err(err) {
          if (err.errcode == 0) {
            self.getTaskList(self.searchParams, self);
          }
        }
      });
    },
    runNow() {
      var s = new Date(this.date[0]);//时间转换方法
      var e = new Date(this.date[1]);//时间转换方法
      var newS =
        s.getFullYear() +
        "" +
        (s.getMonth() + 1 < 10 ? "0" + (s.getMonth() + 1) : s.getMonth() + 1);//时间转换方法
      var newE =
        e.getFullYear() +
        "" +
        (e.getMonth() + 1 < 10 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1);//时间转换方法
      var self = this;
      var statusFlag = false;
      this.chooseList.map(item => {
        if(item.status != '1') {
          statusFlag = true;
        }
      });
      if(statusFlag) {
        this.oss.showMessage({type: 'warning', content: '当前选择执行的列表中有禁用任务，请去掉后再执行！'});
        return;
      }
      this.oss.post({
        url: "/sys/rpt/runNow",
        data: {
          startMonth: newS,
          endMonth: newE,
          id : self.deleteId
        },
        ok(data, page, code) {

          self.$Message.info("执行成功");
          self.getTaskList(self.searchParams, self);
          self.chooseList = [];
          self.deleteId = [];
        },
        err(err) {
          self.$Message.info("执行失败");
          if (err.errcode == 0) {
            self.getTaskList(self.searchParams, self);
          }
        }
      });
    },
    showRowDataDetail(row){
        this.oss.showModal({
          type: 'info',
          title: '作业任务配置',
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
    getTaskList(searchParams, self) {//获取数据
    self.work.loading = true;
      this.oss.get({
        url: "/sys/rpt/list",
        data: searchParams,
        ok(data, page, code) {
          codes = code;
          self.codeList = code;
          self.work.loading = false;
          self.work.totalSize = page.total;
          self.work.size = page.size;
          self.work.data = data;
          self.oss.setTableHeight({
            el: self,
            size: self.work.size
          });
        }
      });
    },
    clickBtn(item) {
      switch (item.code) {
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
              rptName: this.chooseList[0].rptName,
              dbType: this.chooseList[0].dbType,
              rptSql: this.chooseList[0].rptSql,
              status: this.chooseList[0].status,
              remark: this.chooseList[0].remark
            };
          } else if (this.chooseList.length > 1 ) {
            this.oss.showMessage({type: 'warning', content: '只能选择一条数据'});
          } else {
            this.oss.showMessage({type: 'warning', content: '请选择一条数据'})
          }
          break;
        /**
         * 点击删除按钮时的操作：
         * @param code：值为edit
         */
        case "delete":
          if (this.deleteId.length > 0) {
            this.delConfirm();
          } else {
            this.oss.showMessage({type: 'warning', content: '请选择要删除的数据'});
          }
          break;
      }
    },
    /**
     * 删除数据
     */
    delete() {
      var self = this;
      this.oss.post({
        url: "/sys/rpt/delete",
        data: { id: self.deleteId.toString() },
        ok(data) {
          for (var i = 0; i <= self.deleteId.length; i++) {
            self.work.data.map((item, index) => {
              if (self.deleteId[i] == item.id) {
                self.work.data.splice(index, 1);
              }
            });
          }
          if (self.work.data.length == 0) {
            self.searchParams.current -= 1;
            currentPage = self.searchParams.current;
          }
          self.getTaskList(self.searchParams, self);
          self.work.totalSize = self.work.totalSize - self.deleteId.length;
          self.chooseList = [];
          self.deleteId = [];
        }
      });
    },
     delConfirm () {
       var self=this;
                this.oss.showModal({
                    type: 'confirm',
                    title: '确认删除',
                    content: '<p>确认删除所选的'+self.deleteId.length+'条数据吗？</p>',
                    onOk: () => {
                        this.delete();
                    },
                    onCancel: () => {
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
     * 作业分页：点击切换当前页码：
     * @param val：当前页码
     */
    pageFn(val) {
      this.searchParams.current = val;
      currentPage = val;
      this.work.loading = true;
      this.getTaskList(this.searchParams, this);
    },
    /**
     * 日志分页：点击切换当前页码：
     * @param val：当前页码
     */
    logPageFn(val) {
      this.log.current = val;
      this.log.loading = true;
    },
    /**
     * 点击显示每页条数：
     * @param val：每页条数
     */
    pageSizeFn(val) {
      this.searchParams.size = val;
      pageSize = val;
      this.work.loading = true;
      this.getTaskList(this.searchParams, this);
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
              url: "/sys/rpt/add",
              data: val.formData,
              ok(data) {
                self.getTaskList(self.searchParams, self);
                self.$refs.addEditModal.showModal = false;
                self.chooseList = [];
                self.deleteId = [];
                self.oss.showMessage({type: 'success', content: '添加成功'});
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
              url: "/sys/rpt/edit",
              data: val.formData,
              ok(data) {
                self.oss.showMessage({type: 'success', content: '修改成功'});
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

    },
    /**
     * 切换状态
     */
    selectStatus(val) {
      this.searchParams.status = val;
    }
  },
  mounted() {
    this.getTaskList(this.searchParams, this);
  }
};
</script>

<style lang="less">
@import "./../../assets/css/common";
// @import "./../../assets/css/content";
#SchedulingOperation {
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




