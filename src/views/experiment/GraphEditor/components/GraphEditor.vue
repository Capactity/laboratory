<template>
  <div class="example-boundary">
    <div class="header-row">
      <div class="header-content">
        <span class="item-title">编辑操作：</span>
        <label class="draw-btn">
          <input type="checkbox" v-model="editType" />
          连线编辑
        </label>
        <span style="margin-right: 10px">/</span>
        <span class="shift-style">shift</span>
        <span> + 鼠标左键</span>
        <button class="btn btn-primary draw-btn" @click="clearAll">清空画布</button>
        <button class="btn btn-primary draw-btn download-btn" @click="upload">
          数据导出
        </button>
      </div>
    </div>

    <div class="content-canvas">
      <div class="left-sidebar">
        <div v-for="category in workstationCategories" :key="category.title" class="category-section">
          <div class="category-header">
            <span class="category-title">{{ category.title }}</span>
          </div>
          <div class="workstation-list">
            <div
              v-for="item in category.items"
              :key="item.id"
              class="workstation-item"
              draggable="true"
              @dragstart="onDragStart($event, item)"
            >
              <div class="background-layer" :style="{ background: item.color }"></div>
              <div v-if="item.icon" class="icon-container">
                <span class="icon">{{ item.icon }}</span>
              </div>
              <span class="workstation-label">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="canvas-box" ref="canvasBoxRef">
        <canvas
          ref="canvasRef"
          width="110"
          height="750"
          @mousedown="mouseDown"
          @mousemove="mouseMove"
          @mouseup="mouseUp"
          @click="getCanvasClick"
          @dragover="onDragOver"
          @drop="onDrop"
        >
        </canvas>
      </div>

      <div class="right-panel">
        <div class="card">
          <div class="card-header">
            <span>属性</span>
          </div>
          <div class="card-body">
            <div
              v-if="clickedNode && clickedNode.id"
              class="channel-config"
            >
              <div v-for="channel in channels" :key="channel.id" class="channel-item">
                <div class="channel-header">
                  <span>{{ channel.name }}</span>
                </div>
                <div class="channel-fields">
                  <div class="field-row">
                    <label>温度上限</label>
                    <input
                      type="number"
                      v-model="channel.temperature"
                      @input="saveChannelsToNode"
                    />
                  </div>
                  <div class="field-row">
                    <label>时间</label>
                    <input type="text" v-model="channel.time" @input="saveChannelsToNode" />
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>请选择一个节点查看配置</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useCanvas } from '../composables/useCanvas';
import { useNodes } from '../composables/useNodes';
import { useLinks } from '../composables/useLinks';
import type { IWorkstationCategory, IWorkstationItem } from '../types';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasBoxRef = ref<HTMLDivElement | null>(null);

const {
  rectList,
  clickedNode,
  isDragging,
  currentRect,
  dragOffsetX,
  dragOffsetY,
  channels,
  createNode,
  mouseNode,
  updateChannelsFromNode,
  saveChannelsToNode,
  deleteNode,
  clearAll: clearAllNodes
} = useNodes();

const { linkList, clickedLink, linkStartNode, canDrawLink, addLink, deleteLink, getChooseLink, clearAll: clearAllLinks } = useLinks(rectList);

const { context, linkLabelRect, clearCanvas, drawGraph, getRectangleIntersection } = useCanvas(
  canvasRef,
  rectList,
  linkList
);

const editType = ref(false);
const startLX = ref(0);
const startLY = ref(0);
const endX = ref(0);
const endY = ref(0);
const isDragLink = ref(false);
const draggedLegend = ref<IWorkstationItem | null>(null);
const dragStartOffsetX = ref(0);
const dragStartOffsetY = ref(0);

const workstationCategories = ref<IWorkstationCategory[]>([
  {
    title: '工具类',
    items: [
      { id: 'ws_start', label: '开始', icon: '▶️', color: '#52C41A', attr: [], check: false },
      { id: 'ws_end', label: '结束', icon: '⏹️', color: '#FF4D4F', attr: [], check: false }
    ]
  },
  {
    title: '同步热分析类',
    items: [
      { id: 'ws1', label: '双炉体自动进样差热天平HQST-1', icon: '🔥', color: '#5B8FF9', attr: [], check: true }
    ]
  }
]);

const colorLink = ref([
  { color: '#3fb1e3', check: false, hasChoose: true }
]);

const setCanvasEl = () => {
  if (!canvasBoxRef.value || !canvasRef.value) return;
  const width = canvasBoxRef.value.offsetWidth;
  canvasRef.value.setAttribute('width', `${width}px`);
  drawGraph(clickedNode.value, clickedLink.value as any);
};

const mouseDown = (e: MouseEvent) => {
  startLX.value = e.offsetX;
  startLY.value = e.offsetY;
  const rectIndex = mouseNode(e.offsetX, e.offsetY, context.value);
  if (rectIndex !== -1) {
    currentRect.value = rectList.value[rectIndex];
    isDragging.value = false;
    dragOffsetX.value = e.offsetX - currentRect.value.center.x;
    dragOffsetY.value = e.offsetY - currentRect.value.center.y;
    if (editType.value) {
      linkStartNode.value = currentRect.value;
    }
  }
  canDrawLink.value = editType.value;
};

const mouseMove = (e: MouseEvent) => {
  endX.value = e.offsetX;
  endY.value = e.offsetY;
  if (!editType.value && currentRect.value) {
    const dx = e.offsetX - startLX.value;
    const dy = e.offsetY - startLY.value;
    if (Math.sqrt(dx * dx + dy * dy) > 5) {
      isDragging.value = true;
      currentRect.value.center = {
        x: e.offsetX - dragOffsetX.value,
        y: e.offsetY - dragOffsetY.value,
        radius: currentRect.value.center.radius
      };
      drawGraph(clickedNode.value, clickedLink.value as any);
    }
  }
};

const mouseUp = () => {
  const nodeIndex = mouseNode(endX.value, endY.value, context.value);
  if (nodeIndex !== -1 && canDrawLink.value && linkStartNode.value) {
    const endNode = rectList.value[nodeIndex];
    if (linkStartNode.value.id !== endNode.id) {
      addLink(linkStartNode.value, endNode, colorLink.value[0].color);
    }
  }
  currentRect.value = null;
  linkStartNode.value = null;
  canDrawLink.value = false;
  isDragging.value = false;
  drawGraph(clickedNode.value, clickedLink.value as any);
};

const getCanvasClick = (e: MouseEvent) => {
  const pos = { x: e.offsetX, y: e.offsetY };
  const linkObj = getChooseLink(pos, linkLabelRect.value);
  if (!linkObj) {
    const nodeIndex = mouseNode(pos.x, pos.y, context.value);
    if (nodeIndex !== -1) {
      clickedNode.value = rectList.value[nodeIndex];
      if (clickedNode.value.name !== '开始' && clickedNode.value.name !== '结束') {
        updateChannelsFromNode(clickedNode.value);
      }
    }
  } else {
    clickedLink.value = linkObj.label;
  }
  drawGraph(clickedNode.value, clickedLink.value as any);
};

const clearAll = () => {
  clearAllNodes();
  clearAllLinks();
  drawGraph(null, null);
};

const upload = () => {
  console.log('Upload');
};

const onDragStart = (event: DragEvent, item: IWorkstationItem) => {
  draggedLegend.value = item;
  const target = event.target as HTMLElement;
  if (target) {
    const rect = target.getBoundingClientRect();
    dragStartOffsetX.value = event.clientX - (rect.left + rect.width / 2);
    dragStartOffsetY.value = event.clientY - (rect.top + rect.height / 2);
  }
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  if (!draggedLegend.value) return;
  const dropX = event.offsetX - dragStartOffsetX.value;
  const dropY = event.offsetY - dragStartOffsetY.value;
  const id = rectList.value.length > 0 ? `node${parseInt(rectList.value[0].id.replace('node', '')) + 1}` : 'node0';
  const center = { x: dropX, y: dropY, radius: 20 };
  rectList.value.unshift(
    createNode(
      center,
      draggedLegend.value.color,
      id,
      draggedLegend.value.label,
      draggedLegend.value.label,
      false,
      draggedLegend.value.attr,
      draggedLegend.value.icon || ''
    )
  );
  draggedLegend.value = null;
  drawGraph(clickedNode.value, clickedLink.value as any);
};

onMounted(() => {
  setCanvasEl();
  window.addEventListener('resize', setCanvasEl);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') editType.value = true;
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') editType.value = false;
    if (e.key === 'Delete' && clickedNode.value) {
      deleteNode(clickedNode.value.id, linkList);
      clickedNode.value = null;
      drawGraph(null, null);
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', setCanvasEl);
});
</script>

<style scoped>
.example-boundary {
  padding: 20px;
}
.content-canvas {
  display: flex;
  gap: 20px;
}
.left-sidebar {
  width: 200px;
}
.canvas-box {
  flex: 1;
}
.right-panel {
  width: 300px;
}
.workstation-item {
  padding: 10px;
  margin: 5px 0;
  cursor: move;
  border-radius: 8px;
}
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
}
.card-header {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}
.card-body {
  padding: 12px;
}
.channel-item {
  margin-bottom: 16px;
}
.field-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.field-row label {
  width: 80px;
}
.field-row input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
