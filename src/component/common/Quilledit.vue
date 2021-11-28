<template>
  <!-- manually control the data synchronization（或手动控制数据流） -->
  <quill-editor :content="content" @change="onEditorChange($event)">
  </quill-editor>
</template>

<script>
export default {
  name: 'Quilledit',
  data() {
    return {
      content: '',
    }
  },
  // manually control the data synchronization
  // 如果需要手动控制数据同步，父组件需要显式地处理changed事件
  methods: {
    onEditorChange({ quill, html, text }) {
      this.content = html
      this.$emit('editorChange', this.content)
    },
  },
}
</script> 
<style lang="less" scoped>
</style>