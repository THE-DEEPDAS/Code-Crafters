const { createCanvas } = require('canvas');
const fs = require('fs').promises;
const path = require('path');

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function generateBaseTemplate() {
  // Ensure directories exist
  const templatesDir = path.join(__dirname, '../public/templates');
  await ensureDirectoryExists(templatesDir);
  
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');

  // Set white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 800, 600);

  // Add decorative border
  ctx.strokeStyle = '#34D399';
  ctx.lineWidth = 20;
  ctx.strokeRect(20, 20, 760, 560);

  // Add inner border
  ctx.strokeStyle = '#FCD34D';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, 720, 520);

  // Add decorative corners
  const cornerSize = 40;
  ['#34D399', '#FCD34D'].forEach((color, index) => {
    ctx.fillStyle = color;
    // Top left
    ctx.beginPath();
    ctx.moveTo(40 + index*10, 40 + index*10);
    ctx.lineTo(40 + cornerSize + index*10, 40 + index*10);
    ctx.lineTo(40 + index*10, 40 + cornerSize + index*10);
    ctx.closePath();
    ctx.fill();

    // Top right
    ctx.beginPath();
    ctx.moveTo(760 - index*10, 40 + index*10);
    ctx.lineTo(760 - cornerSize - index*10, 40 + index*10);
    ctx.lineTo(760 - index*10, 40 + cornerSize + index*10);
    ctx.closePath();
    ctx.fill();

    // Bottom left
    ctx.beginPath();
    ctx.moveTo(40 + index*10, 560 - index*10);
    ctx.lineTo(40 + cornerSize + index*10, 560 - index*10);
    ctx.lineTo(40 + index*10, 560 - cornerSize - index*10);
    ctx.closePath();
    ctx.fill();

    // Bottom right
    ctx.beginPath();
    ctx.moveTo(760 - index*10, 560 - index*10);
    ctx.lineTo(760 - cornerSize - index*10, 560 - index*10);
    ctx.lineTo(760 - index*10, 560 - cornerSize - index*10);
    ctx.closePath();
    ctx.fill();
  });

  // Add badge watermark
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.translate(400, 300);
  ctx.beginPath();
  ctx.arc(0, 0, 100, 0, Math.PI * 2);
  ctx.fillStyle = '#34D399';
  ctx.fill();
  ctx.restore();

  // Add placeholder text areas
  ctx.fillStyle = '#1F2937';
  ctx.globalAlpha = 0.1;
  ctx.fillRect(100, 100, 600, 60); // Title area
  ctx.fillRect(200, 200, 400, 40); // Name area
  ctx.fillRect(150, 300, 500, 100); // Achievement area
  ctx.globalAlpha = 1;

  // Save the template
  const templatePath = path.join(templatesDir, 'certificate-template.png');
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(templatePath, buffer);
  
  console.log('Certificate template generated successfully at:', templatePath);
}

// Execute the template generation
generateBaseTemplate().catch(err => {
  console.error('Error generating template:', err);
  process.exit(1);
});
