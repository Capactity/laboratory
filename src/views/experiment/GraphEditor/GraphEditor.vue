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
          <div class="workstation-list" :class="{'start-end-list': category.title === '工具类'}">
            <div
              v-for="item in category.items"
              :key="item.id"
              class="workstation-item"
              draggable="true"
              :class="{ 'active': item.check, 'has-icon': item.icon, 'no-icon': !item.icon, 'start-end-node': item.id === 'ws_start' || item.id === 'ws_end' }"
              @dragstart="onDragStart($event, item)"
            >
              <div class="background-layer" :style="{ background: item.color }"></div>
              <div v-if="item.icon" class="icon-container">
                <div class="item-bg"></div>
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
        <el-card class="property-card" shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon><Setting /></el-icon>
              <span>属性配置</span>
            </div>
          </template>
          <div class="card-body">
            <div v-if="clickedNode && clickedNode.id" class="channel-config">
              <el-collapse v-model="activeChannels">
                <el-collapse-item
                  v-for="channel in channels"
                  :key="channel.id"
                  :name="channel.id"
                >
                  <template #title>
                    <div class="collapse-title">
                      <el-icon><Monitor /></el-icon>
                      <span>{{ channel.name }}</span>
                    </div>
                  </template>
                  <el-form label-position="left" label-width="80px" size="default">
                    <el-form-item label="温度上限">
                      <el-input-number
                        v-model="channel.temperature"
                        :min="0"
                        :max="2000"
                        :step="10"
                        controls-position="right"
                        @change="saveChannelsToNode"
                      />
                      <span class="unit">°C</span>
                    </el-form-item>
                    <el-form-item label="时间">
                      <el-input-number
                        v-model="channel.time"
                        :min="0"
                        :max="9999"
                        :step="10"
                        controls-position="right"
                        @change="saveChannelsToNode"
                      />
                      <span class="unit">min</span>
                    </el-form-item>
                  </el-form>
                </el-collapse-item>
              </el-collapse>
            </div>
            <el-empty v-else description="请选择一个节点查看配置" :image-size="100" />
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Setting, Monitor } from '@element-plus/icons-vue';
import { useCanvas } from './composables/useCanvas';
import { useNodes } from './composables/useNodes';
import { useLinks } from './composables/useLinks';
import type { IWorkstationCategory, IWorkstationItem } from './types';

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
const activeChannels = ref<string[]>([]);

const workstationCategories = ref<IWorkstationCategory[]>([
  {
			title: '工具类',
			items: [
				{ id: 'ws_start', label: '开始', icon: '▶️', color: '#52C41A', attr: [], check: false }, // 添加开始图标
				{ id: 'ws_end', label: '结束', icon: '⏹️', color: '#FF4D4F', attr: [], check: false } // 添加结束图标
			]
		},
		{
			title: '同步热分析类',
			items: [
				{ id: 'ws1', label: '双炉体自动进样差热天平HQST-1', icon: '🔥', color: '#5B8FF9', attr: [], check: false },
				{ id: 'ws2', label: '全自动差热天平HOT-2', icon: '🌡️', color: '#5B8FF9', attr: [], check: false }
			]
		},
		{
			title: '差示扫描量热仪类',
			items: [
				{ id: 'ws3', label: '自动进样差示扫描量热仪HQSC-1', icon: '📊', color: '#5B8FF9', attr: [], check: false },
				{ id: 'ws4', label: '差示扫描量热仪HSC-2', icon: '📈', color: '#5B8FF9', attr: [], check: false }
			]
		},
		{
			title: '热重分析仪类',
			items: [
				{ id: 'ws5', label: '自动热重分析仪HQG-1', icon: '⚖️', color: '#5B8FF9', attr: [], check: false },
				{ id: 'ws6', label: '微机热天平HTG-2', icon: '💻', color: '#5B8FF9', attr: [], check: false }
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
  // 连线模式下绘制预览线
  if (editType.value && linkStartNode.value) {
    const previewLine = {
      startNode: linkStartNode.value,
      endX: e.offsetX,
      endY: e.offsetY,
      color: colorLink.value[0].color
    };
    drawGraph(clickedNode.value, clickedLink.value as any, previewLine);
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
      clickedLink.value = null;
      if (clickedNode.value.name !== '开始' && clickedNode.value.name !== '结束') {
        updateChannelsFromNode(clickedNode.value);
        // 默认展开所有折叠面板
        activeChannels.value = channels.value.map(c => c.id);
      }
    } else {
      // 点击空白处，取消选中
      clickedNode.value = null;
      clickedLink.value = null;
    }
  } else {
    clickedLink.value = linkObj.label;
    clickedNode.value = null;
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
</style>


<style lang="scss" scoped>
.content-canvas {
  display: flex;
  width: calc(100% - 20px);
  margin: 0 10px;
  gap: 20px;

  .left-sidebar {
    width: 240px;
    min-width: 240px;
    background: #fff;
    border: 1px solid #d9d9d9;
    padding: 0;
    height: calc(100vh - 150px);
    overflow-y: auto;

    .category-section {
      margin-bottom: 0;
      border-bottom: 1px solid #e8e8e8;

      &:last-child {
        border-bottom: none;
      }

      .category-header {
        padding: 12px 16px;
        background: #fafafa;
        border-bottom: 1px solid #e8e8e8;

        .category-title {
          font-size: 14px;
          font-weight: 600;
          color: #262626;
        }
      }

      .workstation-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;

        &.start-end-list {
          flex-direction: row;
          justify-content: center;
          gap: 12px;
        }

        .workstation-item {
          width: 165px;
          display: flex;
          align-items: center;
          padding: 0;
          border-radius: 12px;
          cursor: move;
          cursor: grab;
          transition: all 0.2s ease;
          position: relative;
          height: 65px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;

          .background-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 12px;
            z-index: 0;
          }

          &.no-icon {
            width: 90px;
          }

          &.start-end-node {
            width: 90px;
            justify-content: center;

            .workstation-label {
              text-align: center;
              width: 100%;
              padding: 0 8px;
            }
          }

          &:active {
            cursor: grabbing;
          }

          &:not(.dragging) {
            opacity: 1 !important;
          }

          &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateY(-1px);
          }

          &.active {
            box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.5);
          }

          &.has-icon {
            justify-content: flex-start;

            .background-layer {
              background: linear-gradient(180deg, var(--bg-color-light), var(--bg-color-dark)) !important;
            }

            .icon-container {
              width: 40px;
              height: 40px;
              margin: 0 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
              flex-shrink: 0;
              position: relative;
              z-index: 1;

              .item-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 8px;
                z-index: -1;
                background: #1e80ff;
              }

              .icon {
                font-size: 24px;
                line-height: 1;
                color: #fff;
              }
            }

            .workstation-label {
              flex: 1;
              font-size: 11px;
              color: #333;
              text-align: left;
              line-height: 1.4;
              padding-right: 8px;
              font-weight: 400;
              word-break: break-all;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              position: relative;
              z-index: 1;
            }
          }

          &[style*='#5B8FF9'] {
            --bg-color-light: #5b8ff9;
            --bg-color-dark: #3a6fd9;
          }
        }
      }
    }

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;

      &:hover {
        background: #a8a8a8;
      }
    }
  }

  .canvas-box {
    flex: 1;
    position: relative;
    min-width: 400px;
    height: calc(100vh - 150px);
    overflow: hidden;
    background-color: #ffffff;
    background-image: linear-gradient(rgba(200, 200, 200, 0.2) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200, 200, 200, 0.2) 1px, transparent 1px);
    background-size: 20px 20px;

    canvas {
      transition: all 0.2s ease;
      background: transparent !important;

      &.drag-over {
        box-shadow: 0 0 20px rgba(24, 144, 255, 0.4);
        border: 2px dashed #1890ff;
      }
    }
  }

  .right-panel {
    width: 320px;
    min-width: 320px;
    height: calc(100vh - 150px);

    .property-card {
      height: 100%;
      display: flex;
      flex-direction: column;

      :deep(.el-card__header) {
        padding: 16px 20px;
        border-bottom: 1px solid #ebeef5;
      }

      :deep(.el-card__body) {
        flex: 1;
        overflow-y: auto;
        padding: 0;
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 500;
        color: #303133;

        .el-icon {
          color: #409eff;
        }
      }

      .card-body {
        padding: 16px;
      }
    }

    .channel-config {
      :deep(.el-collapse) {
        border: none;

        .el-collapse-item__header {
          height: 48px;
          padding: 0 12px;
          background: #f5f7fa;
          border-radius: 6px;
          margin-bottom: 8px;
          border: none;

          &:hover {
            background: #ecf5ff;
          }

          &.is-active {
            background: #ecf5ff;
          }
        }

        .el-collapse-item__wrap {
          border: none;
        }

        .el-collapse-item__content {
          padding: 16px 8px;
        }
      }

      .collapse-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        color: #303133;

        .el-icon {
          color: #409eff;
        }
      }

      :deep(.el-form-item) {
        margin-bottom: 18px;

        &:last-child {
          margin-bottom: 0;
        }

        .el-form-item__label {
          color: #606266;
          font-weight: 400;
        }

        .el-input-number {
          width: 140px;
        }
      }

      .unit {
        margin-left: 8px;
        color: #909399;
        font-size: 13px;
      }
    }

    :deep(.el-empty) {
      padding: 40px 0;

      .el-empty__description {
        color: #909399;
      }
    }
  }

  .edit-item {
    width: 100%;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
    min-height: 300px;

    .empty-icon {
      margin-bottom: 8px;

      .icon-inbox {
        font-size: 48px;
        color: #d9d9d9;
      }
    }

    .empty-text {
      p {
        margin: 0;
        line-height: 1.6;
      }
    }
  }
}

.item-box {
  display: flex;
  margin-bottom: 15px;

  .color-list {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% - 80px);
  }

  .title {
    display: inline-block;
    width: 60px;
  }

  .color-box {
    display: inline-block;
    min-width: 50px;
    height: 30px;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 0 5px;
    color: #fff;
    font-size: 12px;
    line-height: 25px;
    text-align: center;
    cursor: pointer;
  }

  .has-choose {
    background: #c4c2c2 !important;
    border: 3px solid #c4c2c2 !important;
    cursor: default;
    pointer-events: none;
  }
}

.edit-button {
  margin-left: 20px;
  color: #fff;
}

.draw-btn {
  margin-left: 20px;

  img {
    margin-top: -2px;
    margin-right: 5px;
  }
}

.download-btn {
  background-color: #21bc29;
  border-color: #21bc29;
}

.item-title {
  font-weight: 600;
}

.shift-style {
  padding: 3px 7px;
  border: 1px solid #333;
  border-radius: 3px;
}

.attr-box {
  display: inline-block;
  width: 80%;

  button {
    margin-bottom: 10px;
  }

  .save-btn {
    margin-top: 20px;
    padding: 0 20px;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;

    th,
    td {
      border: 1px solid #d9d9d9;
      padding: 8px;
      text-align: left;
    }

    th {
      background: #fafafa;
      font-weight: 600;
    }

    .editable-cell {
      cursor: pointer;
      padding: 4px;
      min-height: 20px;

      &:hover {
        background: #f5f5f5;
      }
    }

    input {
      width: 100%;
      padding: 4px;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
    }

    a {
      color: #1890ff;
      cursor: pointer;

      &:hover {
        color: #40a9ff;
      }
    }
  }
}

.example-boundary {
  width: 100%;
  height: auto;
  overflow-x: hidden;
  background-color: #f8f8f8;
}

.header-row {
  padding-top: 30px;

  .header-col {
    margin: 0 0 20px 10px;
  }
}

.btn {
  padding: 4px 15px;
  font-size: 14px;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: #40a9ff;
    border-color: #40a9ff;
  }

  &.btn-primary {
    color: #fff;
    background: #1890ff;
    border-color: #1890ff;

    &:hover {
      background: #40a9ff;
      border-color: #40a9ff;
    }
  }
}

.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 600px;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1001;

  .drawer-header {
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    button {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #999;

      &:hover {
        color: #333;
      }
    }
  }

  .drawer-body {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 520px;
  max-width: 90%;

  .modal-header {
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    button {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #999;

      &:hover {
        color: #333;
      }
    }
  }

  .modal-body {
    padding: 24px;

    .upload-area {
      border: 1px dashed #d9d9d9;
      border-radius: 2px;
      padding: 40px;
      text-align: center;
      background: #fafafa;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #40a9ff;
      }

      input[type='file'] {
        display: none;
      }

      .upload-text {
        margin: 8px 0;
        color: rgba(0, 0, 0, 0.85);
      }

      .upload-hint {
        margin: 0;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
      }
    }

    .radio-group {
      margin-top: 16px;

      label {
        display: block;
        margin-bottom: 8px;
        cursor: pointer;

        input[type='radio'] {
          margin-right: 8px;
        }
      }
    }
  }

  .modal-footer {
    padding: 10px 16px;
    border-top: 1px solid #f0f0f0;
    text-align: right;

    button {
      margin-left: 8px;
    }
  }
}
</style>
