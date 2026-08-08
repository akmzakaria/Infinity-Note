#!/bin/bash

echo "🎨 Creating OG Image for Infinity Note..."
echo ""

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick found, converting SVG to PNG..."
    convert -background none -size 1200x630 public/og-image.svg public/og-image.png
    
    if [ -f "public/og-image.png" ]; then
        SIZE=$(du -h public/og-image.png | cut -f1)
        echo "✅ OG Image created successfully! (${SIZE})"
        echo ""
        echo "Next steps:"
        echo "1. git add public/og-image.png"
        echo "2. git commit -m 'Add OG image for SEO'"
        echo "3. git push"
    else
        echo "❌ Failed to create PNG"
        exit 1
    fi
else
    echo "⚠️  ImageMagick not found"
    echo ""
    echo "Please create OG image manually:"
    echo ""
    echo "Option 1: Use online converter"
    echo "  1. Go to: https://cloudconvert.com/svg-to-png"
    echo "  2. Upload: public/og-image.svg"
    echo "  3. Convert and download"
    echo "  4. Save as: public/og-image.png"
    echo ""
    echo "Option 2: Use Canva"
    echo "  1. Go to: https://www.canva.com/create/og-images/"
    echo "  2. Create 1200x630px image"
    echo "  3. Add text: 'Infinity Note' and 'Free Online Note Taking App'"
    echo "  4. Download as PNG"
    echo "  5. Save as: public/og-image.png"
    echo ""
    echo "Option 3: Install ImageMagick"
    echo "  Ubuntu/Debian: sudo apt install imagemagick"
    echo "  MacOS: brew install imagemagick"
    echo "  Then run this script again"
fi
