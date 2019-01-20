<template>
  <div id="navigation-menu-topcheer">
    <template v-for="menu in menuListNew" >
      <!-- 包含子节点（非叶子节点） -->
      <el-submenu v-if="getMenuChildrenCount(menu) > 0" :key="menu.id" :index="menu.id.toString()" :id="oss.path2name(menu.uri)" >
        <template slot="title">
          <!-- <i class="el-icon-location"></i> -->
          <!-- <Icon class="icon icon_menu" :type="menu.icon" /> -->
          <i :class="['iconfont', menu.icon, 'icon-nav-menu']"></i>
          <span slot="title">{{menu.name}}</span>
        </template>
        <NavMenu :menuList="menu.children"></NavMenu>
      </el-submenu>
      <!-- 叶子节点 添加id是为了二级菜单展开-->
      <el-menu-item v-else :key="menu.id" :index="menu.id.toString()" :id="oss.path2name(menu.uri)" @click.native.stop="to(menu)">
        <!-- <i class="el-icon-location"></i> -->
        <!-- <Icon class="icon icon_menu" :type="menu.icon" /> -->
        <i :class="['iconfont', menu.icon, 'icon-nav-menu']"></i>
        <span slot="title">{{menu.name}}</span>
      </el-menu-item>
    </template>
    <!-- </el-menu>  -->
  </div>
</template>

<script>

  export default {
    name: 'NavMenu',
    props: ['menuList', 'currentUser'],
    data() {
      return {

      }
    },
    computed: {
      menuListNew() {
        return this.menuList.filter(menu => {
          return menu.type === 'menu';
        });
      }
    },
    methods: {
      to(menu) {
        this.oss.toMenu({menu: menu, self: this, isNav: true});

        // this.$root.showView=false;
        // this.$root.showConfigure=false;
        // this.oss.post({
        //   url: '/sys/logMenu/add',
        //   data: {resourceId: menu.id, resourceUri: menu.uri}
        // });
        // // this.$root.breadNav = [];
        // // this.$root.breadNav.push(...menu.path);
        // let flag = this.$root.navList.some(item => {
        //   return menu.id == item.id;
        // })
        // if (!flag) {
        //   this.$root.navList.push(menu);
        //   sessionStorage.setItem('navList', JSON.stringify(this.$root.navList));
        // }
        // this.oss.setGlobalData('globalBreadNav', menu.path);
        // let key = this.oss.UUID();
        // this.oss.setGlobalData(key, menu);
        // // 保存当前菜单的id
        // sessionStorage.setItem('currentMenuId', menu.id.toString())
        // this.$root.currentMenuId = menu.id;
        // this.$router.push({name: this.oss.path2name(menu.uri), query: {datakey: key}});
      },
      getMenuChildrenCount(menu) {
        let count = 0;
        if(menu.children) {
          menu.children.map(c => {
            if(c.type === 'menu') {
              count++
            }
          });
        }
        return count;
      }
    },
    mounted() {
      this.$nextTick(function() {
        this.$emit("handleMenu");
      })
    }
  }
</script>

<style lang="less" scoped>
  .icon-nav-menu {
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
    vertical-align: middle;
  }
</style>
