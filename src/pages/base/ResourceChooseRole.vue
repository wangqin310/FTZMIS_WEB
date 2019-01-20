<template>
    <div id="resource-choose-role-modal">
        <Modal class="resoureChooseRolemodal" width="500" v-model="showModal">
            <div slot="header">
                选择角色
            </div>
            <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:10px;margin-bottom:6px;">
                <Checkbox
                    :value="checkAll"
                    @click.prevent.native="handleCheckAll">全选</Checkbox>
            </div>
            <CheckboxGroup v-model="roleCheckedIds" @on-change="checkAllGroupChange">
                <Checkbox :label="item.id" v-for="(item,index) in roleList" :key="index"><span>{{item.name}}</span></Checkbox>
            </CheckboxGroup>
            <div slot="footer">
                <Button type="primary" @click="addRoleList"  :disabled="roleCheckedIds.length ==0 ? 'disabled' : false">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    let codes = {};
    export default {
        name: 'model',
        props:['chooseUserList', 'currentNode'],
        data() {
            return {
                checkAll: false,
                showModal:false,
                roleList: [],
                roleCheckedIds: []
            }
        },
        methods: {
            getRoleList() {
                this.roleCheckedIds = [];
                this.oss.get({
                    url:'/sys/role/list',
                    ok:(data,page,code)=> {
                        this.chooseUserList.map(item => {
                            data.map((opt, index) => {
                                if(item.id == opt.id) {
                                    data.splice(index, 1);
                                }
                            })
                        });
                        this.roleList = data;
                    }
                });
            },
            handleCheckAll () {
                this.checkAll = !this.checkAll;
                if (this.checkAll) {
                    this.roleList.map(item => {
                        this.roleCheckedIds.push(item.id);
                    })
                } else {
                    this.roleCheckedIds = [];
                }
            },
            checkAllGroupChange (data) {
                if (data.length === this.roleList.length) {
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.checkAll = false;
                } else {
                    this.checkAll = false;
                }
            },
            addRoleList() {
                this.oss.post({
                    url:'/sys/role/addResource',
                    data:{
                        id:this.roleCheckedIds.toString(),
                        resourceId:this.currentNode.id
                    },
                    ok:()=>{
                        console.log(this.roleCheckedIds.toString(),this.currentNode.id);
                        this.oss.showMessage({type: 'info', content: '添加成功!'});
                        this.showModal=false;
                        var chooseList = [];
                        this.roleList.map(item => {
                            if(this.roleCheckedIds.indexOf(item.id) != -1) {
                                chooseList.push(item);
                            }
                        });
                        chooseList.map(item => {
                            this.chooseUserList.push(item);
                        });
                    },
                    err:()=>{
                        this.oss.showMessage({type:'info', content:'添加失败！'});
                    }
                }) 
            }
        }
    }
</script>
<style lang="less">
    @import "./../../assets/css/common";
    .resoureChooseRolemodal {
        .ivu-modal {
            .ivu-modal-body {
                padding: 10px;
                .ivu-checkbox-group-item {
                    width: 24%;
                    margin: 5px auto;
                }
            } 
        }
    }
  
</style>


