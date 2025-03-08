import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';  
import { createRouter, createWebHistory } from 'vue-router';

// 定义根组件
const App = {
  template: `<router-view></router-view>`
};

// 配置路由
const routes = [
  { path: '/', component: () => import('./views/Home.vue') },
  { path: '/about', component: () => import('./views/About.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 创建并挂载应用
const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.mount('#app');