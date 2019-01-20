<template>
    <div id="user-set-role-modal">
        <Modal class="personalUserSetRolemodal" width="500" v-model="showModal"  @on-cancel="reset" @on-ok="saveRole" ok-text="保存">
            <h3 style="padding: 5px 5px; font-size: 15px">
                <Icon :type="modal.icon" size="18"></Icon>
                {{modal.text}}
            </h3>
            <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:10px;margin-bottom:6px;">
                <Checkbox
                    :value="checkAll"
                    @click.prevent.native="handleCheckAll">全选</Checkbox>
            </div>
            <CheckboxGroup v-model="checkedIds" @on-change="checkAllGroupChange">
                <Checkbox :label="item.id" v-for="(item,index) in roleList" :key="index"><span>{{item.name}}</span></Checkbox>
            </CheckboxGroup>
        </Modal>
    </div>
</template>
<script>
    let codes = {};
    export default {
        name: 'model',
        props:['roleList', 'roleCheckedIds', 'modal'],
        data() {
            return {
                checkAll: false,
                showModal:false,
              checkedIds:[]
            }
        },
        watch:{
          roleCheckedIds:function(val){
            this.checkedIds=val;
          }
        },
        methods: {
            handleCheckAll () {
                this.checkAll = !this.checkAll;
                if (this.checkAll) {
                    var self = this;
                    this.roleList.map(item => {
                        self.checkedIds.push(item.id);
                    })
                } else {
                    this.checkedIds.splice(0,this.checkedIds.length);
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
            saveRole() {
                if(this.modal.text.indexOf('追加') != -1) {
                    this.$emit("saveRole",{checkedIds: this.checkedIds, type: 'append'});
                } else {
                    this.$emit("saveRole",{checkedIds: this.checkedIds, type: 'reset'});
                }
                this.checkAll = false;
            },
            reset() {
                this.checkAll = false;
                this.$emit("reset",{});
            }
        }
    }
</script>
<style lang="less">
    @import "./../../assets/css/common";
    .personalUserSetRolemodal {
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


