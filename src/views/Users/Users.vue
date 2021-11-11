<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="7"
          ><el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getUserList"
            @keyup.enter.native="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          ></el-col
        ></el-row
      >
      <!-- 用户列表 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row.id, scope.row.mg_state)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top-end"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="delUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                size="mini"
                @click="showSetRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加用户 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <!-- 主体 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色 -->
      <el-dialog
        title="分配角色"
        :visible.sync="editRoleDialogVisible"
        width="50%"
        @close="setRoleDialogClosed"
      >
        <div>
          <p>
            当前用户：<el-tag>{{ this.userInfo.username }}</el-tag>
          </p>
          <p>
            当前角色：<el-tag type="success">{{
              this.userInfo.role_name
            }}</el-tag>
          </p>
          <p>
            分配新角色：<el-select
              v-model="selectedRoleId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="btnEditRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  getUserList,
  getUserState,
  addUser,
  getUser,
  editUser,
  delUser,
  getRoles,
  setRole,
} from '@/network/users'

export default {
  name: 'Users',
  data() {
    // 自定义规则
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      } else {
        callback(new Error('邮箱格式不符'))
      }
    }
    let checkMobile = (rule, value, callback) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      } else {
        callback(new Error('手机格式不符'))
      }
    }
    return {
      // 获取用户列表参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      rolesList: [],
      selectedRoleId: '',
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      editRoleDialogVisible: false,
      userInfo: {},
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      editForm: {},
      // 验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const res = await getUserList(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      )
      if (res.meta.status != 200)
        // 获取信息失败
        return this.$message.error(res.meta.msg)
      // 成功
      this.userList = res.data.users
      this.total = res.data.total
    },
    // pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 改变用户状态
    async userStateChange(uid, type) {
      const res = await getUserState(uid, type)
      if (res.meta.status != 200) {
        return this.$message.error('更新状态失败：' + res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 监听添加用户对话框的close事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定添加用户
    addUser() {
      // 表单预校验
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        //通过发起请求
        const res = await addUser(this.addForm)
        if (res.meta.status != 201)
          return this.$message.error('添加用户失败：' + res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 点击修改获取用户信息
    async showEditDialog(id) {
      const res = await getUser(id)
      if (res.meta.status != 200)
        return this.$message.error('请求失败：' + res.meta.msg)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击确认修改用户信息
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const res = await editUser(this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        })
        if (res.meta.status != 200)
          return this.$message.error('更新失败：' + res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    // 删除用户
    async delUser(id) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => {
        err
      })
      if (confirmRes != 'confirm') return this.$message.info('已取消删除')
      const res = await delUser(id)
      if (res.meta.status != 200)
        return this.$message.error('删除失败:' + res.meta.msg)

      this.$message.success(res.meta.msg)
      this.getUserList()
    },
    // 点击分配角色
    async showSetRoleDialog(user) {
      this.userInfo = user
      const res = await getRoles()
      if (res.meta.status != 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
      this.editRoleDialogVisible = true
    },
    // 点击确认分配角色
    async btnEditRole() {
      if (!this.selectedRoleId) return this.$message.error('请选择要分配的角色')
      const res = await setRole(this.userInfo.id, { rid: this.selectedRoleId })
      if (res.meta.status != 200)
        return this.$message.error('更新角色失败：' + res.meta.msg)
      this.$message.success(res.meta.msg)
      this.editRoleDialogVisible = false
      this.getUserList()
    },
    // 分配角色的Dialog关闭
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = ''
    },
  },
}
</script>

<style lang="less" scoped>
</style>