<template>

  <!--
    作者: 何鹏举
    日期: 20180806
    说明:
        1.查看日志: 从WEB界面查看后台的all日志, 读取最后的N行进行显示(默认为100)
      2.日志记录器: 可以从WEB界面动态调整根目录日志级别及指定记录器(包名)的日志级别

    修正:
        1.查看日志: 添加行数选择 -> 100,200,300,400,并在作为参数带着
        2.日志记录器:
            a)三列的宽度按照百分比显示: 80%,10%,10%
            b)设置级别为选择框: 枚举值为固定的["ALL","TRACE","DEBUG","INFO","WARN","ERROR","OFF"]
            选择后发送请求: sys/log/editPackageLevel
      3.点击标签时进行刷新数据(已经写了,但没起作用)

  -->

  <div id="logLevel">

    <Tabs :value="defaultVal" @on-click="changeTab">
      <TabPane name="log" label="查看日志" icon="md-document">
        <Row>
          <Button @click="refreshDataLog(selectSize)">刷新</Button>
          <Select class="selectBox" placeholder="请选择显示条数" v-model="selectSize" size="small" @on-change="changeSelect">
            <Option v-for="(item,index) in sizeList" :key="index" :value="item">{{ item }}条</Option>
          </Select>
        </Row>
        <div style="height: 10px;"></div>
        <div id="logLine">
          <div v-for="(line,index) in lineList" class="ws" :key="index">{{line}}</div>
          <div style="height: 20px;"></div>
          <Spin size="large" fix v-if="showLogSpin"></Spin>
        </div>
      </TabPane>
      <TabPane name="logger" label="日志记录器" icon="ios-construct">
        <Row>
          <Button @click="refreshDataLogger">刷新</Button>
        </Row>
        <div style="height:10px;"></div>
        <div class="tableBox">
          <Table :loading="loading" :columns="columns" :data="dataList"/>
          <Spin size="large" fix v-if="showLoggerSpin"></Spin>
        </div>
      </TabPane>
    </Tabs>
  </div>

</template>

<script>
  export default {
    name: 'LogLevel',
    data() {
      return {
        loading: false,
        defaultVal: 'log',
        selectSize: 100,
        sizeList: [100, 200, 300, 400, 500],
        chooseList: ["ALL", "TRACE", "DEBUG", "INFO", "WARN", "ERROR", "OFF"],
        columns: [{
          key: 'packageName',
          title: 'Logger名称',
        },
          {
            key: 'effectiveLevel',
            title: '有效级别',
            width: 150,

          },
          {
            key: 'level',
            title: '设置级别',
            width: 150,
            render: (h, params) => {
              return h('div', [
                h('Select', {
                  style: {
                    width: '100px'
                  },
                  props:{
                    value:params.row.level
                  },
                  on: {
                    "on-change": val => {
                      var self = this;
                      this.oss.post({
                        url: "/sys/log/editPackageLevel",
                        data: {
                          level: val,
                          packageName: params.row.packageName
                        },
                        ok() {
                          self.$Message.info("修改成功");
                        }
                      });

                    }
                  }
                }, [
                  this.chooseList.map((type) => {
                    return h('Option', {
                      props: {
                        value: type
                      },
                    }, type)
                  })
                ]),
              ]);
            }

          }
        ],
        dataList: [],
        lineList: [],
        lineNums: [100, 200, 300, 400],
        showLogSpin: false,
        showLoggerSpin: false
      }
    },
    methods: {
      changeTab(name) {
        console.log(name);
        switch (name) {
          case 'log':
            this.refreshDataLog(this.selectSize);
            break;
          case 'logger':
            this.refreshDataLogger();
            break;
        }
      },
      changeSelect() {
        console.log(this.selectSize);
        this.refreshDataLog(this.selectSize);
      },
      //刷新日志
      refreshDataLog(line) {
        this.showLogSpin = true;
        this.dataList = [];
        this.loading = true;
        this.oss.get({
          url: '/sys/log/readLastLines',
          data: {
            lines: line
          },
          ok: (data, page, code) => {
            this.lineList = data;
            this.loading = false;
            this.showLogSpin = false;
          },
          err(error) {
            this.loading = false;
          }
        });
      },

      //刷新日志记录器
      refreshDataLogger() {
        this.showLoggerSpin = true;
        this.loading = true;
        this.lineList = [];
        this.oss.get({
          url: '/sys/log/packageLevelList',
          ok: (data, page, code) => {
            this.dataList = data;
            this.loading = false;
            this.showLoggerSpin = false;
          },
          err(error) {
            this.loading = false;
          }
        });
      }
    },
    mounted() {
      this.refreshDataLog(this.selectSize);
    },
  };
</script>

<style lang="less">
  @import "./../../assets/css/common";

  #logLevel {
    .h(100%);
    #logLine {
      position: relative;
      overflow: auto;
      .w(100%);
      .ws {
        white-space: nowrap;
      }
    ;
      /* 等宽字体很重要 */
      font-family: courier, Consolas, Monaco, monospace;

    }
    .tableBox {
      position: relative;
    }
    .selectBox {
      .w(100px);
      margin-left: 20px;
      position: absolute;
      right: 10px;
    }
  }
</style>
