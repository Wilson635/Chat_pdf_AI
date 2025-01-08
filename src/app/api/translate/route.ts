import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

// Configuration de l'API OpenAI avec votre clé API
const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPENAI_API_KEY, // Vous devez définir cette variable dans votre .env.local
    })
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // Récupérer le texte de la requête
            const { text } = req.body;

            if (!text) {
                return res.status(400).json({ error: 'Le texte à traduire est requis.' });
            }

            // Appel à l'API OpenAI pour la traduction
            const response = await openai.createCompletion({
                model: 'text-davinci-003', // Modèle OpenAI à utiliser pour la traduction
                prompt: `Translate the following text to English:\n\n${text}`,
                max_tokens: 500,
            });

            // Retourner le texte traduit
            const translatedText = response.data.choices[0].text?.trim();

            if (!translatedText) {
                return res.status(500).json({ error: 'Erreur lors de la traduction.' });
            }

            res.status(200).json({ translatedText });
        } catch (error) {
            console.error('Erreur lors de l\'appel à l\'API OpenAI', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    } else {
        // Méthode HTTP non autorisée
        res.status(405).json({ error: 'Méthode non autorisée' });
    }
}
