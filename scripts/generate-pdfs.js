const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF(htmlPath, outputPath) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Get the absolute path to the HTML file
  const htmlFilePath = path.resolve(__dirname, htmlPath);
  
  // Read HTML content
  const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
  
  // Load the HTML content into the page
  await page.setContent(htmlContent, { 
    waitUntil: 'load',
    timeout: 30000
  });
  
  // Generate PDF with proper settings
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      right: '15mm',
      bottom: '15mm',
      left: '15mm'
    },
    preferCSSPageSize: false
  });
  
  await browser.close();
  console.log(`PDF generated: ${outputPath}`);
}

async function main() {
  const publicDir = path.join(__dirname, '..', 'public', 'documents');
  
  // Generate Student Copyright Checklist PDF
  await generatePDF(
    path.join(publicDir, 'student-copyright-checklist.html'),
    path.join(publicDir, 'student-copyright-checklist.pdf')
  );
  
  // Generate Work Log PDF
  await generatePDF(
    path.join(publicDir, 'work-log.html'),
    path.join(publicDir, 'work-log.pdf')
  );
  
  console.log('All PDFs generated successfully!');
}

main().catch(console.error);

