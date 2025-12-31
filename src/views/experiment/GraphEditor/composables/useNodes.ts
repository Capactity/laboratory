import { ref, Ref } from 'vue';
import type { INode, IWorkstationItem, IChannel } from '../types';

export function useNodes() {
  const rectList = ref<INode[]>([]);
  const clickedNode = ref<INode | null>(null);
  const hoverNode = ref<INode | null>(null);
  const isDragging = ref(false);
  const currentRect = ref<INode | null>(null);
  const dragOffsetX = ref(0);
  const dragOffsetY = ref(0);

  const channels = ref<IChannel[]>([
    { id: 0, name: '总机', temperature: 1150, time: 180 },
    { id: 1, name: '通道1', temperature: 1150, time: 180 },
    { id: 2, name: '通道2', temperature: 1150, time: 180 }
  ]);

  const createNode = (
    center: { x: number; y: number; radius: number },
    color: string,
    id: string,
    name: string,
    label: string,
    selected: boolean,
    typeAttr: any[],
    icon = ''
  ): INode => {
    return {
      color,
      id,
      name,
      fontSize: 11,
      label,
      center,
      isSelected: selected,
      attr: typeAttr,
      icon,
      width: center.radius * 2,
      height: center.radius * 2
    };
  };

  const addNode = (workstationItem: IWorkstationItem) => {
    const id = rectList.value.length > 0 ? `node${parseInt(rectList.value[0].id.replace('node', '')) + 1}` : 'node0';
    const center = {
      x: 40,
      y: 40,
      radius: 20
    };
    rectList.value.unshift(
      createNode(
        center,
        workstationItem.color,
        id,
        workstationItem.label,
        workstationItem.label,
        false,
        workstationItem.attr,
        workstationItem.icon
      )
    );
  };

  const mouseNode = (x: number, y: number, context: CanvasRenderingContext2D | null): number => {
    if (!context) return -1;
    
    let index = -1;
    rectList.value.forEach((n, i) => {
      context.font = '12px Arial';
      const text = n.name || '';
      const textWidth = context.measureText(text).width;
      const hasIcon = n.icon && n.icon.trim() !== '';

      let boxWidth: number, boxHeight: number;
      if (hasIcon) {
        const iconSize = 48;
        const minWidth = iconSize + 12;
        const textMinWidth = textWidth + 16;
        boxWidth = Math.max(minWidth, textMinWidth, 60);
        boxHeight = 75;
      } else {
        const maxBoxWidth = 110;
        const padding = 16;
        const lineHeight = 18;
        const maxTextWidth = maxBoxWidth - padding;

        const words = text.split('');
        let line = '';
        let lineCount = 0;

        for (let j = 0; j < words.length; j++) {
          const testLine = line + words[j];
          const metrics = context.measureText(testLine);
          if (metrics.width > maxTextWidth && j > 0) {
            lineCount++;
            line = words[j];
          } else {
            line = testLine;
          }
        }
        if (line) lineCount++;

        boxWidth = maxBoxWidth;
        boxHeight = Math.max(lineCount * lineHeight + padding, 50);
      }

      const left = n.center.x - boxWidth / 2;
      const right = n.center.x + boxWidth / 2;
      const top = n.center.y - boxHeight / 2;
      const bottom = n.center.y + boxHeight / 2;

      if (x >= left && x <= right && y >= top && y <= bottom) {
        index = i;
      }
    });
    return index;
  };

  const updateChannelsFromNode = (node: INode) => {
    if (node.channelConfig && Array.isArray(node.channelConfig)) {
      channels.value = node.channelConfig.map(ch => ({ ...ch }));
    } else {
      const randomTemp1 = 1100 + Math.floor(Math.random() * 100);
      const randomTemp2 = 1100 + Math.floor(Math.random() * 100);
      const randomTemp3 = 1100 + Math.floor(Math.random() * 100);
      const randomTime1 = 150 + Math.floor(Math.random() * 60);
      const randomTime2 = 150 + Math.floor(Math.random() * 60);
      const randomTime3 = 150 + Math.floor(Math.random() * 60);

      node.channelConfig = [
        { id: 0, name: '总机', temperature: randomTemp1, time: randomTime1 },
        { id: 1, name: '通道1', temperature: randomTemp2, time: randomTime2 },
        { id: 2, name: '通道2', temperature: randomTemp3, time: randomTime3 }
      ];
      channels.value = node.channelConfig.map(ch => ({ ...ch }));
    }
  };

  const saveChannelsToNode = () => {
    if (clickedNode.value && clickedNode.value.id && 
        clickedNode.value.name !== '开始' && clickedNode.value.name !== '结束') {
      clickedNode.value.channelConfig = channels.value.map(ch => ({ ...ch }));
    }
  };

  const deleteNode = (nodeId: string, linkList: Ref<any[]>) => {
    rectList.value = rectList.value.filter(item => item.id !== nodeId);
    linkList.value = linkList.value.filter(
      item => item.source.id !== nodeId && item.target.id !== nodeId
    );
  };

  const clearAll = () => {
    rectList.value = [];
    clickedNode.value = null;
  };

  return {
    rectList,
    clickedNode,
    hoverNode,
    isDragging,
    currentRect,
    dragOffsetX,
    dragOffsetY,
    channels,
    createNode,
    addNode,
    mouseNode,
    updateChannelsFromNode,
    saveChannelsToNode,
    deleteNode,
    clearAll
  };
}
