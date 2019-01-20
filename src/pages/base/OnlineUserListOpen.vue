<template>
    <div>
      <Table size="small" :columns="columns" :data="childData" border=""></Table>
    </div>
</template>

<script>

    export default {
        props: {
            row: Object
        },
        data(){
          return{
            columns:[
              {title:'IP', key:'ipAddr', width: 122,align:'center'},
              {title:'操作系统', key:'osName',align:'center'},
              {title:'浏览器', key:'browser',align:'center'},
              {title:'登陆时间', key:'startTimestamp',align:'center'},
              {title:'最后访问时间', key:'lastAccessTime',align:'center'},
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
                            this.tichu(params.row.sessionId);
                          }
                        }
                      },
                      "踢出"
                    )
                  ]
            );
          }
        }
            ],
            childData:[]
          }
        },
        methods:{
            tichu(sessionId) {
      this.oss.post({
        url: "/sys/user/removeOnLineInfo",
        data: { sessionId: sessionId },
        ok:(data, page, code) =>{
          this.oss.showMessage({content:'执行成功'});
        this.$emit("refreshData");

        },
        err(err) {
           this.oss.showMessage({content:'执行失败'});
        }
      });
    },
        },
        created(){
          this.childData=this.row.onLineInfoList;
        }

    };
    
</script>

<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
