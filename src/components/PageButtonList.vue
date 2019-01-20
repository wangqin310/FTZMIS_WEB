<template>
  <div class="pageButtonList">
    <ul class="btns_ul">
      <li class="btns_li" v-for="(item,index) in btnList" :key="index">
        <Button :type="item.type" :icon="item.icon" @click="clickBtn(item)" :loading="item.loading">{{item.text}}</Button>
      </li>
      <slot></slot>
       <!-- :disabled="(item.name=='edit'&&(deleteId.length==0||deleteId.length>=2))||(item.name=='delete'&&deleteId.length==0)?'disabled':false"  -->
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PageButtonList',
  // props: ['datakey'],
  props: {
    datakey: String,
    reportCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      btnList: [],
      loading: false
    }
  },
  methods: {
    clickBtn (item) {
      this.$emit('btnClick', item);
    }
  },
  created () {
    if (this.datakey) {
      let menu = this.oss.getGlobalData(this.datakey);
      this.btnList = menu.children.map((item) => {
        return  {
          loading: false,
          text: item.name,
          icon: item.icon,
          type: item.code === 'delete'?'error':'primary',
          code: item.code
        };
      })
    } else {
      let codeMenu = this.oss.getGlobalData(this.reportCode);
      this.btnList = codeMenu.children.map((item) => {
        return  {
          loading: false,
          text: item.name,
          icon: item.icon,
          type: item.code === 'delete'?'error':'primary',
          code: item.code
        };
      })
    }
  }
}
</script>

<style lang="less">

</style>
