const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require("@supabase/supabase-js");
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function rewriteProduct(productId) {
    console.log(`\n✍️ [Luxury Copywriter] Rescriem produsul: ${productId}`);

    const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

    if (fetchError || !product) {
        console.error("❌ Produs negăsit:", fetchError?.message);
        return;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const aiPrompt = `
        Produs actual: "${product.name}"
        Descriere actuală: "${product.description}"

        SARCINĂ: Rescrie acest produs pentru magazinul de elită "AZISUNT".
        Folosește tonul "Quiet Luxury" - rafinat, minimalist, axat pe experiență și statut, nu pe specificații tehnice.

        Returnează JSON:
        {
          "name": "Nume Nou (max 3 cuvinte, elegant)",
          "description": "Descriere nouă (min 300 caractere, persuasivă, elitistă)",
          "marketing": {
            "hook": "Un hook viral",
            "story": "O scurtă poveste de lifestyle"
          },
          "features": ["3 beneficii de lux"]
        }
        Limbă: ROMÂNĂ.
    `;

    try {
        const result = await model.generateContent(aiPrompt);
        const aiResponse = JSON.parse(result.response.text().replace(/```json|```/g, '').trim());

        const { error: updateError } = await supabase
            .from('products')
            .update({
                name: aiResponse.name,
                description: aiResponse.description,
                marketing: aiResponse.marketing,
                features: aiResponse.features,
                updated_at: new Date().toISOString(),
            })
            .eq('id', productId);

        if (updateError) throw updateError;
        console.log(`✅ Produs rescris cu succes: ${aiResponse.name}`);
    } catch (e) {
        console.error(`❌ Eroare la rescriere: ${e.message}`);
    }
}

const id = process.argv[2];
if (id) rewriteProduct(id);
