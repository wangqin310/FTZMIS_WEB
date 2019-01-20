<template>
  <div id="data-permission">
    <div class="tree_box">
      <Row>
        <Col span="16">
        <Input v-model="searchVal" clearable icon="ios-search" placeholder="请根据名称查询" style="width: 185px"></Input>
        </Col>
        </Row>
      <Row>
        <Col span="24">
          <div style="margin-top:15px;margin-right:5px;">
          <Button v-for="item in btnList" :key="item.id" :class="item.className" :type="item.type" style="margin-right:5px;"
                        @click="clickBtn({type:item.className})" v-text="item.text" size="small"/>
                        <Divider type="vertical" />
          <Icon v-for="item in iconList" :key="item.id" :type="item.type" @click.native="iconClick(item.name)" style="margin-right:5px;cursor: pointer;"/>
          </div>
        </Col>
      </Row>
      <div class="tree">
        <Tree :data="permList" :render="renderContent"></Tree>
      </div>
    </div>
    <div class="detail_box">
      <div class="detail">
        <Form ref="showDetail" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <div class="title">
            <Divider orientation="left">
              <Icon v-show="!iconStatus" :type="icon"></Icon>
                <svg v-show="iconStatus" class="icon" aria-hidden="true">
                  <use xlink:href="#icon-quanxian"></use>
                </svg>
                <span v-text="title"></span>
            </Divider>
          </div>
          <Row>
            <Col span="8" >
            <FormItem  v-show="showInput && editParent"  label="节点位置："  :label-width="110" prop="parentId">
              <i-switch  size="large" v-model="switchStatus"  @on-change="switchChange">
                  <span slot="open">下级</span>
                  <span slot="close">同级</span>
              </i-switch>
            </FormItem>
            </Col>
            <Col span="8" v-show="showInput && editParent">
              <FormItem label="上级名称：" :label-width="110" :class="classObj">
                <span  v-text="parentName"></span>
              </FormItem>
            </Col>
            </Row>
          <Row>
            <Col span="8"  v-show="showInput" >
              <FormItem label="权限类型：" :label-width="110" prop="nodeType" :class="classObj">
                <RadioGroup v-model="formValidate.nodeType">
                  <Radio :label="value" v-for="(item,value) in codeList.nodeType" :key="value">{{item}}</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="12"   v-show="!showInput">
              <FormItem label="权限类型：" :label-width="110" prop="nodeType" :class="classObj">
                <span v-text="codeList.nodeType ? codeList.nodeType[formValidate.nodeType] : formValidate.nodeType"></span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8"   v-show="showInput" >
            <FormItem label="权限名称：" :label-width="110" prop="nodeName" :class="classObj">
              <Input v-model="formValidate.nodeName" placeholder="权限名称"  ></Input>
            </FormItem>
            </Col>
            <Col span="12"   v-show="!showInput">
              <FormItem label="权限名称：" :label-width="110" prop="nodeType" :class="classObj">
              <span  v-text="formValidate.nodeName"></span>
              </FormItem>
            </Col>
            <Col span="8"   v-show="showInput">
            <FormItem label="权限值："  :label-width="110" prop="nodeValue">
              <Input v-model="formValidate.nodeValue" placeholder="请输入权限值"  ></Input>
            </FormItem>
            </Col>
            <Col span="12"   v-show="!showInput">
            <FormItem label="权限值："  :label-width="110" prop="nodeValue">
              <span v-text="formValidate.nodeValue"></span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8"  v-show="showInput">
              <FormItem label="创建人员：" :label-width="110" prop="createUser">
                <Input v-model="formValidate.createUser" placeholder="请输入创建人员姓名"  ></Input>
                <!-- <span   v-show="showInput" v-text="formValidate.createUser"></span> -->
              </FormItem>
            </Col>
            <Col span="12"  v-show="!showInput">
              <FormItem label="创建人员：" :label-width="110" prop="createUser">
                <span   v-show="!showInput" v-text="formValidate.createUser"></span>
              </FormItem>
            </Col>
            <Col span="8"  v-show="showInput">
              <FormItem label="创建时间：" :label-width="110" prop="createTime">
                <Input v-model="formValidate.createTime" placeholder="请输入创建时间"  ></Input>
                <!-- <span   v-show="showInput" v-text="formValidate.createTime"></span> -->
              </FormItem>
            </Col>
            <Col span="12"  v-show="!showInput">
              <FormItem label="创建时间：" :label-width="110" prop="createTime">
                <span   v-show="!showInput" v-text="formValidate.createTime"></span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8"  v-show="showInput">
              <FormItem label="修改人员：" :label-width="110" prop="modifyUser">
                <Input v-model="formValidate.createTime" placeholder="请输入修改人员姓名"  ></Input>
                <!-- <span   v-show="showInput" v-text="formValidate.modifyUser"></span> -->
              </FormItem>
            </Col>
            <Col span="12"  v-show="!showInput">
              <FormItem label="修改人员：" :label-width="110" prop="modifyUser">
                <span   v-show="!showInput" v-text="formValidate.modifyUser"></span>
              </FormItem>
            </Col>
            <Col span="8"  v-show="showInput">
              <FormItem label="修改时间：" :label-width="110" prop="modifyTime">
                <Input v-model="formValidate.createTime" placeholder="请输入修改时间"  ></Input>
                <!-- <span   v-show="showInput" v-text="formValidate.modifyTime"></span> -->
              </FormItem>
            </Col>
            <Col span="12"  v-show="!showInput">
              <FormItem label="修改时间：" :label-width="110" prop="modifyTime">
                <span   v-show="!showInput" v-text="formValidate.modifyTime"></span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="16"  v-show="showInput">
              <FormItem label="备注：" :label-width="110" prop="remark">
                <Input  v-model="formValidate.remark" type="textarea" :autosize="{minRows:5,maxRows:5}"
                     placeholder="请在此输入您的备注信息" ></Input>
            </FormItem>
            </Col>
            <Col span="24"  v-show="!showInput">
              <FormItem label="备注：" :label-width="110" prop="remark">
                <span   v-show="!showInput" v-text="formValidate.remark"></span>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem class="btns">
                <Button v-for="item in btnList2" :key="item.id" :class="item.className" :type="item.type"
                      @click="clickBtn({type:item.className})" v-text="item.text" v-show="buttonShow(item)"/>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Divider orientation="left" style="margin-top:-20px"  v-show="!editParent">拥有该权限的用户</Divider>
      </div>
      <div class="detailTable"  v-show="!editParent">
        <ul class="btns_ul">
          <li class="btns_li" v-for="(item,index) in btnList1" :key="index">
            <Button :type="item.type" :disabled="(item.name=='delete'&&deleteId.length==0)?'disabled':false" :icon="item.icon" @click="clickListBtn(item.name)">{{item.text}}</Button>
          </li>
        </ul>
        <Table :loading="loading" :columns="columns" :data="userList" size="small"
               @on-selection-change="chooseData"   highlight-row >
          <div slot="footer" class="page_footer">
            <Page class="page" size="small" placement="top" @on-change="pageFn" @on-page-size-change="pageSizeFn" :total="totalSize"
                  :current="current" :page-size="size" :page-size-opts="pageSizeOpts" show-elevator show-sizer show-total></Page>
          </div>
        </Table>
      </div>
    </div>
    <Spin size="large" fix  v-if="spinShow"/>
    <Org-choose-user @getPermUserList="getPermUserList" :chooseUserList="userList" :currentNode="currentNode" ref="addUserModal"></Org-choose-user>
  </div>
</template>

<script>
  import OrgChooseUser from './OrgChooseUser.vue'
  let codeList = {};
  let codes = {};//用户列表的code
  let currentPage = 1;  //当前页数
  let pageSize = 5;
  export default {
    name: 'DataPermission',
    data() {
      return {
        columns: [    //表头数据
          {type: 'selection', width: 60, align: 'center'},
          {
            title: '序号', width: 60, align: 'center',
            render: (h, params) => {
              return h('div', (params.index + 1) + pageSize * (currentPage - 1));
            }
          },
          {key: 'permType', title: '权限范围', width: 120, align: 'center', 
            render: (h, params) => {
              return h('span', params.row.permType == '' ? '' : codes['permType'][params.row.permType])
            }
          },
          {key: 'account', title: '账号', width: 110, align: 'center'},
          {key: 'name', title: '姓名', width: 110, align: 'center'},
          {
            key: 'gender', title: '性别', width: 80, align: 'center', render: (h, params) => {
            return h('span', params.row.gender == '' ? '' : codes['gender'][params.row.gender])
          }
          },
          {key: 'mobNumber', title: '手机', width: 120, align: 'center'},
          {key: 'email', title: '邮箱', width: 170, align: 'center', ellipsis: true},
          {key: 'empId', title: '工号', width: 100, align: 'center'},
          {
            key: 'position', title: '职位', width: 110, align: 'center', render: (h, params) => {
            return h('span', params.row.position == '' ? '' : codes['position'][params.row.position])
          }
          },
          {
            key: 'status', title: '状态', width: 80, align: 'center', render: (h, params) => {
            return h('span', params.row.status  == '' ? '' : codes['status'][params.row.status])
          }
          },
        ],
        loading:true,
        totalSize: 0,//总条数
        pageSizeOpts: [5,10,20,30],
        size: 5,//每页大小
        current: 1,//当前页
        permList:[],
        userList: [],
        chooseList:[],
        deleteId:[],
        btnList:[
          {className:'add',type:'primary',text:'新增'},
          {className:'edit',type:'primary',text:'编辑'},
          {className:'delete',type:'error',text:'删除'},
        ],
        btnList1:[
          {name:'add',type:'primary',text:'新增'},
          {name:'delete',type:'error',text:'删除'},
        ],
        btnList2:[
          {className:'reset',type:'default',text:'重置'},
          {className:'cancel',type:'default',text:'取消'},
          {className:'save',type:'primary',text:'保存'}
        ],
        iconList:[
          {name:'up',type:'md-arrow-up'},
          {name:'down',type:'md-arrow-down'},
        ],
        searchVal:'',
        formValidate:{
          parentId:'',
          nodeType:'',
          nodeName:'',
          nodeValue:'',
          sort:'',
          remark:'',
          createUser:'',
          createTime:'',
          modifyUser:'',
          modifyTime:''
        },
        ruleValidate:{
          parentId:[
            { required: true,type:'number',message: '父资源主键不能为空且只能为数字', trigger: 'blur' }
          ],
          nodeType:[
            { required: true, message: '权限类型不能为空', trigger: 'blur' }
          ],
          nodeName:[
            { required: true, message: '权限名称不能为空', trigger: 'blur' }
          ]
        },
        title:'节点详情',
        isAddEdit:'',
        saveParams:{
          parentId:'',
          nodeType:'',
          nodeName:'',
          nodeValue:'',
          sort: '',
          remark:'',
          createUser:'',
          createTime:'',
          modifyUser:'',
          modifyTime:''
        },
        showInput:false,
        currentNode:null,
        disabledBtn:false,
        codeList:[],
        treeNodeId:'',
        classObj:{
          requireStar:false,
          notRequireStar:true
        },
        editParent:true,
        switchStatus:true,
        iconStatus:false,
        icon:'',
        spinShow:true,
        parentName:'',
      }
    },
    components:{
      OrgChooseUser
    },
    watch:{
      searchVal(newV){
        this.searchFn(this.permList);
      }
    },
    methods: {
      buttonShow(item) {
        if(!this.currentNode) {   //如果没有选中节点，则不显示任何按钮
          return false;
        }
        if(!this.showInput) { // 当不在编辑状态时,显示编辑与删除按钮
          return item.className=='edit' || item.className=='delete';
        }else if(this.showInput && this.isAddEdit=='add'){ // 当在编辑状态时，如果是新增，则显示重置、返回与保存按钮
          return item.className=='reset' || item.className=='save' || item.className=='cancel';
        } else if(this.showInput && this.isAddEdit == 'edit') { //如果是编辑，显示取消与保存按钮
          return item.className=='cancel' || item.className=='save';
        }
      },
      getPermList(){
        // var self=this;
        this.oss.get({
          url: '/sys/perm/depth',
          data:{depth:0},
          ok:(data,page,code) =>{
            this.codeList=code;
            // 排序：
            data.sort((a, b) => {return a.sort - b.sort;});
            // 转换树形结构，加title属性
            this.permList = this.treeConverter(data, 0);
            this.currentNode = this.permList[0];
            this.treeNodeId = this.permList[0].id;
            this.change();
            this.spinShow=false;
          },
          err:()=>{
            this.spinShow=false;
          }
        })
      },
      treeConverter(treeObj, orgExpend) {
        if(!orgExpend) {
          orgExpend = 0;
        }
        treeObj.map((obj) => {
          obj.title = obj.nodeName;
          if (orgExpend < 2) {
            obj.expand = true;
          }
          if(obj.children.length > 0) {
            this.treeConverter(obj.children, orgExpend+1);
          }
        });
        return treeObj;
      },
      change(val,self){
        this.title="节点详情";
        this.iconStatus=true;
        this.showInput=false;
        this.editParent=false;
        this.isAddEdit='';
        this.switchStatus=true;
        this.classObj.requireStar=false;
        this.classObj.notRequireStar=true;
        this.$refs.showDetail.resetFields();
        this.getPermUserList();
        if(this.currentNode){
          this.formValidate=JSON.parse(JSON.stringify(this.currentNode));
        }
      },
        //获取机构下用户列表
      getPermUserList() {
        this.loading=true;
        this.oss.get({
          url:'/sys/perm/listUser',
          data:{
            permId:this.currentNode.id,
            current:this.current,
            size:this.size,
          },
          ok:(data,page,code)=>{
            this.userList=data;
            codes=code;
            this.loading=false;
            this.totalSize = page.total;
          }
        })
      },
      /**
       * 点击切换当前页码：
       * @param val：当前页码
       */
      pageFn(val) {
        this.current = val;
        currentPage = val;
        this.loading = true;
        this.getPermUserList();
      },
      /**
       * 点击显示每页条数：
       * @param val：每页条数
       */
      pageSizeFn(val) {
        this.size = val;
        pageSize = val;
        this.loading = true;
        this.getPermUserList();
      },
      //用户列表选中数据
      chooseData(val) {
        this.chooseList = val;
        this.deleteId = [];
        this.chooseList.map(item => {
          this.deleteId.push(item.id);
        })
        // console.log(val);
      },
      //用户新增数据权限
      clickListBtn(name) {
        switch (name) {
          /**F
           * 点击新增时
           */
          case 'add':
            this.$refs.addUserModal.getUserList();
            this.$refs.addUserModal.type = 'dataPerm';
            this.$refs.addUserModal._data.showModal = true;
            break;
          /**
           * 点击删除按钮时的操作：
           * @param name：值为delete
           */
          case 'delete':
            this.oss.showModal({
                    type: 'confirm',
                    title: '确认删除',
                    content: '<p>确定删除这'+this.deleteId.length+'条数据么？</p>',
                    onOk: () => {
                        this.deletePermUser();
                    },
                    onCancel: () => {
                    }
                });
            break;
        }
      },
      /**
       * 删除机构下用户
       * @param orgId
       * @param userId:[]
       */
      deletePermUser(){
        this.oss.post({
          url:'/sys/user/deletePerm',
          data:{
            userId:this.deleteId,
            permId:this.currentNode.id
          },
          ok:(data,page,code)=>{
            this.oss.showMessage({type: 'info', content: '删除成功!'});
            this.getPermUserList();
            this.deleteId=[];
          },
          // err:(error)=>{
          //   this.oss.showModal({
          //       type: 'confirm',
          //       title: '删除提醒',
          //       content: '删除失败'
          //   });
          // }
        })
      },
      switchChange(val){
        this.switchStatus=val;
        //下级为true
        if(this.switchStatus){
          this.formValidate.parentId=this.currentNode.id;
          this.parentName=this.currentNode.title;
        }else{
          //同级
          if(this.root){
            var parentKey= this.root.find(el => el === this.node).parent;
            var parent = this.root.find(el => el.nodeKey === parentKey).node;
            this.parentName=parent.title;
            this.formValidate.parentId=this.currentNode.parentId;
          }else{
            this.parentName='';
            this.formValidate.parentId=this.currentNode.parentId;
          }
        }
      },
      clickBtn(obj){
        this.iconStatus=false;
        // var self=this;
        for(var i in this.saveParams){
          this.saveParams[i]=this.formValidate[i];
        }
        switch(obj.type){
          case 'add':
            this.classObj.requireStar=true;
            this.classObj.notRequireStar=false;
            this.editParent=true;
            this.title='新增节点';
            this.icon='md-add';
            this.isAddEdit='add';
            this.showInput=true;
            this.$refs.showDetail.resetFields();
            if(!this.currentNode){
              this.oss.showMessage({type: 'error', title: '节点提示', content: '请选择父资源主键'});
              return;
            }else{
              this.formValidate.parentId=this.currentNode.id;
            }
            this.switchChange(true);
            break;
          case 'edit':
          if(this.currentNode){
              this.formValidate=JSON.parse(JSON.stringify(this.currentNode));
            }
            this.classObj.requireStar=true;
            this.classObj.notRequireStar=false;
            this.title='编辑节点';
            this.icon='md-create';
            this.isAddEdit='edit';
            this.editParent=false;
            this.showInput=true;
            break;
          case 'delete':
            this.$Modal.confirm({
                content: '<p>确认删除这条数据吗？</p>',
                onOk: () => {
                    this.delete();
                },
                onCancel: () => {
                    this.$Message.info('取消删除');
                }
            });
            break;
          case 'reset':
            this.$refs.showDetail.resetFields();
            break;
          case 'cancel':
            this.change(this.currentNode);
            this.$refs.showDetail.resetFields();
            break;
          case 'save':
            if(this.isAddEdit=='add'){
              this.$refs.showDetail.validate((valid) => {
                if(valid) {
                  if(this.switchStatus==false){
                    this.saveParams.prevId=this.currentNode.id;
                  }
                  this.oss.post({
                    url: '/sys/perm/add',
                    data: this.saveParams,
                    ok:(data)=> {
                      this.getPermList();
                      this.change(this.currentNode);
                      this.$refs.showDetail.resetFields();
                      this.oss.showMessage({type: 'success', content: '添加成功'});
                    }
                  })
                }
              })
            }else if(this.isAddEdit=='edit'){
              this.$refs.showDetail.validate((valid) => {
                if(valid) {
                  this.saveParams.id=this.currentNode.id;
                  this.oss.post({
                    url: '/sys/perm/edit',
                    data: this.saveParams,
                    ok:(data) =>{
                      this.getPermList();
                      this.change(Object.assign(this.currentNode, this.saveParams));
                      this.$refs.showDetail.resetFields();
                      this.oss.showMessage({type: 'success', content: '修改成功'});
                    }
                  })
                }
              })
            }
            break;
        }
      },
      delete() {
        this.oss.post({
          url: '/sys/perm/delete',
          data:{id:this.currentNode.id.toString()},
          ok: (data) => {
            this.getPermList();
            this.currentNode = null;
            this.formValidate = {};
            this.$refs.showDetail.resetFields();
            this.oss.showMessage({type: 'success', content: '删除成功'});
          }
        })
      },
      /**
       * 根据名称模糊查询：
       * @param h
       * @param root
       * @param node
       * @param data
       * @returns {*}
       */
      renderContent(h,{root,node,data}){
        return h('span',{
          style:{
            backgroundColor: data.id==this.treeNodeId?'#d5e8fc':'#FFFFFF',
            fontSize: '14px',
            borderRadius: '3px',
            padding : '2px 4px 2px 4px',
            display : 'inline-block'
          },
          on:{
            click:()=>{
              this.searchVal='';
              this.treeNodeId=data.id;
              this.currentNode = data;
              this.change(data,this);
              this.root = root;
              this.node = node;
            }
          }
        },
        [
            h('span', [
                h('span',{
                    style: {
                        display: 'inline-block',
                    }
                },[
                    h('Icon', {
                        props: {
                            type: data.nodeType == 'U' ? 'ios-person' :  'md-home'
                        },
                        style: {
                            marginRight: '8px'
                        }
                    }),
                    h('span', data.nodeName)
                ]),
            ])
        ]
        );
      },
      iconClick(type){
        var parentKey= this.root.find(el => el === this.node).parent;
        var parent = this.root.find(el => el.nodeKey === parentKey).node;

        var index = parent.children.indexOf(this.currentNode);
        if(type == 'up'){
          if(index==0){

          }else{
            parent.children.splice(index,0, ...parent.children.splice(index-1, 1));
          }
        } else if(type == 'down') {
          parent.children.splice(index+1,0, ...parent.children.splice(index, 1));
        }
        //获取当前顺序的id数组
        var sortIdList=[];
        parent.children.map(item=>{
          sortIdList.push(item.id)
        })
        //向后台发送请求
        this.oss.post({
          url:'/sys/perm/sort',
          data:{
            sortIds:sortIdList
          },
          ok:()=>{
            console.log("成功");
          },
          err:()=>{
            console.log("失败");
          }
        })
      },
      searchFn(data){
        // var self=this;
        var arr=[];
        data.map((item,index)=>{
          if((this.searchVal != '') && item.nodeName.toLowerCase() === this.searchVal.toLowerCase().trim()) {
            this.treeNodeId=item.id;
            this.currentNode=item;
            this.change(item,this);
          }
          if(item.children.length>0){
            this.searchFn(item.children);
          }
        })
      }
    },
    mounted() {
      this.getPermList();
    }
  }
</script>

<style lang="less" >
  @import "./../../assets/css/common";
  #data-permission{
    .w(100%);
    .h(100%);
    .b(@whiteColor);
    overflow: hidden;
    .tree_box,.detail_box,{
      .h(100%);
      float:left;
    }
    .icon{
      .h(15px);
      .w(15px);
    }
    .tree_box{
      .w(250px);
      .p(25px);
      box-shadow: 2px 2px 4px #e6e6e6;
      .ivu-row{
        .ivu-col-span-12{
          float:inherit;
        }
        .ivu-input-wrapper{
          // .w(100%)!important;
          .ivu-input-group-append{
            background:white!important;
            border:none;
          }
        }
      }
      .tree{
        .w(100%);
        padding-top:10px;
        .h(calc(~"100% - 32px"));
        overflow: auto;
        ul li {
          cursor: pointer!important;
        }
        .ivu-tree-children{
          cursor:pointer!important;
        }
      }
    }
    .detail_box{
      .w(calc(~"100% - 250px"));
      .p(40px 80px);
      overflow-x: hidden;
      overflow-y: auto;
      .detail{
        .w(100%);
        //.b(yellow);
        .ivu-form{
          position:relative;
          padding-top:50px;

          .requireStar{
            .ivu-form-item-label:before{
            color:red;
            }
          }
          .notRequireStar{
            .ivu-form-item-label:before{
            color:#fff;
            }
          }

          .title{
            position: absolute;
            top: 4px;
            left: 19px;
            font-size: 16px;
          }
          .btns{
            // text-align:center;
            .ivu-form-item-content{
              margin-left:0;
              &>.ivu-btn{
                margin-right:5px;
              }
            }
          }
        }
      }
    }
   .detailTable{
        margin-top: -20px;
      }
  }
</style>
