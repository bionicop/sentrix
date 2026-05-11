#!/usr/bin/env bash
# =============================================================================
# Sentrix — Clean Deliverable Zip Creator
# Creates sentrix-deliverable.zip in the parent directory
# Excludes: node_modules, .git, build artifacts, screenshots, logs
# Includes: all source code, configs, .env files, docs
# =============================================================================

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="$(basename "$PROJECT_DIR")"
OUTPUT_DIR="$(dirname "$PROJECT_DIR")"
OUTPUT_ZIP="$OUTPUT_DIR/sentrix-deliverable.zip"
TEMP_DIR="/tmp/sentrix-clean"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'
BOLD='\033[1m'

info()    { echo -e "${BLUE}[zip]${NC} $*"; }
success() { echo -e "${GREEN}[✓]${NC} $*"; }
warn()    { echo -e "${YELLOW}[!]${NC} $*"; }

echo ""
echo -e "${BOLD}Sentrix — Creating Deliverable Zip${NC}"
echo ""

# =============================================================================
# 1. Clean up temp dir
# =============================================================================
info "Preparing clean working directory..."
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

# =============================================================================
# 2. rsync — copy everything except excluded paths
# =============================================================================
info "Copying project files (excluding build artifacts and dev tools)..."

rsync -a \
  --exclude=".git" \
  --exclude="node_modules" \
  --exclude=".playwright-mcp" \
  --exclude=".claude" \
  --exclude="screenshots" \
  --exclude="Screens" \
  --exclude="test-results" \
  --exclude="*.log" \
  --exclude="*.png" \
  --exclude="*.webm" \
  --exclude="ui/dist" \
  --exclude="ui/.vercel" \
  --exclude="walkthrough/out" \
  --exclude="walkthrough/public/clips" \
  --exclude="walkthrough/public/audio" \
  --exclude="walkthrough/public/screenshots" \
  --exclude="walkthrough/timestamps.json" \
  --exclude="infra/venv" \
  --exclude="infra/prod/services" \
  --exclude="infra/prod/_failsafe" \
  --exclude="infra/prod/.mode" \
  --exclude="make-zip.sh" \
  --exclude="sentrix-deliverable.zip" \
  --exclude="__pycache__" \
  --exclude="*.pyc" \
  --exclude=".DS_Store" \
  --exclude="Thumbs.db" \
  "$PROJECT_DIR/" "$TEMP_DIR/$PROJECT_NAME/"

success "Files copied."

# =============================================================================
# 3. Verify .env files are present (user wants these kept)
# =============================================================================
info "Verifying .env files are included..."
ENV_COUNT=$(find "$TEMP_DIR" -name ".env" 2>/dev/null | wc -l | tr -d ' ')
EXAMPLE_COUNT=$(find "$TEMP_DIR" -name ".env.example" 2>/dev/null | wc -l | tr -d ' ')
success "Found $ENV_COUNT .env file(s) and $EXAMPLE_COUNT .env.example file(s)"

# =============================================================================
# 4. Verify no unwanted content made it in
# =============================================================================
info "Running sanity checks..."

NM_COUNT=$(find "$TEMP_DIR" -type d -name "node_modules" 2>/dev/null | wc -l | tr -d ' ')
GIT_COUNT=$(find "$TEMP_DIR" -type d -name ".git" 2>/dev/null | wc -l | tr -d ' ')

if [ "$NM_COUNT" -gt 0 ]; then
  warn "$NM_COUNT node_modules directory found — removing..."
  find "$TEMP_DIR" -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
fi

if [ "$GIT_COUNT" -gt 0 ]; then
  warn "$GIT_COUNT .git directory found — removing..."
  find "$TEMP_DIR" -type d -name ".git" -exec rm -rf {} + 2>/dev/null || true
fi

success "Sanity checks passed."

# =============================================================================
# 5. Show what's included
# =============================================================================
CLEAN_SIZE=$(du -sh "$TEMP_DIR" | cut -f1)
FILE_COUNT=$(find "$TEMP_DIR" -type f | wc -l | tr -d ' ')
info "Clean copy: $FILE_COUNT files, $CLEAN_SIZE"

# =============================================================================
# 6. Create zip
# =============================================================================
info "Creating zip archive..."
rm -f "$OUTPUT_ZIP"

cd "$TEMP_DIR"
zip -r "$OUTPUT_ZIP" "$PROJECT_NAME" -x "*.DS_Store" > /dev/null

# =============================================================================
# 7. Clean up temp
# =============================================================================
rm -rf "$TEMP_DIR"
info "Temp directory cleaned up."

# =============================================================================
# 8. Final report
# =============================================================================
ZIP_SIZE=$(du -sh "$OUTPUT_ZIP" | cut -f1)

echo ""
echo -e "${GREEN}${BOLD}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  Zip created successfully!${NC}"
echo -e "${GREEN}${BOLD}════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${BOLD}File:${NC}  $OUTPUT_ZIP"
echo -e "  ${BOLD}Size:${NC}  $ZIP_SIZE"
echo -e "  ${BOLD}Files:${NC} $FILE_COUNT"
echo ""
echo "  What's included:"
echo "    ✓ All source code (Go, TypeScript, CSS)"
echo "    ✓ Docker Compose + all configs"
echo "    ✓ .env files + .env.example templates"
echo "    ✓ Database init SQL + seed data"
echo "    ✓ Documentation (README, QUICKSTART, docs/)"
echo "    ✓ Walkthrough video source (Remotion)"
echo "    ✓ start.sh one-click startup script"
echo ""
echo "  What's excluded:"
echo "    ✗ node_modules (reinstall with npm install)"
echo "    ✗ .git history"
echo "    ✗ Build artifacts (dist/, out/)"
echo "    ✗ Screen recordings and rendered videos"
echo "    ✗ Screenshots and test artifacts"
echo "    ✗ Playwright logs and browser cache"
echo ""
echo "  To use the zip:"
echo "    1. Extract it"
echo "    2. cd $PROJECT_NAME/infra/prod"
echo "    3. ./start.sh"
echo ""
