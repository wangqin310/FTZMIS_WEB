<template>
  <div>
    <div class="btn-opeater">
        <div class="FilePathDisplay">
          <span class="FilePathFont">文件路径:</span>
          <Input v-model="currentpath" @on-enter='enterpath' type="text" style="width:500px; height:30px;" />
        </div>
        <div class="table_wrapper">
        <div class="topcheer-oss-table topcheer-oss-table-without-btn online-userlist" ref="topcheerOssTable" >
        <Table class="table" :height="tableHeight" size="small" @on-row-click='change' @on-row-dblclick='downloadFile'  :loading="loading"  :columns="columns" :data="dataList">
        </Table>
        </div>
        </div>
    </div>
     <div style="width:530px; height:31px; position:absolute; left:610px; top:40px; ">
          <Upload
            :before-upload="handleUpload"
            action="">
            <Button  type="default" icon="ios-cloud-upload-outline">选择文件</Button>
          </Upload>
          <div v-if="file !== null" style="position:absolute; left:150px;top:1px;">
              上传文件名称: <span class="aut">{{ file.name }}</span>
              <Button type="primary" size="small" @click="upload" :loading="loadingStatus" style="margin-left: 5px;">
                {{ loadingStatus ? '正在上传' : '上传' }}
              </Button>
              <Button type="default" size="small" @click="cnacelUpload">取消</Button>
          </div>
      </div>
  </div>

</template>

<script>
let codeList = {};
export default {
  name: "FileBrowser",
  data() {
    return {
      file: null,
      loadingStatus: false,
      loading: true,
      columns: [
        { type: "index", title: "序号", width: 70 }, //type:'序号固定不变'
        {
          key: "fileName",
          title: "名称",
          sortable: true,
          sortType: "asc",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                //图标样式修改 名称 大小 颜色
                props: {
                  size: 15,
                  type:
                    params.row.fileName === ".."
                      ? "reply"
                      : params.row.directory ? "folder" : "document"
                }
              }),
              h("span", "   " + params.row.fileName)
            ]);
          }
        },
        {
          title: "权限",
          render: (h, params) => {
            return h("div", [
              h("span", params.row.canRead ? "r" : "-"),
              h("span", params.row.canWrite ? "w" : "-"),
              h("span", params.row.canExecute ? "x" : "-")
            ]);
          }
        },
        { key: "lastModifyTime", title: "最近修改日期", sortable: true },
        { key: "fileSizeDesc", title: "大小", sortable: true },
        {
          title: " ",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              params.row.directory
                ? ""
                : [
                    h(
                      "Button",
                      {
                        props: { type: "error", size: "small" },
                        on: {
                          click: () => {
                            this.delete(params.row.fileAbsolutePath);
                          }
                        }
                      },
                      "Delete"
                    )
                  ]
            );
          }
        }
      ],
      dataList: [],
      tableHeight: "", //默认表格高度
      currentpath: "", //当前路径（文件，文件夹）
      defaultPath: "", //默认路径
      fileAbsolutePath: "", //文件路径
      currentdirpath: "" //当前文件夹路径
    };
  },
  methods: {
    refreshData() {
      //重新加载数据 刷新
      var self = this;
      self.loading = true;
      this.oss.get({
        url: "sys/osfile/list",
        ok(data, page, code) {
          codeList = code;
          self.dataList = data;
          self.loading = false;
          self.oss.setTableHeight({
            el: self,
            headAndPageHeight: 32,
            topHeight: 248,
            size: self.dataList.length,
          });
        },
        finish() {
          self.loading = false;
        }
      });
    },
    getDefaultPath() {
      var self = this;
      self.loading = true;
      this.oss.get({
        url: "sys/osfile/defaultPath",
        ok(data) {
          self.currentpath = data;
          self.defaultPath = data;
          self.loading = false;
        },
        finish() {
          self.loading = false;
        }
      });
    },
    getData() {
      var self = this;
      var dirName = self.defaultPath;
      self.loading = true;
      this.oss.get({
        url: "sys/osfile/list",
        data: { dirName: dirName },
        ok(data, page, code) {
          codeList = code;
          self.dataList = data;
          self.loading = false;
          self.oss.setTableHeight({
            el: self,
            size: self.dataList.length,
            headAndPageHeight: 32,
            topHeight: 120,
          });
        },
        finish() {
          self.loading = false;
          //          self.currentpath = self.currentdirpath;
          //          self.defaultPath = self.currentdirpath;
        }
      });
    },
    handleUpload(file) {
      this.file = file;
      return false;
    },
    cnacelUpload() {
      this.file = null;
    },
    upload() {
      this.loadingStatus = true;
      let self = this;
      var file = self.file;
      var dirName = self.defaultPath;
      var hhh = dirName; //定义上传成功显示文件路径 + "/" + file.name
      this.oss.post({
        action: "upload",
        url: "/sys/osfile/upload",
        data: {
          file: file,
          dirName: dirName
        },
        ok: () => {
          self.loadingStatus = false;
          self.getData();
          self.currentpath = hhh; //上传成功显示路径
          self.file = null; //上传成功上传按钮隐藏
          self.oss.showMessage({ type: "success", content: "上传成功" });
        },
        finish() {
          self.loadingStatus = false;
        }
      });
    },
    change(val) {
      if (val.directory) {
        this.currentpath = val.fileAbsolutePath;
        this.currentdirpath = this.defaultPath;
        this.defaultPath = this.currentpath;
        this.getData();
      } else {
        this.currentpath = val.fileAbsolutePath.substring(
          0,
          val.fileAbsolutePath.lastIndexOf("/")
        );
      }
    },
    enterpath() {
      let self = this;
      self.currentdirpath = self.defaultPath; //目录不存在 显示当前目录路径
      self.defaultPath = self.currentpath;
      self.getData();
    },
    downloadFile(val) {
      this.currentpath = val.fileAbsolutePath;
      var downpath = val.fileAbsolutePath;
      var isDir = val.directory;
      if (!isDir) {
        this.download(downpath);
      }
    },
    download(downpath) {
      let self = this;
      this.oss.get({
        action: "download",
        url: "/sys/osfile/download",
        data: {
          fileAbsolutePath: downpath
        },
        ok: () => {
          self.oss.showMessage({ type: "success", content: "正在下载文件..." });
        },
        finish() {
          self.loadingStatus = false;
        }
      });
    },

    delete(qw) {
      let self = this;
      this.oss.showModal({
        type: "confirm",
        title: "确认删除",
        content: "<p>确定删除这条数据么？</p>",
        onOk: () => {
          this.oss.get({
            url: "/sys/osfile/delete",
            data: {
              fileAbsolutePath: qw
            },
            ok: () => {
              self.loadingStatus = false;
              self.currentpath = self.defaultPath;
              self.getData();
            },
            err: (errmsg, errDetail) => {
              setTimeout(() => {
                let config = {
                  type: 'error',
                  title: '失败提醒',
                  errDetail: errDetail,
                  content: errmsg
                }
                self.oss.showModal(config);
              }, 500)
            }
          });
        },
        onCancel: () => {}
      });
    }
  },

  mounted() {
    this.refreshData();
    this.getDefaultPath();
  }
};
</script>

<style lang="less" scoped>
@import "./../../assets/css/common";
.btn-opeater {
  overflow:hidden;
  position: relative;
}
.aut {
  display: inline-block;
  width: 148px;
  height: 15px;
  line-height: 23px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.FilePathDisplay {
  /*文件路径显示*/
  width: 630px;
  height: 30px;
  position: relative;
  left: 272px;
  top: -6px;
  margin: 10px 10px 10px -252px;
}
.FilePathFont {
  /*文件路径字体样式*/
  font-size: 16px;
  font-family: PingFang SC;
  position: relative;
  top: 4px;
  left: -15px;
}
.topcheer-oss-table {
  overflow: hidden;
  .h(100%);
  .table {
    &.ivu-table-wrapper {
      border: "";
      border-left: 1px solid #e6e6e6;
      border-top: 1px solid #e6e6e6;
      .h(calc(~"100% + 50px"))!important;
      .ivu-table {
        overflow: auto;
        border-radius: 10px !important;
      }
    }
  }
}
</style>
