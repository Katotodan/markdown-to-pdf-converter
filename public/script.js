const form = document.getElementById("markdown-form");
const downloadBtn = document.getElementById("download-btn");

// Handle form submission

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const markdown = document.getElementById("markdown-input").value;

        try {
            const response = await fetch("/convert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markdown }),
            });

            if (!response.ok) throw new Error(`Server responded ${response.status}`);

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            document.getElementById('pdfViewer').src = objectUrl;
        } catch (error) {
            console.error("Error converting Markdown to PDF:", error);
            alert("Failed to convert Markdown to PDF. Please try again.");
        }
    });
}

// Handle download button click
if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
        const pdfViewer = document.getElementById('pdfViewer');
        if (pdfViewer && pdfViewer.src) {
            const link = document.createElement('a');
            link.href = pdfViewer.src;
            link.download = 'markdown.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("No PDF available to download. Please convert Markdown first.");
        }
    });
}