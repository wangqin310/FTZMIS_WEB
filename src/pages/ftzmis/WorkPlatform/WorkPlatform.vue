<template>
  <div id="workPlatform">
    <div class="top">
      <div class="title">业务监控处理</div>
      <div class="cont">
          <ul>
            <li class="institution_situation situation">
              <div class="sit_title">机构情况</div>
              <div class="description">
                  <div class="des">机构报文成功情况</div>
                  <span class="num">5/19</span>
                
              </div>
            </li>
            <li class="report_situation situation">
              <div class="sit_title">报表情况</div>
              <ul class="situationWrap">
                <li class="situationItem" v-for="item in nums1">
                  <div class="des">{{item.title}}</div>
                  <div class="num wrap-container" ref="number">{{item.num}}</div>
                </li>
              </ul>
            </li>
            <li class="running_message_situation situation">
              <div class="sit_title">报文跑批情况</div>
              <ul class="situationWrap">
                <li class="situationItem" v-for="item in nums2">
                  <div class="des">{{item.title}}</div>
                  <span class="num">{{item.num}}</span>
                </li>
              </ul>
            </li>
            <li class="related_account situation">
              <div class="sit_title">关联账户下发</div>
              <ul class="situationWrap">
                <li class="situationItem" v-for="item in nums3">
                  <div class="des">{{item.title}}</div>
                  <span class="num">{{item.num}}</span>
                </li>
              </ul>
            </li>
          </ul>
      </div>
    </div>
    <div class="bottom">
        <div class="title">系统监控</div>
        <div class="cont">
            <ul>
              <li class="source_data_status status">
                <div class="st_title">源数据状态</div>
                <ul>
                  <li>
                    <img :src="untstatusSrc" alt=""><br>
                    <span style="color:#e2413a;">未处理</span>
                  </li>
                  <li>
                    <img :src="processingSrc" alt=""><br>
                    <span style="color:#909090;">处理中</span>
                  </li>
                  <li>
                    <img :src="completedSrc" alt=""><br>
                    <span style="color:#909090;">已完成</span>
                  </li>
                </ul>
              </li>
              <li class="running_message_status status">
                <div class="st_title">报表跑批状态</div>
                <ul>
                  <li>
                    <img :src="untreatedSrc" alt=""><br>
                    <span style="color:#909090;">未处理</span>
                  </li>
                  <li>
                    <img :src="prostatusSrc" alt=""><br>
                    <span style="color:#f8ba27;">处理中</span>
                  </li>
                  <li>
                    <img :src="completedSrc" alt=""><br>
                    <span style="color:#909090;">已完成</span>
                  </li>
                </ul>
              </li>
              <li class="MQ_status status">
                <div class="st_title">MQ状态</div>
                <ul>
                  <li>
                    <img :src="comstatusSrc" alt=""><br>
                    <span style="color:#25c921;">正常</span>
                  </li>
                  <li>
                    <img :src="untreatedSrc" alt=""><br>
                    <span style="color:#909090;">异常</span>
                  </li>
                </ul>
              </li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script>
export default{
  data(){
    return{
      untreatedSrc:require('@/assets/images/workplatform/untreated.png'),
      untstatusSrc:require('@/assets/images/workplatform/untreated_status.png'),
      processingSrc:require('@/assets/images/workplatform/processing.png'),
      prostatusSrc:require('@/assets/images/workplatform/processing_status.png'),
      completedSrc:require('@/assets/images/workplatform/completed.png'),
      comstatusSrc:require('@/assets/images/workplatform/completed_status.png'),
      html:'',
      newHtml:'',
      nums1:[
        {title:'报表总数',num:15} ,
        {title:'业务发生',num:21},
        {title:'已提交',num:12},
        {title:'已复核',num:6},
        {title:'已报送',num:46},
        {title:'交易失败',num:29},
      ],
      nums2:[
        {title:'报表总数',num:26},
        {title:'报表错误数',num:15},
        {title:'批量投错误数',num:7},
        {title:'明细错误数',num:6},
      ],
      nums3:[
        {title:'昨日下发账户数',num:123},
        {title:'累计下发账户数',num:543910},
      ]
    }
  },
  methods:{
    //  初始化动画
            init () {
              this.$nextTick(()=>{
                for (let i = 0; i < this.nums1.length; i++) {
                  this.nums1[i].num.toString().split('').forEach((v,i,arr) => {
                    this.html += '<div class="wrap"><ul class="list scroll' + v + '">'
                    for (let j = 0; j <= 9; j++) {
                        this.html += '<li>' + j + '</li>'
                    }
                    this.html += '</ul></div>'
                })
                this.newHtml=this.html;
                this.html='';
                this.$refs.number[i].innerHTML = this.newHtml
                  // this.change();
                }
                  
              })
                
            },
            change(){
                setInterval(()=>{
                  for (let i = 0; i < this.nums1.length; i++) {
                    this.nums1[i].num++;
                    var newValue=this.nums1[i].num.toString().split('');
                    for (let j = 0; j < newValue.length; j++) {
                        this.html += '<div class="wrap"><ul class="list">'
                        this.html += '<li>' + newValue[j] + '</li>'
                        this.html += '</ul></div>'
                        
                    }
                    this.newHtml=this.html;
                    this.html='';
                    this.$refs.number[i].innerHTML = this.newHtml
                  }
                    
                },1500)
                  }
        },

        created(){
          this.init();
          // this.change();
        }
      }
</script>

<style lang="less">
#workPlatform{
  min-width: 1310px;
  overflow: auto;
  padding: 2%;
  width: 100%;
  height: 100%;
  .top{
    width: 100%;
    // height: 40%;
    // width: 95vw;
    height: 21vw;
    border-radius: 5px;
    background: #fff;
    border: 1px solid #e6e6e6;
    box-shadow: 0 0 12px #e6e6e6;
    padding: 0 1vw;
    .title{
      font-size: 1vw;
      color: #404040;
      font: 1vw/3vw '微软雅黑';
    }
    .cont{
      li.situation{
        float: left;
        height: 16vw;
        margin-right: 1vw;
        background: #f8f8f8;
        .sit_title{
          font: 0.8vw/3vw '微软雅黑';
          padding-left: 1vw;
          color: #404040;
          border-bottom: 1px solid #e5e5e5;
        }
        ul.situationWrap{
          padding: 1vh 2vh;
          li.situationItem{
            float: left;
            width: 5.5vw;
            margin-right: 0.5vw;
            text-align: left;
          .des{
            font-size: 0.5vw;
            color: #909090;
          }
          .num{
            // display: inline-block;
            color: #339bf4;
            // width: 50px;
            width:64px;
            font: 3vw/5vw '微软雅黑'!important;
            
          }
        }
        }
        .description{
          padding: 2vh;
          text-align: left;
          .des{
            font-size: 0.5vw;
            color: #909090;
          }
          .num{
            color: #339bf4;
            font: 3vw/5vw '微软雅黑';
          }
          
        }
      }
      .institution_situation{
        width: 10vw;
      }
      .report_situation{
        width: 21vw;
      }
      .running_message_situation{
        width: 16vw;
      }
      .related_account{
        width: 19vw;
        li{
          width: 7vw!important;
          float: none!important;
          text-align: left!important;
        }
      }
    }
  }
  .bottom{
    width: 100%;
    padding: 0 1vw;
    height: 16vw;
    border-radius: 5px;
    margin-top: 2vh;
    background: #fff;
    border: 1px solid #e6e6e6;
    box-shadow: 0 0 12px #e6e6e6;
    .title{
      font-size: 1vw;
      color: #404040;
      font: 1vw/3vw '微软雅黑';
    }
    .cont{
      ul{
        width: 100%;
        height: 100%;
        overflow: hidden;
          li.status{
            float: left;
            height: 11vw;
            background: #f8f8f8;
            margin-right: 1vw;
            .st_title{
              font: 0.8vw/3vw '微软雅黑';
              padding-left: 1vw;
              color: #404040;
              border-bottom: 1px solid #e5e5e5;
            }
            ul{
              text-align: center;
              padding-top: 2vw;
              li{
                display: inline-block;
                margin-right: 2vw;

                // padding: 1.4vw;
              }
            }
            
        }
        .source_data_status{
            width: 19vw;
        }
        .running_message_status{
            width: 19vw;
        }
        .MQ_status{
            width: 13vw;
        }
      }
      
    }
  }
}
</style>
<style lang='less'>
#workPlatform{
  .wrap-container { 
  display:flex;
  justify-content: flex-start;
  }
.wrap{ 
  width: 53px;
  height: 5vw;
  position:relative; 
  overflow:hidden;
  box-sizing: border-box;
  /* font-size: 18px; */
  }
.list { 
  position:absolute;
  left:0;top:0;
  margin:0;
  padding:0; 
  height:100%;
  box-sizing: border-box;
  }
.list li{
   /* font-size: 20px; */
   list-style:none;
            font: 3vw/5vw '微软雅黑';

   /* width:12px;
   height:18px; */
   /* line-height:18px; */
   color:#339bf4; 
   text-align:center; 
   float:left;
   box-sizing: border-box;}
@keyframes move9{0%{top:0;}100%{top:-900%;}}
@keyframes move8{0%{top:0;}100%{top:-800%;}}
@keyframes move7{0%{top:0;}100%{top:-700%;}}
@keyframes move6{0%{top:0;}100%{top:-600%;}}
@keyframes move5{0%{top:0;}100%{top:-500%;}}
@keyframes move4{0%{top:0;}100%{top:-400%;}}
@keyframes move3{0%{top:0;}100%{top:-300%;}}
@keyframes move2{0%{top:0;}100%{top:-200%;}}
@keyframes move1{0%{top:0;}100%{top:-100%;}}
.scroll9 {animation:.5s move9 /*infinite*/ linear;top:-900%; }
.scroll8 {animation:.5s move8 /*infinite*/ linear;top:-800%; }
.scroll7 {animation:.5s move7 /*infinite*/ linear;top:-700%; }
.scroll6 {animation:.5s move6 /*infinite*/ linear;top:-600%; }
.scroll5 {animation:.5s move5 /*infinite*/ linear;top:-500%; }
.scroll4 {animation:.5s move4 /*infinite*/ linear;top:-400%; }
.scroll3 {animation:.5s move3 /*infinite*/ linear;top:-300%; }
.scroll2 {animation:.5s move2 /*infinite*/ linear;top:-200%; }
.scroll1 {animation:.5s move1 /*infinite*/ linear;top:-100%; }
}

</style>


