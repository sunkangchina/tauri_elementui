import mqtt from "mqtt";

class MqttService {
  constructor() {
    this.client = null;
    this.url = import.meta.env.VITE_MQTT_URL; // 读取 MQTT URL
    this.clientId = import.meta.env.VITE_MQTT_CLIENT_ID; // 读取客户端 ID
    this.username = import.meta.env.VITE_MQTT_USERNAME; // 读取用户名
    this.password = import.meta.env.VITE_MQTT_PASSWORD; // 读取密码
    this.listeners = {}; // 存储事件监听器
    this.subscribedTopics = new Set(); // 存储已订阅的主题
  }

  // 连接到 MQTT 代理
  connect() {
    this.client = mqtt.connect(this.url, {
      clientId: this.clientId,
      username: this.username,
      password: this.password,
      clean: true,
      reconnectPeriod: 1000,
      keepalive: 60, // 设置心跳间隔为 60 秒
    });

    // 连接成功事件
    this.client.on("connect", () => {
      console.log("MQTT 连接成功");
      this.emit("connected");

      // 重连后重新订阅之前订阅的主题
      this.subscribedTopics.forEach((topic) => {
        this.client.subscribe(topic, (err) => {
          if (err) {
            console.error(`重连后订阅主题 ${topic} 失败:`, err);
          } else {
            console.log(`重连后成功订阅主题: ${topic}`);
          }
        });
      });
    });

    // 连接关闭事件
    this.client.on("close", () => {
      console.log("MQTT 连接关闭");
      this.emit("disconnected");
    });

    // 连接错误事件
    this.client.on("error", (error) => {
      console.error("MQTT 错误:", error);
      this.emit("error", error);
    });

    // 接收到消息事件
    this.client.on("message", (topic, message) => {
      console.log(`收到消息: ${message.toString()}，来自主题: ${topic}`);
      this.emit("message", { topic, message: message.toString() });
    });
  }

  // 订阅主题
  subscribe(topic, callback) {
    if (!this.listeners[topic]) {
      this.listeners[topic] = [];
    }
    this.listeners[topic].push(callback);
    this.subscribedTopics.add(topic); // 记录已订阅的主题

    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(`订阅主题 ${topic} 失败:`, err);
      } else {
        console.log(`成功订阅主题: ${topic}`);
      }
    });
  }

  // 取消订阅主题
  unsubscribe(topic, callback) {
    if (this.listeners[topic]) {
      this.listeners[topic] = this.listeners[topic].filter((listener) => listener !== callback);
      if (this.listeners[topic].length === 0) {
        delete this.listeners[topic];
        this.subscribedTopics.delete(topic); // 移除已订阅的主题
        this.client.unsubscribe(topic, (err) => {
          if (err) {
            console.error(`取消订阅主题 ${topic} 失败:`, err);
          } else {
            console.log(`成功取消订阅主题: ${topic}`);
          }
        });
      }
    }
  }

  // 发布消息
  publish(topic, message) {
    if (this.client && this.client.connected) {
      this.client.publish(topic, message, (err) => {
        if (err) {
          console.error(`发布消息到主题 ${topic} 失败:`, err);
        } else {
          console.log(`成功发布消息到主题: ${topic}`);
        }
      });
    } else {
      console.error("MQTT 未连接");
    }
  }

  // 事件监听
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // 移除事件监听
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
    }
  }

  // 触发事件
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }

  // 断开连接
  disconnect() {
    if (this.client) {
      this.client.end();
      console.log("MQTT 连接已断开");
    }
  }
}

export default new MqttService();