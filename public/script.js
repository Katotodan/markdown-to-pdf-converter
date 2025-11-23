const form = document.getElementById("markdown-form");
const downloadBtn = document.getElementById("download-btn");
const loader = document.querySelector(".loader");
const pdfViewer = document.getElementById('pdfViewer');
const errorDisplayer = document.getElementById("error-displayer");
const previewText = document.getElementById("preview");

// Handle form submission
const setError = (message) => {
    errorDisplayer.textContent = message;
    setTimeout(() => {
        errorDisplayer.textContent = "";
    }, 2000);
    loader.style.display = "none";
    pdfViewer.style.display = "none";
    downloadBtn.style.display = "none";
    previewText.style.display = "none";
    return;
};


if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        loader.style.display = "block";
        pdfViewer.style.display = "none";
        downloadBtn.style.display = "none";
        previewText.style.display = "none";

        const markdown = document.getElementById("markdown-input").value;
        if (!markdown.trim()) {
            return setError("Please enter some Markdown content.");
        }

        try {
            const response = await fetch("/convert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markdown }),
            });

            if (!response.ok){
                return setError("Failed to convert Markdown to PDF. Please try again.");
            }
            loader.style.display = "none";
            pdfViewer.style.display = "block";
            downloadBtn.style.display = "block";
            previewText.style.display = "block";

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