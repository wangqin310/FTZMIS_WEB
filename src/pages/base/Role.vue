<template>
  <div id="role">
    <Row class="search_wrapper">
      <Form :label-width="80">
          <FormItem  label="角色名称" >
            <Input clearable class="inputs" v-model="searchModel.name" size="small" placeholder="请输入角色名称" style="width:120px"/>
          </FormItem>
          <FormItem  label="状态" :label-width="60">
            <Select class="selects" v-model="searchModel.status" size="small" @on-change="selectStatus" placeholder="请选择状态类型" style="width:120px">
              <Option value="">所有类型</Option>
              <Option v-for="(item,index) in codeList.status" :value="index" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          <Button type="primary" shape="circle" @click="search" style="margin-left:50px">查&nbsp;&nbsp;询</Button>
      </Form>
    </Row>
    <!-- 按钮组件 -->
    <page-button-list @btnClick="clickBtn" :datakey="$route.query.datakey"></page-button-list>

    <!-- <ul class="btns_ul">
      <li class="btns_li" v-for="(item,index) in $root.btnList" :key="index">
        <Button :type="item.type" :icon="item.icon" :disabled="(item.name=='edit'&&(deleteId.length==0||deleteId.length>=2))||(item.name=='delete'&&deleteId.length==0)?'disabled':false"  @click="clickBtn(item.name)">{{item.text}}</Button>
      </li>
    </ul> -->
    <div class="table_wrapper">
      <div class="topcheer-oss-table topcheer-oss-table-without-btn" ref="topcheerOssTable">
        <Table class=""  :loading="loading" :columns="columns" :height="tableHeight" :data="roleList" size="small"
               @on-selection-change="chooseData"  @on-row-dblclick="showRowDataDetail"  highlight-row >
          <div slot="footer" class="page_footer">
            <Page class="page" size="small" v-if="totalSize>0" placement="top" @on-change="pageFn" @on-page-size-change="pageSizeFn"  :total="totalSize"
                  :current="searchParams.current" :page-size="searchParams.size" :page-size-opts="oss.pageSizeOpts" show-elevator show-sizer show-total></Page>
          </div>
        </Table>
      </div>
    </div>
    <role-add-edit class="addEditModal" ref="addEditModal" :codeList="codeList"
                   :formValidate="formValidate" :ruleValidate="ruleValidate" :modal="modal" @save="save" @reset="reset"></role-add-edit>
    <role-assign-resource class="assignResourceModal" ref="assignResourceModal" :resourceList="resourceList"
           :oriResourceList="oriResourceList" :modal="modal" @assignResource="assignResource" @reset="reset"></role-assign-resource>
  </div>
</template>

<script>
  import RoleAddEdit from './RoleAddEdit.vue'
  import RoleAssignResource from './RoleAssignResource.vue'
  import pageButtonList from '@/components/PageButtonList.vue'

  let codes = {};
  let currentPage = 1;  //当前页数
  let pageSize = 10;
  export default {
    name: 'Role',
    data() {
      return {
        loading: true,
        columns: [
          {type:'selection', width:80, align:'center'},
          {
            title: '序号', width: 80, align: 'center',
            render: (h, params) => {
              return h('div', (params.index + 1) + pageSize * (currentPage - 1));
            }
          },
          {key: 'name', title: '角色名称', width: 150,align: 'center'},
          {key: 'createUser', title: '创建人员', width: 150,align: 'center'},
          {key: 'createTime', title: '创建时间', width: 170,align: 'center'},
          {key: 'modifyUser', title: '修改人员', width: 150,align: 'center'},
          {key: 'modifyTime', title: '修改时间', width: 170,align: 'center'},
          {key: 'status', title: '状态', width: 150,align: 'center',render: (h, params) => {
            return h('span', params.row.status == '' ? '' : codes['status'][params.row.status])
          }},
          {key: 'remark', title: '备注', width: 150,align: 'center',ellipsis:true}
        ],
        // btnList: [   //按钮列表
        //   {text: '新 增', icon: 'md-add', type: 'primary', name: 'add'},
        //   {text: '修 改', icon: 'md-create', type: 'primary', name: 'edit'},
        //   {text: '删 除', icon: 'md-close', type: 'error', name: 'delete'},
        //   {text: '分配资源', icon: 'md-settings', type: 'primary', name: 'assignResource'}
        // ],
        roleList: [],
        tableHeight: '', //默认表格的高度
        totalSize:0,
        size: 0,  //每页大小
        loading:true,
        searchModel: {
          name: '',     //角色名称
          status: ''    //状态
        },
        searchParams:{   //查询条件
          current:1,
          size:10,
          name:'',
          status:''
        },
        deleteId:[],    //选中的id集合
        codeList:[],
        formValidate:{
          name:'',
          remark:''
        },
        modal: {
          text: '',  //弹框标题：新增还是编辑
          type: '',   //add:新增，edit：编辑
          icon: ''
        },
        ruleValidate:{
          name:[
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ]
        },
        chooseList:[],
        resourceList: [],
        oriResourceList: [],
        roleResourceIds: []
      }
    },
    components:{
      RoleAddEdit,
      RoleAssignResource,
      pageButtonList
    },
    methods: {
      getRoleList(searchParams,self){
        this.oss.get({
          url: '/sys/role/list',
          data: searchParams,
          ok(data, page, code) {
            codes=code;
            self.codeList=code;
            self.loading = false;
            self.totalSize = page.total;
            self.size = page.size;
            self.roleList = data;
            self.oss.setTableHeight({
              el: self,
              headAndPageHeight: 80,
              size: self.size
            });
          }
        })
      },
      clickBtn(item) {
        switch (item.code) {
          case 'add':
            this.modal.text = '新增角色';
            this.modal.type = 'add';
            this.modal.icon = 'md-person-add';
            this.$refs.addEditModal._data.showModal = true;
            this.$refs.addEditModal.$refs.formModal.resetFields();
            break;
          case 'edit':
            this.modal.text = '编辑角色';
            this.modal.type = 'edit';
            this.modal.icon = 'ios-create';
            var self = this;
            if (this.chooseList.length == 1) {
              this.$refs.addEditModal._data.showModal = true;
              this.formValidate = {
                id: this.chooseList[0].id,
                name: this.chooseList[0].name,
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
           * @param code：值为edit
           */
          case 'delete':
           if (this.deleteId.length > 0) {
            this.$Modal.confirm({
                content: '<p>确认删除所选的'+ this.deleteId.length +'条数据吗？</p>',
                title: '删除提示',
                onOk: () => {
                    this.delete();
                    this.oss.showMessage({type: 'success', content: '删除成功'});
                },
                onCancel: () => {
                    // this.$Message.info('取消删除');
                }
              });
            } else {
              this.oss.showMessage({type: 'warning', content: '请选择要删除的数据'});
            }
            break;
          case 'assignResource':
            var self = this;
            if(this.deleteId.length == 1) {
              this.oss.get({
                  url:'/sys/role/listResource',
                  data: {id: self.deleteId.toString()},
                  ok(data,page,code) {
                      data.map((item) =>
                        self.roleResourceIds.push(item.id)
                      );
                      self.getResourceDepth(self);
                  }
                });
            } else if (this.chooseList.length > 1 ) {
              this.oss.showMessage({type: 'warning', content: '只能选择一条数据'});
            } else {
              this.oss.showMessage({type: 'warning', content: '请选择一条数据'})
            }
            break;
        }
      },
      getResourceDepth(self) {
        this.oss.get({
            url: '/sys/resource/depth',
            data:{depth: 0, childType: ''},
                ok(data, page, code) {
                  self.resourceList =self.treeConverter(data, 1);  //1:节点展开或关闭标识
                  self.oriResourceList = JSON.parse(JSON.stringify(self.resourceList));
                  if(self.resourceList && self.resourceList.length > 0) {
                    self.$refs.assignResourceModal._data.showModal = true;
                    self.modal.text = '分配资源';
                    self.modal.type = 'assignResource';
                    self.modal.icon = 'md-settings';
                  }
                }
          });
      },
      treeConverter(treeObj, orgExpend) {
        let self = this;
        treeObj.map((obj) => {
          obj.title = obj.name;
          if(orgExpend < 3) {
            obj.expand=true;
          } else {
            obj.expand = false;
          }
          if(self.roleResourceIds.indexOf(obj.id) != -1) {
            obj.checked = true;
          }
          if(obj.children.length > 0) {
            obj.checked = false;
            self.treeConverter(obj.children, orgExpend + 1);
          }
        });
        return treeObj;
      },
      assignResource(val) {
        var self = this;
        var data = {id: this.deleteId.toString(), resourceId: val.toString()};
        this.oss.post({
          url: '/sys/role/assignResource',
          data: data,
          ok(data) {
            self.getRoleList(self.searchParams, self);
            self.chooseList = [];
            self.deleteId=[];
            self.roleResourceIds=[];
            self.oss.showMessage({type: 'success', content: '分配资源成功！'});
          }
        })
      },
      /**
       * 删除数据
       */
      delete() {
        var self = this;
        this.oss.post({
          url: '/sys/role/delete',
          data: {id: self.deleteId.toString()},
          ok(data) {
            for (var i = 0; i <= self.deleteId.length; i++) {
              self.roleList.map((item, index) => {
                if (self.deleteId[i] == item.id) {
                  self.roleList.splice(index, 1);
                }
              })
            }
            if (self.roleList.length == 0) {
              self.searchParams.current -= 1;
              currentPage = self.searchParams.current;
            }
            self.getRoleList(self.searchParams, self);
            self.totalSize = self.totalSize - self.deleteId.length;
            self.chooseList = [];
            self.deleteId=[];
          }
        })
      },
      /**
       * 选中的数据
       */
      chooseData(val){
        this.chooseList = val;
        this.deleteId = [];
        var self = this;
        this.chooseList.map(item => {
          self.deleteId.push(item.id);
        })
      },
      /**
       * 点击行时选中数据：
       * @param val：所选中的数据
       */
      currentChange(val){
        var self=this;
        this.roleList.map((item,index)=>{
          if(item.id==val.id){
            if(typeof item._checked=='undefined'||item._checked==false){
              this.$set(item,'_checked',true);
              self.deleteId.push(item.id);
              self.chooseList.push(val);
            }else if(item._checked==true){
              item._checked=false;
              self.deleteId.map((i,idx)=>{
                if(i==val.id){
                  self.deleteId.splice(idx,1);
                };
              });
              self.chooseList.map((item,index)=>{
                if(item.id==val.id){
                  self.chooseList.splice(index,1);
                }
              })
            }
          }
        })
      },
      /**
       * 点击切换当前页码：
       * @param val：当前页码
       */
      pageFn(val){
        this.searchParams.current = val;
        currentPage = val;
        this.loading = true;
        this.getRoleList(this.searchParams, this);
      },
      /**
       * 点击显示每页条数：
       * @param val：每页条数
       */
      pageSizeFn(val){
        this.searchParams.size = val;
        pageSize = val;
        this.loading = true;
        this.getRoleList(this.searchParams, this);
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
        if (val.type == 'add') {
          this.$refs.addEditModal.$refs.formModal.validate((valid)=>{
            if(valid){
              this.oss.post({
                url: '/sys/role/add',
                data: val.formData,
                ok(data) {
                  self.getRoleList(self.searchParams, self);
                  self.$refs.addEditModal.showModal = false;
                  self.chooseList = [];
                  self.deleteId=[];
                  self.oss.showMessage({type: 'success', content: '添加成功'});
                }
              })
            }
          })
        }
        /**
         * 编辑角色：
         */
        else if (val.type == 'edit') {
          this.$refs.addEditModal.$refs.formModal.validate((valid)=>{
            if(valid){
              this.oss.post({
                url: '/sys/role/edit',
                data: val.formData,
                ok(data) {
                  self.getRoleList(self.searchParams, self);
                  self.$refs.addEditModal.showModal = false;
                  self.chooseList = [];
                  self.deleteId=[];
                  self.oss.showMessage({type: 'success', content: '修改成功'});
                }
              })
            }})
        }
      },
      /**
       * 重置
       * @param val
       */
      reset(val) {
        this.$refs.addEditModal.$refs.formModal.resetFields();
        this.roleResourceIds=[];
      },
      /**
       * 查询：
       */
      search(){
        this.searchParams.current=1;
        currentPage=1;
        Object.assign(this.searchParams, this.searchModel);
        this.getRoleList(this.searchParams, this);
      },
      /**
       * 双击当前行显示详情
       */
      showRowDataDetail(row){
        this.oss.showModal({
          type: 'info',
          title: '角色详细信息',
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
      /**
       * 切换状态
       */
      selectStatus(val){
        this.searchParams.status=val;
      }
    },
    mounted() {
      this.getRoleList(this.searchParams,this);
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/common";
  // @import "./../../assets/css/content";
  #role{
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
