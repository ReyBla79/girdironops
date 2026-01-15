#!/bin/bash

# Gridiron Ops Export Script
# Creates a ZIP archive ready for download/setup in a new React project

set -e

# Configuration
EXPORT_NAME="gridiron-ops-export"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ZIP_FILE="${EXPORT_NAME}_${TIMESTAMP}.zip"

echo "🏈 Gridiron Ops Export Script"
echo "=============================="
echo ""

# Create temporary export directory
TEMP_DIR=$(mktemp -d)
EXPORT_DIR="$TEMP_DIR/$EXPORT_NAME"
mkdir -p "$EXPORT_DIR"

echo "📦 Packaging files..."

# Copy source files
cp -r src "$EXPORT_DIR/"
cp -r public "$EXPORT_DIR/"
cp -r supabase "$EXPORT_DIR/"

# Copy config files
cp index.html "$EXPORT_DIR/"
cp vite.config.ts "$EXPORT_DIR/"
cp tailwind.config.ts "$EXPORT_DIR/"
cp postcss.config.js "$EXPORT_DIR/"
cp tsconfig.json "$EXPORT_DIR/"
cp tsconfig.app.json "$EXPORT_DIR/"
cp tsconfig.node.json "$EXPORT_DIR/"
cp components.json "$EXPORT_DIR/"
cp eslint.config.js "$EXPORT_DIR/"
cp EXPORT_README.md "$EXPORT_DIR/README.md"

# Create package.json template (without lockfiles)
cat > "$EXPORT_DIR/package.json" << 'EOF'
{
  "name": "gridiron-ops",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@react-three/drei": "^9.122.0",
    "@react-three/fiber": "^8.18.0",
    "@supabase/supabase-js": "^2.89.0",
    "@tanstack/react-query": "^5.83.0",
    "@types/three": "^0.160.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.462.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.61.1",
    "react-resizable-panels": "^2.1.9",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "three": "^0.160.1",
    "vaul": "^0.9.9",
    "zod": "^3.25.76",
    "zustand": "^5.0.9"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.6.2",
    "vite": "^5.4.10"
  }
}
EOF

# Create .env.example
cat > "$EXPORT_DIR/.env.example" << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
EOF

# Create .gitignore
cat > "$EXPORT_DIR/.gitignore" << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Build
dist/
build/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Lock files (regenerate on install)
package-lock.json
bun.lockb
yarn.lock
pnpm-lock.yaml
EOF

echo "🗜️  Creating ZIP archive..."

# Create ZIP file
cd "$TEMP_DIR"
zip -r "$ZIP_FILE" "$EXPORT_NAME" -x "*.DS_Store" -x "*__MACOSX*"

# Move to original directory
mv "$ZIP_FILE" "$OLDPWD/"

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo "✅ Export complete!"
echo "📁 File: $ZIP_FILE"
echo "📏 Size: $(du -h "$OLDPWD/$ZIP_FILE" | cut -f1)"
echo ""
echo "To use:"
echo "  1. Unzip the archive"
echo "  2. cd $EXPORT_NAME"
echo "  3. npm install"
echo "  4. cp .env.example .env (and configure)"
echo "  5. npm run dev"
echo ""
