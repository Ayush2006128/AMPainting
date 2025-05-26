import { genkit } from "genkit";
import { googleAI, gemini20FlashExp } from "@genkit-ai/googleai";

// Define an interface for the agent configuration to ensure type safety.
// This interface now explicitly expects a Model instance and the user's drawing URI.
interface GenkitAgentConfig {
    apiKey: string;
    model: typeof gemini20FlashExp; // Assuming 'gemini20FlashExp' is the correct Genkit Model instance
    imageUri: string; // The URI (e.g., Data URI or URL) of the user's drawing to be improved
}

/**
 * A class responsible for interacting with a Genkit-powered AI model
 * to improve user-provided drawings.
 */
class GenerateImage {
    private imgAgent: ReturnType<typeof genkit>;
    public imgUri: string;
    private readonly prompt: string;

    /**
     * Constructs a new GenerateImage agent.
     * @param config - Configuration object containing the API key, model, and initial image URI.
     */
    constructor(config: GenkitAgentConfig) {
        // Initialize Genkit with the Google AI plugin and the specified model.
        // The 'model' property here expects a Model object from @genkit-ai/googleai.
        this.imgAgent = genkit({
            plugins: [googleAI({ apiKey: config.apiKey })],
            model: config.model,
        });
        this.imgUri = config.imageUri; // Store the URI of the user's drawing
        // Define a detailed prompt to guide the AI in improving the drawing.
        // This prompt instructs the model to enhance details, colors, textures, and lighting
        // while maintaining the original structure of the drawing.
        this.prompt = "Improve this drawing, making it more detailed and visually appealing while preserving its original structure and main elements. Enhance colors, textures, and lighting to bring it to life, making it look professional and polished.";
    }

    /**
     * Generates an improved version of the user's drawing.
     * It sends the user's drawing (as a media part) and a text prompt to the Genkit agent.
     * The method then parses the AI's response to extract the generated image.
     * @returns A Promise that resolves to a string containing the Data URI of the generated image.
     * This Data URI can be directly used in an <img> tag's 'src' attribute.
     * @throws An error if no image URI is provided, if the AI model returns no valid content,
     * or if no image data is found in the model's response.
     */
    async generateImprovedDrawing(): Promise<string> {
        // Validate that an image URI has been provided before attempting generation.
        if (!this.imgUri) {
            throw new Error("No image URI provided for improvement. Please set 'imgUri' before calling 'generateImprovedDrawing'.");
        }

        console.log("Sending request to Genkit for image improvement...");

        try {
            // Call the Genkit agent's 'generate' method.
            // We provide a multimodal prompt: a text instruction and the user's drawing as media.
            // The 'contentType' for the input image is set to 'image/png', which is common for drawings.
            // Use 'any' for genResponse to avoid type errors, or define a proper interface for the response.
            const genResponse: any = await this.imgAgent.generate({
                prompt: [
                    { text: this.prompt },
                    { media: { url: this.imgUri, contentType: "image/png" } } // Assuming user drawings are PNGs
                ],
                // For image generation, some models might require specific configuration
                // like 'responseModality: ['image']'. Genkit often handles this implicitly
                // when an image-capable model is used and an image is expected in response.
            });

            // Log the full response for debugging purposes. This helps understand the exact
            // structure of the model's output, which can vary slightly between models/versions.
            console.log("Full Genkit Response:", JSON.stringify(genResponse, null, 2));

            // Check if the response contains valid data and content parts.
            if (genResponse.data && genResponse.data.length > 0 &&
                genResponse.data[0].content && genResponse.data[0].content.parts) {

                // Iterate through each part of the content to find the image data.
                for (const part of genResponse.data[0].content.parts) {
                    // An image output will typically be in an 'inlineData' part with an image MIME type.
                    if (part.inlineData && part.inlineData.mimeType.startsWith("image/")) {
                        // Construct a Data URI from the base64 encoded image data.
                        // This format allows the image to be embedded directly in HTML.
                        const dataUri = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                        console.log("Image successfully generated and extracted as Data URI.");
                        return dataUri; // Return the Data URI
                    }
                }
                // If no image part was found after checking all parts.
                throw new Error("The AI model returned content, but no image data was found in the response parts. Expected an image output.");
            } else {
                // If the response structure is unexpected or empty.
                throw new Error("No valid response or content data from the AI model. Check model capabilities and input.");
            }
        } catch (error) {
            console.error("Error generating improved drawing:", error);
            throw error; // Re-throw the error after logging
        }
    }
}

export default { GenerateImage };
