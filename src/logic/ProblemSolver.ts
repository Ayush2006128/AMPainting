import { genkit } from "genkit";
import { googleAI, gemini20Flash } from "@genkit-ai/googleai";

interface GenkitAgentConfig {
    apiKey: string;
    model: typeof gemini20Flash; // Use typeof to refer to the type of the imported model
    imageUri?: string; // Optional, if you want to pass an image URI directly
}
class ProblemSolver {
    private problemAgent: ReturnType<typeof genkit>;
    public answer: string;
    private readonly prompt: string;
    constructor(config: GenkitAgentConfig) {
        this.problemAgent = genkit({
            plugins: [googleAI({ apiKey: config.apiKey })],
            model: config.model,
        });
        this.answer = ""; // Initialize to an empty string
        this.prompt = "Given the following image of question, your job is to provide answer to that problem.";
    }
    /**
     * Analyzes an image to provide an answer to the problem depicted in the image.
     * @param imageUri The URI or path to the image. This will be converted to a Genkit media object.
     * @returns A Promise that resolves to a string containing the answer to the problem.
     */
    async solveProblem(imageUri: string): Promise<string> {
        // Genkit's generate method accepts an array of content parts.
        // For multimodal input, you include text and media parts.
        const genResponse = await this.problemAgent.generate([
            { text: this.prompt },
            { media: { url: imageUri, contentType: "image/jpeg" } } // Pass the image as a media object
        ]);

        const responseText = genResponse.text ?? "";

        if (!responseText) {
            throw new Error("No valid response received from the AI model.");
        }

        this.answer = responseText;
        return this.answer;
    }
}

export default { ProblemSolver };