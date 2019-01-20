<template>
  <div id="DBLinkManagement">
    <Row class="search_wrapper">
      <Form :label-width="90">
          <FormItem  label="连接名称"  >
            <Input  clearable v-model="searchParams.connName" size="small" style="width:120px" placeholder="请输入连接名称"/>
          </FormItem>
          <FormItem  label="连接类型" :label-width="80">
            <Select clearable class="selects" v-model="searchParams.connType" size="small" @on-change="selectStatus" placeholder="请选择连接类型" style="width:120px">
              <Option v-for="(item,index) in codeList.dbConnType" :value="index" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem  label="数据库类型" >
            <Select clearable class="selects" v-model="searchParams.dbType" size="small" @on-change="selectStatus" placeholder="请选择数据库类型" style="width:130px">
              <Option v-for="(item,index) in codeList.dbType" :value="index" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem  label="状态" :label-width="60">
            <Select clearable class="selects" v-model="searchParams.status" size="small" @on-change="selectStatus" placeholder="请选择状态类型" style="width:120px">
              <Option v-for="(item,index) in codeList.status" :value="index" :key="index">{{ item=="有效"?item="启用":"未启用" }}</Option>
            </Select>
          </FormItem>
          <Button type="primary" shape="circle" @click="search" style="margin-left:50px">查&nbsp;&nbsp;询</Button>
      </Form>
    </Row>
    <!-- 按钮组件 -->
    <page-button-list @btnClick="clickBtn" :datakey="$route.query.datakey"></page-button-list>

    <!-- <ul class="btns_ul">
      <li class="btns_li" v-for="(item,index) in $root.btnList" :key="index">
        <Button :type="item.type" :disabled="(item.name=='edit'&&(editId.length==0||editId.length>=2))||(item.name=='delete'&&editId.length==0)||(item.name=='test'&&(editId.length==0||editId.length>=2))?'disabled':false" :icon="item.icon" @click="clickBtn(item.name)">{{item.text}}</Button>
      </li>
    </ul> -->
    <div class="table_wrapper">
      <div class="topcheer-oss-table topcheer-oss-table-without-btn" ref="topcheerOssTable">
        <Table class=""  :loading="loading" :columns="columns" :height="tableHeight" :data="dataList" size="small"
               @on-selection-change="chooseData"  @on-row-dblclick="showRowDataDetail" highlight-row >
          <div slot="footer" class="page_footer">
            <Page class="page" size="small" v-if="total>0" placement="top" @on-change="pageFn" @on-page-size-change="pageSizeFn"  :total="total"
                  :current="searchParams.current" :page-size="searchParams.size" :page-size-opts="oss.pageSizeOpts" show-elevator show-sizer show-total></Page>
          </div>
        </Table>
      </div>
    </div>
    <DBLinkManagement-add-edit class="addEditModal" ref="addEditModal" :codeList="codeList"
                   :formValidate="formValidate" :modal="modal" @getDBConfigList="getDBConfigList" ></DBLinkManagement-add-edit>
  </div>
</template>
<script>
  import DBLinkManagementAddEdit from './DBLinkManagementAddEdit.vue'
  import pageButtonList from '@/components/PageButtonList.vue'

  let codes = {};
  let currentPage = 1;  //当前页数
  let pageSize = 10;
  export default {
    name: 'DBLinkManagement',
    data() {
      return {
        loading: false,
        columns: [
          {type:'selection', width:80, align:'center'},
          {
            title: '序号', width: 80, align: 'center',
            render: (h, params) => {
              return h('div', (params.index + 1) + pageSize * (currentPage - 1));
            }
          },
          {key: 'connName', title: '连接名称', width: 110, sortable: true,align: "center"},
          {key: 'connType', title: '连接类型', width: 110, sortable: true,align: "center"},
          {key: 'dbType', title: '数据库类型', width: 100, edit: 'text',align: "center"},
          {key: 'driverClass', title: '驱动类名', width: 200, sortable: true,align: "left",align: 'center'},
          {key: 'url', title: '连接URL', width: 280,align: "left",align: 'center'},
          {key: 'username', title: '用户名', width: 100,align: "center"},
          {
            key: "status",
            title: "状态",
            width: 100,
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
                        arr.push(params.row.connName);
                        if (!val) {
                        this.oss.post({
                            url: "/sys/dbConfig/disable",
                            data: {
                            connName: arr.toString()
                            },
                            ok(data, page, code) {
                            self.oss.showMessage({type: 'success', content: '已禁用'});
                            self.getDBConfigList();
                            }
                        });
                        } else {
                        this.oss.post({
                            url: "/sys/dbConfig/enable",
                            data: {
                            connName: arr.toString()
                            },
                            ok(data, page, code) {
                            self.oss.showMessage({type: 'success', content: '已启用'});
                            self.getDBConfigList();
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
          {key: 'initialSize', title: '初始化连接池大小', width: 80,align: "center"},
          {key: 'maxTotal', title: '最大连接池大小', width: 80,align: "center"},
          {key: 'createUser', title: '创建人员', width: 100,align: "center"},
          {key: 'createTime', title: '创建时间', width: 160,sortable: true,align: "center"},
          {key: 'modifyUser', title: '修改人员', width: 100,align: "center"},
          {key: 'modifyTime', title: '修改时间', width: 160, sortable: true,align: "center"},
          {key: 'remark', title: '备注', width: 150,align: "center",ellipsis:true}
        ],
        isFirst:true,
        codeList: [],
        total: 0,
        size: 0,   //每页大小
        searchParams:{   //查询条件
          current: 1,
          size: 10,
          connName:'',
          connType:'',
          dbType:'',
          status:'',
        },
        editId:[],    //选中的id集合
        deleteName:[],
        dataList:[],
        tableHeight: '',  //默认表格高度
        formValidate:{
          id:'',
          connName:'',
          connType:'jdbc',
          dbType:'',
          driverClass:'',
          url:'',
          username:'',
          password:'',
          initialSize:null,
          maxTotal:null,
          status:1,
          remark:'',
        },
        modal: {
          text: '',  //弹框标题：新增还是编辑
          type: '',   //add:新增，edit：编辑
          icon: ''
        },

        chooseList:[],
        currentUser:{},
      }
    },
    components:{
      DBLinkManagementAddEdit,
      pageButtonList
    },
    methods: {
      getDBConfigList(){
        var self=this;
        this.oss.get({
          url: '/sys/dbConfig/list',
          data: self.searchParams,
          ok(data, page, code) {
            self.codeList=code;
            self.loading = false;
            self.total = page.total;
            self.size = page.size;
            self.dataList = data;
            self.chooseList = [];
            self.deleteName=[];
            self.editId=[]
            self.oss.setTableHeight({
              el: self,
              headAndPageHeight: 115,
              size: self.size
            });
          }
        });
      },
      selectStatus(val){
      },
      clickBtn(item) {
        switch (item.code) {
          case 'add':
            this.modal.text = '新增连接';
            this.modal.type = 'add';
            this.modal.icon = 'md-person-add';
            this.$refs.addEditModal._data.showModal = true;
            this.$refs.addEditModal.$refs.formModal.resetFields();
            this.formValidate.connName='';
            this.formValidate.initialSize=1;
            this.formValidate.maxTotal=2;
            break;
          case 'edit':
            this.modal.text = '编辑连接';
            this.modal.type = 'edit';
            this.modal.icon = 'ios-create';
            this.isFirst = true;
            var self = this;
            if (this.chooseList.length == 1) {
              this.$refs.addEditModal._data.showModal = true;
              this.formValidate = {
                id:this.chooseList[0].id,
                connName:this.chooseList[0].connName,
                connType: this.chooseList[0].connType,
                dbType: this.chooseList[0].dbType,
                driverClass: this.chooseList[0].driverClass,
                url: this.chooseList[0].url,
                username: this.chooseList[0].username,
                password: this.chooseList[0].password,
                initialSize: this.chooseList[0].initialSize,
                maxTotal: this.chooseList[0].maxTotal,
                remark: this.chooseList[0].remark,
              }
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
          case 'delete':
            if (this.chooseList.length > 0) {
              this.delConfirm();
            } else {
              this.oss.showMessage({type: 'warning', content: '请选择要删除的数据'});
            }
            break;
          case 'test':
            if (this.chooseList.length == 1) {
              this.oss.post({
                url: "/sys/dbConfig/testConnByName",
                data: {
                  connName: this.deleteName.toString()
                  },
                ok:(data, page, code)=> {
                  this.oss.showMessage({type: 'success', content: '测试成功，连接正确'});
                  this.getDBConfigList();
                },
                // err: (error)=>{
                //   this.oss.showModal({
                //       type: 'error',
                //       title: '测试结果',
                //       content: '测试失败，连接有误'
                //   });
                // }
              });
            } else if (this.chooseList.length > 1 ) {
              this.oss.showMessage({type: 'warning', content: '只能选择一条数据'});
            } else {
              this.oss.showMessage({type: 'warning', content: '请选择一条数据'})
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
          url: '/sys/dbConfig/delete',
          data: {connName: self.deleteName.toString()},
          ok(data) {
            for (var i = 0; i <= self.deleteName.length; i++) {
              self.dataList.map((item, index) => {
                if (self.deleteName[i] == item.connName) {
                  self.dataList.splice(index, 1);
                }
              })
            }
            if (self.codeList.length == 0) {
              self.searchParams.current -= 1;
              currentPage = self.searchParams.current;
            }
            self.oss.showMessage({type: 'success', content: '删除成功'});
            self.getDBConfigList();
            self.total = self.total - self.deleteName.length;
            self.chooseList = [];
            self.deleteName=[];
          },
          // err(err) {
          //   self.oss.showModal({
          //           type: 'error',
          //           title: '异常提示',
          //           content: '删除失败'
          //       });
          // }
        })
      },
      delConfirm () {
                this.oss.showModal({
                    type: 'confirm',
                    title: '确认删除',
                    content: '<p>确认删除所选的'+this.deleteName.length+'条数据吗？</p>',
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
      chooseData(val){
        this.chooseList = val;
        this.editId = [];
        this.deleteName=[];
        var self = this;
        this.chooseList.map(item => {
          self.editId.push(item.id);
          self.deleteName.push(item.connName);
        })
      },
      /**
       * 点击切换当前页码：
       * @param val：当前页码
       */
      pageFn(val) {
        this.searchParams.current = val;
        currentPage=val;
        this.loading = true;
        this.getDBConfigList();
      },
      /**
       * 点击显示每页条数：
       * @param val：每页条数
       */
      pageSizeFn(val) {
        this.searchParams.size = val;
        pageSize = val;
        this.loading = true;
        this.getDBConfigList();
      },
      /**
       * 查询：
       */
      search(){
        this.searchParams.current=1;
        // pageSize=0;
        currentPage=1;
        this.getDBConfigList();
      },
      showRowDataDetail(row){
        this.oss.showModal({
          type: 'info',
          title: '数据库连接详细信息',
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
    },
    mounted() {
      this.getDBConfigList();
    },
    created() {
      this.getDBConfigList();
    },
  }
</script>
<style lang="less">
  @import "./../../assets/css/common";
  // @import "./../../assets/css/content";
  #DBLinkManagement{
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
