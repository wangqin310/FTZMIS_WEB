<template>
    <div class="role-assign-resource-modal" id="role-assign-resource-modal">
        <Modal class="roleAssignResourceModal" width="500" v-model="showModal"  @on-cancel="reset" @on-ok="saveResource" ok-text="保存">
            <h3 slot="header" style="padding: 5px 5px; font-size: 16px">
                <Icon :type="modal.icon" size="20"></Icon>
                {{modal.text}}
            </h3>
            <Input v-model="searchVal" clearable  @on-change="searchFn(resourceList)" icon="search" placeholder="请根据名称查询"></Input>
            <Tree :data="oriResourceList" ref="tree" show-checkbox multiple ></Tree>
        </Modal>
    </div>
</template>
<script>
    let codes = {};
    export default {
        name: 'model',
        props:['resourceList','modal', 'oriResourceList'],
        data() {
            return {
                searchVal: '',
                resourceSelectIds : [],
                resourceSelectedList: [],
                showModal:false
            }
        },
        methods: {
            checkedNode(list, checkedIds) {
                list.map((resource) => {
                    if(checkedIds.indexOf(resource.id) > -1) {
                        resource.checked = true;
                    }
                    if(resource.children.length > 0) {
                        this.checkedNode(resource.children, checkedIds);
                    }
                })
            },
            searchFn() {
                // 每次搜索之前要先判断有哪些节点是被选过的，把它遍历到主树上去
                var checkedNode = this.$refs.tree.getCheckedNodes();
                var checkedIds = [];
                checkedNode.map((item) => {
                    if(item.children.length == 0) { // 只取子节点上勾选的数据
                        checkedIds.push(item.id);
                    }
                });
                if(checkedIds.length > 0) this.checkedNode(this.resourceList, checkedIds);
                
                //继续搜索其他元素
                var newArr = JSON.parse(JSON.stringify(this.resourceList));
                this.oriResourceList.splice(0, this.oriResourceList.length);
                if(this.searchVal != '') {
                    newArr = this.searchFilter(newArr);
                }
                newArr.map((item) => {
                    this.oriResourceList.push(item);
                })
            },
            searchFilter(tree) {
                let result = []
                // filter 遍历
                result = tree.filter((item) => {
                    // 如果名字相等
                    if (item.name.indexOf(this.searchVal) > -1) {
                        item.selected = true
                        return true
                    // 如果有子节点，递归子节点
                    // 如果有名字相等的，返回的值应该为非空数组
                    } else if (item.children && item.children.length > 0) {
                        item.expand=true
                        item.children = this.searchFilter(item.children)
                        return item.children.length > 0
                    // 抛弃
                    } else {
                        return false
                    }
                })
                return result
            },

            saveResource() {
                var self = this;
                this.resourceSelectedList = this.$refs.tree.getCheckedNodes();
                this.resourceSelectedList.map((item) =>
                    self.resourceSelectIds.push(item.id)
                );
                this.$emit("assignResource",this.resourceSelectIds);
                this.resourceSelectedList = [];
                this.resourceSelectIds = [];
            },
            reset() {
                this.resourceSelectedList = [];
                this.resourceSelectIds = [];
                this.searchVal = '';
                this.$emit("reset",{});
            }
        }
    }
</script>
<style lang="less">
    @import "./../../assets/css/common";
    .roleAssignResourceModal{
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


