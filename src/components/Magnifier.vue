<template>
    <div class="image-container" @mousemove="moveLens" @mouseleave="hideLens">
      <img ref="image" :src="src" :alt="alt" class="zoom-image" />
      <div ref="lens" class="lens"></div>
      <div ref="magnifier" class="magnifier"></div>
    </div>
  </template>
  
  <script>
export default {
  name: 'Magnifier',
  props: {
    src: { type: String, required: true },
    alt: { type: String, default: 'Image' },
    zoom: { type: Number, default: 2 },
    lensSize: { type: Number, default: 100 }, // 镜头直径
    magnifierSize: { type: Number, default: 200 }, // 放大镜直径
    position: { 
      type: String, 
      default: 'right', 
      validator: value => ['right', 'left', 'top', 'bottom'].includes(value)
    }
  },
  methods: {
    moveLens(event) {
      const image = this.$refs.image;
      const lens = this.$refs.lens;
      const magnifier = this.$refs.magnifier;

      const rect = image.getBoundingClientRect();
      const x = event.pageX - rect.left - window.scrollX;
      const y = event.pageY - rect.top - window.scrollY;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        lens.style.display = 'none';
        magnifier.style.display = 'none';
        return;
      }

      lens.style.display = 'block';
      magnifier.style.display = 'block';

      const lensSize = this.lensSize; // 镜头直径
      const magnifierSize = this.magnifierSize; // 放大镜直径

      // 限制镜头圆心位置
      const lensX = Math.max(lensSize / 2, Math.min(x, rect.width - lensSize / 2));
      const lensY = Math.max(lensSize / 2, Math.min(y, rect.height - lensSize / 2));
      lens.style.left = `${lensX - lensSize / 2}px`;
      lens.style.top = `${lensY - lensSize / 2}px`;

      const zoom = this.zoom;
      const zoomedWidth = rect.width * zoom;
      const zoomedHeight = rect.height * zoom;

      // 计算镜头圆心的放大位置
      const lensCenterX = lensX; // 圆心 x 坐标
      const lensCenterY = lensY; // 圆心 y 坐标
      const lensRadius = lensSize / 2; // 镜头半径

      // 计算放大镜的背景位置（基于镜头圆心）
      const bgX = (lensCenterX - lensRadius) * zoom; // 镜头左边界放大后的位置
      const bgY = (lensCenterY - lensRadius) * zoom; // 镜头上边界放大后的位置

      // 调整边界，确保镜头圆形区域完整显示
      const maxBgX = zoomedWidth - (lensSize * zoom); // 最大 x 偏移
      const maxBgY = zoomedHeight - (lensSize * zoom); // 最大 y 偏移
      const adjustedBgX = Math.max(0, Math.min(bgX, maxBgX));
      const adjustedBgY = Math.max(0, Math.min(bgY, maxBgY));

      magnifier.style.backgroundImage = `url(${this.src})`;
      magnifier.style.backgroundSize = `${zoomedWidth}px ${zoomedHeight}px`;
      magnifier.style.backgroundPosition = `-${adjustedBgX}px -${adjustedBgY}px`;
    },
    hideLens() {
      this.$refs.lens.style.display = 'none';
      this.$refs.magnifier.style.display = 'none';
    }
  }
};
</script>
  
  <style scoped>
  .image-container {
    position: relative;
    display: inline-block;
    margin: 20px 0;
  }
  
  .zoom-image {
    width: 400px;
    height: auto;
  }
  
  .lens {
    position: absolute;
    width: v-bind(lensSize + 'px'); /* 圆形直径 */
    height: v-bind(lensSize + 'px');
    border: 2px solid #ccc;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50%; /* 改为圆形 */
    display: none;
    pointer-events: none;
  }
  
  .magnifier {
    position: absolute;
    width: v-bind(magnifierSize + 'px'); /* 使用 props 定义的直径 */
    height: v-bind(magnifierSize + 'px');
    border: 2px solid #ccc;
    border-radius: 50%;
    background-repeat: no-repeat;
    display: none;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
  
  .magnifier {
    top: v-bind(position === 'bottom' ? 'calc(100% + 20px)' : position === 'top' ? `-${magnifierSize + 20}px` : '0');
    left: v-bind(position === 'right' ? 'unset' : position === 'left' ? `-${magnifierSize + 20}px` : '0');
    right: v-bind(position === 'right' ? `-${magnifierSize + 20}px` : 'unset');
    bottom: v-bind(position === 'bottom' ? 'unset' : '0');
  }
  </style>