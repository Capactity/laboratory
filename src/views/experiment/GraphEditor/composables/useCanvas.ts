import { ref, Ref, computed } from 'vue';
import type { INode, ILink, ILinkLabelRect, IPoint } from '../types';

export function useCanvas(
  canvasRef: Ref<HTMLCanvasElement | null>,
  rectList: Ref<INode[]>,
  linkList: Ref<ILink[]>
) {
  const linkLabelRect = ref<ILinkLabelRect[]>([]);
  const transform = ref({ k: 1, x: 0, y: 0 });

  const context = computed(() => {
    return canvasRef.value?.getContext('2d') || null;
  });

  const clearCanvas = () => {
    if (!context.value || !canvasRef.value) return;
    const { width, height } = canvasRef.value;
    context.value.clearRect(0, 0, width, height);
  };

  const adjustColor = (color: string, amount: number): string => {
    let usePound = false;
    if (color[0] === '#') {
      color = color.slice(1);
      usePound = true;
    }

    const num = parseInt(color, 16);
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00ff) + amount;
    let b = (num & 0x0000ff) + amount;

    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    return (usePound ? '#' : '') + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  };

  const getRectangleIntersection = (
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    angle: number
  ) => {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    let minT = Infinity;
    let intersectionX = centerX;
    let intersectionY = centerY;

    if (dx > 0.001) {
      const t = halfWidth / dx;
      const y = t * dy;
      if (Math.abs(y) <= halfHeight && t < minT) {
        minT = t;
        intersectionX = centerX + halfWidth;
        intersectionY = centerY + y;
      }
    }

    if (dx < -0.001) {
      const t = -halfWidth / dx;
      const y = t * dy;
      if (Math.abs(y) <= halfHeight && t < minT) {
        minT = t;
        intersectionX = centerX - halfWidth;
        intersectionY = centerY + y;
      }
    }

    if (dy > 0.001) {
      const t = halfHeight / dy;
      const x = t * dx;
      if (Math.abs(x) <= halfWidth && t < minT) {
        minT = t;
        intersectionX = centerX + x;
        intersectionY = centerY + halfHeight;
      }
    }

    if (dy < -0.001) {
      const t = -halfHeight / dy;
      const x = t * dx;
      if (Math.abs(x) <= halfWidth && t < minT) {
        minT = t;
        intersectionX = centerX + x;
        intersectionY = centerY - halfHeight;
      }
    }

    return { x: intersectionX, y: intersectionY };
  };

  const computedRectPoint = (point: IPoint, length: number, angle: number): IPoint => {
    return {
      x: point.x + length * Math.cos(angle),
      y: point.y + length * Math.sin(angle)
    };
  };

  const drawArrow = (d: ILink, target: IPoint, angle: number) => {
    if (!context.value) return;

    const headLen = 10;
    const theta = 30;
    const radian = (angle * 180) / Math.PI;
    const angle1 = ((radian + theta) * Math.PI) / 180;
    const angle2 = ((radian - theta) * Math.PI) / 180;
    const topX = headLen * Math.cos(angle1);
    const topY = headLen * Math.sin(angle1);
    const botX = headLen * Math.cos(angle2);
    const botY = headLen * Math.sin(angle2);

    context.value.beginPath();
    const arrowX = target.x + topX;
    const arrowY = target.y + topY;
    context.value.lineWidth = 1;
    context.value.setLineDash([4, 0]);
    context.value.moveTo(arrowX, arrowY);
    context.value.lineTo(target.x, target.y);

    const arrowX2 = target.x + botX;
    const arrowY2 = target.y + botY;
    context.value.lineTo(arrowX2, arrowY2);
    context.value.fillStyle = d.color;
    context.value.fill();
    context.value.save();
  };

  const drawLinkItem = (item: ILink, clickedLink: INode | null) => {
    if (!context.value) return;

    context.value.font = '12px Arial';

    const sourceText = item.source.name || '';
    const sourceHasIcon = item.source.icon && item.source.icon.trim() !== '';
    let sourceBoxWidth: number, sourceBoxHeight: number;

    if (sourceHasIcon) {
      const iconSize = 40;
      const padding = 8;
      const iconTextGap = 8;

      context.value.font = '11px Arial';
      const maxCharsPerLine = 9;
      const words = sourceText.split('');
      const lines = [];

      for (let i = 0; i < words.length; i += maxCharsPerLine) {
        lines.push(words.slice(i, i + maxCharsPerLine).join(''));
        if (lines.length >= 3) break;
      }

      let maxLineWidth = 0;
      for (const line of lines) {
        const lineWidth = context.value.measureText(line).width;
        if (lineWidth > maxLineWidth) {
          maxLineWidth = lineWidth;
        }
      }

      const textAreaWidth = maxLineWidth + 4;
      const calculatedWidth = padding + iconSize + iconTextGap + textAreaWidth + padding;
      sourceBoxWidth = Math.min(calculatedWidth, 165);
      sourceBoxHeight = 70;
    } else {
      sourceBoxWidth = 90;
      sourceBoxHeight = 70;
    }

    const targetText = item.target.name || '';
    const targetHasIcon = item.target.icon && item.target.icon.trim() !== '';
    let targetBoxWidth: number, targetBoxHeight: number;

    if (targetHasIcon) {
      const iconSize = 40;
      const padding = 8;
      const iconTextGap = 8;

      context.value.font = '11px Arial';
      const maxCharsPerLine = 9;
      const words = targetText.split('');
      const lines = [];

      for (let i = 0; i < words.length; i += maxCharsPerLine) {
        lines.push(words.slice(i, i + maxCharsPerLine).join(''));
        if (lines.length >= 3) break;
      }

      let maxLineWidth = 0;
      for (const line of lines) {
        const lineWidth = context.value.measureText(line).width;
        if (lineWidth > maxLineWidth) {
          maxLineWidth = lineWidth;
        }
      }

      const textAreaWidth = maxLineWidth + 4;
      const calculatedWidth = padding + iconSize + iconTextGap + textAreaWidth + padding;
      targetBoxWidth = Math.min(calculatedWidth, 165);
      targetBoxHeight = 70;
    } else {
      targetBoxWidth = 90;
      targetBoxHeight = 70;
    }

    const sourceAngle = Math.atan2(
      item.target.center.y - item.source.center.y,
      item.target.center.x - item.source.center.x
    );
    const targetAngle = Math.atan2(
      item.source.center.y - item.target.center.y,
      item.source.center.x - item.target.center.x
    );

    const sourcePoint = getRectangleIntersection(
      item.source.center.x,
      item.source.center.y,
      sourceBoxWidth,
      sourceBoxHeight,
      sourceAngle
    );

    const targetPoint = getRectangleIntersection(
      item.target.center.x,
      item.target.center.y,
      targetBoxWidth,
      targetBoxHeight,
      targetAngle
    );

    const centerP = {
      x: (sourcePoint.x + targetPoint.x) / 2,
      y: (sourcePoint.y + targetPoint.y) / 2
    };

    let angle = Math.atan2(sourcePoint.y - targetPoint.y, sourcePoint.x - targetPoint.x);
    let offsetAngle = angle > 0 ? -(Math.PI / 2) + angle : Math.PI / 2 + angle;
    if (angle > Math.PI / 2) {
      angle = -(Math.PI - angle);
      offsetAngle = angle + Math.PI / 2;
    }
    if (angle < -Math.PI / 2) {
      angle = -(-Math.PI - angle);
      offsetAngle = -(Math.PI / 2) + angle;
    }
    const centerLine = {
      x: centerP.x + item.k * 80 * Math.cos(offsetAngle),
      y: centerP.y + item.k * 80 * Math.sin(offsetAngle)
    };

    context.value.beginPath();
    context.value.lineWidth = 20;
    context.value.strokeStyle = 'rgba(0, 0, 0, 0)';
    context.value.bezierCurveTo(
      sourcePoint.x,
      sourcePoint.y,
      centerLine.x,
      centerLine.y,
      targetPoint.x,
      targetPoint.y
    );
    context.value.stroke();

    context.value.beginPath();
    if (item.linkType === 'dash') {
      context.value.setLineDash([4, 2]);
    }

    const baseWidth = Math.max(item.width || 2, 2);
    const isSelected = clickedLink && (clickedLink as any).id === item.id;

    if (isSelected) {
      context.value.shadowColor = 'rgba(64, 158, 255, 0.6)';
      context.value.shadowBlur = 10;
      context.value.lineWidth = baseWidth + 2;
    } else {
      context.value.lineWidth = baseWidth;
    }

    context.value.bezierCurveTo(
      sourcePoint.x,
      sourcePoint.y,
      centerLine.x,
      centerLine.y,
      targetPoint.x,
      targetPoint.y
    );
    context.value.strokeStyle = item.color;
    context.value.stroke();

    if (isSelected) {
      context.value.shadowColor = 'transparent';
      context.value.shadowBlur = 0;
    }

    context.value.save();
    const arrowAngle = Math.atan2(centerLine.y - targetPoint.y, centerLine.x - targetPoint.x);

    drawArrow(item, targetPoint, arrowAngle);

    const clickAreaWidth = 150;
    const clickAreaHeight = 40;

    const rectObj: ILinkLabelRect = {
      pointA: computedRectPoint(
        computedRectPoint(centerLine, -clickAreaWidth / 2, angle),
        -clickAreaHeight / 2,
        offsetAngle
      ),
      pointB: computedRectPoint(
        computedRectPoint(centerLine, clickAreaWidth / 2, angle),
        -clickAreaHeight / 2,
        offsetAngle
      ),
      pointC: computedRectPoint(
        computedRectPoint(centerLine, clickAreaWidth / 2, angle),
        clickAreaHeight / 2,
        offsetAngle
      ),
      pointD: computedRectPoint(
        computedRectPoint(centerLine, -clickAreaWidth / 2, angle),
        clickAreaHeight / 2,
        offsetAngle
      ),
      label: item
    };
    linkLabelRect.value.push(rectObj);

    if (clickedLink && (clickedLink as any).id === item.id) {
      const deleteSize = 20;
      const deleteX = centerLine.x;
      const deleteY = centerLine.y;

      context.value.shadowColor = 'rgba(64, 158, 255, 0.5)';
      context.value.shadowBlur = 8;
      context.value.shadowOffsetX = 0;
      context.value.shadowOffsetY = 0;

      context.value.beginPath();
      context.value.arc(deleteX, deleteY, deleteSize / 2, 0, 2 * Math.PI);
      context.value.fillStyle = '#fff';
      context.value.fill();

      context.value.strokeStyle = '#e0e0e0';
      context.value.lineWidth = 1;
      context.value.stroke();

      context.value.shadowColor = 'transparent';
      context.value.shadowBlur = 0;
      context.value.shadowOffsetX = 0;
      context.value.shadowOffsetY = 0;

      context.value.strokeStyle = '#409EFF';
      context.value.lineWidth = 2;
      context.value.lineCap = 'round';
      const iconOffset = 4;
      context.value.beginPath();
      context.value.moveTo(deleteX - iconOffset, deleteY - iconOffset);
      context.value.lineTo(deleteX + iconOffset, deleteY + iconOffset);
      context.value.moveTo(deleteX + iconOffset, deleteY - iconOffset);
      context.value.lineTo(deleteX - iconOffset, deleteY + iconOffset);
      context.value.stroke();

      item.deleteButton = {
        x: deleteX,
        y: deleteY,
        radius: deleteSize / 2
      };
    }
  };

  const drawNodeItem = (item: INode, clickedNode: INode | null) => {
    if (!context.value) return;

    const text = item.name || '';

    context.value.font = '12px Arial';
    const textWidth = context.value.measureText(text).width;

    const hasIcon = item.icon && item.icon.trim() !== '';
    let boxWidth: number, boxHeight: number;

    if (hasIcon) {
      const iconSize = 40;
      const padding = 8;
      const iconTextGap = 8;

      context.value.font = '11px Arial';
      const maxCharsPerLine = 9;
      const words = text.split('');
      const lines = [];

      for (let i = 0; i < words.length; i += maxCharsPerLine) {
        lines.push(words.slice(i, i + maxCharsPerLine).join(''));
        if (lines.length >= 3) break;
      }

      let maxLineWidth = 0;
      for (const line of lines) {
        const lineWidth = context.value.measureText(line).width;
        if (lineWidth > maxLineWidth) {
          maxLineWidth = lineWidth;
        }
      }

      const textAreaWidth = maxLineWidth + 4;
      const calculatedWidth = padding + iconSize + iconTextGap + textAreaWidth + padding;
      boxWidth = Math.min(calculatedWidth, 165);
      boxHeight = 70;
    } else {
      boxWidth = 90;
      boxHeight = 70;
    }

    const x = item.center.x - boxWidth / 2;
    const y = item.center.y - boxHeight / 2;
    const radius = 12;

    context.value.globalAlpha = 1;

    if (!(clickedNode && clickedNode.id === item.id)) {
      context.value.shadowColor = 'rgba(0, 0, 0, 0.1)';
      context.value.shadowBlur = 8;
      context.value.shadowOffsetX = 0;
      context.value.shadowOffsetY = 2;
    }

    context.value.beginPath();
    context.value.moveTo(x + radius, y);
    context.value.lineTo(x + boxWidth - radius, y);
    context.value.quadraticCurveTo(x + boxWidth, y, x + boxWidth, y + radius);
    context.value.lineTo(x + boxWidth, y + boxHeight - radius);
    context.value.quadraticCurveTo(x + boxWidth, y + boxHeight, x + boxWidth - radius, y + boxHeight);
    context.value.lineTo(x + radius, y + boxHeight);
    context.value.quadraticCurveTo(x, y + boxHeight, x, y + boxHeight - radius);
    context.value.lineTo(x, y + radius);
    context.value.quadraticCurveTo(x, y, x + radius, y);
    context.value.closePath();

    if (hasIcon) {
      context.value.fillStyle = '#fff';
      context.value.fill();
      context.value.lineWidth = 0;
      context.value.strokeStyle = 'transparent';
      context.value.stroke();
    } else {
      const gradient = context.value.createLinearGradient(x, y, x, y + boxHeight);
      gradient.addColorStop(0, item.color);
      gradient.addColorStop(1, adjustColor(item.color, -20));
      context.value.fillStyle = gradient;
      context.value.fill();
      context.value.lineWidth = 0;
      context.value.strokeStyle = 'transparent';
      context.value.stroke();
    }

    context.value.shadowColor = 'transparent';
    context.value.shadowBlur = 0;
    context.value.shadowOffsetX = 0;
    context.value.shadowOffsetY = 0;

    if (clickedNode && clickedNode.id === item.id) {
      context.value.shadowColor = 'rgba(64, 158, 255, 0.5)';
      context.value.shadowBlur = 15;
      context.value.shadowOffsetX = 0;
      context.value.shadowOffsetY = 0;

      context.value.lineWidth = 3;
      context.value.strokeStyle = '#409EFF';
      context.value.stroke();

      context.value.shadowColor = 'transparent';
      context.value.shadowBlur = 0;
    }

    if (hasIcon) {
      const iconSize = 40;
      const padding = 8;
      const iconX = x + padding;
      const iconY = y + (boxHeight - iconSize) / 2;
      const iconRadius = 8;

      context.value.beginPath();
      context.value.moveTo(iconX + iconRadius, iconY);
      context.value.lineTo(iconX + iconSize - iconRadius, iconY);
      context.value.quadraticCurveTo(iconX + iconSize, iconY, iconX + iconSize, iconY + iconRadius);
      context.value.lineTo(iconX + iconSize, iconY + iconSize - iconRadius);
      context.value.quadraticCurveTo(iconX + iconSize, iconY + iconSize, iconX + iconSize - iconRadius, iconY + iconSize);
      context.value.lineTo(iconX + iconRadius, iconY + iconSize);
      context.value.quadraticCurveTo(iconX, iconY + iconSize, iconX, iconY + iconSize - iconRadius);
      context.value.lineTo(iconX, iconY + iconRadius);
      context.value.quadraticCurveTo(iconX, iconY, iconX + iconRadius, iconY);
      context.value.closePath();

      const iconGradient = context.value.createLinearGradient(iconX, iconY, iconX, iconY + iconSize);
      iconGradient.addColorStop(0, item.color);
      iconGradient.addColorStop(1, adjustColor(item.color, -15));
      context.value.fillStyle = iconGradient;
      context.value.fill();

      context.value.shadowColor = 'rgba(0, 0, 0, 0.15)';
      context.value.shadowBlur = 4;
      context.value.shadowOffsetY = 2;

      context.value.shadowColor = 'transparent';
      context.value.shadowBlur = 0;
      context.value.font = '24px Arial';
      context.value.textAlign = 'center';
      context.value.textBaseline = 'middle';
      context.value.fillStyle = '#fff';
      context.value.fillText(item.icon || '', iconX + iconSize / 2, iconY + iconSize / 2);

      context.value.font = '11px Arial';
      context.value.textAlign = 'left';
      context.value.textBaseline = 'top';
      context.value.fillStyle = '#333';

      const iconTextGap = 8;
      const textX = iconX + iconSize + iconTextGap;
      const lineHeight = 15;

      const maxCharsPerLine = 9;
      const words = text.split('');
      const lines = [];

      for (let i = 0; i < words.length; i += maxCharsPerLine) {
        lines.push(words.slice(i, i + maxCharsPerLine).join(''));
      }

      const actualLines = Math.min(lines.length, 3);
      const totalTextHeight = actualLines * lineHeight;
      const textStartY = y + (boxHeight - totalTextHeight) / 2;

      for (let i = 0; i < actualLines; i++) {
        context.value.fillText(lines[i], textX, textStartY + i * lineHeight);
      }
    } else {
      context.value.shadowColor = 'rgba(0, 0, 0, 0.2)';
      context.value.shadowBlur = 8;
      context.value.shadowOffsetX = 0;
      context.value.shadowOffsetY = 2;

      const gradient = context.value.createLinearGradient(x, y, x, y + boxHeight);
      if (item.color === '#52C41A') {
        gradient.addColorStop(0, '#73d13d');
        gradient.addColorStop(1, '#389e0d');
      } else if (item.color === '#FF4D4F') {
        gradient.addColorStop(0, '#ff7875');
        gradient.addColorStop(1, '#cf1322');
      } else {
        gradient.addColorStop(0, item.color);
        gradient.addColorStop(1, adjustColor(item.color, -20));
      }

      context.value.beginPath();
      context.value.moveTo(x + radius, y);
      context.value.lineTo(x + boxWidth - radius, y);
      context.value.quadraticCurveTo(x + boxWidth, y, x + boxWidth, y + radius);
      context.value.lineTo(x + boxWidth, y + boxHeight - radius);
      context.value.quadraticCurveTo(x + boxWidth, y + boxHeight, x + boxWidth - radius, y + boxHeight);
      context.value.lineTo(x + radius, y + boxHeight);
      context.value.quadraticCurveTo(x, y + boxHeight, x, y + boxHeight - radius);
      context.value.lineTo(x, y + radius);
      context.value.quadraticCurveTo(x, y, x + radius, y);
      context.value.closePath();
      context.value.fillStyle = gradient;
      context.value.fill();

      context.value.shadowColor = 'transparent';
      context.value.shadowBlur = 0;
      context.value.shadowOffsetX = 0;
      context.value.shadowOffsetY = 0;

      context.value.font = 'bold 14px Arial';
      context.value.textAlign = 'center';
      context.value.textBaseline = 'middle';
      context.value.fillStyle = '#fff';
      context.value.fillText(text, item.center.x, item.center.y);
    }

    if (clickedNode && clickedNode.id === item.id) {
      const deleteSize = 20;
      const deleteX = x + boxWidth - deleteSize / 4;
      const deleteY = y - deleteSize / 4;

      context.value.shadowColor = 'rgba(64, 158, 255, 0.5)';
      context.value.shadowBlur = 8;
      context.value.shadowOffsetX = 0;
      context.value.shadowOffsetY = 0;

      context.value.beginPath();
      context.value.arc(deleteX, deleteY, deleteSize / 2, 0, 2 * Math.PI);
      context.value.fillStyle = '#fff';
      context.value.fill();

      context.value.strokeStyle = '#e0e0e0';
      context.value.lineWidth = 1;
      context.value.stroke();

      context.value.shadowColor = 'transparent';
      context.value.shadowBlur = 0;
      context.value.shadowOffsetX = 0;
      context.value.shadowOffsetY = 0;

      context.value.strokeStyle = '#409EFF';
      context.value.lineWidth = 2;
      context.value.lineCap = 'round';
      const iconOffset = 4;
      context.value.beginPath();
      context.value.moveTo(deleteX - iconOffset, deleteY - iconOffset);
      context.value.lineTo(deleteX + iconOffset, deleteY + iconOffset);
      context.value.moveTo(deleteX + iconOffset, deleteY - iconOffset);
      context.value.lineTo(deleteX - iconOffset, deleteY + iconOffset);
      context.value.stroke();

      item.deleteButton = {
        x: deleteX,
        y: deleteY,
        radius: deleteSize / 2
      };
    }
  };

  const drawGraph = (clickedNode: INode | null, clickedLink: INode | null, previewLine?: { startNode: INode; endX: number; endY: number; color: string } | null) => {
    if (!context.value) return;

    context.value.save();
    clearCanvas();
    context.value.scale(transform.value.k, transform.value.k);
    linkLabelRect.value = [];

    linkList.value.forEach((item) => {
      drawLinkItem(item, clickedLink);
    });

    // 绘制预览连线
    if (previewLine) {
      drawPreviewLine(previewLine.startNode, previewLine.endX, previewLine.endY, previewLine.color);
    }

    rectList.value.forEach((item) => {
      drawNodeItem(item, clickedNode);
    });

    context.value.restore();
  };

  const drawPreviewLine = (startNode: INode, endX: number, endY: number, color: string) => {
    if (!context.value) return;

    const text = startNode.name || '';
    const hasIcon = startNode.icon && startNode.icon.trim() !== '';
    let boxWidth: number, boxHeight: number;

    if (hasIcon) {
      const iconSize = 40;
      const padding = 8;
      const iconTextGap = 8;

      context.value.font = '11px Arial';
      const maxCharsPerLine = 9;
      const words = text.split('');
      const lines = [];

      for (let i = 0; i < words.length; i += maxCharsPerLine) {
        lines.push(words.slice(i, i + maxCharsPerLine).join(''));
        if (lines.length >= 3) break;
      }

      let maxLineWidth = 0;
      for (const line of lines) {
        const lineWidth = context.value.measureText(line).width;
        if (lineWidth > maxLineWidth) {
          maxLineWidth = lineWidth;
        }
      }

      const textAreaWidth = maxLineWidth + 4;
      const calculatedWidth = padding + iconSize + iconTextGap + textAreaWidth + padding;
      boxWidth = Math.min(calculatedWidth, 165);
      boxHeight = 70;
    } else {
      boxWidth = 90;
      boxHeight = 70;
    }

    const sourceAngle = Math.atan2(
      endY - startNode.center.y,
      endX - startNode.center.x
    );

    const sourcePoint = getRectangleIntersection(
      startNode.center.x,
      startNode.center.y,
      boxWidth,
      boxHeight,
      sourceAngle
    );

    // 绘制虚线预览
    context.value.beginPath();
    context.value.setLineDash([6, 4]);
    context.value.lineWidth = 2;
    context.value.strokeStyle = color;
    context.value.moveTo(sourcePoint.x, sourcePoint.y);
    context.value.lineTo(endX, endY);
    context.value.stroke();
    context.value.setLineDash([]);

    // 绘制箭头
    const arrowAngle = Math.atan2(sourcePoint.y - endY, sourcePoint.x - endX);
    const headLen = 10;
    const theta = 30;
    const radian = (arrowAngle * 180) / Math.PI;
    const angle1 = ((radian + theta) * Math.PI) / 180;
    const angle2 = ((radian - theta) * Math.PI) / 180;
    const topX = headLen * Math.cos(angle1);
    const topY = headLen * Math.sin(angle1);
    const botX = headLen * Math.cos(angle2);
    const botY = headLen * Math.sin(angle2);

    context.value.beginPath();
    context.value.moveTo(endX + topX, endY + topY);
    context.value.lineTo(endX, endY);
    context.value.lineTo(endX + botX, endY + botY);
    context.value.fillStyle = color;
    context.value.fill();
  };

  return {
    context,
    linkLabelRect,
    clearCanvas,
    drawGraph,
    drawNodeItem,
    drawLinkItem,
    getRectangleIntersection,
    computedRectPoint
  };
}
