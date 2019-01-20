<template>
    <div id="user-operate-type-modal">
        <Modal class="userOperateTypemodal" width="500" v-model="showModal" :mask-closable="false">
            <div slot="header">
                <h3 style="padding: 8px 5px; font-size: 16px">
                    <Icon :type="modal.icon" size="18"></Icon>
                    <span>{{modal.text}}</span>
                </h3>
            </div>
            <p>由于您选择了多个用户,请先确定是重置操作还是追加操作！</p>
            <div slot="footer">
                <Button type="primary" @click="appendRole">追加</Button>
                <Button type="primary" @click="resetRole">重置</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        name: 'model',
        props:['modal'],
        data() {
            return {
                showModal:false
            }
        },
        methods: {
            appendRole() {
                this.showModal = false;
                this.$emit("operTypeConfirm","追加", this.modal.type);
            },
            resetRole() {
                this.showModal = false;
                this.$emit("operTypeConfirm","重置", this.modal.type);
            }
        }
    }
</script>
<style lang="less">
    @import "./../../assets/css/common";
    .userOperateTypemodal{
        .ivu-modal {
            .ivu-modal-header{
                padding: 10px;
            }
            .ivu-modal-body{
                text-align: center;
                line-height: 16px;
                font-size: 16px;
            }
            .ivu-modal-footer{
                text-align: center;
            }
        }
    }
</style>


