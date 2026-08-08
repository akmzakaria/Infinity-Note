# SEO Deployment Checklist

## Immediate Actions (Before First Deployment)

- [ ] Create Open Graph image (`/public/og-image.png` - 1200x630px)
  - Screenshot of app dashboard
  - Add logo and tagline
  - Use brand colors (#1D4ED8)

- [ ] Test metadata preview
  - Use [Opengraph.xyz](https://www.opengraph.xyz/)
  - Check how it looks on Facebook, Twitter, LinkedIn

- [ ] Verify all links work
  - Check sitemap: `https://infinity-note.vercel.app/sitemap.xml`
  - Check robots.txt: `https://infinity-note.vercel.app/robots.txt`
  - Check manifest: `https://infinity-note.vercel.app/manifest.webmanifest`

## After Deployment

- [ ] Google Search Console
  1. Go to [search.google.com/search-console](https://search.google.com/search-console)
  2. Add property: `https://infinity-note.vercel.app`
  3. Verify with HTML tag method
  4. Update verification code in `app/layout.tsx`
  5. Submit sitemap: `https://infinity-note.vercel.app/sitemap.xml`
  6. Request indexing for homepage

- [ ] Bing Webmaster Tools
  1. Go to [bing.com/webmasters](https://www.bing.com/webmasters)
  2. Add site
  3. Verify ownership
  4. Submit sitemap

- [ ] Google Analytics 4
  1. Create GA4 property
  2. Get Measurement ID
  3. Add to Next.js app (optional)

- [ ] Lighthouse Audit
  1. Open DevTools → Lighthouse
  2. Run audit
  3. Aim for 90+ in all categories
  4. Fix any issues

## Week 1

- [ ] Monitor Google Search Console
  - Check for crawl errors
  - Verify pages are being indexed

- [ ] Create social media accounts
  - [ ] Twitter/X: @infinitynote
  - [ ] LinkedIn page
  - [ ] Reddit account for r/productivity posts

- [ ] Submit to directories
  - [ ] Product Hunt (plan launch)
  - [ ] AlternativeTo.net (as Evernote alternative)
  - [ ] Slant.co
  - [ ] G2 Crowd

## Week 2-4

- [ ] Content creation
  - [ ] Create /about page
  - [ ] Create /help or /faq page
  - [ ] Write first blog post (if implementing blog)

- [ ] Community engagement
  - [ ] Share on Reddit (r/productivity, r/selfhosted)
  - [ ] Post on Hacker News (Show HN)
  - [ ] Share on Twitter with relevant hashtags
  - [ ] Join productivity Discord servers

- [ ] Get initial reviews/testimonials
  - [ ] Ask friends/early users
  - [ ] Display on homepage

## Month 2-3

- [ ] Link building
  - [ ] Guest post on productivity blogs
  - [ ] Participate in productivity forums
  - [ ] Comment on relevant blog posts (with backlink)

- [ ] Content updates
  - [ ] Add more FAQ items
  - [ ] Create video tutorial (YouTube SEO)
  - [ ] Write comparison articles

- [ ] Monitor and optimize
  - [ ] Check keyword rankings
  - [ ] Update meta descriptions based on CTR
  - [ ] Add more internal links

## Ongoing (Monthly)

- [ ] Review Search Console data
  - Which keywords bring traffic?
  - Any crawl errors?
  - Pages with low CTR to optimize

- [ ] Content updates
  - Keep homepage fresh
  - Update feature list
  - Add new testimonials

- [ ] Build 5-10 quality backlinks
  - Guest posts
  - Directory submissions
  - Community participation

- [ ] Technical audit
  - Check for broken links
  - Update outdated content
  - Improve page speed if needed

## Success Metrics to Track

- [ ] Set baseline metrics (Week 1)
  - Organic traffic: ___
  - Keyword rankings: ___
  - Indexed pages: ___

- [ ] Monthly goals
  - 20% traffic growth month-over-month
  - Top 3 keywords ranking in top 50
  - 5+ quality backlinks acquired

## Notes

- SEO takes 3-6 months to show significant results
- Focus on providing value, not gaming the system
- User experience is the most important ranking factor
- Consistent effort beats one-time optimization

## Resources

- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Opengraph.xyz](https://www.opengraph.xyz/) - Preview social shares
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Ahrefs Free Tools](https://ahrefs.com/free-seo-tools)
- [Google Keyword Planner](https://ads.google.com/home/tools/keyword-planner/)
