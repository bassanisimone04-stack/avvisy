#!/usr/bin/env bash
# Downloads the self-hosted font files into assets/fonts/.
#
#   bash scripts/fetch-fonts.sh
#
# Playfair Display and Plus Jakarta Sans are both variable fonts: Google
# serves ONE physical woff2 per family+style covering the whole weight range,
# and lets the browser interpolate the exact weight via the 'wght' axis (see
# src/styles/fonts.css for the @font-face rules that rely on this). That is
# why this script only needs three URLs, not one per weight.
#
# These URLs were captured from Google's css2 API with a Chrome user agent,
# filtered to the "latin" subset (the only one this English-language site
# needs) — see the commit that introduced this file for how to re-derive them
# if a family ever needs a fourth weight/style or a different subset.
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p assets/fonts
curl -sS -o assets/fonts/playfair-display-variable.woff2 \
  "https://fonts.gstatic.com/s/playfairdisplay/v40/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgA.woff2"
curl -sS -o assets/fonts/playfair-display-italic.woff2 \
  "https://fonts.gstatic.com/s/playfairdisplay/v40/nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_pqTXtHA-Q.woff2"
curl -sS -o assets/fonts/plus-jakarta-sans-variable.woff2 \
  "https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yw.woff2"

for f in assets/fonts/*.woff2; do
  head -c4 "$f" | grep -q "wOF2" && echo "✓ $f" || { echo "✗ $f is not a valid woff2"; exit 1; }
done
