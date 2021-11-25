  <template>
  <div>
    <el-tag
      :key="tag"
      v-for="(tag, index) in scope.row.attr_vals"
      closable
      :disable-transitions="false"
      @close="handleClose(index, scope.row)"
    >
      {{ tag }}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="scope.row.inputVisible"
      v-model="scope.row.inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm(scope.row)"
      @blur="handleInputConfirm(scope.row)"
    >
    </el-input>
    <el-button
      v-else
      class="button-new-tag"
      size="small"
      @click="showInput(scope.row)"
      >+ New Tag</el-button
    >
  </div>
</template>
  
  <script>
import { upParams } from '@/network/goods'
export default {
  name: 'Expandtag',
  props: ['scope'],
  methods: {
    // 删除tag标签
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },

    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获取焦点
      // $nextTick 方法的作用 当页面上的元素被重新渲染之后，才会执行回调函数中的方法
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length == 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发起请求
      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      const res = await upParams(row.cat_id, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' '),
      })
      if (res.meta.status != 200)
        return this.$message.error('更新失败：' + res.meta.msg)
      this.$message.success(res.meta.msg)
    },
  },
}
</script>
  
  <style <style lang="less" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>