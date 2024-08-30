import { GoogleGenerativeAI } from "@google/generative-ai";


async function getImageDescriptionFromGemini(fileName: string, image: string) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Analise essa foto, me diga qual a medida, o quanto foi consumido neste medidor. Caso não seja um medidor de água ou gás, retorne null (responda em pt-br e apenas o valor da medição em número)";

    const imagePart = fileToGenerativePart(
      fileName,
      "image/png",
    );

    const result = await model.generateContent([prompt, imagePart]);

    function fileToGenerativePart(path: string, mimeType: string) {
      return {
        inlineData: {
          data: image,
          mimeType,
        },
      };
    }

    const imageMeasurement = Number(result.response.text().replace("m³", ""))

    return imageMeasurement
  } catch (error) {
    console.error('error while generating text through image :', error);
    throw error
  }
}


export {
  getImageDescriptionFromGemini
}