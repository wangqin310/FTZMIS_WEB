<template>
  <div id="modal" style="min-width:600px;overflow:auto" >
    <Modal  id="orgChooseUser" v-model="showModal"  width="755" :mask-closable="false" title="标题">
        <Form :label-width="60">
            <Row class="search_wrapper">
                <FormItem label="姓名" style="float:left">
                    <Input  clearable v-model="searchParams.name" size="small" placeholder="请输入姓名" style="width:120px"/>
                </FormItem>
                <FormItem label="登录账号" :label-width="80" style="float:left">
                    <Input  clearable v-model="searchParams.account" size="small" placeholder="请输入登录账号" style="width:120px" />
                </FormItem>
                <Button type="primary" shape="circle" @click="search" style="margin-left:50px;float:left" >查&nbsp;&nbsp;询</Button>
            </Row>
        </Form>
        <div class="table_wrapper">
            <div class="topcheer-oss-table topcheer-oss-table-without-btn">
                <Table :loading="loading" :columns="columns" :data="userList" size="small"
                    @on-selection-change="chooseData"  highlight-row >
                <div slot="footer" class="page_footer">
                    <Page class="page" size="small" v-if="totalSize>0" placement="top" @on-change="pageFn" @on-page-size-change="pageSizeFn"  :total="totalSize"
                        :current="searchParams.current" :page-size="searchParams.size" show-elevator show-sizer show-total></Page>
                </div>
                </Table>
            </div>
        </div>
        <div slot="footer">
            <Button type="primary" @click="addUserList"  :disabled="chooseList.length ==0 ? 'disabled' : false">确定</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
    let codes={};
    let currentPage=1;
    let pageSize=10;
    export default {
        name: 'addUserList',
        props:['currentNode', 'chooseUserList'],
        data () {
            return {
              columns: [    //表头数据
                {type: 'selection', width: 60, align: 'center'},
                {
                    title: '序号', width: 60, align: 'center',
                    render: (h, params) => {
                        return h('div', (params.index + 1) + pageSize * (currentPage - 1));
                    }
                },
                {key: 'permType', title: '权限范围', width: 110, align: 'center'},
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
               loading : true,
               searchParams: {
                    current: 1,   //当前页
                    size: 10,     //每页大小
                    name: '',         //姓名
                    account: '',      //账号
                },
                userList:[],
                totalSize: 0,
                chooseList :[],
                chooseId:[],
                showModal:false,
                type: 'org',
                dataList:[],
                permType:''
            }
        },
        methods: {
            getUserList() {
                this.loading = true;
                this.oss.get({
                    url: '/sys/user/list',
                    data: this.searchParams,
                    ok: (data, page, code) =>{
                        codes=code;
                        this.codeList=code;
                        this.loading = false;
                        this.totalSize = page.total;
                        this.userList = data;
                        this.userList.map(opt => {
                            this.chooseUserList.map(item => {
                                if (item.id == opt.id) {
                                    opt._disabled=true
                                }
                            })
                        })
                    }
                })
            },
            chooseData(val) {
                this.chooseList = val;
                this.chooseId = [];
                this.chooseList.map(item => {
                    this.chooseId.push(item.id);
                })
            },
            /**
             * 点击切换当前页码：
             * @param val：当前页码
             */
            pageFn(val) {
                this.searchParams.current = val;
                currentPage = val;
                this.loading = true;
                this.getUserList();
            },
            /**
             * 点击显示每页条数：
             * @param val：每页条数
             */
            pageSizeFn(val) {
                this.searchParams.size = val;
                pageSize = val;
                this.loading = true;
                this.getUserList();
            },
            /**
             * 查询：
             */
            search() {
                this.loading = true;
                this.searchParams.current=1;
                currentPage=1;
                this.getUserList();
            },
            /**
             * 当为用户添加数据权限的时候，选择是否包含子级节点权限后再触发添加方法
             */
            dataPermAdd(){
                this.dataList = [];
                this.chooseId.map(item=>{
                    this.dataList.push(
                        {
                            "userId":item,
                            "permId":this.currentNode.id,
                            "permType":this.permType
                        }
                    )
                })
                
                this.oss.post({
                    url:'/sys/user/addPerm',
                    data:{
                        userPermJsonArray:JSON.stringify(this.dataList)
                    },
                    ok:()=>{
                        this.oss.showMessage({type: 'info', content: '添加成功!'});
                        this.showModal=false;
                        this.$emit("getPermUserList",null);
                    }
                })
            },
            addUserList(chooseId){
                /**
                 * 根据类型判断添加机构还是数据权限
                 */
                if(this.type == 'dataPerm') {
                    /**
                     * 添加时是否包含子级节点权限
                     */
                    this.oss.showModal({
                        type: 'confirm',
                        title: '确认提示',
                        content: '是否包含子级节点权限',
                        okText:'是',
                        cancelText:'否',
                        onOk: () => {
                            this.permType='C';
                            this.dataPermAdd();
                        },
                        onCancel: () => {
                            this.permType='N';
                            this.dataPermAdd();
                        }
                    });
                }else{
                    this.oss.post({
                        url:'/sys/user/addOrg',
                        data:{
                            id:this.chooseId.toString(),
                            orgId:this.currentNode.id
                        },
                        ok:()=>{
                            this.oss.showMessage({type: 'info', content: '添加成功!'});
                            this.showModal=false;
                            this.$emit("getOrgUserList",null);
                            // this.chooseList.map(item => {
                            //     this.chooseUserList.push(item);
                            // })
                        }
                    })   
                }
            }
        }
    }
</script>
<style lang="less">
  @import "./../../assets/css/common";
    #orgChooseUser {
        .w(100%);
        .orgChooseUser{
            .ivu-modal {
                .ivu-modal-content {
                padding: 0 20px 10px 20px;
                .ivu-modal-close{
                    z-index:99;
                }
                .ivu-modal-body {
                    .p(36px 16px 16px);
                }
                }
            }
        }
        .topcheer-oss-table {
            -webkit-box-shadow: 0px 0px 0px ;
            -moz-box-shadow: 0px 0px 0px;
            box-shadow: 0px 0px 0px ;
        }
        .ivu-table:after {
            width:0px;
        }
    }
  </style>