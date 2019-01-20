<template>
    <div class="reportModal">
        <Modal class="reportTemplateAddEditmodal" width="600" v-model="showModal" @on-cancel="reset" ok-text="保存">
            <h3>
              <Icon :type="modal.icon" size="18"></Icon>
              {{modal.text}}
            </h3>
            <Form ref="formModal" :rules="ruleValidate" :model="formValidate" :label-width="120">
              <Row>
                <Col span="12" v-for="(item, index) in columns" :key="index">
                  <FormItem :label="item.title" :prop="item.key" v-if="index!=0 &&!formatsData.codeParse.hasOwnProperty(item.key) && !formatsData.timeParse.hasOwnProperty(item.key) && item.key!='create_user' && item.key!='modified_user'">
                     <Input v-model="formValidate[item.key]" :placeholder="'请输入'+item.title" />
                  </FormItem>
                  <!-- 带有下拉框 -->
                  <FormItem :label="item.title" :prop="item.key" v-else-if="formatsData.codeParse.hasOwnProperty(item.key)">
                     <Select v-model="formValidate[item.key]" clearable >
                       <Option v-for="(ele, index) in dicts[formatsData.codeParse[item.key]]" :value="index" :key="index" style="max-width: 146px">{{ ele }}</Option>
                     </Select>
                  </FormItem>
                  <!-- 日期 除去创建人，修改人，时间-->
                  <FormItem :label="item.title" :prop="item.key" v-else-if="formatsData.timeParse.hasOwnProperty(item.key) && item.key!='create_time' && item.key!='modified_time' && item.key!='create_user' && item.key!='modified_user'">
                    <DatePicker type="date" v-model="formValidate[item.key]" :placeholder="'请选择'+item.title" />
                  </FormItem>
                </Col>
              </Row>
            </Form> 
            <div slot="footer" class="btns" style="text-align:center;">
              <Button v-if="modal.type == 'add'" type="default" @click="reset">重置</Button>
              <Button type="primary" @click="save">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    name: 'modal',
    props: ['modal', 'formValidate', 'dicts', 'columns', 'formatsData'],
    data() {
        return {
            showModal:false,
            labelWidth: 0,    //label宽度
            ruleValidate: {
              acct_id: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
              cust_nm: [{ required: true, message: '户名不能为空', trigger: 'blur' }],
              categ: [{ required: true, message: '类别不能为空', trigger: 'blur' }],
              currency_cd: [{required: true, message: '货币不能为空', trigger: 'blur'}],
              belong_org_id: [{required: true, message: '所属机构代码不能为空', trigger: 'blur'}],
              balance_cd: [{required: true, message: '资产负债指标代码不能为空', trigger: 'blur'}],
              report_id: [{required: true, message: '报表编码不能为空', trigger: 'blur'}],
              bond_id: [{required: true, message: '债券代码不能为空', trigger: 'blur'}],
              // bond_nm: [{required: true, message: '债券名称不能为空', trigger: 'blur'}],
              issu_corp_acct: [{required: true, message: '发债企业账号不能为空', trigger: 'blur'}],
              applicant_nm: [{required: true, message: '申请人名称不能为空', trigger: 'blur'}],
              applicant_org_id: [{required: true, message: '申请人机构代码不能为空', trigger: 'blur'}],
              applicant_corp_nm: [{required: true, message: '申请人企业名称不能为空', trigger: 'blur'}],
              debtor_nm: [{required: true, message: '债务人名称不能为空', trigger: 'blur'}],
              debtor_org_id: [{required: true, message: '债务人机构代码不能为空', trigger: 'blur'}],
              corp_acct_id: [{required: true, message: '企业账号不能为空', trigger: 'blur'}],
              bal: [{required: true, message: '金额不能为空', trigger: 'blur'}],
              txn_type: [{required: true, message: '交易类型不能为空', trigger: 'blur'}],
              opposite_acctno: [{required: true, message: '对方账号不能为空', trigger: 'blur'}],
              opposite_acct_name: [{required: true, message: '对方户名不能为空', trigger: 'blur'}],
              queryinstitutioncode: [{required: true, message: '查询金融机构代码不能为空', trigger: 'blur'}],
              reportinstitutioncode: [{required: true, message: '机构代码不能为空', trigger: 'blur'}],
              institutioncode: [{required: true, message: '融资主体代码不能为空', trigger: 'blur'}],
              investorname:  [{required: true, message: '投资人名称不能为空', trigger: 'blur'}],
            }
        }
    },
    methods: {
      reset() {
        this.$emit("reset",{formData:this.formValidate});
      },
      save() {
        if(this.formValidate.iden_type == '身份证') { //如果选择的证件类型为身份证，则加校验
          var regex = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
          if(this.formValidate.iden_type && !regex.test(this.formValidate.iden_type)) {
            this.oss.showModal({type: 'warning', content: '身份证格式不正确'});
            return;
          }
        }
        this.$refs.formModal.validate((valid) => {
          if(valid) {
            this.$emit("save",{formData:this.formValidate,type:this.modal.type});
          }
        })
      }
    }
}
</script>
<style>
 
  .ivu-modal-wrap .ivu-form .ivu-form-item-label{
        max-height: 40px!important;
        padding: 0;
        padding-right: 12px!important;
        padding-top: 8px!important;
      
  }
  

</style>
