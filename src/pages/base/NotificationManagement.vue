<template>
  <div id="notification-management">
    <Tabs value="name2" v-model="currentTabPane"  @on-click="change">
      <TabPane label="邮件" name="mailConfig"> 
        <Form :label-width="80" :model="mailConfigParams" ref="mailConfigParams">
          <Col span="24">
            <FormItem  label="主机地址" prop="host">
              <Input v-model="mailConfigParams.host" placeholder="请输入主机地址" style="width:96%"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem  label="用户名" prop="username">
              <Input v-model="mailConfigParams.username" style=" width:130px" placeholder="请输入用户名"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem  label="密码" prop="password">
              <Input  v-model="mailConfigParams.password" style=" width:130px" placeholder="请输入密码"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem  label="附件大小"  prop="attachementMaxSize">
              <Input v-model="mailConfigParams.attachementMaxSize" style=" width:130px" placeholder="附件大小（单位：M）"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem  label="端口" prop="post">
              <Input v-model="mailConfigParams.post" style=" width:130px" placeholder="超时时间（单位：秒）"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem  label="字符集选择" prop="defaultEncoding">
              <Select class="selects" v-model="mailConfigParams.defaultEncoding"  @on-change="selectStatus" placeholder="请选择状态类型" style="width:130px">
                <Option v-for="(item,index) in charsetList.charset" :value="index" :key="index">{{ item }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24"><hr></Col>
          <Col span="24">
            <Button type="primary" style="margin-top:15px;margin-bottom:15px;" @click="addProps">添加属性值</Button>
          </Col>
          <Col span="24" v-for="(item,index) in propertyList" :key="index">
            <Row :gutter="20" >
              <Col span="24">
                <FormItem>
                  <Input v-model="item.item_code" style=" width:130px" placeholder="请输入key" /> ----
                  <Input v-model="item.item_value" style=" width:130px" placeholder="请输入value" /> &nbsp;&nbsp;<Button type="primary" @click="del(index,item)">删除</Button>
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span="24">
            <FormItem class="btns">
              <Button type="default" @click="reset">重置</Button>
              <Button type="primary" @click="save">保存</Button>
            </FormItem>
          </Col>
        </Form>
      </TabPane>
      <TabPane label="短信" name="smsConfig">
        <Form :label-width="80" :model="smsConfigParams" ref="smsConfigParams">
          <FormItem  label="appkey" prop="appkey">
            <Input  v-model="smsConfigParams.appkey" placeholder="请输入appkey" style="width:96%"/>
          </FormItem>
          <FormItem class="btns">
              <Button type="default" @click="reset">重置</Button>
              <Button type="primary" @click="save">保存</Button>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="微信" name="weixinConfig">
        <Form :label-width="80" :model="weixinConfigParams" ref="weixinConfigParams">
          <FormItem  label="authcUrl" prop="authcUrl">
            <Input  v-model="weixinConfigParams.authcUrl" placeholder="请输入url" style="width:96%"/>
          </FormItem>
          <FormItem  label="appid" prop="appid">
            <Input  v-model="weixinConfigParams.appid" placeholder="请输入appid" style="width:96%"/>
          </FormItem>
          <FormItem  label="appsecret" prop="appsecret">
            <Input v-model="weixinConfigParams.appsecret" placeholder="请输入appsecret" style="width:96%"/>
          </FormItem>
          <FormItem  label="token" prop="token">
            <Input v-model="weixinConfigParams.token" placeholder="请输入token" style="width:96%"/>
          </FormItem>
          <FormItem  label="aeskey" prop="aeskey">
            <Input v-model="weixinConfigParams.aeskey" placeholder="请输入aeskey" style="width:96%"/>
          </FormItem>
          <FormItem class="btns">
              <Button type="default" @click="reset">重置</Button>
              <Button type="primary" @click="save">保存</Button>
          </FormItem>
        </Form>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  export default {
    name: 'NotificationManagement',
    data() {
      return {
        mailConfigParams:{
          hostId:null,
          host:'',
          usernameId:null,
          username:'',
          passwordId:null,
          password:'',
          attachementMaxSizeId:null,
          attachementMaxSize:'',
          defaultEncodingId:null,
          defaultEncoding:'UTF-8',
          postId:null,
          post:'',
          javaMailPropertiesId:'',
          javaMailProperties:''
        },
        smsConfigParams:{
          appkeyId:null,
          appkey:''
        },
        weixinConfigParams:{
          authcUrlId:null,
          authcUrl:'',
          appidId:null,
          appid:'',
          appsecretId:null,
          appsecret:'',
          tokenId:null,
          token:'',
          aeskeyId:null,
          aeskey:''
        },
        propertyList:[],
        propertyObj:{},
        charsetList:[],
        currentTabPane:'mailConfig',
      }
    },
    methods: {
      addProps() {
        this.propertyList.splice(0, 0, {item_code: '', item_value: ''});
      },
        change(){
          this.getNotificationManagement();
        },
      getNotificationManagement(){
        var self=this;
        this.oss.get({
          url: '/sys/code/findCodeDetailByType',
          data: {typeCodes:self.currentTabPane},
          ok(data,page,code) {
            self.getCodeList();
            if(self.currentTabPane==='mailConfig'){
              self.propertyList=[];
              self.mailConfigParams.hostId=data.mailConfig.host.id;
              self.mailConfigParams.host=data.mailConfig.host.attr1;
              self.mailConfigParams.usernameId=data.mailConfig.username.id;
              self.mailConfigParams.username=data.mailConfig.username.attr1;
              self.mailConfigParams.passwordId=data.mailConfig.password.id;
              self.mailConfigParams.password=data.mailConfig.password.attr1;
              self.mailConfigParams.defaultEncodingId=data.mailConfig.defaultEncoding.id;
              self.mailConfigParams.defaultEncoding=data.mailConfig.defaultEncoding.attr1;
              self.mailConfigParams.postId=data.mailConfig.post.id;
              self.mailConfigParams.post=data.mailConfig.post.attr1;
              self.mailConfigParams.attachementMaxSizeId=data.mailConfig.attachementMaxSize.id;
              self.mailConfigParams.attachementMaxSize=data.mailConfig.attachementMaxSize.attr1;
              self.mailConfigParams.javaMailPropertiesId=data.mailConfig.javaMailProperties.id;
              let props = JSON.parse(data.mailConfig.javaMailProperties.attr1);
              for(let k in props) {
                self.propertyList.push({item_code: k, item_value: props[k]});
              }
            }else if(self.currentTabPane==='smsConfig'){
              self.smsConfigParams.appkeyId=data.smsConfig.appkey.id;
              self.smsConfigParams.appkey=data.smsConfig.appkey.attr1;
            }else if(self.currentTabPane==='weixinConfig'){
              self.weixinConfigParams.authcUrlId=data.weixinConfig.authcUrl.id;
              self.weixinConfigParams.authcUrl=data.weixinConfig.authcUrl.attr1;
              self.weixinConfigParams.appidId=data.weixinConfig.appid.id;
              self.weixinConfigParams.appid=data.weixinConfig.appid.attr1;
              self.weixinConfigParams.appsecretId=data.weixinConfig.appsecret.id;
              self.weixinConfigParams.appsecret=data.weixinConfig.appsecret.attr1;
              self.weixinConfigParams.tokenId=data.weixinConfig.token.id;
              self.weixinConfigParams.token=data.weixinConfig.token.attr1;
              self.weixinConfigParams.aeskeyId=data.weixinConfig.aeskey.id;
              self.weixinConfigParams.aeskey=data.weixinConfig.aeskey.attr1;
            }
          }
        });
      },
      del(index){
        this.propertyList.splice(index,1);
      },
      save(){
        var self=this;
        self.propertyObj = {};
        if(self.currentTabPane==='mailConfig'){
          for(var i=0;i<self.propertyList.length;i++){
              self.propertyObj[self.propertyList[i].item_code]=self.propertyList[i].item_value;
          };
          self.mailConfigParams.javaMailProperties=JSON.stringify(self.propertyObj);
          var strData = "[{'id':" + self.mailConfigParams.hostId + ",'attr1':'" + self.mailConfigParams.host + "'},"+
                        "{'id':" + self.mailConfigParams.usernameId + ",'attr1':'" + self.mailConfigParams.username + "'}," +
                        "{'id':" + self.mailConfigParams.passwordId + ",'attr1':'" + self.mailConfigParams.password + "'}," +
                        "{'id':" + self.mailConfigParams.attachementMaxSizeId + ",'attr1':'" + self.mailConfigParams.attachementMaxSize + "'}," +
                        "{'id':" + self.mailConfigParams.defaultEncodingId + ",'attr1':'" + self.mailConfigParams.defaultEncoding + "'}," +
                        "{'id':" + self.mailConfigParams.postId + ",'attr1':'" + self.mailConfigParams.post + "'}," +
                        "{'id':" + self.mailConfigParams.javaMailPropertiesId + ",'attr1':'" + self.mailConfigParams.javaMailProperties + "'}]" ;
        }else if(self.currentTabPane==='smsConfig'){
          var strData = "[{'id':" + self.smsConfigParams.appkeyId + ",'attr1':'" + self.smsConfigParams.appkey + "'}]";
        }else if(self.currentTabPane==='weixinConfig'){
          var strData = "[{'id':" + self.weixinConfigParams.authcUrlId + ",'attr1':'" + self.weixinConfigParams.authcUrl + "'},"+
                        "{'id':" + self.weixinConfigParams.appidId + ",'attr1':'" + self.weixinConfigParams.appid + "'}," +
                        "{'id':" + self.weixinConfigParams.appsecretId + ",'attr1':'" + self.weixinConfigParams.appsecret + "'}," +
                        "{'id':" + self.weixinConfigParams.tokenId + ",'attr1':'" + self.weixinConfigParams.token + "'}," +
                        "{'id':" + self.weixinConfigParams.aeskeyId + ",'attr1':'" + self.weixinConfigParams.aeskey + "'}]" ;
        }
        this.oss.post({
          url:'/sys/notifyConfig/edit',
          data:{
            idAttr1JsonArray:strData
          },
          ok(data){
            self.oss.showMessage({type: 'success', content: '修改配置成功'});
            self.getNotificationManagement();
          },
          // err(error){
          //   self.oss.showModal({
          //       type: 'confirm',
          //       title: '失败提醒',
          //       content: '修改配置失败',
          //       onOk: () => {
          //       },
          //   });
          // }
        });
      },
      getCodeList(){
         var self=this;
        this.oss.get({
          url:'/sys/code/findCodeByType',
          data:{
            typeCodes:'charset'
          },
          ok(data){
            self.charsetList=data;
          }
        });
      },
      selectStatus(val){
      },
      reset(){
        if(this.currentTabPane==='mailConfig'){
          this.$refs.mailConfigParams.resetFields();
          this.propertyList=[];
        }else if(this.currentTabPane==='smsConfig'){
          this.$refs.smsConfigParams.resetFields();
        }else if(this .currentTabPane==='weixinConfig'){
          this.$refs.weixinConfigParams.resetFields();
        }
      },
    },
    created() {
      this.getNotificationManagement();
    }
  }
</script>

<style lang="less">
  #notification-management {
    width: 450px;
    font-family: "Microsoft YaHei";
    font-size: 20px;
    .btns{
      .ivu-form-item-content{
        text-align:center;
        .ivu-btn-default{
          margin-right:25px;
          margin-left:-80px;
        }
      }
    }
    hr{
      border: 0;
      color: #d7dadf;
      background-color: #d7dadf;
      height: 1px
    }
  }
</style>
