#!/usr/bin/env zsh
# Fitted Full-Stack Generator (web + mobile + desktop) — template-driven scaffold
set -euo pipefail

APP_ROOT="${PWD}/fitted"
CONFIG_ROOT="${PWD}/config"
TEMPLATE_ROOT="${CONFIG_ROOT}/template"
STYLE_MAP="${CONFIG_ROOT}/style-map.json"

if [ ! -d "${TEMPLATE_ROOT}" ]; then
  echo "==> Template missing at ${TEMPLATE_ROOT}. Please populate config/template before running this script."
  exit 1
fi
if [ ! -f "${STYLE_MAP}" ]; then
  echo "==> Style map missing at ${STYLE_MAP}."
  exit 1
fi

echo "==> Bootstrapping workspace at ${APP_ROOT}"
rm -rf "${APP_ROOT}"
mkdir -p "${APP_ROOT}"
cp -R "${TEMPLATE_ROOT}/." "${APP_ROOT}/"

cd "${APP_ROOT}"

echo "==> Git + pnpm workspace"
git init -q
corepack enable pnpm 2>/dev/null || true

export STYLE_MAP
export APP_ROOT

cat <<'NODE' > /tmp/generate-styles.js
const fs = require('fs');
const path = require('path');
const style = JSON.parse(fs.readFileSync(process.env.STYLE_MAP, 'utf-8'));
const root = process.env.APP_ROOT;
const colors = style.vars;
const cssLines = [];
cssLines.push(':root{');
for (const [key, value] of Object.entries(colors)) {
  cssLines.push(`  --e-${key}:${value};`);
}
cssLines.push('}');
for (const [name, rules] of Object.entries(style.classes)) {
  const decls = Object.entries(rules)
    .map(([prop, val]) => `  ${prop}:${val};`)
    .join('\n');
  cssLines.push(`.e-${name}{\n${decls}\n}`);
}
for (const [name, rules] of Object.entries(style.utilities)) {
  const decls = Object.entries(rules)
    .map(([prop, val]) => `  ${prop}:${val};`)
    .join('\n');
  cssLines.push(`.e-${name}{\n${decls}\n}`);
}
fs.writeFileSync(path.join(root, 'packages/ui-eldora/styles.css'), cssLines.join('\n'));
const tailwindColors = Object.fromEntries(Object.entries(colors).map(([key]) => [key, `rgb(var(--e-${key}))`]));
const tailwind = `import type { Config } from "tailwindcss";\nimport eldora from "@fitted/ui-eldora/plugin.cjs";\nconst config: Config = {\n  content: ["./app/**/*.{ts,tsx}","../../packages/ui-shadcn/**/*.{ts,tsx}"],\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(tailwindColors, null, 2)},\n      borderRadius: { DEFAULT: "var(--e-radius)" }\n    }\n  },\n  plugins: [eldora]\n};\nexport default config;\n`;
fs.writeFileSync(path.join(root, 'apps/web/tailwind.config.ts'), tailwind);
NODE

node /tmp/generate-styles.js
rm /tmp/generate-styles.js

echo "==> Installing root dev deps"
pnpm i --silent

echo "==> Done."
echo "NEXT STEPS:"
echo "  1) cd ${APP_ROOT} && pnpm dev:web     # open http://localhost:3000"
echo "  2) For mobile: pnpm dev:mobile   # Expo dev server (Metro) inside fitted/"
echo "  3) For desktop: ensure Rust toolchain, then pnpm dev:desktop"
