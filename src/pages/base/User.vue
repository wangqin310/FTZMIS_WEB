<template>
  <div id="user">
    <Row class="search_wrapper">
      <Form :label-width="60">
        <FormItem label="姓名">
          <Input  clearable v-model="searchModel.name" size="small" placeholder="请输入姓名" style="width:120px"/>
        </FormItem>
        <FormItem label="登录账号" :label-width="80">
          <Input  clearable v-model="searchModel.account" size="small" placeholder="请输入登录账号" style="width:120px" />
        </FormItem>
        <FormItem label="工号">
          <Input  clearable v-model="searchModel.empId" size="small" placeholder="请输入工号" style="width:120px"/>
        </FormItem>
        <FormItem label="状态">
          <Select class="selects" clearable v-model="searchModel.status" size="small" @on-change="selectStatus"  style="width:120px">
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
        <Button :type="item.type" :disabled="(item.name=='edit'&&(deleteId.length==0||deleteId.length>=2))||(item.name=='delete'&&deleteId.length==0)?'disabled':false" :icon="item.icon" @click="clickBtn(item.name)">{{item.text}}</Button>
      </li>
    </ul> -->
    <div class="table_wrapper">
      <div class="topcheer-oss-table topcheer-oss-table-without-btn" ref="topcheerOssTable">
        <Table :loading="loading" :columns="columns" :data="userList" size="small"        :height="tableHeight"
               @on-selection-change="chooseData"  @on-row-dblclick="showRowDataDetail"  highlight-row >
          <div slot="footer" class="page_footer">
            <Page class="page" size="small" v-if="totalSize>0" placement="top" @on-change="pageFn" @on-page-size-change="pageSizeFn"  :total="totalSize"
                  :current="searchParams.current" :page-size="searchParams.size" :page-size-opts="oss.pageSizeOpts" show-elevator show-sizer show-total></Page>
          </div>
        </Table>
      </div>
    </div>
    <user-add-edit :userList="allUser" class="addEditModal" ref="addEditModal" :modal="modal" :codeList="codeList"
                   :formValidate="formValidate" @save="save" @reset="reset"></user-add-edit>
    <user-set-role class="roleSetModal" ref="roleSetModal" :modal="modal" :roleList="roleList" :roleCheckedIds="roleCheckedIds"
             @saveRole="saveRole" @reset="reset"></user-set-role>
    <user-set-org class="orgSetModal" ref="orgSetModal" :modal="modal" :orgList="orgList"
             @saveOrg="saveOrg" @reset="reset"></user-set-org>
    <!-- 分配权限类型框-->
    <user-set-perm class="userSetPermModal" ref="userSetPermModal" :modal="modal"
            :userPermList="userPermList" :deleteId="deleteId" @savePerm="savePerm" @reset="reset"></user-set-perm>
  </div>
</template>

<script type="text/ecmascript-6">
  import UserAddEdit from './UserAddEdit.vue'
  import UserSetRole from './UserSetRole.vue'
  import UserSetOrg from './UserSetOrg.vue'
  import UserSetPerm from './UserSetPerm.vue'
  import pageButtonList from '@/components/PageButtonList.vue'

  let codes = {};
  let tableIndex = 0;
  let currentPage = 1;  //当前页数
  let pageSize = 10;
  export default {
    name: 'User',
    data() {
      return {
        name_input: '',    //姓名
        login_input: '',   //登录账号
        work_num_input: '',  //工号
        select_model: 0,     //状态选择
        // btnList: [   //按钮列表
        //   {text: '新 增', icon: 'md-add', type: 'primary', name: 'add'},
        //   {text: '修 改', icon: 'md-create', type: 'primary', name: 'edit'},
        //   {text: '删 除', icon: 'md-close', type: 'error', name: 'delete'},
        //   {text: '设置部门', icon: 'md-settings', type: 'primary', name: 'setDepart'},
        //   {text: '分配用户角色', icon: 'ios-people', type: 'primary', name: 'setRole'},
        //   {text: '分配数据权限', icon: 'md-settings', type: 'primary', name: 'setPerm'}
        // ],
        columns: [    //表头数据
          {type: 'selection', width: 60, align: 'center'},
          {
            title: '序号', width: 60, align: 'center',
            render: (h, params) => {
              return h('div', (params.index + 1) + pageSize * (currentPage - 1));
            }
          },
          {key: 'account', title: '登录账号', width: 110, align: 'center'},
          {key: 'name', title: '姓名', width: 110, align: 'center'},
          {
            key: 'gender', title: '性别', width: 80, align: 'center', render: (h, params) => {
            return h('span', params.row.gender == '' ? '' : codes['gender'][params.row.gender])
          }
          },
          {key: 'birthday', title: '出生日期', width: 110, align: 'center'},
          {
            key: 'certType', title: '证件类型', width: 110, align: 'center', render: (h, params) => {
            return h('span', params.row.certType == '' ? '' : codes['certType'][params.row.certType])
          }
          },
          {key: 'certNumber', title: '证件号码', width: 170, align: 'center', ellipsis: true},
          {key: 'telNumber', title: '固定电话', width: 130, align: 'center'},
          {key: 'mobNumber', title: '手机号码', width: 120, align: 'center'},
          {key: 'faxNumber', title: '传真号码', width: 130, align: 'center'},
          {key: 'email', title: '邮箱', width: 170, align: 'center', ellipsis: true},
          {key: 'empId', title: '工号', width: 100, align: 'center'},
          {
            key: 'position', title: '职位', width: 110, align: 'center', render: (h, params) => {
            return h('span', params.row.position == '' ? '' : codes['position'][params.row.position])
          }
          },
          {key: 'loginLastTime', title: '最后登录时间', width: 160, align: 'center'},
          {key: 'loginSuccessCount', title: '登录成功次数', width: 100, align: 'center'},
          {key: 'passwordExpiryDate', title: '密码过期日期', width: 110, align: 'center'},
          {key: 'passwordStatus', title: '密码状态', width: 80, align: 'center'},
          {key: 'wxOpenid', title: '微信OpenID', width: 150, align: 'center', ellipsis: true},
          {key: 'createUser', title: '创建人员', width: 100, align: 'center'},
          {key: 'createTime', title: '创建时间', width: 160, align: 'center'},
          {key: 'modifyUser', title: '修改人员', width: 100, align: 'center'},
          {key: 'modifyTime', title: '修改时间', width: 160, align: 'center'},
          {
            key: 'status', title: '状态', width: 80, align: 'center', render: (h, params) => {
            return h('span', params.row.status  == '' ? '' : codes['status'][params.row.status])
          }
          },
          {key: 'remark', title: '备注', width: 150, align: 'center',ellipsis:true}
        ],
        userList: [],   //用户列表数据
        tableHeight: '', //默认表格的高度
        allUser: [],
        searchModel: {
          name: '',     //姓名
          account: '',  //登录账号
          empId: '',    //工号
          status: ''    //状态
        },
        searchParams: {
          current: 1,   //当前页
          size: 10,     //每页大小
          name: '',         //姓名
          account: '',      //账号
          empId: '',        //工号
          status: ''        //状态
        },
        totalSize: 0,
        size: 0,  //每页大小
        chooseList: [],   //选中的表格内容
        formValidate: {   //表单内容：
          account: '',
          name: '',
          gender: '',
          birthday: '',
          certType: '',
          certNumber: '',
          mobNumber: '',
          telNumber:'',
          email: '',
          faxNumber: '',
          empId: '',
          wxOpenid: '',
          position: '',
          managerId: '',
          passwordStatus: '0',
          passwordExpiryDate: '2099-12-31',
          status: '1',
          remark: ''
        },
        loading: true,
        deleteId: [],
        modal: {
          text: '',  //弹框标题：新增还是编辑
          type: '',   //add:新增，edit：编辑
          icon: ''
        },
        codeList: [],    //code列表数据
        roleList: [],    // 角色列表数据
        roleCheckedIds: [],    // 用户已有角色id集合
        orgCheckedIds: [],  // 用户已有机构id集合
        orgList: [],     //部门列表数据
        userPermList:[],
        permCheckedList:[],
        permCheckedIds: []    //用户已有的数据权限
      }
    },
    components: {
      UserAddEdit,
      UserSetRole,
      UserSetOrg,
      UserSetPerm,
      pageButtonList
    },
    methods: {
      getUserList(searchParams) {
        this.oss.get({
          url: '/sys/user/list',
          data: searchParams,
          ok: (data, page, code) =>{
            codes=code;
            this.codeList=code;
            this.loading = false;
            this.totalSize = page.total;
            this.size = page.size;
            this.userList = data;
            this.oss.setTableHeight({
              el: this,
              size: this.size
            });
          }
        })
      },
      getAllUser() {
        this.oss.get({
          url: '/sys/user/list',
          ok: (data, page, code) =>{
            this.allUser = data;
          }
        })
      },
      clickBtn(item) {
        switch (item.code) {
          /**
           * 点击添加按钮时的操作：
           * @param code：值为add
           */
          case 'add':
            this.modal.text = '新增用户';
            this.modal.type = 'add';
            this.modal.icon = 'md-person-add';
            this.$refs.addEditModal.$refs.formModal.resetFields();
            this.getAllUser();
            this.$refs.addEditModal._data.showModal = true;
            break;
          /**
           * 点击编辑按钮时的操作：
           * @param code：值为edit
           */
          case 'edit':
            this.modal.text = '编辑用户';
            this.modal.type = 'edit';
            this.modal.icon = 'ios-create';
            if (this.chooseList.length == 1) {
              this.formValidate = JSON.parse(JSON.stringify(this.chooseList[0]));
              if(this.allUser.length == 0) {
                this.getAllUser();
              }
              this.$refs.addEditModal.userList = this.allUser;
              this.$refs.addEditModal._data.showModal = true;
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
            if (this.deleteId.length > 0) {
              this.$Modal.confirm({
                content: '<p>确认删除所选的'+ this.deleteId.length +'条数据吗？</p>',
                title: '删除提示',
                onOk: () => {
                    this.delete();
                },
                onCancel: () => {
                    // this.$Message.info('取消删除');
                }
              });
            } else {
              this.oss.showMessage({type: 'warning', content: '请选择要删除的数据'});
            }
            break;
          /**
           * 点击分配角色按钮时的操作：
           * @param name：值为setRole
           */
          case 'setRole':
            var self = this;
            if(this.deleteId.length > 0) {
              if(this.deleteId.length == 1) {
                // 如果是选择单个用户，需要回显角色
                this.oss.get({
                  url:'/sys/user/listRole',
                  data: {id: self.deleteId.toString()},
                  ok(data,page,code) {
                      data.map((item) =>
                        self.roleCheckedIds.push(item.id)
                      );
                      self.getTreeList(self, '/sys/role/list', '分配角色','setRole','ios-people');
                      self.$refs.roleSetModal._data.showModal = true;
                  }
                });
              } else {
                // 如果是选择多个用户分配角色，则不回显,需要弹出框让用户选择是重置还是追加角色
                this.oss.showModal({
                    type: 'confirm',
                    title: '操作类型确认',
                    width: 500,
                    content:'由于您选择了多个用户,请先确定是重置操作还是追加操作！',
                    okText: '追加',
                    cancelText: '重置',
                    onOk: () => {
                      self.operTypeConfirm("追加", "roleOperateType");
                    },
                    onCancel:()=>{
                      self.operTypeConfirm("重置", "roleOperateType");
                    }
                  });
                this.setModalParam(this, '操作类型确认', 'roleOperateType', 'md-settings');
              }
            } else {
              self.oss.showMessage({type: 'warning', content: '请选择一条数据'});
            }
            break;
          /**
           * 点击设置部门按钮时的操作：
           * @param name：值为setDepart
           */
          case 'setDepart':
            var self = this;
            if(this.deleteId.length > 0) {
              if(this.deleteId.length == 1) {
                // 如果是选择单个用户，需要回显角色
                this.oss.get({
                  url:'/sys/user/listOrg',
                  data: {id: self.deleteId.toString()},
                  ok(data,page,code) {
                      data.map((item) =>
                        self.orgCheckedIds.push(item.id)
                      );
                      self.getTreeList(self, '/sys/org/depth', '分配部门','setDepart','md-settings');
                      self.$refs.orgSetModal._data.showModal = true;
                  }
                });
              } else {
                // 如果是选择多个用户分配角色，则不回显,需要弹出框让用户选择是重置还是追加角色
                 this.oss.showModal({
                    type: 'confirm',
                    title: '操作类型确认',
                    width: 500,
                    content:'由于您选择了多个用户,请先确定是重置操作还是追加操作！',
                    okText: '追加',
                    cancelText: '重置',
                    onOk: () => {
                      self.operTypeConfirm("追加", "orgOperateType");
                    },
                    onCancel:()=>{
                      self.operTypeConfirm("重置", "orgOperateType");
                    }
                  });
                this.setModalParam(this, '操作类型确认', 'orgOperateType', 'md-settings');
              }
            } else {
              self.oss.showMessage({type: 'warning', content: '请选择一条数据'});
            }
            break;
          case 'setPerm':
            var self = this;
            if(this.deleteId.length > 0) {
              if(this.deleteId.length == 1) {
                // 如果是选择单个用户，需要回显角色
                this.oss.get({
                  url:'/sys/user/listUserPerm',
                  data: {userId: self.deleteId.toString()},
                  ok(data,page,code) {
                      self.permCheckedList = data;
                      data.map((item) =>
                        self.permCheckedIds.push(item.permId)
                      );
                      self.getTreeList(self, '/sys/perm/depth', '分配数据权限','setPerm','md-settings');
                      self.$refs.userSetPermModal._data.showModal = true;
                  }
                });
              } else {
                // 如果是选择多个用户分配角色，则不回显,需要弹出框让用户选择是重置还是追加角色
                this.oss.showModal({
                    type: 'confirm',
                    title: '操作类型确认',
                    width: 500,
                    content:'由于您选择了多个用户,请先确定是重置操作还是追加操作！',
                    okText: '追加',
                    cancelText: '重置',
                    onOk: () => {
                      self.operTypeConfirm("追加", "permOperateType");
                    },
                    onCancel:()=>{
                      self.operTypeConfirm("重置", "permOperateType");
                    }
                  });
                this.setModalParam(this, '操作类型确认', 'permOperateType', 'md-settings');
              }
            } else {
              self.oss.showMessage({type: 'warning', content: '请选择一条数据'});
            }
            break;
        }
      },
      getTreeList(self, url, text, type, icon) {
        this.oss.get({
          url: url,
              ok(data, page, code) {
                var list = [];
                list = data;
                if(type == 'setRole') {
                  self.roleList = data;
                } else if(type == 'setDepart') {
                  self.orgList =self.treeConverter(data, 1);  //1:节点展开或关闭标识
                } else if(type == 'setPerm') {
                  self.userPermList =self.permTreeConverter(data);
                }
                if(list && list.length > 0) {
                  self.setModalParam(self, text, type, icon)
                }
              }
        });
      },
      setModalParam(self, text, type, icon) {
        self.modal.text = text;
        self.modal.type = type;
        self.modal.icon = icon;
      },
      permTreeConverter(treeObj) {
        let self = this;
        treeObj.map((obj) => {
          obj.title = obj.nodeName;
          obj.expand = true;
          var index = self.permCheckedIds.indexOf(obj.id);
          if(index != -1) {
            obj.selected = true;
            obj.permType = self.permCheckedList[index].permType;
          }
          if(obj.children.length > 0) {
            self.permTreeConverter(obj.children);
          }
        });
        return treeObj;
      },
      operTypeConfirm(operType, modalType) {
        var self = this;
        if(modalType == 'roleOperateType') {
          self.getTreeList(self, '/sys/role/list', '分配角色('+operType+')','setRole','ios-people');
          self.$refs.roleSetModal._data.showModal = true;
        } else if(modalType == 'orgOperateType') {
          self.getTreeList(self, '/sys/org/depth', '分配部门('+operType+')','setDepart','md-settings');
          self.$refs.orgSetModal._data.showModal = true;
        } else if(modalType == 'permOperateType') {
          self.getTreeList(self, '/sys/perm/depth', '分配数据权限('+operType+')','setPerm','md-settings');
          self.$refs.userSetPermModal._data.showModal = true;
        }
      },
      /**
       * 点击切换当前页码：
       * @param val：当前页码
       */
      pageFn(val) {
        this.searchParams.current = val;
        currentPage = val;
        this.loading = true;
        this.getUserList(this.searchParams);
      },
      treeConverter(treeObj, orgExpend) {
        let self = this;
        treeObj.map((obj) => {
          obj.title = obj.name;
          if(orgExpend < 2) {
            obj.expand=true;
          }
          if(self.orgCheckedIds.indexOf(obj.id) != -1) {
            obj.checked = true;
          }
          if(obj.children.length > 0) {
            self.treeConverter(obj.children, orgExpend + 1);
          }
        });
        return treeObj;
      },
      /**
       * 点击显示每页条数：
       * @param val：每页条数
       */
      pageSizeFn(val) {
        this.searchParams.size = val;
        pageSize = val;
        this.loading = true;
        this.getUserList(this.searchParams);
      },
      /**
       *
       * 选择数据：
       * @param val：所选中的数据
       */
      chooseData(val) {
        this.chooseList = val;
        this.deleteId = [];
        var self = this;
        this.chooseList.map(item => {
          self.deleteId.push(item.id);
        })
      },
      /**
       * 删除数据
       */
      delete() {
        var self = this;
        this.oss.post({
          url: '/sys/user/delete',
          data: {id: self.deleteId.toString()},
          ok(data) {
            for (var i = 0; i <= self.deleteId.length; i++) {
              self.userList.map((item, index) => {
                if (self.deleteId[i] == item.id) {
                  self.userList.splice(index, 1);
                }
              })
            }
            if (self.userList.length == 0) {
              self.searchParams.current -= 1;
              currentPage = self.searchParams.current;
            }
            self.getUserList(self.searchParams);
            self.totalSize = self.totalSize - self.deleteId.length;
            self.chooseList = [];
            self.deleteId=[];
            self.oss.showMessage({type: 'success', content: '删除成功'});
          }
        })
      },
      /**
       * 保存用户角色
       */
      saveRole(val) {
        var self = this;
        var data = {id: this.deleteId.toString(), roleId: val.checkedIds.toString()};
        var url = '';
        if(val.type == 'append') {
          url = '/sys/user/addRole';
        } else {
          url = '/sys/user/assignRole';
        }
        this.oss.post({
          url: url,
          data: data,
          ok(data) {
            self.getUserList(self.searchParams);
            self.chooseList = [];
            self.deleteId=[];
            self.roleCheckedIds = [];
            self.oss.showMessage({type: 'success', content: '角色分配成功！'});
          }
        })
      },
      /**
       * 保存用户机构
       */
      saveOrg(val, operType) {
        var self = this;
        var url = '';
        if(operType == 'append') {
          url = '/sys/user/addOrg';
        } else {
          url = '/sys/user/assignOrg';
        }
        var data = {id: this.deleteId.toString(), orgId: val.toString()};
        this.oss.post({
          url: url,
          data: data,
          ok(data) {
            self.getUserList(self.searchParams);
            self.chooseList = [];
            self.deleteId=[];
            self.orgCheckedIds = [];
            self.oss.showMessage({type: 'success', content: '部门设置成功！'});
          }
        })
      },
      savePerm(submitParams, operType) {
        var url = '';
        if(operType == 'clear') {
          this.oss.post({
              url: '/sys/user/deleteAllPerm',
              data: {userId: this.deleteId.toString()},
              ok: (data) =>{
                this.getUserList(this.searchParams);
                this.chooseList = [];
                this.deleteId=[];
                this.userPermList = [];
                this.permCheckedIds = [];
                this.permCheckedList = [];
                this.$refs.userSetPermModal._data.showModal = false;
                this.oss.showMessage({type: 'success', content: '角色分配成功！'});
              }
          });
          return;
        }
        if(operType == 'append') {
          url = '/sys/user/addPerm';
        } else {
          url = '/sys/user/assignPerm';
        }
        this.deleteId.map((item) => {
          submitParams.map((param) => {
            param.userId = item
          });
        });
        this.oss.post({
          url: url,
          data: {userPermJsonArray: JSON.stringify(submitParams)},
          ok:(data)=>{
            this.getUserList(this.searchParams);
            this.chooseList = [];
            this.deleteId=[];
            this.userPermList = [];
            this.permCheckedIds = [];
            this.permCheckedList = [];
            this.$refs.userSetPermModal._data.showModal = false;
            this.oss.showMessage({type: 'success', content: '权限分配成功！'});
          }
        })
      },
      /**
       * 重置
       */
      reset(val) {
        this.$refs.addEditModal.$refs.formModal.resetFields();
        this.roleCheckedIds = [];
        this.orgCheckedIds = [];
        this.userPermList = [];
        this.permCheckedIds = [];
        this.permCheckedList = [];
        // 因为权限分配的modal修改了userPermList的值，所以这里需要全新获取一下
        // if(){}
        this.getTreeList(this, '/sys/perm/depth', '分配数据权限','setPerm','md-settings');
      },
      time(n) {
        return n >= 10 ? n : '0' + n;
      },
      /**
       * 保存
       * @param val
       */
      save(val) {
        var self = this;
        if (val.formData.birthday && val.formData.birthday != '') {
          val.formData.birthday = new Date(val.formData.birthday).getFullYear() + '/' + this.time(new Date(val.formData.birthday).getMonth() + 1) + '/' + this.time(new Date(val.formData.birthday).getDate());
        } else {
          val.formData.birthday = '';
        }
        /**
         * 新增用户：
         */
        // if (val.type == 'add') {
          this.oss.post({
            url: val.type == 'add' ? '/sys/user/add' : '/sys/user/edit',
            data: val.formData,
            ok(data) {
              self.getUserList(self.searchParams);
              self.$refs.addEditModal.showModal = false;
              self.chooseList = [];
              self.deleteId=[];
              self.oss.showMessage({type: 'success', content: val.type == 'add' ? '添加成功' : '修改成功'});
            }
          })
        // }
        /**
         * 编辑用户：
         */
        // else if (val.type == 'edit') {
        //   this.$refs.addEditModal.$refs.formModal.validate((valid)=>{
        //     if(valid){
        //       this.oss.post({
        //         url: '/sys/user/edit',
        //         data: val.formData,
        //         ok(data) {
        //           self.getUserList(self.searchParams, self);
        //           self.$refs.addEditModal.showModal = false;
        //           self.chooseList = [];
        //           self.deleteId=[];
        //           self.oss.showMessage({type: 'success', content: '修改成功'});
        //         }
        //       })
        //     }})
        // }
      },
      /**
       * 查询：
       */
      search() {
        this.searchParams.current=1;
        currentPage=1;
        Object.assign(this.searchParams, this.searchModel);
        this.getUserList(this.searchParams);
      },
      /**
       * 双击当前行显示详情
       */
      showRowDataDetail(row){
        this.oss.showModal({
          type: 'info',
          title: '用户详细信息',
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
      this.getUserList(this.searchParams);
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/common";

  #user {
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
