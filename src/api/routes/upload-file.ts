import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../../app";

// POST /upload
// Responsável por receber uma imagem em base 64, consultar o Gemini e retornar a 
// medida lida pela API
// Esse endpoint deve:
// • Validar o tipo de dados dos parâmetros enviados (inclusive o base64)
// • Verificar se já existe uma leitura no mês naquele tipo de leitura.
// • Integrar com uma API de LLM para extrair o valor da imagem
// Ela irá retornar:
// • Um link temporário para a imagem
// • Um GUID
// • O valor numérico reconhecido pela LLM
// Request Body
// {
//  "image": "base64",
//  "customer_code": "string",
//  "measure_datetime": "datetime",
//  "measure_type": "WATER" ou "GAS"
// }


// PATCH /confirm
// Responsável por confirmar ou corrigir o valor lido pelo LLM,
// Esse endpoint deve:
// • Validar o tipo de dados dos parâmetros enviados
// • Verificar se o código de leitura informado existe
// • Verificar se o código de leitura já foi confirmado
// • Salvar no banco de dados o novo valor informado
// Ele NÃO deve fazer:
// • Fazer novas consultas ao LLM para validar o novo resultado recebido
// Ela irá retornar:
// • Resposta de OK ou ERRO dependendo do valor informado.
// Request Body
// {
//  "measure_uuid": "string",
//  "confirmed_value": intege
// }

//

// GET /<customer code>/list
// Responsável por listar as medidas realizadas por um determinado cliente
// Esse endpoint deve:
// • Receber o código do cliente e filtrar as medidas realizadas por ele
// • Ele opcionalmente pode receber um query parameter “measure_type”, que 
// deve ser “WATER” ou “GAS”
// ▪ A validação deve ser CASE INSENSITIVE
// ▪ Se o parâmetro for informado, filtrar apenas os valores do tipo 
// especificado. Senão, retornar todos os tipos.
// Ex. {base url}/<customer code>/list?measure_type=WATER
// Ela irá retornar:
// • Uma lista com todas as leituras realizadas.

import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type RequestBody = {
  "image": string,
  "customer_code": string,
  "measure_datetime": string,
  "measure_type": "water" | "gas"

}

type ResponseBody = {
  image_url: string,
  measure_value: number,
  measure_uuid: string

}

async function uploadRoutes() {
  app.post("/upload", async (req: FastifyRequest<{ Body: RequestBody }>, reply: FastifyReply) => {
    const { image, customer_code, measure_datetime, measure_type } = req.body


    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Analise essa foto, me diga qual a medida e o quanto foi consumido neste medidor. Caso não seja um medidor de água ou gás, informe que não se trata de um medidor (responda em pt-br)";
    // Note: The only accepted mime types are some image types, image/*.
    const imagePart = fileToGenerativePart(
      `gato.jpg`,
      "image/jpeg",
    );

    const result = await model.generateContent([prompt, imagePart]);
    console.log(result.response.text());

    function fileToGenerativePart(path: string, mimeType: string) {
      return {
        inlineData: {
          data: image,
          mimeType,
        },
      };
    }


    const responseBody: RequestBody = {
      image,
      customer_code,
      measure_type,
      measure_datetime
    }

    return reply.code(200).send(responseBody)


  })

}


export {
  uploadRoutes
}