const { PDFDocument, rgb, StandardFonts } = PDFLib;

const previewBtn = document.getElementById("previewBtn");
const saveBtn = document.getElementById("saveBtn");
const pdfPreview = document.getElementById("pdfPreview");

previewBtn.addEventListener("click", async () => {
    const text = document.getElementById("textContent").value;
    const color = document.getElementById("textColor").value;
    const fontSize = parseInt(document.getElementById("fontSize").value, 10);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const rgbColor = hexToRgb(color);

    page.drawText(text, {
        x: 50,
        y: 750,
        size: fontSize,
        font,
        color: rgbColor,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    pdfPreview.src = url;
});

saveBtn.addEventListener("click", async () => {
    const templateJson = {
        objects: [
            {
                type: "text",
                x: 50,
                y: 750,
                fontSize: parseInt(document.getElementById("fontSize").value, 10),
                color: document.getElementById("textColor").value,
                font: "Helvetica-Bold",
                content: document.getElementById("textContent").value
            }
        ]
    };

    // Aquí haces POST a tu backend para guardar la template
    const res = await fetch("/templates", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer super_secret_token"
        },
        body: JSON.stringify({
            name: "ticket_bus_v1",
            templateJson
        })
    });

    const data = await res.json();
    alert("Template guardada: " + JSON.stringify(data));
});

// Helper para convertir HEX a rgb()
function hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return rgb(r, g, b);
}
