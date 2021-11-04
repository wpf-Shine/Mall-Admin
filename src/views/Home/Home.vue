<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <img class="shoplogo" src="@/assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-row>
        <el-col :span="12">
          <span class="demonstration"></span>
          <el-dropdown trigger="click">
            <img
              class="Avatar el-dropdown-link"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              alt=""
            />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-plus" @click.native="loginOut"
                >退出</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bff"
          unique-opened
          :collapse="iscollapse"
          :collapse-transition="false"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="subitem.id + ''"
              v-for="subitem in item.children"
              :key="subitem.id"
              ><template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from '@/network/menu'
export default {
  name: 'Home',
  data() {
    return {
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      iscollapse: false,
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    // 获取菜单
    async getMenuList() {
      const res = await getMenuList('menus')
      // 请求失败
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      // 请求成功
      this.menulist = res.data
      console.log(this.menulist)
    },
    // 切换菜单的折叠和展开
    toggleCollapse() {
      this.iscollapse = !this.iscollapse
    },
    // 退出
    loginOut() {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #373d41;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
  .toggle-btn {
    background-color: #4a5064;
    font-size: 10px;
    color: #fff;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf1;
}
.Avatar {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}
.iconfont {
  margin-right: 10px;
}
</style>