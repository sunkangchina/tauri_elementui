import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()], // 支持 .vue 文件
  clearScreen: false,
  server: {
    port: 3001,
    strictPort: true,
    host: 'localhost'
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    minify: 'esbuild'
  },
  resolve: {
    alias: {
      // 确保 vue 指向支持运行时编译的版本
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  }
});