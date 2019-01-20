<template>
  <div class="marketing_card">
    <!-- 线 -->
    <div class="line"></div>
    <div class="cardbox" v-if="isTips"></div>
    <Row type="flex" justify="start" class="code-row" :gutter="12">
      <Col :lg="6" :md="8" v-for="card in cardList" :key="card.id">
        <Card>
          <p slot="title">
            <span>{{cardSource[card.cardSource]}}</span>
            <Rate disabled v-model="card.cardStars" v-bind:count="card.cardStars"></Rate>
          </p>
          <div class="flex flex-horizontal">
            <ul class="flex-user">
              <li>姓&#12288;&#12288;名：
                <a href="javascript:void(0);" @click="custMaintain({custId:card.custId, custNo: card.custNo, custName: card.custName})">{{card.custName}}</a>
              </li>
              <li>联系方式：{{card.contactNo}}</li>
              <li>推荐产品：
                <a href="javscript:void(0);" @click="showProductDetail({prodCode: card.rcmdProdCode, prodName: card.rcmdProdName})">{{card.rcmdProdName}}</a>
              </li>
              <li>推荐理由：{{card.rcmdReason}}</li>
            </ul>
            <img :src="cardStatusIcon[card.cardStatus]" />
          </div>
          <div class="flex flex-horizontal flex-btn" v-if="cardType === 'accurateMarketing'||cardType ==='gripMap'">
            <ButtonGroup>
              <Button class="btns" type="primary" shape="circle" size="small" icon="android-textsms" @click="toMarketing(card, 'SMS')">短信</Button>
              <Button class="btns" type="primary" shape="circle" size="small" icon="android-call" @click="toMarketing(card, 'PHONE')">电话</Button>
              <Button class="btns" type="primary" shape="circle" size="small" icon="person-stalker" @click="toMarketing(card, 'FACE')">现场</Button>
            </ButtonGroup>
            <Select v-show="cardType !=='gripMap'" :value="card.cardSetType" class="set-btn" :placement="'bottom'" size="small" clearable :placeholder="'卡片设置'" @on-change="cardSet($event,card)">
              <Option value="T">置顶卡片</Option>
              <Option value="I">忽略卡片</Option>
            </Select>
          </div>
        </Card>
      </Col>
      <Col v-if="cardList.length === 0">没有找到符合条件的营销卡片</Col>
    </Row>
    <component :is="operComp" :mdata="operData"></component>
     <!--客户维护-->
    <!-- <custmer-maintain ref="custMaintain" :custId="custId" :choosePublicShow="choosePublicShow" :chooseId="chooseId" @editSave="editSave" :btnName="btnName"></custmer-maintain> -->
     <custmer-maintain ref="custMaintain" :choosePublicShow="choosePublicShow"></custmer-maintain>
  </div>
</template>

<script>
  import marketingOperate from '@/pages/crm/Marketing/MarketingCardOperate.vue'
  import CustmerMaintain from '@/pages/crm/Customer/CustmerManagement/CustmerMaintain.vue'


  export default {
    name: 'marketingCard',
    props: [
     'cardType',
     'cardList',
     'cardSource',
     'isTips'
    ],
    components: {
      marketingOperate,
      CustmerMaintain
    },
    data() {
      return {
        operComp: '',
        operData: {},
        cardStatusIcon: {
          'M': require('@/assets/images/crm/undeal.png'),
          'F': require('@/assets/images/crm/continue.png'),
          'S': require('@/assets/images/crm/success.png'),
          'R': require('@/assets/images/crm/reject.png')
        },
        choosePublicShow:{
          id:'',    //客户主键
          custNo:'',   //客户号
          custName:''  //客户名称
        },
        // custId:'',
        // chooseId:[],     //选中的id
        // btnName:'',     //添加按钮名称
        searchParams: {
          current: 1,   //当前页
          size: 10,     //每页大小
          prodCode: '',     //产品代码
          prodName: ''      //产品名称
        },
        codeList: {},
        row: {},
        columns: [    //表头数据
          {
            title: '序号', width: 65, align: 'center',
            render: (h, params) => {
              return h('div', (params.index + 1) + pageSize * (currentPage - 1));
            }
          },
          {key: 'prodCode', title: '产品代码', width: 100,align: 'center'},
          {key: 'prodName', title: '产品名称', width: 100,align: 'center'},
          {key: 'orgName', title: '产品主管机构', width: 120,align: 'center'},
          {key: 'businessType', title: '业务性质', width: 100,align: 'center',
            render:(h,params)=>{
              var self = this;
               return h('div',[
                 h('span',{},codeList['businessType'][params.row.businessType])
               ])
            }
          },
          {key: 'prodLargeType', title: '产品大类', width: 100,align: 'center',
            render:(h,params)=>{
              var self = this;
               return h('div',[
                 h('span',{},codeList['prodLargeType'][params.row.prodLargeType])
               ])
            }
          },
          {key: 'prodSmallType', title: '产品小类', width: 100,align: 'center',
            render:(h,params)=>{
              var self = this;
               return h('div',[
                 h('span',{},codeList['prodSmallType'][params.row.prodSmallType])
               ])
            }
          },
          {key: 'prodStatus', title: '产品状态', width: 100,align: 'center',
            render:(h,params)=>{
              var self = this;
               return h('div',[
                 h('span',{},codeList['prodStatus'][params.row.prodStatus])
               ])
            }
          },
          {key: 'prodDesc', title: '产品描述', width: 255,ellipsis:true,align: 'center'},
          {key: 'createUser', title: '创建人员', width: 100, align: 'center'},
          {key: 'createTime', title: '创建日期', width: 160, align: 'center'}
        ]
       
      }
    },
    methods: {
      cardSet(cardSetType, card) {
        cardSetType = cardSetType || '';
        let self = this;
        this.oss.post({
          url: '/crm/marketingCard/edit',
          data: {id: card.id, cardSetType: cardSetType},
          ok(data, page, code) {
           card.cardSetType = cardSetType;
          }
        });
      },
      toMarketing(card, operType) {
        this.operData.card = card;
        this.operData.operType = operType;
        this.operComp = 'marketingOperate';
      },
      custMaintain(obj) {      //点击客户名称显示基本信息
        // this.btnName= obj.btnName;
        const {custId, custNo, custName} = obj;
        // this.chooseId.push(custId);
        // this.custId = custId;
        this.choosePublicShow = {
          id: custId,
          custNo: custNo,
          custName: custName
        }
        this.$refs.custMaintain._data.showModal = true;
        this.$refs.custMaintain._data.currentTab = this.$refs.custMaintain._data.labelName='basicInfo';
        this.$refs.custMaintain.getManagerList();
        this.$refs.custMaintain.getCustBasicInfo(this.choosePublicShow.id);
      },
      // editSave(val){
      //   switch (val.name) {
      //     case 'basicInfo':   //编辑客户基本信息
      //       this.$refs.custMaintain._data.custBasicInfoParams.id = this.chooseId[0];
      //       this.editCustBasicInfo(this.$refs.custMaintain._data.custBasicInfoParams);
      //       break;
      //     case 'contactInfo':    //编辑客户联系信息
      //       this.$refs.custMaintain._data.custContactInfoParams.id = this.chooseId[0];
      //       this.editCustContactInfo(this.$refs.custMaintain._data.custContactInfoParams);
      //       break;
      //     case 'custPreference':   //编辑客户偏好
      //       this.$refs.custMaintain._data.custPreferenceParams.id = this.chooseId[0];
      //       var preferenceParams = JSON.parse(JSON.stringify(this.$refs.custMaintain._data.custPreferenceParams));
      //       for(var key in preferenceParams){
      //         if(this.oss.isArray(preferenceParams[key])){
      //           preferenceParams[key]=preferenceParams[key].toString();
      //         }
      //       };
      //       this.editCustPreferenceInfo(preferenceParams);
      //       break;
      //   }
      // },
      // editCustBasicInfo(params){   //编辑客户基本信息
      //   this.oss.post({
      //     url: 'crm/cust/editCustBase',
      //     data: params,
      //     ok:(data, page, code)=>{
      //       this.oss.showMessage({type: 'success', content: '修改成功'});
      //     }
      //   })
      // },   
      // editCustContactInfo(params){     //编辑联系信息
      //   this.oss.post({
      //     url: 'crm/cust/editCustContact',
      //     data: params,
      //     ok:(data, page, code)=>{
      //       this.oss.showMessage({type: 'success', content: '修改成功'});
      //     }
      //   })
      // },  
      // editCustPreferenceInfo(params){    //编辑客户偏好
      //   this.oss.post({  
      //     url: 'crm/cust/editCustHobby',
      //     data: params,
      //     ok:(data, page, code)=>{
      //       this.oss.showMessage({type: 'success', content: '修改成功'});
      //     }
      //   })
      // }, 
      getProductManagementList(searchParams,self){
        self.oss.get({
          url: '/crm/marketingProduct/list',
          data: searchParams,
          ok(data, page, code) {
            self.codeList=code;
            self.row = data[0];
            self.oss.showModal({
                type: 'info',
                title: '产品管理详细信息',
                width: 500,
                okText: '关闭',
                render: (h) => {
                  return h('tableRowDataDetail', {
                    props: {
                      columns: self.columns,
                      dataRow: self.row,
                      codes: self.codeList
                    }
                  })
                }
            });
          }
        })
      },  
      showProductDetail(product) {
        this.searchParams = {
          current: 1,   
          size: 10,    
          prodCode: product.prodCode,     
          prodName: product.prodName
        }
        var self = this;
        this.getProductManagementList(this.searchParams, self);
      }
    },
    created() {
     
    }
  }
</script>

<style lang="less">
  @import "../assets/css/common";
  .marketing_card{
    .w(100%);
    .h(100%);
    position: relative;
    .ivu-col {
      padding-left: 20px!important;
      padding-right: 20px!important;
      margin-bottom:15px;
      min-width:370px;
    }
    .line {
      height: 2px;
      width: 24px;
      position: absolute;
      background-color: #fff;
      left: 150px;
      top: 216px;
      z-index: 9999;
    }
    .cardbox {
      width: 370px;
      height: 208px;
      position: absolute;
      left: -13px;
      top: 79px;
      background: url('../assets/images/crm/tips.png') bottom center no-repeat;
    }
    .ivu-col .ivu-card {
      margin-top:10px;
      height:208px;
      max-width:370px;
      border-radius: 6px;
    }
    .ivu-card-head {
      padding:7px 10px 3px 15px;
      height:33px;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      background:linear-gradient(to right, #3eb9fc,#78eafe);
    }
    .ivu-card-head p {
      font-size:13px;
      font-weight: 500;
      padding:0;
      text-align: left;
      color: white;
      display: flex;
      justify-content: space-between;
    }
    .flex {
      display: flex;
    }
    .flex-horizontal {
      margin-top:10px;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    ul,
    li {
      padding: 0;
      margin: 0;
      list-style: none;
      text-align: left;
    }
    li {
      height:30px;
      line-height:30px;
      font-size:12px;
    }
    ul{
      width:auto;
    }
    .ivu-card-body .flex img{
      width:120px;
      height:90px;
    }
    .flex-horizontal .flex-user{
      margin-left:6px;
      margin-top:-15px;
    }
    .flex-horizontal img{
      position:absolute;
      padding:0;
      width: auto;
      height:80%;
      top:40px;
      right:15px;
      margin-top:10px;
      margin-bottom:25px;
      margin-left:5px;
    }
    .ivu-card-body{
      padding:5px 10px 10px;
    }
    .flex-btn{
      .ivu-btn-group{
        min-width:172px;
      }
    }
    .ivu-card-body .flex .set-btn{
      display:inline-block;
      width:85px;
    }
    .ivu-card-body .flex .set-btn .ivu-select-item{
      padding-left:5px;
    }
  }
</style>
