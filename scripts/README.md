# 🛠️ Scripts & Tools Directory

This directory contains helper scripts to fix your Google indexing issue.

## 📜 Available Scripts

### 1. `verify-seo.sh` ✅
**Purpose**: Verify all SEO elements before deploying

**Usage**:
```bash
./scripts/verify-seo.sh
```

**What it checks**:
- ✅ OG image exists
- ✅ robots.txt exists
- ✅ sitemap.ts exists
- ✅ manifest exists
- ✅ Build succeeds
- ✅ Meta tags configured

**When to use**: Before every deployment

---

### 2. `create-og-image.sh` 🎨
**Purpose**: Automatically convert SVG to PNG OG image

**Usage**:
```bash
./scripts/create-og-image.sh
```

**Requirements**: ImageMagick installed

**What it does**:
- Converts `public/og-image.svg` to `public/og-image.png`
- Sets correct dimensions (1200x630)
- Shows file size

**If ImageMagick not installed**:
- Shows instructions for manual creation
- Suggests online converters
- Provides Canva link

---

### 3. `generate-og-image.html` 🌐
**Purpose**: Browser-based OG image generator

**Usage**:
```bash
# Open in browser
firefox scripts/generate-og-image.html
# or
google-chrome scripts/generate-og-image.html
```

**Features**:
- Creates 1200x630 OG image in browser
- Uses HTML5 Canvas
- Auto-generates on page load
- Click to download as PNG
- No dependencies required

**Steps**:
1. Open in browser
2. Image appears automatically
3. Click "Download Image"
4. Save as `public/og-image.png`

---

## 🚀 Quick Start

### First Time Setup

1. **Create OG Image**:
```bash
# Try automated method
./scripts/create-og-image.sh

# If that doesn't work, use browser method
firefox scripts/generate-og-image.html
# Download the image, save as public/og-image.png
```

2. **Verify Everything**:
```bash
./scripts/verify-seo.sh
```

3. **Deploy**:
```bash
git add public/og-image.png
git commit -m "Add OG image for SEO"
git push
```

---

## 🔧 Troubleshooting

### "Permission denied" error
```bash
chmod +x scripts/*.sh
```

### "ImageMagick not found"
```bash
# Ubuntu/Debian
sudo apt install imagemagick

# macOS
brew install imagemagick

# Or use the browser method instead
firefox scripts/generate-og-image.html
```

### "OG image looks wrong"
- Edit `public/og-image.svg` to customize
- Or create your own at https://canva.com
- Required size: 1200x630 pixels

---

## 📁 Files in This Directory

```
scripts/
├── verify-seo.sh              # Pre-deployment verification
├── create-og-image.sh         # Auto-generate OG image
├── generate-og-image.html     # Browser-based generator
└── README.md                  # This file
```

---

## 🎯 Recommended Workflow

**Before Every Deploy**:
```bash
# 1. Make your changes
# ...

# 2. Verify SEO is good
./scripts/verify-seo.sh

# 3. If all checks pass, deploy
git push
```

**When Creating OG Image**:
```bash
# Method 1: Automated (requires ImageMagick)
./scripts/create-og-image.sh

# Method 2: Browser-based (always works)
firefox scripts/generate-og-image.html
# Then download and save

# Method 3: Online tool (easiest)
# Go to: https://cloudconvert.com/svg-to-png
# Upload: public/og-image.svg
# Download result as: public/og-image.png

# Method 4: Create from scratch
# Go to: https://canva.com
# Create 1200x630px image
# Save as: public/og-image.png
```

---

## 🆘 Need More Help?

See the main documentation:
- `../CHECKLIST.md` - Step-by-step guide
- `../URGENT_FIX.md` - Quick fix instructions
- `../FIX_SUMMARY.md` - Complete overview

---

## ✨ Tips

1. **Always verify before deploying**: `./scripts/verify-seo.sh`
2. **Keep OG image under 500KB** for fast loading
3. **Use PNG format** (better quality than JPG for text)
4. **Test the image** on https://metatags.io after deploying

---

That's it! These scripts make it easy to maintain your SEO. 🚀
