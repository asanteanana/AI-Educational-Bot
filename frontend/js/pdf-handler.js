// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

class PDFHandler {
    constructor() {
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        this.fileSelect = document.getElementById('fileSelect');
        this.pdfViewer = document.getElementById('pdfViewer');
        this.viewerSection = document.querySelector('.pdf-viewer-section');
        this.currentPDF = null;
        this.currentPage = 1;
        this.pdfText = '';
        this.highlightedElements = [];

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Drag and drop events
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('drag-over');
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('drag-over');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type === 'application/pdf') {
                this.handlePDFFile(file);
            }
        });

        // File input events
        this.fileSelect.addEventListener('click', () => {
            this.fileInput.click();
        });

        this.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type === 'application/pdf') {
                this.handlePDFFile(file);
            }
        });
    }

    async handlePDFFile(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            this.currentPDF = pdf;
            this.pdfText = '';

            // Show the PDF viewer section
            this.viewerSection.style.display = 'block';

            // Extract text from all pages
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                this.pdfText += pageText + '\n';

                // Render the first page initially
                if (pageNum === 1) {
                    await this.renderPage(page);
                }
            }

            // Dispatch event for TTS engine
            const event = new CustomEvent('pdfLoaded', { detail: { text: this.pdfText } });
            document.dispatchEvent(event);
        } catch (error) {
            console.error('Error loading PDF:', error);
            alert('Error loading PDF. Please try again.');
        }
    }

    async renderPage(page) {
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        this.pdfViewer.innerHTML = '';
        this.pdfViewer.appendChild(canvas);

        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
    }

    highlightText(textPosition) {
        // Remove previous highlights
        this.highlightedElements.forEach(el => el.classList.remove('highlighted'));
        this.highlightedElements = [];

        // Find and highlight the current text
        const textNodes = this.pdfViewer.querySelectorAll('.text-layer > span');
        let currentPosition = 0;

        textNodes.forEach(node => {
            const nodeLength = node.textContent.length;
            if (currentPosition <= textPosition && textPosition < currentPosition + nodeLength) {
                node.classList.add('highlighted');
                this.highlightedElements.push(node);
                node.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            currentPosition += nodeLength + 1; // +1 for space
        });
    }
}

// Initialize PDF handler
const pdfHandler = new PDFHandler(); 