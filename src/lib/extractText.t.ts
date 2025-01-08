import pdfParse from "pdf-parse";

export async function extractTextFromPDF(fileBuffer: Buffer): Promise<string> {
    try {
        const data = await pdfParse(fileBuffer);
        return data.text; // Renvoie uniquement le texte extrait du PDF
    } catch (error) {
        console.error("Error parsing PDF:", error);
        return "";
    }
}
