<template>
  <div>
    <el-button type="success" @click="back">返回首页</el-button>
    <el-button type="success" @click="handleClick">关于按钮</el-button>
    <p>这是关于页面</p>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick() {
      alert('关于页面按钮被点击了！');
    },
    back() {
      this.$router.push('/'); // 使用 Vue Router 跳转到首页
    }
  }
};
</script>