<template>
  <div id="table-row-data-detail">
    <Row v-for="(item, index) in columnList" :key="index" :gutter="16" class-name="data-row">
      <Col span="6" class-name="data-row-title">{{item.title}}</Col>
      <Col v-if="item.typeCode" span="18" class-name="data-row-value">{{oss.getValue(codes, [item.typeCode, dataRow[item.key]], dataRow[item.key])}}</Col>
      <Col v-else-if="codes.hasOwnProperty(item.key)" span="18" class-name="data-row-value">{{oss.getValue(codes, [item.key, dataRow[item.key]], dataRow[item.key])}}</Col>
      <Col v-else span="18" class-name="data-row-value">{{dataRow[item.key]}}</Col>
    </Row>
  </div>
</template>

<script >
  export default {
    name: 'TableRowDataDetail',
    props: {
      columns: {type: Array, required: true},
      dataRow: {type: Object, required: true},
      codes: {type: Object, required: true},
    },
    data() {
      return {

      }
    },
    computed: {
      columnList() {
        return this.columns.filter(item => {
          return item.hasOwnProperty('key');
        });
      }
    },
    methods: {

    },
    mounted() {

    },
    created() {

    }
  }
</script>

<style lang="less">
  #table-row-data-detail {
    overflow: auto;
    overflow-x: hidden;
    height: 300px;
    word-wrap: break-word;
    word-break: break-all;
    padding-right: 10px;
    .data-row {
      margin: 15px 0px;
      .data-row-title {
        text-align: right;
      }
      .data-row-value {
        text-align: left;
      }
    }
  }
</style>
