export interface INode {
  id: string;
  name: string;
  label: string;
  color: string;
  fontSize: number;
  center: {
    x: number;
    y: number;
    radius: number;
  };
  isSelected: boolean;
  attr: Array<{ name: string; value: string; isType?: boolean }>;
  icon?: string;
  width?: number;
  height?: number;
  channelConfig?: IChannel[];
  deleteButton?: {
    x: number;
    y: number;
    radius: number;
  };
}

export interface ILink {
  id: string;
  name: string;
  source: INode;
  target: INode;
  color: string;
  width: number;
  fontSize: number;
  linkType: 'solid' | 'dash';
  isSelected: boolean;
  attr: Array<{ name: string; value: string }>;
  k: number;
  siteBottom?: 'top' | 'bottom';
  deleteButton?: {
    x: number;
    y: number;
    radius: number;
  };
}

export interface IWorkstationItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  attr: any[];
  check: boolean;
}

export interface IWorkstationCategory {
  title: string;
  items: IWorkstationItem[];
}

export interface ILegend {
  label: string;
  color: string;
  attr: Array<{ name: string; value: string; isType: boolean }>;
  check: boolean;
}

export interface IColorItem {
  color: string;
  check: boolean;
  hasChoose: boolean;
}

export interface IChannel {
  id: number;
  name: string;
  temperature: number;
  time: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface ILinkLabelRect {
  pointA: IPoint;
  pointB: IPoint;
  pointC: IPoint;
  pointD: IPoint;
  label: ILink;
}
