<template>
    <div class="user-set-org-modal" id="user-set-org-modal">
        <Modal class="personalUserSetOrgmodal" width="500" v-model="showModal"  @on-cancel="reset" @on-ok="saveOrg" ok-text="保存">
            <h3 slot="header" style="padding: 5px 5px; font-size: 16px">
                <Icon :type="modal.icon" size="20"></Icon>
                {{modal.text}}
            </h3>
            <Tree :data="orgList" show-checkbox multiple ref="tree"></Tree>
        </Modal>
    </div>
</template>
<script>
    let codes = {};
    export default {
        name: 'model',
        props:['orgList','modal'],
        data() {
            return {
                orgSelectIds : [],
                orgSelectedList: [],
                showModal:false
            }
        },
        methods: {
            saveOrg() {
                var self = this;
                this.orgSelectedList = this.$refs.tree.getCheckedNodes();
                this.orgSelectedList.map((item) => 
                    self.orgSelectIds.push(item.id)
                );
                if(this.modal.text.indexOf('追加') != -1) {
                    this.$emit("saveOrg",this.orgSelectIds, 'append');
                } else {
                    this.$emit("saveOrg",this.orgSelectIds, 'reset');
                }
                this.orgSelectedList = [];
                this.orgSelectIds = [];
            },
            reset() {
                this.orgSelectedList = [];
                this.orgSelectIds = [];
                this.$emit("reset",'');
            }
        }
    }
</script>
<style lang="less">
    @import "./../../assets/css/common";
    .personalUserSetOrgmodal{
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


