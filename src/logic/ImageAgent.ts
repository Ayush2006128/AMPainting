import { genkit } from "genkit";
import { googleAI, gemini20FlashExp } from "@genkit-ai/googleai";

// Define an interface for the agent configuration to ensure type safety
interface GenkitAgentConfig {
    apiKey: string;
    model: typeof gemini20FlashExp; // Use typeof to refer to the type of the imported model
    imageUri?: string; // Optional, if you want to pass an image URI directly
}
class GenerateImage {
    private imgAgent: ReturnType<typeof genkit>;
    public imgUri: string;
    private readonly prompt: string;

    constructor(config: GenkitAgentConfig) {
        this.imgAgent = genkit({
            plugins: [googleAI({ apiKey: config.apiKey })],
            model: config.model,
        });
        this.imgUri = config.imageUri || ""; // Initialize with the provided image URI or an empty string
        this.prompt = "Improve the following image while keeping the original structure same.";
    }

    /**
     * Generates an improved version of the image.
     * @returns A Promise that resolves to a string containing the URI of the generated image.
     */
    async generateImage(): Promise<string> {
        // Genkit's generate method accepts an array of content parts.
        // For multimodal input, you include text and media parts.
        const genResponse = await this.imgAgent.generate([
            { text: this.prompt },
            { media: { url: this.imgUri, contentType: "image/jpeg" } } // Pass the image as a media object
        ]);

        const responseText = genResponse.text ?? "";

        if (!responseText) {
            throw new Error("No image generated. The AI model did not return any content.");
        }

        // Assuming the response contains a URI to the generated image
        return responseText; // Return the URI of the generated image
    }
}

export default { GenerateImage };