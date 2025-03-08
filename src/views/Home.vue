<template>
  <div>
    <el-button type="primary">首页按钮</el-button>
    <p>欢迎来到首页！</p>

    <!-- 使用 Magnifier 组件 -->
    <Magnifier :src="imageSrc" alt="示例图片" :zoom="2.5" :lens-size="120" :magnifier-size="240" />

    <router-link to="/about">
      <el-button type="success">跳转到关于页面</el-button>
    </router-link>
  </div>
</template>

<script>
import Magnifier from '../components/Magnifier.vue'; // 导入组件
import imageSrc from '../assets/image.jpg'; // 导入图片

export default {
  name: 'Home',
  components: {
    Magnifier // 注册组件
  },
  data() {
    return {
      imageSrc // 传递给组件
    };
  }
};
</script>