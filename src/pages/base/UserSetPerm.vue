<template>
    <div class="user-set-perm-modal" id="user-set-org-modal">
        <Modal class="personalUserSetPermmodal" width="500" v-model="showModal"  @on-cancel="reset">
            <h3 slot="header" style="padding: 5px 5px; font-size: 16px">
                <Icon :type="modal.icon" size="20"></Icon>
                {{modal.text}}
            </h3>
            <div>
                <span>节点名称</span>
                <span style="display:inline-block; float: right; marginRight: 15px;">
                    <span style="width: 25%; marginRight: 15px;">包含子节点权限</span>
                    <span style="width: 25%; ">仅当前节点权限</span>
                    
                </span>
            </div>
            <Tree :data="userPermList" multiple :render="renderContent" ref="permTree"></Tree>
            <div slot="footer">
                <Button type="primary" @click="savePerm">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    let codes = {};
    export default {
        name: 'model',
        props:['userPermList','modal', 'deleteId'],
        data() {
            return {
                submitParams : [],
                permSelectedList: [],
                showModal:false,
                currentId: -1
            }
        },
        methods: {
            renderContent(h,{root,node,data})  {
                var self = this;
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%',
                        background: data.id == this.currentId ? '#F5EEEC' : 'white'
                    },
                    on: {
                        mouseenter: (event) => {
                            this.currentId = data.id;
                        },
                        mouseout: (event) => {
                            this.currentId = -1;
                        }
                    }
                },[
                    h('span', {
                        style: {
                            
                        },
                    },[
                        h('span',{
                            style: {
                                display: 'inline-block',
                            }
                        },[
                            h('Icon', {
                                props: {
                                    type: data.nodeType == 'U' ? 'person' : (data.nodeType == 'O' ? 'home' : '')
                                },
                                style: {
                                    marginRight: '8px'
                                }
                            }),
                            h('span', data.title)
                        ]),
                            h('span',{
                            style: {
                                display: 'inline-block',
                                float: 'right',
                                marginRight: '15px'
                            }
                        },[
                            h('Checkbox', {
                                style: {
                                    width: '100px',
                                    display: data.children.length > 0 ? 'inline-block' : 'none',
                                },
                                props: {
                                    value : data.selected && data.permType == 'C',
                                    disabled: data.selected == true && data.permType == 'N'
                                },
                                on: {
                                    'on-change': (checked) => {
                                        if(checked) {
                                            data.selected = true;
                                            data.permType = 'C'
                                        } else {
                                            data.selected = false;
                                        }
                                    }
                                }
                            }),
                            h('Checkbox', {
                                style: {
                                    display: 'inline-block',
                                    marginRight: '45px',
                                },
                                props: {
                                    value : data.selected && data.permType == 'N',
                                    disabled: data.selected == true && data.permType == 'C'
                                },
                                on: {
                                    'on-change': (checked) => {
                                        if(checked) {
                                            data.selected = true;
                                            data.permType = 'N';
                                        } else {
                                            data.selected = false;
                                        }
                                    }
                                }
                            }),
                        ])
                    ])
                    
                    
                ])
            },
            savePerm() {
                var self = this;
                this.permSelectedList = this.$refs.permTree.getSelectedNodes();
                this.permSelectedList.map((item) => 
                    self.submitParams.push({permId: item.id, permType: item.permType})
                );
                if(this.submitParams.length == 0) {
                    this.$emit("savePerm",this.submitParams, 'clear');
                } else {
                    if(this.modal.text.indexOf('追加') != -1) {
                        this.$emit("savePerm",this.submitParams, 'append');
                    } else {
                        this.$emit("savePerm",this.submitParams, 'reset');
                    }
                }
                this.permSelectedList = [];
                this.submitParams = [];
            },
            reset() {
                this.permSelectedList = [];
                this.submitParams = [];
                this.$emit("reset",'');
            }
        }
    }
</script>
<style lang="less">
    @import "./../../assets/css/common";
    .personalUserSetPermmodal{
        .ivu-modal {
            .ivu-modal-body {
                height: 350px;
                overflow-y: scroll;
                .ivu-checkbox-group-item {
                    width: 20%;
                }
            } 
        }
    } 
</style>


