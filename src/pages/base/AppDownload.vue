<template>
  <div class="app-download">
    <div class="qrcode">
      <div class="title">扫描下方二维码下载移动客户端</div>
      <div class="img ios">
        <img src="./../../assets/images/qr-ios.png" alt="苹果版" />
      </div>
      <div class="img android">
        <img src="./../../assets/images/qr-android.png" alt="安卓版" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AppDownload',
    data() {
      return {

      }
    },
    methods: {

    },
    created() {

    }
  }
</script>

<style lang="less" scoped>
  .app-download {
    width: 100%;
    height: 100%;
    /* justify-content: center;
    align-items: center;
    display: flex;
    font-family: "Microsoft YaHei";
    font-size: 20px; */
    position:relative;
    .qrcode {
      width: 600px;
      height: 500px;
      // background-color: red;
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      padding: 10px;
      .title {
        height: 100px;
        line-height: 50px;
        font-size: 30px;
        text-align: center;
        // background-color: rgb(58, 41, 209);
        margin-bottom: 10px;
      }
      .img {
        width: 200px;
        height: 200px;
        // background-color: rgb(32, 216, 78);
        // border: 1px solid #080808;
        overflow: hidden;
        &.ios {
          float: left;
        }
        &.android {
          float: right;
        }
        img {
          width: 100%;
        }
      }
    }
  }
</style>
