import express from 'express';
import puppeteer from 'puppeteer';
import { marked } from 'marked';
import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.text({ limit: '10mb' }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/convert', async (req, res) => {
  try {
    const markdown = req.body.markdown;

    if (!markdown || markdown.trim() === '') {
      return res.status(400).send('Markdown is empty');
    }

    const htmlContent = marked(markdown);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
    });

    return res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating PDF');
  }
});

export default app;
