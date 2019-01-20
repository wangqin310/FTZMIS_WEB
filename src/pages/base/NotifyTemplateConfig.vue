<template>
  <div id="notifyTemplateConfig">
    <Row class="search_wrapper">
      <Form :label-width="80">
          <FormItem  label="通知类型" >
            <Select class="selects" v-model="searchParams.notifyType" size="small" @on-change="selectStatus" placeholder="请选择通知类型" style="width:130px">
              <Option value="">所有类型</Option>
              <Option v-for="(item,index) in codeList.notifyType" :value="index" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem  label="服务商模板ID" :label-width="100">
            <Input clearable v-model="searchParams.templateId" size="small" style="width:130px" placeholder="请输入服务商模板ID"/>
          </FormItem>
          <FormItem  label="模板名称">
            <Input clearable v-model="searchParams.templateName" size="small" style="width:130px" placeholder="请输入模板名称"/>
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
        <Table class=""  :loading="loading" :columns="columns" :height="tableHeight" :data="dataList" size="small"
               @on-selection-change="chooseData"  @on-row-dblclick="showRowDataDetail" highlight-row >
          <div slot="footer" class="page_footer">
            <Page class="page" size="small" v-if="total>0" placement="top" @on-change="pageFn" @on-page-size-change="pageSizeFn"  :total="total"
                  :current="searchParams.current" :page-size="searchParams.size" :page-size-opts="oss.pageSizeOpts" show-elevator show-sizer show-total></Page>
          </div>
        </Table>
      </div>
    </div>
    <notifyTemplate-add-edit class="addEditModal" ref="addEditModal" :codeList="codeList"
                   :formValidate="formValidate" @getNotifyTemplateList="getNotifyTemplateList" :modal="modal"></notifyTemplate-add-edit>
  </div>
</template>
<script>
  import NotifyTemplateAddEdit from './NotifyTemplateAddEdit.vue'
  import pageButtonList from '@/components/PageButtonList.vue'

  let codes = {};
  let currentPage = 1;  //当前页数
  let pageSize = 10;
  export default {
    name: 'NotifyTemplateConfig',
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
          {key: 'notifyType', title: '通知类型', width: 100,align: 'center',render: (h, params) => {
            return h('span', params.row.notifyType == '' ? '' : codes['notifyType'][params.row.notifyType])
          }},
          {key: 'templateId', title: '服务商模板id', width: 270, sortable: true, align:'center',ellipsis:true},
          {key: 'templateName', title: '模板名称', width: 130, edit: 'text', align:'center'},
          {key: 'templateTitle', title: '模板标题', width: 140, sortable: true, align:'center'},
          {key: 'templateContent', title: '模板内容', width: 270, align:'center',ellipsis:true},
          {key: 'createUser', title: '创建人员', width: 100, align:'center'},
          {key: 'createTime', title: '创建时间', width: 160, sortable: true, align:'center'},
          {key: 'modifyUser', title: '修改人员', width: 100, align:'center'},
          {key: 'modifyTime', title: '修改时间', width: 160, sortable: true, align:'center'},
          {key: 'remark', title: '备注', width: 100,ellipsis:true, align:'center'}
        ],
		// btnList: [],
        codeList: [],
        tableHeight: '', //默认表格的高度
        total: 0,
        size: 0,     //每页大小
        searchParams:{   //查询条件
          current: 1,
          size: 10,
          notifyType: '',
          templateId: '',
          templateName: '',
          templateStatus: ''
        },
        deleteId:[],    //选中的id集合
        dataList:[],
        formValidate:{
          id:'',
          notifyType:'',
          templateId:'',
          templateName:'',
          templateTitle:'',
          templateContent:'',
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
      NotifyTemplateAddEdit,
      pageButtonList
    },
    methods: {
      getNotifyTemplateList(){
        var self=this;
        this.oss.get({
          url: '/sys/notifyTemplate/list',
          data: self.searchParams,
          ok(data, page, code) {
            codes=code;
            self.codeList=code;
            self.loading = false;
            self.total = page.total;
            self.size = page.size;
            self.dataList = data;
            self.chooseList = [];
            self.deleteId=[];
            self.oss.setTableHeight({
              el: self,
              size: self.size
            });
          }
        });
      },
      clickBtn(item) {
        switch (item.code) {
          case 'add':
            this.modal.text = '新增模板';
            this.modal.type = 'add';
            this.modal.icon = 'md-person-add';
            this.$refs.addEditModal._data.showModal = true;
            this.$refs.addEditModal.$refs.formModal.resetFields();
            this.formValidate.templateTitle=this.oss.companyName;
            break;
          case 'edit':
            this.modal.text = '编辑模板';
            this.modal.type = 'edit';
            this.modal.icon = 'ios-create';
            var self = this;
            if (this.chooseList.length == 1) {
              this.$refs.addEditModal._data.showModal = true;
              this.formValidate = {
                id:this.chooseList[0].id,
                notifyType:this.chooseList[0].notifyType,
                templateId: this.chooseList[0].templateId,
                templateName: this.chooseList[0].templateName,
                templateTitle: this.chooseList[0].templateTitle,
                templateContent: this.chooseList[0].templateContent,
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
          url: '/sys/notifyTemplate/delete',
          data: {id: self.deleteId.toString()},
          ok(data) {
            for (var i = 0; i <= self.deleteId.length; i++) {
              self.dataList.map((item, index) => {
                if (self.deleteId[i] == item.id) {
                  self.dataList.splice(index, 1);
                }
              })
            }
            if (self.codeList.length == 0) {
              self.searchParams.current -= 1;
              currentPage = self.searchParams.current;
            }
            self.oss.showMessage({type: 'success', content: '删除成功'});
            self.getNotifyTemplateList();
            self.total = self.total - self.deleteId.length;
            self.chooseList = [];
            self.deleteId=[];
          },
          err(err) {
            self.oss.showMessage({type: 'error',title: '异常提示', content: '删除失败'});
          }
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
        var self = this;
        this.chooseList.map(item => {
          self.deleteId.push(item.id);
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
        this.getNotifyTemplateList();
      },
      /**
       * 点击显示每页条数：
       * @param val：每页条数
       */
      pageSizeFn(val) {
        this.searchParams.size = val;
        pageSize = val;
        this.loading = true;
        this.getNotifyTemplateList();
      },
      /**
       * 查询：
       */
      search(){
        this.searchParams.current=1;
        currentPage=1;
        this.getNotifyTemplateList();
      },
      /**
       * 双击当前行查看详细信息
       */
      showRowDataDetail(row){
        this.oss.showModal({
          type: 'info',
          title: '通知模板配置详细信息',
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
      selectStatus(val){
      },
    },
    mounted() {

    },
    created(){
      this.getNotifyTemplateList();
    }
  }
</script>
<style lang="less">
  @import "./../../assets/css/common";
  // @import "./../../assets/css/content";
  #notifyTemplateConfig{
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
