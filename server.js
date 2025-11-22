import express from 'express';
import puppeteer from 'puppeteer';
import { marked } from 'marked';
import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';


const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.text({ limit: "10mb" }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Serve main UI
app.get("/", (req, res) => {
    res.render("index");
});


// Convert Markdown → PDF
app.post("/convert", async (req, res) => {
    try {
        const markdown = req.body.markdown;

        if (!markdown || markdown.trim() === "") {
            return res.status(400).send("Markdown is empty");
        }

        // Convert Markdown to HTML
        const htmlContent = marked(markdown);

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        await browser.close();

        // Set response headers for download
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=markdown.pdf",
            "Content-Length": pdfBuffer.length,
        });

        return res.send(pdfBuffer);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error generating PDF");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
