#!/usr/bin/env node

/**
 * Generate OG Image for Infinity Note
 * This script creates a PNG OG image without external dependencies
 * using SVG-to-PNG conversion or canvas if available
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Generating OG Image for Infinity Note...\n');

// Check if canvas package is available
let canvas;
try {
  canvas = require('canvas');
  console.log('✅ Canvas package found, generating PNG...\n');
  generateWithCanvas();
} catch (err) {
  console.log('⚠️  Canvas package not found.');
  console.log('📝 Creating alternative solutions...\n');
  showManualInstructions();
}

function generateWithCanvas() {
  const { createCanvas } = canvas;
  const canvasEl = createCanvas(1200, 630);
  const ctx = canvasEl.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#0c1327');
  gradient.addColorStop(1, '#1e293b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Decorative circles
  ctx.fillStyle = 'rgba(29, 78, 216, 0.1)';
  ctx.beginPath();
  ctx.arc(1000, 100, 200, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
  ctx.beginPath();
  ctx.arc(200, 500, 250, 0, Math.PI * 2);
  ctx.fill();

  // Border
  ctx.strokeStyle = '#1D4ED8';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, 1180, 610);

  // App name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 90px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Infinity Note', 600, 200);

  // Infinity symbol
  ctx.fillStyle = '#3B82F6';
  ctx.font = 'bold 100px Arial';
  ctx.fillText('∞', 600, 315);

  // Tagline
  ctx.fillStyle = '#94a3b8';
  ctx.font = '40px Arial, sans-serif';
  ctx.fillText('Free Online Note Taking App', 600, 420);

  // Features
  ctx.font = '28px Arial, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('✨ Unlimited Notes  |  🏷️ Categories  |  ☁️ Cloud Sync  |  📱 Mobile Friendly', 600, 500);

  // URL
  ctx.fillStyle = '#1D4ED8';
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.fillText('infinity-note.vercel.app', 600, 570);

  // Save to file
  const outputPath = path.join(__dirname, '..', 'public', 'og-image.png');
  const buffer = canvasEl.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);

  const stats = fs.statSync(outputPath);
  const fileSizeKB = (stats.size / 1024).toFixed(2);

  console.log('✅ OG Image created successfully!');
  console.log(`📁 Location: public/og-image.png`);
  console.log(`📊 Size: ${fileSizeKB} KB`);
  console.log('\n✨ Next steps:');
  console.log('   1. git add public/og-image.png');
  console.log('   2. git commit -m "Add OG image for SEO"');
  console.log('   3. git push');
  console.log('\n🔍 Verify after deploy:');
  console.log('   https://infinity-note.vercel.app/og-image.png\n');
}

function showManualInstructions() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('To generate the OG image, choose ONE of these options:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('OPTION 1: Install canvas package and run this script again');
  console.log('──────────────────────────────────────────────────────');
  console.log('   npm install --save-dev canvas');
  console.log('   node scripts/generate-og-image.js\n');

  console.log('OPTION 2: Use online converter (EASIEST)');
  console.log('──────────────────────────────────────────────────────');
  console.log('   1. Go to: https://cloudconvert.com/svg-to-png');
  console.log('   2. Upload: public/og-image.svg');
  console.log('   3. Set width: 1200, height: 630');
  console.log('   4. Download and save as: public/og-image.png\n');

  console.log('OPTION 3: Use the browser generator');
  console.log('──────────────────────────────────────────────────────');
  console.log('   1. Open: scripts/generate-og-image.html');
  console.log('   2. Click "Download Image"');
  console.log('   3. Save as: public/og-image.png\n');

  console.log('OPTION 4: Use Canva');
  console.log('──────────────────────────────────────────────────────');
  console.log('   1. Go to: https://www.canva.com/create/og-images/');
  console.log('   2. Create 1200x630px image');
  console.log('   3. Add text: "Infinity Note" + tagline');
  console.log('   4. Download as PNG\n');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(1);
}
