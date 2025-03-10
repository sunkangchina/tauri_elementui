<template>
  <div> 

    <!-- 使用 Magnifier 组件 -->
    <Magnifier :src="imageSrc" alt="示例图片" :zoom="2.5" :lens-size="120" :magnifier-size="240" />

    <div><el-button @click="sendMessage">发送消息</el-button></div>
    <div>收到的消息</div>
    <div style="padding:10px;border:1px solid #eee;margin-top:10px;margin-bottom:10px;">{{ message }}</div>

    <router-link to="/about">
      <el-button type="success">跳转到关于页面</el-button>
    </router-link>
  </div>
</template>

<script>
import Magnifier from '../components/Magnifier.vue'; // 导入组件
import imageSrc from '../assets/image.jpg'; // 导入图片
import MqttService from '../utils/socket';
export default {
  name: 'Home',
  components: {
    Magnifier // 注册组件
  },
  data() {
    return { 
      message: '',
      imageSrc // 传递给组件
    };
  },
  mounted() {
    this.initSocket();
  },
  methods: {
    initSocket() {
      MqttService.connect();

      MqttService.subscribe('my/topic', (message) => {
        console.log('收到消息:', message);
      });

      // 发布消息
      MqttService.publish('my/topic', 'Hello MQTT');
 
    },
    sendMessage() {
      MqttService.publish('my/topic', '发送一个消息 my/topic');
    },
  },
  beforeDestroy() {
     
  },
};
</script>