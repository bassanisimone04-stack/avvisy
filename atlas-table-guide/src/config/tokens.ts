/** Design tokens — mirrored 1:1 in src/app/globals.css (a unit test asserts they match). */
export const TOKENS = {
  "red-600": "#B3122B",
  "red-700": "#8E0E22",
  "red-900": "#4A0A15",
  "red-50": "#FCEFF0",
  ivory: "#FAF7F2",
  sand: "#F0E9DF",
  white: "#FFFFFF",
  ink: "#1A1415",
  stone: "#5F5654",
  line: "#E4DBD1",
  gold: "#B8955A",
  success: "#1F7A4D",
  warning: "#8A5200",
  info: "#1D5FA8",
} as const;

/** Every text/background pair used in the UI. [foreground, background, minRatio] */
export const CONTRAST_PAIRS: [keyof typeof TOKENS, keyof typeof TOKENS, number][] = [
  ["ink", "ivory", 4.5], ["ink", "white", 4.5], ["ink", "sand", 4.5], ["ink", "red-50", 4.5],
  ["stone", "ivory", 4.5], ["stone", "white", 4.5], ["stone", "sand", 4.5],
  ["white", "red-600", 4.5], ["ivory", "red-600", 4.5], ["white", "red-700", 4.5], ["ivory", "red-700", 4.5],
  ["ivory", "red-900", 4.5], ["white", "red-900", 4.5], ["sand", "red-900", 4.5], ["gold", "red-900", 3],
  ["red-600", "ivory", 4.5], ["red-600", "white", 4.5], ["red-700", "red-50", 4.5], ["red-600", "sand", 4.5],
  ["success", "white", 4.5], ["warning", "white", 4.5], ["info", "white", 4.5], ["red-600", "red-50", 4.5],
  ["white", "success", 4.5], ["white", "info", 4.5], ["red-900", "ivory", 4.5], ["red-900", "white", 4.5],
];
