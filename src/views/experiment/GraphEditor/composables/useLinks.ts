import { ref, Ref } from 'vue';
import type { INode, ILink, ILinkLabelRect, IPoint } from '../types';

export function useLinks(rectList: Ref<INode[]>) {
  const linkList = ref<ILink[]>([]);
  const clickedLink = ref<ILink | null>(null);
  const hoverLink = ref<ILink | null>(null);
  const linkStartNode = ref<INode | null>(null);
  const canDrawLink = ref(false);

  const createLink = (
    source: INode,
    target: INode,
    color: string,
    id: string,
    name: string,
    k: number
  ): ILink => {
    return {
      source,
      target,
      color,
      id,
      name,
      width: 1,
      fontSize: 12,
      linkType: 'solid',
      isSelected: false,
      attr: [],
      k
    };
  };

  const calculateK = () => {
    const newLinks = [...linkList.value];
    const detailData: ILink[] = [];
    const size = 0.8;

    linkList.value.forEach((item) => {
      const list = newLinks.filter(
        (itemN) => itemN.source.id === item.source.id && itemN.target.id === item.target.id
      );
      const listOther = newLinks.filter(
        (itemN) => itemN.source.id === item.target.id && itemN.target.id === item.source.id
      );
      [...list, ...listOther].forEach((itemT, i) => {
        const k = i % 2 === 0 ? -(size + (i / 2) * size) : size + ((i + 1) / 2 - 1) * size;
        const siteBottom = i % 2 === 0 ? 'bottom' : 'top';
        const obj = {
          radian: list.length + listOther.length === 1 ? -0.01 : k
        };
        itemT.k = obj.radian;
        itemT.siteBottom = siteBottom as 'top' | 'bottom';
        const hasIn = detailData.findIndex((d) => d.id === itemT.id);
        if (hasIn === -1) {
          detailData.push(itemT);
        }
      });
    });
  };

  const addLink = (startNode: INode, endNode: INode, color: string) => {
    if (startNode.id === endNode.id) return;

    // 检查两个节点之间是否已存在连线（无论方向）
    const existingLink = linkList.value.find(
      (item) =>
        (item.source.id === startNode.id && item.target.id === endNode.id) ||
        (item.source.id === endNode.id && item.target.id === startNode.id)
    );
    if (existingLink) return;

    const lenL = linkList.value.length;
    const linkId = lenL > 0 ? `link${parseInt(linkList.value[0].id.replace('link', '')) + 1}` : 'link0';

    linkList.value.unshift(createLink(startNode, endNode, color, linkId, linkId, 0));
    calculateK();
  };

  const deleteLink = (linkId: string) => {
    linkList.value = linkList.value.filter(item => item.id !== linkId);
    calculateK();
  };

  const getCross = (pointA: IPoint, pointB: IPoint, eventPoint: IPoint): number => {
    return (pointB.x - pointA.x) * (eventPoint.y - pointA.y) - (eventPoint.x - pointA.x) * (pointB.y - pointA.y);
  };

  const getChooseLink = (pos: IPoint, linkLabelRect: ILinkLabelRect[]): ILinkLabelRect | null => {
    for (const item of linkLabelRect) {
      const isPointIn =
        getCross(item.pointA, item.pointB, pos) * getCross(item.pointC, item.pointD, pos) >= 0 &&
        getCross(item.pointB, item.pointC, pos) * getCross(item.pointD, item.pointA, pos) >= 0;
      if (isPointIn) {
        return item;
      }
    }
    return null;
  };

  const clearAll = () => {
    linkList.value = [];
    clickedLink.value = null;
  };

  return {
    linkList,
    clickedLink,
    hoverLink,
    linkStartNode,
    canDrawLink,
    createLink,
    calculateK,
    addLink,
    deleteLink,
    getChooseLink,
    getCross,
    clearAll
  };
}
