import type { ReactNode } from "react";

/** Editorial/SEO content per tool: formula, worked example, limits, FAQ. */
export interface ToolContent {
  headline: ReactNode;
  intro: string;
  formula: { title: string; lines: string[] };
  example: string[];
  limits: string[];
  faq: { q: string; a: string }[];
  relatedProducts: string[];
  directoryCategory: string;
}

export const toolContent: Record<string, ToolContent> = {
  "board-foot-calculator": {
    headline: (
      <>
        Board Foot <em className="text-clay-ink italic">Calculator</em>
      </>
    ),
    intro: "Hardwood is sold by the board foot. Enter rough dimensions to see board feet, volume and cost — with a waste allowance for planing, defects and offcuts.",
    formula: {
      title: "The formula",
      lines: ["Board feet = thickness (in) × width (in) × length (in) ÷ 144", "or: thickness (in) × width (in) × length (ft) ÷ 12", "1 board foot = 144 in³ ≈ 0.00236 m³"],
    },
    example: ["An 8/4 board (2″ thick), 6″ wide and 8 ft long:", "2 × 6 × 8 ÷ 12 = 8 board feet.", "At $12.50 per board foot with 15% waste: 8 × 1.15 × 12.50 = $115."],
    limits: [
      "Lumber yards price on nominal rough thickness (4/4, 8/4…). Use the thickness you pay for, not the planed size.",
      "Some yards round each board up or measure width differently — check how your supplier tallies.",
      "Waste allowance is an estimate; figured or knotty stock can need far more.",
    ],
    faq: [
      { q: "What does 4/4 mean?", a: "Quarters of an inch of rough thickness: 4/4 is 1 inch, 8/4 is 2 inches. Surfaced 4/4 usually ends up around ¾ inch." },
      { q: "Do I use rough or finished dimensions?", a: "For buying lumber, use rough dimensions. For estimating finished-part volume, use the Cut List Calculator." },
      { q: "Are sheet goods sold by the board foot?", a: "No. Plywood and MDF are sold by the sheet; board feet apply to solid lumber." },
    ],
    relatedProducts: ["walnut-hall-bench-plan", "end-grain-cutting-board-plan", "shop-project-planner"],
    directoryCategory: "hardwood-suppliers",
  },
  "cnc-project-cost-calculator": {
    headline: (
      <>
        CNC Project <em className="text-clay-ink italic">Cost</em> Calculator
      </>
    ),
    intro: "Price a CNC job before you quote it — or before you send a file to a shop. Break the cost into material, machine time, design, setup, tooling and finishing.",
    formula: {
      title: "How the estimate works",
      lines: [
        "Subtotal = sheets × sheet price + machine hours × machine rate + design hours × design rate + setup + tooling + finishing",
        "Total = subtotal × (1 + markup %)",
        "Per piece = total ÷ quantity",
      ],
    },
    example: ["2 sheets at $95, 3 h machine time at $85/h, 2 h design at $60/h, $50 setup, $20 tooling, $40 finishing:", "Subtotal $675. With 20% markup the total is $810 — $202.50 per piece for 4 pieces."],
    limits: [
      "This is a planning estimate, not a quote. Shop rates, minimums and material prices vary widely.",
      "Machine time depends on toolpaths, feeds, speeds and material — use your CAM estimate when you have one.",
      "Taxes, shipping and payment fees are not included.",
    ],
    faq: [
      { q: "What is a typical CNC machine rate?", a: "It varies by region, machine and shop. Ask local shops in the directory for their rates and use those numbers." },
      { q: "Should design time be charged?", a: "Usually yes — file clean-up, nesting and toolpaths take real time even for supplied files." },
    ],
    relatedProducts: ["modular-plywood-bookcase-cnc", "plywood-standing-desk-cnc", "cnc-wall-organizer"],
    directoryCategory: "cnc-services",
  },
  "cut-list-calculator": {
    headline: (
      <>
        Cut List <em className="text-clay-ink italic">Calculator</em>
      </>
    ),
    intro: "List the parts of your project to get piece counts and board feet by thickness — plus a simple estimate of how many boards to buy.",
    formula: {
      title: "What it calculates",
      lines: [
        "Cut list: for each part, board feet = length × width × thickness ÷ 144 × quantity",
        "Stock estimate: first-fit decreasing on length, adding the saw kerf between cuts",
        "Length yield = total part length ÷ total stock length",
      ],
    },
    example: ["Four legs 28″ × 1¾″ × 1¾″ need 4 × 28 × 1.75 × 1.75 ÷ 144 ≈ 2.38 board feet of 8/4 stock before waste."],
    limits: [
      "A cut list is not a cutting layout. The stock estimate is a simple heuristic, not an optimized nesting algorithm.",
      "It assumes one part across each board’s width and ignores grain direction, defects, end checks and planing allowance.",
      "Sheet-goods (2D) optimization is not included.",
    ],
    faq: [
      { q: "Why does the estimate differ from optimization software?", a: "Optimizers try many arrangements and can rip several parts from one board. This tool uses a fast single-pass rule, so it can be conservative." },
      { q: "Should I add extra length?", a: "Yes — add an inch or two per part for trimming, and buy 15–30% extra for defects." },
    ],
    relatedProducts: ["split-top-workbench-plan", "shop-project-planner", "mid-century-side-table-plan"],
    directoryCategory: "lumber-stores",
  },
};
