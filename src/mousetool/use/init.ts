import type { Props } from "./";
import type { ToolInstances } from "../types";

export function useInit(props: Props, tdtMap: T.Map): ToolInstances {
  const { visible, markTool, polygonTool, polylineTool, rectangleTool, circleTool, paintBrushTool } = props;
  const tools: ToolInstances = {
    markTool: new T.MarkTool(tdtMap, markTool),
    polygonTool: new T.PolygonTool(tdtMap, polygonTool),
    polylineTool: new T.PolylineTool(tdtMap, polylineTool),
    rectangleTool: new T.RectangleTool(tdtMap, rectangleTool),
    circleTool: new T.CircleTool(tdtMap, circleTool),
    paintBrushTool: new T.PaintBrushTool(tdtMap, paintBrushTool)
  };

  Object.values(tools).forEach(tool => {
    if (tool) {
      if (!visible) tool.close();
    }
  });

  return tools;
}
