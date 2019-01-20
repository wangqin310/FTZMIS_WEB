<template>
    <div>
        <Modal class="reportChartConfig" title="编辑报表图表" width="824" v-model="show" :mask-closable="false">
            <ul class="btns_ul">
                <li class="btns_li" v-for="(item,index) in btnList" :key="index">
                    <Button :type="item.type" :icon="item.icon" @click="clickOperateBtn(item.name)" :disabled="btnDisabled(item.name)">
                        {{item.text}}
                    </Button>
                </li>
            </ul>
            <div>
                <Table size="small" highlight-row :columns="columns" :data="chartList" @on-selection-change="selectedData"/>
            </div>
            <div slot="footer">
                <!-- <Button type="primary" @click="closeChartConfig">关闭</Button> -->
            </div>
        </Modal>
        <ReportChartConfigAddEdit ref="chartAddEdit" :reportId="reportId" :queryChartList="queryChartList"/>
    </div>
</template>
<script>
import ReportChartConfigAddEdit from '@/pages/base/ReportChartConfigAddEdit'
export default {
    data() {
        return {
            show: false,
            reportId: null,
            codeList: {},
            btnList: [   //按钮列表
                {text: '新 增', icon: 'md-add', type: 'primary', name: 'add'},
                {text: '修 改', icon: 'md-create', type: 'primary', name: 'edit'},
                {text: '删 除', icon: 'md-close', type: 'error', name: 'delete'},
                {text: '上 移', icon: 'md-arrow-round-up', type: 'primary', name: 'up'},
                {text: '下 移', icon: 'md-arrow-round-down', type: 'primary', name: 'down'}
            ],
            
            columns: [
                { type: 'selection', width: 60, align: 'center' },
                { key: 'chartSort', title : '序号', width: 60, align: 'center' },
                { key: 'chartTitle', title : '图表标题', width: 120,align: 'center'},
                { key: 'chartType', title : '图表类型', width: 100,align: 'center',
                    render: (h,params)=> {
                        return h('span', params.row.chartType == '' ? '' : this.codeList['chartType'][params.row.chartType])
                    }
                },
                { key: 'dimField', title : '统计维度字段', width: 120,align: 'center'},
                { key: 'valField', title : '数值字段', width: 160,align: 'center'},
                { key: 'valFieldName', title : '数值字段名称', width: 170,align: 'center'},
                // { key: 'chartSort', title : '图表排序', width: 90,align: 'center'}
            ],
            chartList: [],
            selectedList: []
        }
    },
    components: { ReportChartConfigAddEdit },
    methods: {
        btnDisabled(name) {
            switch (name) {
                case 'edit':
                    return this.selectedList.length != 1;
                    break;
                case 'up' :
                    return this.chartList.length == 1 || !(this.selectedList.length == 1 &&  this.selectedList[0].chartSort != 1);
                    break;
                case 'down':
                    return this.chartList.length== 1 || !(this.selectedList.length == 1 &&  this.selectedList[0].chartSort != this.chartList.length);
                    break;
                case 'delete':
                    return this.selectedList.length == 0;
            }
        },
        clickOperateBtn(name) {
            switch (name) {
                case 'add':
                    this.$refs.chartAddEdit.chartType = this.codeList['chartType'];
                    this.$refs.chartAddEdit.chartParam = {};
                    this.$refs.chartAddEdit.chartParam.chartSort=this.chartList.length + 1;
                    this.$refs.chartAddEdit.show = true;
                    break;
                case 'edit':
                    this.$refs.chartAddEdit.chartType = this.codeList['chartType'];
                    this.$refs.chartAddEdit.chartParam = JSON.parse(JSON.stringify(this.selectedList[0]));
                    this.$refs.chartAddEdit.show = true;
                    break;
                case 'delete': 
                    this.$Modal.confirm({
                        content: '<p>确认删除选中的数据吗？</p>',
                        title: '删除提示',
                        onOk: () => {
                            this.delete();
                        },
                        onCancel: () => {
                            this.$Message.info('取消删除');
                        }
                    });
                    break;
                case 'up':
                    this.chartList.map((item, index) => {
                        if(item.id == this.selectedList[0].id) {
                            item.chartSort = item.chartSort - 1;
                            this.chartList[index-1].chartSort = this.chartList[index-1].chartSort + 1;
                            this.edit(item, () => {
                                this.edit(this.chartList[index-1],() => {this.exchangeEle(index, 'up')})
                            });
                        }
                    });
                    break;
                case 'down':
                    this.chartList.map((item, index) => {
                        if(item.id == this.selectedList[0].id) {
                            item.chartSort = item.chartSort + 1;
                            this.chartList[index+1].chartSort = this.chartList[index+1].chartSort - 1;
                            this.edit(item, () => {
                                this.edit(this.chartList[index+1],() => {this.exchangeEle(index, 'down')})
                            });
                        }
                    });
                    break;
            }
        },
        exchangeEle(index, exchangeType) {
            var checkedId = this.chartList[index].id;
            switch (exchangeType) {
                case 'up':
                    this.chartList.splice(index, 0, ...this.chartList.splice(index-1, 1));
                    break;
                case 'down':
                    this.chartList.splice(index+1, 0, ...this.chartList.splice(index, 1));
                    break;
            };
            this.selectedList=[];
            this.chartList.map(item => {
                if(typeof item._checked !='undefined'||item._checked==true) {
                    item._checked = false;
                }
                if(item.id == checkedId) {
                    this.$set(item,'_checked',true);
                    this.selectedList.push(item);
                }
            })
        },
        edit(param,callback) {
            this.oss.post({
                url: '/sys/repotChartConfig/edit',
                data: param,
                finish: () => {
                   callback && callback();
                }
            });
        },
        delete() {
            var ids = [];
            this.selectedList.map(item => {
                ids.push(item.id);
            })
            this.oss.post({
                url: '/sys/repotChartConfig/delete',
                data: { id: ids.toString() },
                ok: (data) => {
                    this.oss.showMessage({type: 'success', content: '删除成功'});
                    this.queryChartList(this.reportId);
                }
            })
        },
        queryChartList(reportId) {
            this.oss.get({
                url: '/sys/repotChartConfig/list',
                data: { reportId, orderBy: 'chart_sort' },
                ok: (data, page, code) => {
                    this.chartList = data;
                    this.codeList = code;
                }
            })
        },
        selectedData(val) {
            this.selectedList = val;
        },
        // closeChartConfig() {
        //     this.show = false;
        // }
    }
}
</script>
<style lang="less">
    @import "./../../assets/css/common";
    .reportChartConfig{
        .ivu-modal-body{
            .btns_ul{
                height: 50px;
                padding: 0;
            }
        }
    }
</style>


