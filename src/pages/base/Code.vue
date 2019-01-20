<template>
  <div id="code">
    <Row class="search_wrapper">
      <Form :label-width="80">
          <FormItem  label="类型代码" >
            <Input  clearable v-model="searchParams.typeCode" size="small" style="width:120px" placeholder="请输入类型代码"/>
          </FormItem>
          <FormItem  label="类型名称" >
            <Input  clearable v-model="searchParams.typeName" size="small" style="width:120px" placeholder="请输入类型名称"/>
          </FormItem>
          <FormItem  label="条目代码" >
            <Input  clearable v-model="searchParams.itemCode" size="small" style="width:120px" placeholder="请输入条目代码"/>
          </FormItem>
          <FormItem  label="条目名称" >
            <Input clearable v-model="searchParams.itemName" size="small" style="width:120px" placeholder="请输入条目名称"/>
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
        <Table  :loading="loading" :columns="columns" :height="tableHeight" :data="dataList" size="small"
               @on-selection-change="chooseData"  @on-row-dblclick="showRowDataDetail" highlight-row >
          <div slot="footer" class="page_footer">
            <Page class="page" size="small" v-if="total>0" placement="top" @on-change="pageFn" @on-page-size-change="pageSizeFn"  :total="total"
                  :current="searchParams.current" :page-size="searchParams.size" :page-size-opts="oss.pageSizeOpts" show-elevator show-sizer show-total></Page>
          </div>
        </Table>
      </div>
    </div>
    <code-add-edit class="addEditModal" ref="addEditModal" :codeList="codeList"
                   :formValidate="formValidate"  :modal="modal" @getCodeList="getCodeList"></code-add-edit>
  </div>
</template>
<script>
  import CodeAddEdit from './CodeAddEdit.vue'
  import pageButtonList from '@/components/PageButtonList.vue'

  let codes = {};
  let currentPage = 1;  //当前页数
  let pageSize = 10;
  export default {
    name: 'Code',
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
          {key: 'systemCode', title: '所属系统', width: 110, sortable: true , align:'center'},
          {key: 'typeCode', title: '类型代码', width: 150, sortable: true, align:'center'},
          {key: 'typeName', title: '类型名称', width: 130, edit: 'text', align:'center'},
          {key: 'itemCode', title: '条目代码', width: 110, sortable: true, align:'center'},
          {key: 'itemName', title: '条目名称', width: 100, align:'left', tooltip: true},
          {key: 'itemSort', title: '条目排序', width: 90, align:'center'},
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
                    "on-change": () => {
                      if(params.row.status==='1'){
                        params.row.status='0';
                      }else{
                        params.row.status='1';
                      }
                      this.oss.post({
                        url: "/sys/code/edit",
                        data: params.row,
                        ok: (data, page, code) =>{
                          this.oss.showMessage({type: 'success', content: '修改状态成功'});
                        },
                        // err: (error) =>{
                        //   this.oss.showModal({
                        //       type: 'confirm',
                        //       title: '失败提醒',
                        //       content: '修改状态失败'
                        //   });
                        // }
                      });
                    }
                  }
                },
                [
                  h(
                    "span",
                    {
                      slot: "open"
                    },
                    "有效"
                  ),
                  h(
                    "span",
                    {
                      slot: "close"
                    },
                    "无效"
                  )
                ]
              );
            }
          },
          {key: 'attr1', title: '扩展属性1', width: 100,ellipsis:true, align:'center'},
          {key: 'attr2', title: '扩展属性2', width: 100,ellipsis:true, align:'center'},
          {key: 'attr3', title: '扩展属性3', width: 100,ellipsis:true, align:'center'},
          {key: 'attr4', title: '扩展属性4', width: 100,ellipsis:true, align:'center'},
          {key: 'attr5', title: '扩展属性5', width: 100,ellipsis:true, align:'center'},
          {key: 'createUser', title: '创建人员', width: 100, align:'center'},
          {key: 'createTime', title: '创建时间', width: 160, sortable: true, align:'center'},
          {key: 'modifyUser', title: '修改人员', width: 100, align:'center'},
          {key: 'modifyTime', title: '修改时间', width: 160, sortable: true, align:'center'},
          {key: 'remark', title: '备注', width: 100,ellipsis:true, align:'center'}
        ],
        // btnList: [   //按钮列表
          // {text: '新 增', icon: 'md-add', type: 'primary', name: 'add'},
          // {text: '修 改', icon: 'md-create', type: 'primary', name: 'edit'},
          // {text: '删 除', icon: 'md-close', type: 'error', name: 'delete'}
        // ],
        codeList: [],
        total: 0,
        size: 0,   //每页大小
        searchParams:{   //查询条件
          current: 1,
          size: 10,
          typeCode: '',
          typeName: '',
          itemCode: '',
          itemName: ''
        },
        deleteId:[],    //选中的id集合
        dataList:[],
        tableHeight: '',  //默认表格高度
        formValidate:{
          id:'',
          systemCode:'',
          typeCode:'',
          typeName:'',
          itemCode:'',
          itemName:'',
          itemSort:null,
          attr1:'',
          attr2:'',
          attr3:'',
          attr4:'',
          attr5:'',
          status:'1',
          remark:'',
        },
        modal: {
          text: '',  //弹框标题：新增还是编辑
          type: '',   //add:新增，edit：编辑
          icon: ''
        },

        chooseList:[]
      }
    },
    components:{
      CodeAddEdit,
      pageButtonList
    },
    methods: {
      getCodeList(){
        this.oss.get({
          url: '/sys/code/list',
          data: this.searchParams,
          ok: (data, page, code) =>{
            codes=code;
            this.codeList=code;
            this.loading = false;
            this.total = page.total;
            this.size = page.size;
            this.dataList = data;
            this.chooseList = [];
            this.deleteId=[];
            this.oss.setTableHeight({
              el: this,
              size: this.size
            });
          }
        });
      },
      clickBtn(item) {
        switch (item.code) {
          case 'add':
            this.modal.text = '新增代码';
            this.modal.type = 'add';
            this.modal.icon = 'md-person-add';
            this.$refs.addEditModal._data.showModal = true;
            this.$refs.addEditModal.$refs.formModal.resetFields();
            this.formValidate.attr1='';
            this.formValidate.attr2='';
            this.formValidate.attr3='';
            this.formValidate.attr4='';
            this.formValidate.attr5='';
            break;
          case 'edit':
            this.modal.text = '编辑代码';
            this.modal.type = 'edit';
            this.modal.icon = 'ios-create';
            if (this.chooseList.length == 1) {
              this.$refs.addEditModal._data.showModal = true;
              this.formValidate = {
                id:this.chooseList[0].id,
                systemCode:this.chooseList[0].systemCode,
                typeCode: this.chooseList[0].typeCode,
                typeName: this.chooseList[0].typeName,
                itemCode: this.chooseList[0].itemCode,
                itemName: this.chooseList[0].itemName,
                itemSort: this.chooseList[0].itemSort,
                attr1: this.chooseList[0].attr1,
                attr2: this.chooseList[0].attr2,
                attr3: this.chooseList[0].attr3,
                attr4: this.chooseList[0].attr4,
                attr5: this.chooseList[0].attr5,
                remark: this.chooseList[0].remark,
              }
            }  else if (this.chooseList.length > 1 ) {
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
              this.delConfirm();
            } else {
              this.oss.showMessage({type: 'warning', content: '请选择需要删除的数据'});
            }
            break;
        }
      },
      /**
       * 删除数据
       */
      delete() {
        this.oss.post({
          url: '/sys/code/delete',
          data: {id: this.deleteId.toString()},
          ok: (data) =>{
            this.oss.showMessage({type: 'success', content: '删除成功'});
            this.getCodeList();
          },
          // err: (error) =>{
          //   this.oss.showModal({
          //       type: 'confirm',
          //       title: '删除失败',
          //       content: '删除失败'
          //   });
          // }
        })
      },
      delConfirm () {
        this.oss.showModal({
            type: 'confirm',
            title: '确认删除',
            content: '<p>确认删除所选的'+this.deleteId.length+'条数据吗？</p>',
            onOk: () => {
                this.delete();
            }
        });
      },
      /**
       * 选中的数据
       */
      chooseData(val){
        this.chooseList = val;
        this.deleteId = [];
        this.chooseList.map(item => {
          this.deleteId.push(item.id);
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
        this.getCodeList();
      },
      /**
       * 点击显示每页条数：
       * @param val：每页条数
       */
      pageSizeFn(val) {
        this.searchParams.size = val;
        pageSize = val;
        this.loading = true;
        this.getCodeList();
      },
      /**
       * 查询：
       */
      search(){
        this.searchParams.current=1;
        // pageSize=0;
        currentPage=1;
        this.getCodeList();
      },
      showRowDataDetail(row){
        this.oss.showModal({
          type: 'info',
          title: '代码详细信息',
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
    created() {
      this.getCodeList();
    },
  }
</script>
<style lang="less">
  @import "./../../assets/css/common";
  // @import "./../../assets/css/content";
  #code{
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
