<template>
  <div id="cache">
    <div class="box">
        <Button class="button" type="info" shape="circle" size="large" @click="clearCodeCache">清除代码二级缓存</Button>
        <br>
        <br>
        <br>
        <Button class="button" type="primary" shape="circle" size="large" @click="clearResourceCache">清除资源二级缓存</Button>
        <br>
        <br>
        <br>
        <Button class="button" type="info" shape="circle" size="large" @click="clearAuthoCache">清除Shiro授权缓存</Button>
        <br>
        <br>
        <br>
        <Button class="button" type="primary" shape="circle" size="large" @click="refreshFilterChain">刷新Shiro过滤器链</Button>
    </div>
  </div>
</template>
<script>
export default {
    name: 'CacheManagement',
    data(){
        return {
        }
    },
    methods:{
        clearCodeCache(){
            let self = this;
            this.oss.get({
              url: 'sys/cache/clearCodeCache',
              ok() {
                self.$Message.success('已成功清除代码二级缓存');
              },
              err(error) {
                self.$Message.error('清除代码二级缓存失败');
              }
            });
        },
        clearResourceCache(){
            let self = this;
            this.oss.get({
              url: 'sys/cache/clearResourceCache',
              ok() {
                self.$Message.success('已成功清除资源二级缓存');
              },
              err(error) {
                self.$Message.error('清除资源二级缓存失败');
              }
            });
        },
        clearAuthoCache(){
            let self = this;
            this.oss.get({
              url: 'sys/cache/clearAuthoCache',
              ok() {
                self.$Message.success('已成功清除Shiro授权缓存');
              },
              err(error) {
                self.$Message.error('清除Shiro授权缓存失败');
              }
            });
        },
        refreshFilterChain(){
            let self = this;
            this.oss.get({
              url: 'sys/cache/refreshFilterChain',
              ok() {
                self.$Message.success('已成功刷新Shiro过滤器链');
              },
              err(error) {
                self.$Message.error('刷新Shiro过滤器链失败');
              }
            });
        },
      }
}
</script>
<style lang="less">
  @import "./../../assets/css/common";
  // @import "./../../assets/css/content";
  #cache{
    .w(100%);
    .h(100%);
  }
  .button{
    width: 70%;
  }
  .box{
    padding-top: 10%;
    margin: 0 auto;
    width:600px;
    height: 600px;
  }
</style>
