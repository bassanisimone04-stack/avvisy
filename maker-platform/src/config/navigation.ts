export const primaryNav = [
  { href: "/explore/us/woodworking", label: "Explore" },
  { href: "/shop", label: "Digital Projects" },
  { href: "/tools", label: "Free Tools" },
  { href: "/resources", label: "Resources" },
] as const;

export const footerNav = [
  {
    title: "Explore",
    links: [
      { href: "/explore/us/woodworking", label: "Woodworking & CNC directory" },
      { href: "/explore/us/woodworking?category=cnc-services", label: "CNC machining services" },
      { href: "/explore/us/woodworking?category=makerspaces", label: "Makerspaces" },
      { href: "/explore/us/woodworking?category=hardwood-suppliers", label: "Hardwood suppliers" },
    ],
  },
  {
    title: "Digital Projects",
    links: [
      { href: "/shop", label: "All projects" },
      { href: "/shop/woodworking", label: "Woodworking plans" },
      { href: "/shop?format=DXF", label: "CNC-ready DXF files" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Free Tools",
    links: [
      { href: "/tools/board-foot-calculator", label: "Board Foot Calculator" },
      { href: "/tools/cnc-project-cost-calculator", label: "CNC Project Cost Calculator" },
      { href: "/tools/cut-list-calculator", label: "Cut List Calculator" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/resources", label: "Resources" },
      { href: "/for-business", label: "List your business" },
      { href: "/for-business#claim", label: "Claim a listing" },
      { href: "/legal/affiliate-disclosure", label: "Affiliate disclosure" },
    ],
  },
] as const;

export const legalNav = [
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/refunds", label: "Refunds" },
  { href: "/legal/digital-license", label: "Digital license" },
  { href: "/legal/cookies", label: "Cookies" },
] as const;
