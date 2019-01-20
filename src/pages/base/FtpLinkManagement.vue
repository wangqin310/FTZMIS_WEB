<template>
  <div id="FTPLink">
    <Form :label-width="80">
      <Row :gutter="24" class="search_wrapper">
        <FormItem label="连接名称" >
          <Input clearable placeholder="请输入连接名称查询" v-model="searchModel.connName" size="small" style="width:140px"></Input>
        </FormItem>
        <FormItem label="连接类型" >
          <Select placeholder="请选择连接类型" v-model="searchModel.connType" style="width:140px" size="small">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <Button type="primary" shape="circle" @click="search" style="margin-left:50px">查&nbsp;&nbsp;询</Button>
      </Row>
    </Form>
     <!-- 按钮组件 -->
    <page-button-list @btnClick="clickBtn" :datakey="$route.query.datakey"></page-button-list>

    <!-- <ul class="btns_ul">
      <li class="btns_li" v-for="(item,index) in $root.btnList" :key="index">
        <Button :type="item.type" :icon="item.icon" :disabled="(item.name=='edit'&&(deleteConnName.length==0||deleteConnName.length>=2))||(item.name=='delete'&&deleteConnName.length==0)?'disabled':false"  @click="clickBtn(item.name)">{{item.text}}</Button>
      </li>
      <li class="btns_li" style="margin-left: 11px; border-left: 1px dashed #e6e6e6;">
        <Button  style="background:#2d8cf0; color:#fff; margin-left:30px;" @click="testConnByName">检测</Button>
      </li>
    </ul> -->
    <div class="table_wrapper">
      <div class="topcheer-oss-table topcheer-oss-table-without-btn time-task" ref="topcheerOssTable">
        <Table ref="selection" @on-row-dblclick="showRowDataDetail" :height="tableHeight" :loading="loading" :columns="columns" :data="taskList"
               @on-selection-change="chooseData" highlight-row size="small">
        <div slot="footer" class="page_footer">
          <Page class="page" v-if="totalSize>0" @on-change="pageFn" placement="top" @on-page-size-change="pageSizeFn" :total="totalSize" :page-size-opts="oss.pageSizeOpts"
              show-elevator show-sizer show-total size="small"></Page>
        </div>
        </Table>
      </div>
    </div>
    <task-add-edit class="addEditModal" ref="addEditModal" :codeList="codeList"
                   :formValidate="formValidate" :ruleValidate="ruleValidate" :modal="modal" @save="save" @reset="reset"></task-add-edit>
  </div>
</template>

<script>
  import TaskAddEdit from "./FtpLinkManagementAdd.vue"
  import pageButtonList from '@/components/PageButtonList.vue'

  let codes = {};
  let currentPage = 1; //当前页数
  let pageSize = 10;
  export default {
    name: 'FtpLinkManagement',
    data() {
      return {
        date: "",
        loading: true,
        cityList: [
                    {
                        value: 'ftp',
                        label: 'ftp'
                    },
                    {
                        value: 'sftp',
                        label: 'sftp'
                    },
                    {
                        value: ' ',
                        label: '所有类型 '
                    }

                ],
                model1: '',
        columns: [
          { type: "selection", width: 80, align: "center" },
          {
            title: "序号",
            width: 60,
            align: "center",
            render: (h, params) => {
              return h("div", params.index + 1 + pageSize * (currentPage - 1));
            }
          },
        { key: "connName", title: "连接名称", align: "center",width:90 },
        { key: "connType", title: "连接类型", align: "center" ,width:60},
        { key: "host", title: "主机", align: "center", width:160},
        { key: "port", title: "端口", align: "center" ,width:60},
        { key: "timeout", title: "超时时长(秒)", align: "center",width:80 },
        { key: "username", title: "用户名", align: "center", width:90 },
        { key: "createUser", title: "创建人员", align: "center",width:100, },
        { key: "createTime", title: "创建时间", align: "center", width:160 },
        { key: "modifyUser", title: "修改人员", align: "center",width:90 },
        { key: "modifyTime", title: "修改时间", align: "center", width:160 },
          {
            key: "status",
            title: "状态",
            align: "center",
            width:100,
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
                      arr.push(params.row.connName);
                      if (!val) {
                        this.oss.post({
                          url: "/sys/ftpConfig/disable",
                          data: {
                            connName: arr.toString()
                          },
                          ok(data, page, code) {
                            self.$Message.info("禁用成功");
                            self.getTaskList(self.searchParams, self);
                          }
                        });
                      } else {
                        this.oss.post({
                          url: "/sys/ftpConfig/enable",
                          data: {
                            connName: arr.toString()
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
          { key: "remark", title: "备注", align: "center", width:150 }
        ],
        // btnList: [
        //   //按钮列表
        //   { text: "新 增", icon: "md-add", type: "primary", name: "add" },
        //   { text: "修 改", icon: "md-create", type: "primary", name: "edit" },
        //   { text: "删 除", icon: "md-close", type: "error", name: "delete" }
        // ],
        taskList: [],
        tableHeight: '',  //默认表格高度
        totalSize: 0,
        size: 0,  //每页大小
        loading: true,
        searchModel: {
          connName: "",
          connType: "",
          status: ""
        },
        searchParams: {
          current: 1,
          size: 10,
          connName: "",
          connType: "",
          status: "",
          runStatus: ""
        },
        deleteConnName: [],
        codeList: [],
        formValidate: {
          connName: "",
          connType: "",
          cronExpression:'',
          remark: "",
          staus:0
        },
        modal: {
          text: "", //弹框标题：新增还是编辑
          type: "", //add:新增，edit：编辑
          icon: ""
        },
        ruleValidate: {
          //验证表单数据不能为空
          connName: [{ required: true, message: "连接名称不能为空", trigger: "blur" }],
          connType: [
            { required: true, message: "连接类型不能为空", trigger: "blur" }
          ],
          host: [
            { required: true, message: "主机不能为空", trigger: "blur" }
          ],
          timeout: [
              { required: true,pattern:/^[0-9]{1,3}$/g, message: '超时时长格式不正确', trigger: 'blur' }
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
      testConnByName() {
        var self = this;
        this.oss.post({
          url: "/sys/ftpConfig/testConnByName",
          data: {
            connName: self.deleteConnName.toString(),
            },
          ok(data, page, code) {

            self.oss.showMessage({type:'success',content:"连接成功"});
          },
          // err(err) {
          //   self.oss.showModal({type:'error',content:err});
          // }
        });
      },
      showRowDataDetail(row){
        this.oss.showModal({
          type: 'info',
          title: 'FTP链接管理',
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
      getTaskList(searchParams, self) {//获取数据
        this.oss.get({
          url: "/sys/ftpConfig/list",
          data: searchParams,
          ok(data, page, code) {
            codes = code;
            self.codeList = code;
            self.loading = false;
            self.totalSize = page.total;
            self.size = page.size;
            self.taskList = data;
            self.oss.setTableHeight({
              el: self,
              size: self.size
            });
          }
        });
      },

      clickBtn(item) {//编辑
       this.$refs.addEditModal._data.hintText='';


        switch (item.code) {
          case "add":
            for(var i in this.formValidate){
              if(i=='status'){
                this.formValidate[i]=0;
              }else{
                this.formValidate[i]=null;
              }

            }
            this.modal.text = "新增连接";
            this.modal.type = "add";
            this.modal.icon = "md-person-add";
            this.$refs.addEditModal._data.showModal = true;
            this.$refs.addEditModal.$refs.formModal.resetFields();
            break;
          case "edit":
            this.modal.text = "编辑连接";
            this.modal.type = "edit";
            this.modal.icon = "ios-create";
            var self = this;
            if (this.chooseList.length == 1) {
              this.$refs.addEditModal._data.showModal = true;
              this.formValidate = {
                connName: this.chooseList[0].connName,
                connType: this.chooseList[0].connType,
                host: this.chooseList[0].host,
                port	: this.chooseList[0].port	,
                timeout	: this.chooseList[0].timeout	,
                username	: this.chooseList[0].username	,
                password	: this.chooseList[0].password	,

                remark: this.chooseList[0].remark,
              };
              this.$refs.addEditModal._data.status=this.chooseList[0].status==1?true:false;
            } else if (this.chooseList.length > 1 ) {
                this.oss.showMessage({type: 'warning', content: '只能选择一条数据'});
            } else {
                this.oss.showMessage({type: 'warning', content: '请选择一条数据'})
            }
            break;
          /**
           * 点击删除按钮时的操作：
           * @param code：值为delete
           */
          case "delete":
            if (this.chooseList.length > 0) {
              this.delConfirm();
            } else {
              this.oss.showMessage({type: 'warning', content: '请选择要删除的数据'});
            }
            break;
          case "test":
            if (this.chooseList.length == 1) {
              this.testConnByName();
            } else if (this.chooseList.length > 1 ) {
                this.oss.showMessage({type: 'warning', content: '只能选择一条数据'});
            } else {
              this.oss.showMessage({type: 'warning', content: '请选择一条数据'})
            }
        }
      },
      /**
       * 删除数据
       */
      delete() {
        var self = this;
        this.oss.post({
          url: "/sys/ftpConfig/delete",
          data: { connName: self.deleteConnName.toString() },
          ok(data) {
            for (var i = 0; i <= self.deleteConnName.length; i++) {
              self.taskList.map((item, index) => {
                if (self.deleteConnName[i] == item.connName) {
                  self.taskList.splice(index, 1);
                }
              });
            }
            if (self.taskList.length == 0) {
              self.searchParams.current -= 1;
              currentPage = self.searchParams.current;
            }
            self.getTaskList(self.searchParams, self);
            self.totalSize = self.totalSize - self.deleteConnName.length;
            self.chooseList = [];
            self.deleteConnName = [];
          }
        });
      },
     delConfirm () {
       var self=this;
                this.oss.showModal({
                    type: 'confirm',
                    title: '确认删除',
                    content: '<p>确认删除所选的'+self.deleteConnName.length+'条数据吗？</p>',
                    onOk: () => {
                        this.delete();
                        this.oss.showMessage({type: 'success', content: '删除成功'});
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
        this.deleteConnName = [];
        var self = this;
        this.chooseList.map(item => {
          self.deleteConnName.push(item.connName);
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
                url: "/sys/ftpConfig/add",
                data: val.formData,
                ok(data) {
                  self.getTaskList(self.searchParams, self);
                  self.$refs.addEditModal.showModal = false;
                  self.chooseList = [];
                  self.deleteConnName = [];
                  self.oss.showMessage({
                    type: "success",
                    content: "添加成功"
                  });
                }
              });
            }
          });
        } else if (val.type == "edit") {
          /**
           * 编辑：
           */
          this.$refs.addEditModal.$refs.formModal.validate(valid => {
            if (valid) {
              this.oss.post({
                url: "/sys/ftpConfig/edit",
                data: val.formData,
                ok(data) {
                  self.oss.showMessage({
                    type: "success",
                    content: "修改成功"
                  });
                  self.getTaskList(self.searchParams, self);
                  self.$refs.addEditModal.showModal = false;
                  self.chooseList = [];
                  self.deleteConnName = [];
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
        this.$refs.addEditModal._data.hintText='';
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
  #FTPLink {
    .w(100%);
    .h(100%);
    .search_wrapper {
      display: flex;
      align-items: center;
    }
    .ivu-form-item {
      margin-bottom: 0;
    }
    .ivu-modal {
      width: 700px !important;
      .ivu-modal-confirm-body div {
        word-break: break-all;
      }
    }
  }
</style>






