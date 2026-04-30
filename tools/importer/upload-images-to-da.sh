#!/bin/bash
# Upload images to DA for the DART page migration
# Run this script from the project root after authenticating to DA
#
# Prerequisites:
#   - npm install @anthropic-ai/da-admin (or use the DA CLI)
#   - Be logged into DA (da.live) in your browser
#
# Usage: bash tools/importer/upload-images-to-da.sh

ORG="aemdemos"
REPO="poc-stryker"
MEDIA_PATH="us/en/joint-replacement/procedures/media"
SOURCE_DIR="migration-work/images"
DA_API="https://admin.da.live/source/${ORG}/${REPO}/${MEDIA_PATH}"

echo "Uploading images to DA: ${ORG}/${REPO}/${MEDIA_PATH}/"
echo ""

# Map of hash filenames to descriptive names for clarity
declare -A IMAGE_NAMES=(
  ["1873ab2e6c6a7f7a365579729a943dd1.png"]="dart-hero-ecosystem.png"
  ["d93020705053ebcef9bcd1b6fe71903b.png"]="gold-hip-product.png"
  ["8df3f0225f7fb8a54945764aabb044fc.png"]="dart-surgical-technique-thumb.png"
  ["a10d251c1960d7aac022137caf1563da.png"]="video-bikini-incision.png"
  ["f8d97c6860f195f19d0a037763bd2fdc.png"]="video-da-approach-insignia.png"
  ["fef2c2a6be30c499348318c4c2bd1f33.png"]="video-dall-miles-cable.png"
  ["4b308e337ba9543b409402d938d50f3e.png"]="video-da-total-hip.png"
  ["251726180f7e8cdfb8af8963dfe0983b.png"]="video-mako-total-hip.png"
  ["5bdaf50694e99008c2b36b2756669af1.png"]="video-robotic-arm-da.png"
  ["2e02c4cb291a3be0690ad1de0d16fd14.png"]="medical-education-hcp.png"
  ["6a1abaaf85088c69ffa01dd61df2136d.png"]="implant-insignia.png"
  ["2560561227d9cb0756e59ba2a313f2b0.jpg"]="implant-accolade-ii.jpg"
  ["c4a6aeea96bf4eea90289f34bbf30a12.png"]="implant-exeter.png"
  ["da70a85f633f79c612c229af08e4ab86.png"]="implant-restoration-modular.png"
  ["bef0cc02bf0efee3214c87ca35fec447.jpg"]="implant-trident-ii.jpg"
  ["5832d7c53e3e2ae7ffe6e537a80bbf6d.png"]="implant-modular-dual-mobility.png"
  ["61f6a0954017b7f0f48587c15519ddc8.png"]="mako-smartrobotics.png"
  ["07b97ee9c46a8228f8d3655cb55e6edc.jpg"]="instrumentation-femoral-tray.jpg"
  ["9823395795e028d5a17ec750876fc123.png"]="instrumentation-broach-handles.png"
  ["3b1185dd5ce8b513d1dba37233bf7c37.png"]="pivot-guardian-hero.png"
  ["c0385fe7db2d119652e95a4af2f6386d.png"]="pivot-guardian-brochure-thumb.png"
  ["253ec8faaf5eca58c61ad67941f40485.png"]="asc-update.png"
  ["7502d739d71869aab806b28d64a19971.png"]="asc-gradient-hero.png"
)

SUCCESS=0
FAIL=0

for hash_file in "${!IMAGE_NAMES[@]}"; do
  nice_name="${IMAGE_NAMES[$hash_file]}"
  source_file="${SOURCE_DIR}/${hash_file}"

  if [ ! -f "$source_file" ]; then
    echo "  SKIP: $hash_file (not found)"
    continue
  fi

  # Determine content type
  ext="${hash_file##*.}"
  case "$ext" in
    png) content_type="image/png" ;;
    jpg) content_type="image/jpeg" ;;
    *) content_type="application/octet-stream" ;;
  esac

  echo -n "  Uploading ${nice_name}... "

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -X PUT "${DA_API}/${nice_name}" \
    -H "Content-Type: ${content_type}" \
    --data-binary "@${source_file}")

  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "204" ]; then
    echo "OK (${HTTP_CODE})"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "FAILED (${HTTP_CODE})"
    FAIL=$((FAIL + 1))
  fi
done

echo ""
echo "Done. Success: ${SUCCESS}, Failed: ${FAIL}"
echo ""
if [ $FAIL -gt 0 ]; then
  echo "NOTE: If you got 401 errors, you need to authenticate first."
  echo "Open https://da.live in your browser, log in, then get your auth token."
  echo "Add -H 'Authorization: Bearer YOUR_TOKEN' to the curl commands."
fi
