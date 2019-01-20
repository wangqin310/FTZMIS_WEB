<template>
  <div id="DocumentManagement">
    <Row class="search_wrapper">
      <Form :label-width="90">
          <FormItem  label="文件名称" >
            <Input clearable class="inputs" v-model="searchParams.fileName" size="small" placeholder="请输入文件名称" style=" width:180px"/>
          </FormItem>
          <Button type="primary" shape="circle" @click="search" style="margin-left:50px">查&nbsp;&nbsp;询</Button>
      </Form>
    </Row>
    <!-- 按钮组件 -->
     <page-button-list @btnClick="clickBtn" :datakey="$route.query.datakey"></page-button-list>

    <!-- <ul class="btns_ul">
      <li class="btns_li" v-for="(item,index) in btnList" :key="index">
        <Button :type="item.type" :icon="item.icon" :disabled="(item.name=='edit'&&(deleteId.length==0||deleteId.length>=2))||(item.name=='delete'&&deleteId.length==0)?'disabled':false"  @click="clickBtn(item.name)">{{item.text}}</Button>
      </li>
    </ul> -->
    <div style="width:530px; height:10px; position:relative; left:112px; top:-43px; ">
          <Upload
            :before-upload="handleUpload"
            action="">
            <Button  type="default" icon="ios-cloud-upload-outline">选择文件</Button>
          </Upload>
          <div v-if="file !== null" style="width:530px; height:31px; position:absolute; left:125px; top:2px;  ">
              {{ file.name }}
              <Button type="text" @click="upload" :loading="loadingStatus">
                {{ loadingStatus ? '正在上传' : '开始上传' }}
              </Button>
              <Button type="default" size="small" @click="cnacelUpload">取消上传</Button>
          </div>
      </div>
    <div class="table_wrapper">
      <div class="topcheer-oss-table topcheer-oss-table-without-btn time-task" ref="topcheerOssTable">
        <Table ref="selection" @on-row-dblclick="showRowDataDetail" :height="tableHeight" :loading="loading" :columns="columns" :data="taskList"
               @on-selection-change="chooseData" @on-row-click='bbb' size="small">
        <div slot="footer" class="page_footer">
          <Page class="page" v-if="totalSize>0" placement="top" @on-change="pageFn" @on-page-size-change="pageSizeFn" :total="totalSize"
             :current="searchParams.current" :page-size-opts="oss.pageSizeOpts" show-elevator show-sizer show-total size="small"></Page>
        </div>
        </Table>
      </div>
    </div>
    <task-add-edit class="addEditModal" ref="addEditModal" :codeList="codeList"
    :formValidate="formValidate" :ruleValidate="ruleValidate" :modal="modal" @save="save" @reset="reset"></task-add-edit>
  </div>
</template>

<script>
import TaskAddEdit from "./DocumentManagementAdd.vue"
import pageButtonList from '@/components/PageButtonList.vue'

let codes = {};
let currentPage = 1; //当前页数
let pageSize = 10;
export default {
  name: "DocumentManagement",
  data() {
    return {
      file: null,
      loadingStatus: false,
      date: "",
      loading: true,
      columns: [
          { type: "selection", width: 80, align: "center" },
          {
          title: "序号",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("div", params.index + 1 + pageSize * (currentPage - 1));
          }
        },
          {key: 'fileName', title: '文件名称', width: 230 , align: 'center',
          render: (h, params) => {
          return h('div', [
            h('a', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                click: ()=>{
                  this.download();
                }
              }
            },params.row.fileName)
          ])
          }
          },
          {key: 'fileExt', title: '文件后缀名', width: 120, align: 'center' },
          {key: 'fileSizeDesc', title: '文件大小', width: 120, align: 'center'},
          {key: 'fileSrc', title: '文件来源', width: 120, align: 'center'},
          {key: 'createUser', title: '创建人员', width: 100 , align: 'center'},
          {key: 'createTime', title: '创建时间', width: 200, align: 'center'},
          {key: 'modifyUser', title: '修改人员', width: 160, align: 'center'},
          {key: 'modifyTime', title: '修改时间', width: 180, align: 'center'},
          {key: 'remark', title: '备注', width: 120, align: 'center',ellipsis:true}
      ],
      // btnList: [
      //   //按钮列表
      //   { text: "修 改", icon: "md-create", type: "primary", name: "edit" },
      // ],
      taskList: [],
      tableHeight: '',  //默认表格高度
      totalSize: 0,
      size: 0,  //每页大小
      loading: true,
      searchParams: {
        current: 1,
        size: 10,
        fileName:"",
      },
      deleteId: [],
      codeList: [],
      formValidate: {
        fileName:"",
      },
      modal: {
        text: "",
        type: "",
        icon: ""
      },
      ruleValidate: {
        fileName: [
            { required: true, message: "文件名不能为空", trigger: "blur" }
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
     bbb(val) { //下载
      var downpath = val.id;
      var isDir = val.directory;
      if (!isDir) {
        this.download(downpath);
      }
    },
    download(downpath) {//下载
      let self = this;
      this.oss.post({
        action: "download",
        url: "/sys/file/download",
        data: {
          id: downpath
        },
        finish() {
          self.loadingStatus = false;
        }
      });
    },
    cnacelUpload() {
      this.file = null;
    },
   showRowDataDetail(row){
        this.oss.showModal({
          type: 'info',
          title: '文档管理',
          width: 500,
          okText: '关闭',
          render: (h) => {
            return h('tableRowDataDetail', {
              props: {
                columns: this.columns,
                dataRow: row,
                codes: {}
              }
            })
          }
        });
      },
    handleUpload(file) { //上传
      this.file = file;
      return false;
    },
    upload() {//上传
      this.loadingStatus = true;
      let self = this;
      var file = self.file;
      this.oss.post({
        action: "upload",
        url: "/sys/file/upload",
        data: {
          file: file,
        },
        ok: () => {
          self.loadingStatus = false;
          self.getTaskList(self.searchParams, self);
          self.file = null; //上传成功上传按钮隐藏
          self.oss.showMessage({type: 'success', content: '上传成功'});
        },
        finish() {
          self.loadingStatus = false;
        }
      });
    },
    getTaskList(searchParams, self) {//获取数据
      this.oss.get({
        url: "/sys/file/list",
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
            topHeight: 210,
            headAndPageHeight: 80,
            size: self.size
          });
        }
      });
    },
    chooseData(val) {
      this.chooseList = val;
      this.deleteId = [];
      var self = this;
      this.chooseList.map(item => {
        self.deleteId.push(item.id);
      });
    },

    clickBtn(name) {
      switch (name) {
        case "edit":
          this.modal.text = "编辑文件";
          this.modal.type = "edit";
          this.modal.icon = "ios-create";
          var self = this;
          if (this.chooseList.length == 1) {
            this.$refs.addEditModal._data.showModal = true;
            this.formValidate = {
              id: this.chooseList[0].id,
              fileName: this.chooseList[0].fileName,
              remark: this.chooseList[0].remark,
            };
          }
          break;
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
      if (val.type == "edit") {
        /**
         * 编辑角色：
         */
        this.$refs.addEditModal.$refs.formModal.validate(valid => {
          if (valid) {
            this.oss.post({
              url: "/sys/file/edit",
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
      this.searchParams.current = 1;
      currentPage = 1;
      // Object.assign(this.searchParams, this.c);
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
#DocumentManagement {
  .w(100%);
    .h(95%);
    .ivu-form{
      height: 100%;
      display: flex;
      align-items: center;
    }
    .ivu-form-item{
      margin-bottom: 0px;
    }
  .table_wrapper {
    .h(calc(~"100% - 100px"));
  }
}
// .main_page {
//   .main {
//     .content_wrapper {
//       overflow: hidden;
//       .content {
//         overflow: hidden;
//       }
//     }
//   }
// }
</style>




