<template>
  <div ref="SystemMessage" class="system-message">
    <p class="title">{{title}}</p>
    <Timeline pending>
        <TimelineItem v-for="(msg,idx) in msgList" :key="msg.id">
          <!-- <Icon type="trophy" slot="dot"></Icon> -->
          <!-- <Icon type="gear-a" :color="nodeColor[msg.messageLevel]" slot="dot"></Icon> -->
          <p class="time">{{msg.createTime}}</p>
          <p :class="['content', msg.messageLevel === 'A' ? 'red' : '']" :style="">{{msg.messageContent}}</p>
        </TimelineItem>
        <TimelineItem color="green">
          <p :class="moreFlag ? 'more' : 'none'" @click="more">{{moreText}}</p>
        </TimelineItem>
    </Timeline>
  </div>
</template>

<script>
  export default {
    name: 'SystemMessage',
    data() {
      return {
        msgList: [],
        title: '所有消息',
        moreFlag: true,
        moreText: '正在加载...',
        msgInfo: undefined,
        params: {current: 1, size: 10, orderBy: 'create_time desc, id desc'},
        nodeColor: {A: 'red', B: 'blue'}
      }
    },
    methods: {
      more() {
        if(!this.moreFlag) return;
        let self = this;
        if(this.msgInfo && this.msgInfo.num > 0) {
          self.params['status'] = '0';
          self.title = '未读消息';
        }
        self.moreText = '正在加载...';
        this.oss.get({
          url: '/sys/message/findAll',
          data: self.params,
          ok(data, page, code) {
            self.msgList.push(...data);
            if(self.msgList.length === 0 && page.total === 0) {
              self.moreFlag = false;
              self.moreText = '暂无消息';
            }else if('status' in self.params && self.msgInfo.num > 0) {
              self.updateMsgStatus(data);
              self.msgInfo.num = Math.max(self.msgInfo.num - data.length, 0);
              if(self.msgInfo.num > 0) {
                self.moreText = '查看更多(还有' + self.msgInfo.num + '条)';
              }else {
                self.moreFlag = false;
                self.moreText = '结束';
              }
            }else if(!('status' in self.params) && (page.total-self.msgList.length) > 0) {
              self.params.current++;
              self.moreText = '查看更多(还有' + (page.total-self.msgList.length) + '条)';
            }else {
              self.moreFlag = false;
              self.moreText = '结束';
            }
            // alert(self.$refs.SystemMessage.scrollHeight);
            self.$refs.SystemMessage.scrollTop = self.$refs.SystemMessage.scrollHeight;
          }
        });
      },
      updateMsgStatus(msgList) {
        let self = this;
        let idList = [];
        msgList.map(msg => {
          idList.push(msg.id);
        });
        self.oss.post({
          url: '/sys/message/readed',
          data: {id: idList}
        });
      }
    },
    created() {
      let datakey = this.$route.query.datakey;
      if(datakey) {
        this.msgInfo = this.oss.getGlobalData(datakey);
        this.more();
      }
    }
  }
</script>

<style lang="less" scoped>
  .system-message {
    width: 100%;
    height: 100%;
    padding: 30px;
    overflow-x: hidden;
    .title {
      margin: 0px 0px 25px 0px;
      color:green;
    }
    .red {
      color: red;
    }
    .time {
      color:rgb(155, 155, 155);
    }
    .content {
      margin-top: 5px;
    }
    .more {
      color:#258dcd;
    }
    .more:hover {
      cursor: pointer;
    }
    .none {
      color: gray;
    }
  }
</style>
