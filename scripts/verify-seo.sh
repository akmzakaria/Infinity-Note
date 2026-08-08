#!/bin/bash

# SEO Verification Script for Infinity Note
# Run this before deploying to check everything is ready

echo "🔍 Infinity Note - SEO Verification"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root"
    exit 1
fi

echo "1. Checking critical files..."
echo ""

# Check OG Image
if [ -f "public/og-image.png" ]; then
    SIZE=$(du -h public/og-image.png | cut -f1)
    echo "✅ OG Image exists (${SIZE})"
else
    echo "❌ OG Image missing! Create public/og-image.png (1200x630px)"
    echo "   → Open scripts/generate-og-image.html to generate one"
fi

# Check robots.txt
if [ -f "public/robots.txt" ]; then
    echo "✅ robots.txt exists"
else
    echo "❌ robots.txt missing!"
fi

# Check sitemap
if [ -f "app/sitemap.ts" ]; then
    echo "✅ sitemap.ts exists"
else
    echo "❌ sitemap.ts missing!"
fi

# Check manifest
if [ -f "app/manifest.webmanifest" ]; then
    echo "✅ manifest.webmanifest exists"
else
    echo "❌ manifest.webmanifest missing!"
fi

echo ""
echo "2. Building project..."
echo ""

# Try to build
if npm run build > /tmp/build.log 2>&1; then
    echo "✅ Build successful"
else
    echo "❌ Build failed! Check errors:"
    tail -20 /tmp/build.log
    exit 1
fi

echo ""
echo "3. Checking generated files..."
echo ""

# Check if sitemap was generated
if [ -f ".next/server/app/sitemap.xml/route.js" ] || [ -f ".next/server/app/sitemap.xml.rsc" ]; then
    echo "✅ Sitemap generated in build"
else
    echo "⚠️  Sitemap route not found in build (might be okay)"
fi

echo ""
echo "4. Checking meta tags in layout..."
echo ""

# Check layout file for important SEO elements
if grep -q "metadataBase" app/layout.tsx; then
    echo "✅ metadataBase configured"
else
    echo "❌ metadataBase missing in app/layout.tsx"
fi

if grep -q "og-image.png" app/layout.tsx; then
    echo "✅ OG image referenced in metadata"
else
    echo "❌ OG image not referenced in metadata"
fi

if grep -q "keywords:" app/layout.tsx; then
    echo "✅ Keywords defined"
else
    echo "⚠️  No keywords found"
fi

echo ""
echo "======================================"
echo "📊 Verification Complete"
echo ""
echo "Next steps:"
echo "1. Generate OG image if missing (scripts/generate-og-image.html)"
echo "2. Deploy: git push"
echo "3. Test production URLs:"
echo "   - https://infinity-note.vercel.app/sitemap.xml"
echo "   - https://infinity-note.vercel.app/robots.txt"
echo "   - https://infinity-note.vercel.app/og-image.png"
echo "4. Submit to Google Search Console"
echo ""
echo "Read GOOGLE_INDEXING_FIX.md for full instructions"
