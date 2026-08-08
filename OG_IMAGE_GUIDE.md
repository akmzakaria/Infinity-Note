# How to Create Your Open Graph Image

## What is an Open Graph Image?

When someone shares your Infinity Note link on Facebook, Twitter, LinkedIn, or WhatsApp, the OG image is the preview image that appears. A good OG image significantly increases click-through rates.

## Specifications

- **Dimensions**: 1200 x 630 pixels (exact)
- **Format**: PNG or JPG
- **File size**: Under 1MB (smaller is better)
- **File name**: `og-image.png`
- **Location**: `/public/og-image.png`

## Design Guidelines

### Option 1: Screenshot-Based (Recommended)

1. **Take a clean screenshot** of your app
   - Use the main dashboard view
   - Show some sample notes with categories
   - Make sure it looks professional (no lorem ipsum)

2. **Add branding overlay**
   - App logo in top-left or center
   - App name: "Infinity Note"
   - Tagline: "Free Online Note Taking App"
   - Use your brand color: #1D4ED8 (blue)

3. **Add visual elements**
   - Subtle gradient background
   - Icons representing features
   - Clean, modern design

### Option 2: Graphic Design

Create a promotional graphic with:
- Large app logo/icon
- App name prominently displayed
- Key value propositions:
  * "Free Forever"
  * "Unlimited Notes"
  * "Smart Categories"
  * "Cloud Sync"
- Clean background (dark theme matching your app)
- Call-to-action: "Start Taking Notes →"

## Tools You Can Use

### Free Tools (Recommended)

1. **Canva** (https://canva.com)
   - Template available: Search "Open Graph"
   - Easy drag-and-drop interface
   - Free tier is sufficient
   - Export as PNG

2. **Figma** (https://figma.com)
   - Professional design tool
   - Create frame: 1200x630px
   - Free for individuals
   - More control over design

3. **Adobe Express** (https://www.adobe.com/express/)
   - Similar to Canva
   - Good templates
   - Free tier available

### Online Generators

1. **Bannerbear** (https://www.bannerbear.com/demos/social-media-sharing-images/)
   - Quick OG image generator
   - Customizable templates

2. **Placid** (https://placid.app/)
   - Template-based
   - Fast generation

## Quick DIY Method

If you want to do it quickly:

1. Open your app in browser
2. Take screenshot (make it look good!)
3. Open in any image editor
4. Resize to 1200x630px
5. Add text overlay:
   ```
   Infinity Note
   Free Online Note Taking App
   ✓ Unlimited Notes  ✓ Categories  ✓ Cloud Sync
   ```
6. Save as `og-image.png`
7. Move to `/public/` folder

## Design Example Template

Here's a text-based layout to visualize:

```
┌─────────────────────────────────────────────────────────┐
│                                                           │
│   [Logo Icon]                                             │
│                                                           │
│   INFINITY NOTE                                           │
│   Free Online Note Taking App                            │
│                                                           │
│   ✓ Free Forever    ✓ Unlimited Notes                    │
│   ✓ Smart Categories    ✓ Cloud Sync                     │
│                                                           │
│   [Screenshot of app dashboard]                          │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Color Scheme

Use your app's colors:
- **Primary**: #1D4ED8 (Blue)
- **Background**: #0c1327 (Dark blue-gray)
- **Text**: #F8FAFC (Light gray/white)
- **Accent**: #0EA5E9 (Sky blue)

## Text to Include

Choose 3-4 key messages:
- "Free Forever - No Premium Tiers"
- "Unlimited Notes & Categories"
- "Sync Across All Devices"
- "Works Offline with PWA"
- "Simple, Fast, Secure"

## After Creating

1. Save as `og-image.png`
2. Place in `/public/og-image.png`
3. Test at: https://www.opengraph.xyz/
4. Deploy to Vercel
5. Share a link and check preview!

## Testing Your OG Image

After uploading:

1. **Social Media Debuggers**
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/

2. **Generic OG Tester**
   - https://www.opengraph.xyz/
   - Paste: https://infinity-note.vercel.app

3. **Mobile Preview**
   - Send link via WhatsApp to yourself
   - Check how it looks

## Common Mistakes to Avoid

❌ Text too small (remember it's viewed at thumbnail size)
❌ Too much text (keep it simple)
❌ Wrong dimensions (must be exactly 1200x630)
❌ Low contrast (text hard to read)
❌ No branding (people don't know what it is)
❌ File too large (slows loading)

## Tips for Best Results

✅ Bold, clear typography
✅ High contrast colors
✅ Large icons/logos
✅ Minimal text (5-10 words max)
✅ Professional screenshot
✅ Brand colors consistent
✅ Test on mobile devices

## Need Help?

If you're struggling with design:
1. Look at OG images from successful apps (Notion, Evernote, Todoist)
2. Use Canva's built-in templates
3. Keep it simple - less is more
4. Focus on your unique value proposition

---

**Remember**: The OG image is the first impression many users will have of your app. Make it count! 🎨
