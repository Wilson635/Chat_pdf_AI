import { franc } from "franc-min";

export async function detectLanguage(text: string): Promise<string> {
    const langCode = franc(text);

    switch (langCode) {
        case "eng":
            return "english";
        case "fra":
            return "french";
        case "spa":
            return "spanish";
        case "deu":
            return "german";
        default:
            return "unknown";
    }
}
