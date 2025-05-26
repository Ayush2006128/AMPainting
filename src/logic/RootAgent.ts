import { genkit } from "genkit";
import { googleAI, gemini20Flash } from "@genkit-ai/googleai";

// Define an interface for the agent configuration to ensure type safety
interface GenkitAgentConfig {
    apiKey: string;
    model: typeof gemini20Flash; // Use typeof to refer to the type of the imported model
    imageUri?: string; // Optional, if you want to pass an image URI directly
}

class ImageAnalyzer {
    private rootAgent: ReturnType<typeof genkit>;
    public isProblem: boolean;
    private readonly prompt: string;

    constructor(config: GenkitAgentConfig) {
        this.rootAgent = genkit({
            plugins: [googleAI({ apiKey: config.apiKey })],
            model: config.model,
        });
        this.isProblem = false; // Initialize to a default value
        this.prompt = "Given the following image, determine that the image contains problem or drawing. If it contains a problem then return true otherwise return false.";
    }

    /**
     * Analyzes an image to determine if it contains a problem or a drawing.
     * @param imageUri The URI or path to the image. This will be converted to a Genkit media object.
     * @returns A Promise that resolves to a boolean indicating if the image is a problem.
     */
    async analyzeImage(imageUri: string): Promise<boolean> {
        // Genkit's generate method accepts an array of content parts.
        // For multimodal input, you include text and media parts.
        const genResponse = await this.rootAgent.generate([
            { text: this.prompt },
            { media: { url: imageUri, contentType: "image/jpeg" } } // Pass the image as a media object
        ]);

        const responseText = genResponse.text ?? "";

        if (responseText.toLowerCase().includes("true")) {
            this.isProblem = true;
        } else if (responseText.toLowerCase().includes("false")) {
            this.isProblem = false;
        } else {
            throw new Error(`Unexpected response from the AI model. Expected 'true' or 'false', but got: "${responseText}"`);
        }
        return this.isProblem;
    }
}

export default { ImageAnalyzer };