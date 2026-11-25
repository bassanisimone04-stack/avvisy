export interface ToolMeta {
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  vertical: string;
  status: "live" | "planned";
  index: string;
}

export const tools: ToolMeta[] = [
  {
    slug: "board-foot-calculator",
    name: "Board Foot Calculator",
    shortName: "Board feet",
    summary: "Convert rough lumber dimensions into board feet, cubic meters and cost — with a waste allowance.",
    vertical: "woodworking",
    status: "live",
    index: "01",
  },
  {
    slug: "cnc-project-cost-calculator",
    name: "CNC Project Cost Calculator",
    shortName: "CNC cost",
    summary: "Estimate material, machine time, design and finishing for a CNC job, per piece and in total.",
    vertical: "woodworking",
    status: "live",
    index: "02",
  },
  {
    slug: "cut-list-calculator",
    name: "Cut List Calculator",
    shortName: "Cut list",
    summary: "Turn a parts list into totals by thickness, plus a simple estimate of how many boards to buy.",
    vertical: "woodworking",
    status: "live",
    index: "03",
  },
];

export const plannedTools = [
  "Quilt Fabric Calculator",
  "Quilt Binding Calculator",
  "Leather Consumption Calculator",
  "Stitch Spacing Calculator",
  "Ring Size Converter",
  "Metal Weight Calculator",
  "Clay Shrinkage Calculator",
];

export function getTool(slug: string) {
  return tools.find((t) => t.slug === slug);
}
