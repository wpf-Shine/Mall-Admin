<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addDialogVisible = true"
        >添加角色</el-button
      >
      <!-- 角色列表 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', index1 == 0 ? 'dbtop' : '', 'vcenter']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index2 == 0 ? '' : 'dbtop', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6"
                    ><el-tag
                      closable
                      type="success"
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i
                  ></el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addRolesForm"
        :rules="addrolesFormRules"
        ref="addRolesFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnAddRoles()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editRolesForm"
        :rules="editrolesFormRules"
        ref="editRolesFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnEditRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="rightsProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoles,
  addRoles,
  getRole,
  editRole,
  delRole,
  delRight,
  getRights,
  addRight,
} from '@/network/power'
export default {
  name: 'Roles',
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      // 权限数据
      rightsList: [],
      // 树形控件的属性绑定对象
      rightsProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认选中的节点id
      defKeys: [],
      // 当前即将分配权限的角色ID
      roleId: null,
      addDialogVisible: false,
      editDialogVisible: false,
      setRightDialogVisible: false,
      addRolesForm: {
        roleName: '',
        roleDesc: '',
      },
      editRolesForm: {},
      addrolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
      editrolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const res = await getRoles()
      if (res.meta.status != 200)
        return this.$message.error('获取失败：' + res.meta.msg)
      this.rolesList = res.data
    },
    // 添加角色
    btnAddRoles() {
      this.$refs.addRolesFormRef.validate(async (valid) => {
        if (!valid) return
        const res = await addRoles(this.addRolesForm)
        if (res.meta.status != 201)
          return this.$message.error('添加角色失败：' + res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.getRolesList()
      })
    },
    // 监听添加角色对话框的close事件
    addDialogClosed() {
      this.$refs.addRolesFormRef.resetFields()
    },
    // 编辑角色
    async showEditDialog(id) {
      const res = await getRole(id)
      if (res.meta.status != 200)
        return this.$message.error('获取角色信息失败：' + res.meta.msg)
      this.editRolesForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editRolesFormRef.resetFields()
    },
    btnEditRoles() {
      this.$refs.editRolesFormRef.validate(async (valid) => {
        if (!valid) return
        const res = await editRole(this.editRolesForm.roleId, {
          roleName: this.editRolesForm.roleName,
          roleDesc: this.editRolesForm.roleDesc,
        })
        if (res.meta.status != 200)
          return this.$message.error('修改失败' + res.meta.msg)
        this.$message.success('修改角色信息成功')
        this.editDialogVisible = false
        this.getRolesList()
      })
    },
    // 删除角色
    async delRole(id) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
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
      const res = await delRole(id)
      if (res.meta.status != 200)
        return this.$message.error('删除失败:' + res.meta.msg)

      this.$message.success(res.meta.msg)
      this.getRolesList()
    },
    // 删除权限
    async removeRightById(role, rightId) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
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
      const res = await delRight(role.id, rightId)
      if (res.meta.status != 200)
        return this.$message.error('取消授权失败:' + res.meta.msg)
      this.$message.success(res.meta.msg)
      role.children = res.data
    },
    // 分配权限
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限
      const res = await getRights('tree')
      if (res.meta.status != 200)
        return this.$message.error('获取权限数据失败：' + res.meta.msg)
      this.rightsList = res.data
      // 获取三级节点的ID
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归获取角色下的三级权限ID
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含childeren属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击确定后分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      const res = await addRight(this.roleId, { rids: idStr })
      if (res.meta.status != 200)
        return this.$message.error('分配权限失败：' + res.meta.msg)
      this.$message.success(res.meta.msg)
      this.setRightDialogVisible = false
      this.getRolesList()
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.dbtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>