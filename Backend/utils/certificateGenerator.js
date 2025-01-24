const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs').promises;

const generateCertificateTemplate = async (username, milestone) => {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');

  // Load the base template
  const template = await loadImage(
    path.join(__dirname, '../public/templates/certificate-template.png')
  );
  ctx.drawImage(template, 0, 0);

  // Add certificate text
  ctx.fillStyle = '#1F2937';
  ctx.textAlign = 'center';

  // Title
  ctx.font = 'bold 40px Arial';
  ctx.fillText('Certificate of Achievement', 400, 120);

  // Subtitle
  ctx.font = 'italic 25px Arial';
  ctx.fillText('for Environmental Conservation', 400, 160);

  // Main text
  ctx.font = '30px Arial';
  ctx.fillText('This certifies that', 400, 220);
  
  // Username
  ctx.font = 'bold 35px Arial';
  ctx.fillText(username, 400, 270);
  
  // Achievement text
  ctx.font = '30px Arial';
  ctx.fillText(`has successfully recycled`, 400, 320);
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = '#34D399';
  ctx.fillText(`${milestone} Cups`, 400, 370);
  
  // Additional text
  ctx.font = '25px Arial';
  ctx.fillStyle = '#1F2937';
  ctx.fillText('Contributing to a cleaner and greener planet', 400, 420);

  // Date
  ctx.font = '20px Arial';
  ctx.fillText(new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }), 400, 500);

  return canvas;
};

exports.createCertificate = async (username, milestone) => {
  const canvas = await generateCertificateTemplate(username, milestone);
  const fileName = `certificate_${username}_${milestone}_${Date.now()}.png`;
  const filePath = path.join(__dirname, '../public/certificates', fileName);
  
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(filePath, buffer);
  
  return `/certificates/${fileName}`;
};
