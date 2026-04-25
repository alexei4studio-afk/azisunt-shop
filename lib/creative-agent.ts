import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function generateProductCopy(productName: string, category: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Ești un expert în Copywriting, SEO și AEO (Answer Engine Optimization). 
    Scrie o descriere captivantă și optimizată pentru produsul: "${productName}" din categoria "${category}".
    
    Cerințe:
    1. Ton: Profesional, dar entuziast (stil "Viral TikTok").
    2. Structură: 
       - Un cârlig (hook) scurt la început.
       - 3 beneficii principale explicate clar.
       - O secțiune "De ce este viral acum?".
       - O întrebare frecventă (FAQ) pentru AEO.
    3. Limbă: Română.
    4. Format: JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Copywriting Error:", error);
    return null;
  }
}

export async function generateImagePrompt(productName: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Creează un prompt detaliat pentru un generator de imagini AI (precum Midjourney sau Replicate) 
    pentru a genera o fotografie de produs "High-End Lifestyle" pentru: "${productName}".
    Imaginea trebuie să arate premium, minimalistă, cu lumină naturală și fundal curat (aesthetic).
    Promptul trebuie să fie în Engleză.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Image Prompt Error:", error);
    return null;
  }
}
