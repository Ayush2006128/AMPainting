import RootAgent from "../RootAgent";
import ImageAgent from "../ImageAgent";
import ProblemSolver from "../ProblemSolver";
import { gemini20Flash } from "@genkit-ai/googleai";

export async function askAi(imageUri: string): Promise<string> {

    let isProblem: boolean;
    const apiKey = process.env.GEMINI_API_KEY ?? "";
    const imageAgent = new ImageAgent.GenerateImage({apiKey: apiKey ?? "", model: gemini20Flash, imageUri: imageUri});
    const rootAgent = new RootAgent.ImageAnalyzer({apiKey: apiKey ?? "", model: gemini20Flash});
    const problemSolver = new ProblemSolver.ProblemSolver({apiKey: apiKey ?? "", model: gemini20Flash});
    try {
        isProblem = await rootAgent.analyzeImage(imageUri);
        if (isProblem) {
            let answer = await problemSolver.solveProblem(imageUri);
            return answer;
        } else {
            let answer = await imageAgent.generateImprovedDrawing();
            return answer;
        }
    } catch (error) {
        console.error("Error during AI processing:", error);
        throw new Error("Failed to process the image with AI. Please try again later.");
    }
    
}