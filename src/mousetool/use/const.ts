import type { DefineEmits, DefineProps } from "~/utils/types";
import type { ToolInstances } from "../types";

export const PROPS = {
  /** 是否可见 */
  visible: { type: Boolean, default: true },
  markTool: { type: Object, default: () => ({}) },
  polygonTool: { type: Object, default: () => ({}) },
  polylineTool: { type: Object, default: () => ({}) },
  rectangleTool: { type: Object, default: () => ({}) },
  circleTool: { type: Object, default: () => ({}) },
  paintBrushTool: { type: Object, default: () => ({}) }
};

export const EVENTS = {
  init: (_instances: ToolInstances) => true
};

export type Props = DefineProps<typeof PROPS>;
export type Emit = DefineEmits<typeof EVENTS>;
