<template>
  <div class="tag-nav-wrapper">
    <div class="tags-nav">
      <div class="close-con">
            <Dropdown trigger="click" placement="bottom" @on-click="close">
              <Icon type="ios-close-circle-outline" :size="18"></Icon>
              <DropdownMenu slot="list">
                <DropdownItem name="closeAll">关闭所有</DropdownItem>
                <DropdownItem name="closeOthers">关闭其他</DropdownItem>
              </DropdownMenu>
            </Dropdown>
      </div>
      <div class="btn-con left-btn">
            <Button @click="handleScroll(240)">
              <Icon type="ios-arrow-back" :size="18"></Icon>
            </Button>
      </div>
      <div class="btn-con right-btn">
            <Button @click="handleScroll(-240)">
              <Icon type="ios-arrow-forward" :size="18"></Icon>
            </Button>
      </div>
      <div class="scroll-outer" ref="scrollOuter" @DOMMouseScroll="handlescroll"@mousewheel="handlescroll">
        <div class="scroll-body" ref="scrollBody" :style="{left: tagBodyLeft + 'px'}">
            <Tag type="dot" ref="tagsPageOpened" v-for="(item, index) in navList" :key="item.name" :name="item.name" :color="item.id == menuId ? 'primary':'default'" :closable="index > 0" @on-close="handleClose(item)" @click.native="changeTag(item)">{{item.name}}
            </Tag>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['menuId'],
  data () {
    return {
      tagBodyLeft: 0,
      outerPadding: 4
    }
  },
  computed: {
    //计算属性
    navList() {
      if (this.$root.navList && this.$root.navList.length > 0) {
        //若有值，直接返回
        return this.$root.navList;
        console.log(ths.$root.navList)
      } else {
        //没值，从缓存中取
        this.$root.navList = this.oss.getGlobalData("navList");
        return this.$root.navList;
      }
    }
  },
  methods: {
    // 鼠标滚轮事件
    handlescroll (e) {
      var type = e.type
      let delta = 0
      if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40
      }
      this.handleScroll(delta)
    },
    // 点击左右箭头移动
    handleScroll (offset) {
      if (this.tagBodyLeft == 0) {
        let left = this.$refs.scrollBody.style.left.replace('px','');
        this.tagBodyLeft = parseInt(left);
      }
      const outerWidth = this.$refs.scrollOuter.offsetWidth;
      const bodyWidth = this.$refs.scrollBody.offsetWidth;
      if (offset > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset);
      } else {
        if (outerWidth < bodyWidth) {
          if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
            this.tagBodyLeft = this.tagBodyLeft;
          } else {
            this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, outerWidth - bodyWidth);
          }
        } else {
          this.tagBodyLeft = 0;
        }
      }
      this.$refs.scrollBody.style.transition = 'all ease .5s';
    },
   // 点击关闭菜单
    handleClose(item) {
      let currentMenuId = this.oss.getGlobalData("currentMenuId");
      if (item.id == currentMenuId) {
        //当前关闭高亮的菜单，就让当前菜单的前一个高亮
        const index = this.$root.navList.findIndex(e => {
          return e.id == currentMenuId;
        });
        this.$root.navList.splice(index, 1);
        this.$root.currentMenuId = this.$root.navList[index - 1].id;
        this.oss.setGlobalData("currentMenuId", this.$root.navList[index-1].id);
        this.oss.toMenu({menu: this.$root.navList[index-1], self: this, isNav: false,query: this.$root.navList[index-1].query||null});
      } else {
        // 否则直接删除
        const index = this.$root.navList.findIndex(e => {
          return e.id == item.id;
        });
        this.$root.navList.splice(index, 1);
      }
      this.oss.setGlobalData("navList", this.$root.navList);
    },
    // 高亮菜单显示在可视区
    moveToView (tag) {
      const outerWidth = this.$refs.scrollOuter.offsetWidth;
      const bodyWidth = this.$refs.scrollBody.offsetWidth;   //标签的宽度
      if (bodyWidth < outerWidth) {
        this.tagBodyLeft = 0;
      } else if (tag.offsetLeft < -this.tagBodyLeft) {
        // 标签在可视区域左侧
        this.tagBodyLeft = -tag.offsetLeft + this.outerPadding;
      } else if (tag.offsetLeft > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + outerWidth) {
        // 标签在可视区域
        this.tagBodyLeft = Math.min(0, outerWidth - tag.offsetWidth - tag.offsetLeft - this.outerPadding);
      } else {
        // 标签在可视区域右侧
        this.tagBodyLeft = -(tag.offsetLeft - (outerWidth - this.outerPadding - tag.offsetWidth));
      }
    },
    // 通过下标找到对应的DOM元素
    getTagElementByIndex(index) {
      this.$nextTick(() => {
        let refsTag = this.$refs.tagsPageOpened;
        refsTag.forEach((item, i) => {
          if (i == index) {
            let tag = refsTag[index].$el;
            this.moveToView(tag);
          }
        })
      })
    },
    // 点击切换标签
    changeTag(item) {
      let currentMenuId = item.id;
      this.oss.setGlobalData("currentMenuId", currentMenuId); //页面刷新，仍高亮
      this.$root.currentMenuId = item.id;
      let index = this.$root.navList.findIndex(item => {
        return item.id == this.$root.currentMenuId;
      });
      this.getTagElementByIndex(index);
      if (item.query) {
        this.oss.toMenu({menu: item, self: this, isNav: false, query:item.query});
      } else {
        this.oss.toMenu({menu: item, self: this, isNav: false});
      }
    },
    close (name) {
      // 点击关闭所有,保留工作平台
      if (name == "closeAll") {
        let scrollBody = this.$refs.scrollBody;
        let length = this.navList.length;
        if (length > 1) {
          this.$root.navList.splice(1, length - 1);
          scrollBody.style.left = 0;
          scrollBody.style.transition = "all ease .5s";
        }
        this.$root.currentMenuId = this.$root.navList[0].id;
        this.oss.setGlobalData("currentMenuId", this.$root.currentMenuId);
        this.oss.toMenu({menu: this.$root.navList[0], self: this, isNav: false});
        this.oss.setGlobalData("navList", this.$root.navList);
        // 点击关闭其他，保留当前高亮和工作平台
      } else if (name == "closeOthers") {
        let scrollBody = this.$refs.scrollBody;
        let currentMenuId = this.oss.getGlobalData("currentMenuId");
        let currMenuList = this.$root.navList.filter(item => {
          return item.id == currentMenuId;
        });
        let workPlatform = this.navList[0];
        let flag = currMenuList.some(item => {
          return item.id == workPlatform.id;
        });
        if (!flag) {
          //若当前高亮不是工作平台
          currMenuList.unshift(this.$root.navList[0]);
        }
        this.$root.navList = currMenuList;
        scrollBody.style.left = 0;
        scrollBody.style.transition = "all ease .5s";
        this.oss.setGlobalData("navList", this.$root.navList);
      }
    }
  },
  watch:{
    '$route' (to) {
      let currentMenuId = this.oss.getGlobalData("currentMenuId");
      let index = this.$root.navList.findIndex(item => {
        return item.id == currentMenuId;
      })
      this.getTagElementByIndex(index);
      this.$refs.scrollBody.style.transition = 'all ease .5s';
    }
  },
  mounted() {
    // 刷新页面，高亮菜单仍在可视区
    setTimeout(() => {
      let currentMenuId = this.oss.getGlobalData("currentMenuId");
      let index = this.$root.navList.findIndex(item => {
        return item.id == currentMenuId;
      })
      this.getTagElementByIndex(index);
      this.$refs.scrollBody.style.transition = 'all ease .5s';
    }, 200)
  }
}
</script>
<style lang="less">
@import "../assets/css/common";
  .tag-nav-wrapper {
    .tags-nav {
      .h(100%);
      .w(100%);
      position: relative;
      .close-con {
        background: #fff;
        z-index: 101;
        height: 35px;
        position: absolute;
        right: 26px;
        width: 38px;
        top: 0;
        text-align: center;
        cursor: pointer;
        .ivu-btn-text {
          background-color: #fff;
        }
        .ivu-dropdown {
          margin-top: 10px;
          .ivu-select-dropdown {
            margin: 10px 0;
          }
        }
      }
      .btn-con {
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 11;
        button {
          line-height: 14px;
          padding: 6px 4px;
          text-align: center;
           border-radius: 0;
        }
        .ivu-btn {
          width: 26px;
          height: 35px;
          border: 0;
        }
      }
      .left-btn {
        left: 0;
        border-left: 1px solid #f0f0f0;
        border-right: 1px solid #f0f0f0;
      }
      .right-btn {
        right: 64px;
        border-right: 1px solid #f0f0f0;
      }
      .scroll-outer {
        .w(calc(~"100% - 115px"));
        left: 26px;
        right: 100px;
        position: absolute;
        top: 0;
        bottom: 0;
        background-color: #f0f0f0;
        .scroll-body {
          // .w(100%);
          left: 0;
          display: inline-block;
          overflow: visible;
          padding: 0 4px;
          position: absolute;
          white-space: nowrap;
        }
      }
    }
  }
</style>

