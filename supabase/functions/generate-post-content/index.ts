import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configurações dos modelos disponíveis
type ModelConfig = {
  name: string;
  provider: string;
  fast: boolean;
  cost: string;
};

const AI_MODELS: Record<string, ModelConfig> = {
  'glm-4.5-air': {
    name: 'GLM-4.5 Air',
    provider: 'zhipu',
    fast: true,
    cost: 'free'
  },
  'glm-4-32b': {
    name: 'GLM-4 32B',
    provider: 'thudm',
    fast: false,
    cost: 'low'
  },
  'glm-4-9b': {
    name: 'GLM-4 9B',
    provider: 'thudm',
    fast: true,
    cost: 'low'
  },
  'gpt-4o-mini': {
    name: 'GPT-4o Mini',
    provider: 'openai',
    fast: true,
    cost: 'low'
  },
  'gpt-4o': {
    name: 'GPT-4o',
    provider: 'openai',
    fast: false,
    cost: 'medium'
  },
  'claude-3-sonnet-20240229': {
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    fast: true,
    cost: 'medium'
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      objective, 
      network, 
      template, 
      theme, 
      content,
      model = 'glm-4.5-air',
      generateImages = true,
      generateCaption = true,
      generateHashtags = true,
      customPrompt = null
    } = await req.json();

    console.log('Generating AI content:', { 
      objective, 
      network, 
      template, 
      theme, 
      model,
      contentLength: content?.length || 0
    });

    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    // Use o conteúdo fornecido ou o tema como fallback
    const contentToProcess = content || theme || objective;

    let systemPrompt = `Você é um especialista em marketing digital e criação de conteúdo para redes sociais. Sua especialidade é criar posts engajantes e persuasivos que geram resultados.

Você deve gerar conteúdo baseado nos seguintes parâmetros:
- Rede Social: ${network}
- Formato/Template: ${template}
- Conteúdo/Tema: ${contentToProcess}
${objective ? `- Objetivo: ${objective}` : ''}

IMPORTANTE: Responda SEMPRE em JSON válido com as seguintes chaves:`;

    const requestedContent = [];
    
    if (generateImages) {
      requestedContent.push(`"carousel_prompts": [array de 3-5 prompts detalhados em inglês para geração de imagens do carrossel, cada prompt deve ser específico, visual e adequado para ${network}]`);
    }
    
    if (generateCaption) {
      requestedContent.push(`"caption": "legenda em português, engajante e persuasiva, otimizada para ${network}"`);
    }
    
    if (generateHashtags) {
      requestedContent.push(`"hashtags": [array de 10-15 hashtags relevantes e estratégicas para ${network}]`);
    }

    systemPrompt += `
{
  ${requestedContent.join(',\n  ')}
}

DIRETRIZES ESPECÍFICAS POR REDE SOCIAL:

${network === 'instagram' ? `
INSTAGRAM:
- Caption: Max 2200 caracteres, use quebras de linha, emojis estratégicos
- Inclua CTA claro (curtir, comentar, compartilhar, salvar)
- Prompts de imagem: Foque em aspectos visuais, cores vibrantes, composição atrativa
- Hashtags: Mix de populares (#love #instagood) e nicho específico
` : ''}

${network === 'linkedin' ? `
LINKEDIN:
- Caption: Tom profissional mas acessível, max 3000 caracteres
- Inclua insights valiosos, dados ou dicas práticas
- CTA para engagement profissional (compartilhar experiência, opinar)
- Prompts de imagem: Profissionais, corporativos, infográficos
- Hashtags: Focadas em negócios, indústria e profissional
` : ''}

${network === 'tiktok' ? `
TIKTOK:
- Caption: Concisa, max 2200 caracteres, trending language
- Use gírias atuais e linguagem jovem
- CTA para viralização (duet, stitch, trend)
- Prompts de imagem: Dinâmicas, coloridas, para vídeos curtos
- Hashtags: Trending hashtags + nicho específico
` : ''}

Adaptações por template:
- Post Feed: Foco em engajamento e valor
- Stories: Mais casual, interativo, urgência
- Reels/Vídeos: Dinâmico, entretenimento, viralização

${customPrompt ? `\nINSTRUÇÕES PERSONALIZADAS: ${customPrompt}` : ''}`;

    const userPrompt = customPrompt || `Crie conteúdo profissional e engajante para: ${contentToProcess}`;

    // Use different API based on model
    let response;
    let apiUrl;
    let requestBody;
    let headers;

    if (model === 'glm-4.5-air') {
      // Use Z.AI GLM 4.5 Air (free) API
      apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
      headers = {
        'Authorization': `Bearer ${openRouterApiKey}`, // Will use same key for now
        'Content-Type': 'application/json',
      };
      requestBody = {
        model: 'glm-4-air',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      };
    } else {
      // Use OpenRouter for other models
      const fullModelName = model.includes('/') ? model : `${AI_MODELS[model]?.provider || 'thudm'}/${model}`;
      apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
      headers = {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://postcraft.app',
        'X-Title': 'PostCraft - AI Content Generator',
      };
      requestBody = {
        model: fullModelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      };
    }
    
    console.log('Using model:', model, 'API URL:', apiUrl);

    response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API error:', {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
        model,
        error: errorData
      });
      throw new Error(`API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('AI Generated text:', generatedText);

    // Parse the JSON response with improved error handling
    let generatedContent;
    try {
      // Clean and extract JSON from the response
      let jsonText = generatedText.trim();
      
      // Look for JSON block markers
      const jsonStart = jsonText.indexOf('{');
      const jsonEnd = jsonText.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonText = jsonText.slice(jsonStart, jsonEnd + 1);
      }
      
      // Clean common AI response artifacts
      jsonText = jsonText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^\s*json\s*/i, '')
        .trim();
      
      generatedContent = JSON.parse(jsonText);
      console.log('Successfully parsed AI JSON:', generatedContent);
    } catch (e) {
      console.error('Failed to parse AI JSON. Raw response:', generatedText);
      console.error('Parse error:', e);
      
      // Smart fallback with better content extraction
      const fallbackCaption = contentToProcess.length > 20 
        ? `🚀 ${contentToProcess}\n\n✨ Conte-nos sua opinião nos comentários!` 
        : `Novo conteúdo sobre ${contentToProcess}! 🎉\n\n💭 O que você achou? Compartilhe conosco!`;
      
      generatedContent = {
        caption: generateCaption ? fallbackCaption : undefined,
        hashtags: generateHashtags ? [
          '#marketing', '#conteudo', '#digital', '#socialmedia',
          network === 'instagram' ? '#instagram' : network === 'linkedin' ? '#linkedin' : '#tiktok',
          '#engajamento', '#criatividade'
        ] : undefined,
        carousel_prompts: generateImages ? [
          `Professional ${network} post image about ${contentToProcess}`,
          `Modern design layout for ${contentToProcess} content`,
          `Engaging visual representation of ${contentToProcess}`
        ] : undefined
      };
      
      console.log('Using enhanced fallback content:', generatedContent);
    }

    // Validate generated content structure
    if (!generatedContent || typeof generatedContent !== 'object') {
      throw new Error('Invalid content structure generated');
    }

    // Generate images using OpenRouter if requested and prompts exist
    let generatedImages = [];
    if (generateImages && generatedContent.carousel_prompts && Array.isArray(generatedContent.carousel_prompts)) {
      console.log('Generating images for carousel...');
      
      for (const prompt of generatedContent.carousel_prompts.slice(0, 3)) {
        try {
          const imageResponse = await fetch('https://openrouter.ai/api/v1/images/generations', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openRouterApiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://postcraft.app',
              'X-Title': 'PostCraft - AI Image Generator',
            },
            body: JSON.stringify({
              model: 'black-forest-labs/flux-1-schnell',
              prompt: `${prompt}. High quality, professional, suitable for ${network} social media post. Modern design, vibrant colors, engaging composition.`,
              width: 1024,
              height: 1024,
              steps: 4,
              response_format: 'url'
            }),
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            console.log('Image generation response:', imageData);
            
            // Handle different response formats
            if (imageData.data && imageData.data[0]) {
              // OpenAI format
              generatedImages.push({
                prompt: prompt,
                url: imageData.data[0].url,
                revised_prompt: imageData.data[0].revised_prompt || prompt
              });
            } else if (imageData.url) {
              // Direct URL format
              generatedImages.push({
                prompt: prompt,
                url: imageData.url,
                revised_prompt: prompt
              });
            } else if (imageData.images && imageData.images[0]) {
              // Alternative format
              generatedImages.push({
                prompt: prompt,
                url: imageData.images[0].url,
                revised_prompt: prompt
              });
            }
          } else {
            const errorText = await imageResponse.text();
            console.error('Failed to generate image for prompt:', prompt, 'Error:', errorText);
          }
        } catch (error) {
          console.error('Error generating image:', error);
        }
      }
    }

    const result = {
      ...generatedContent,
      generated_images: generatedImages,
      model_used: model,
      model_info: AI_MODELS[model],
      network,
      template,
      processing_time: Date.now(),
      timestamp: new Date().toISOString(),
      success: true
    };

    console.log('Final AI result:', { 
      success: true, 
      contentKeys: Object.keys(generatedContent),
      imagesCount: generatedImages.length,
      model 
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-post-content function:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.stack : undefined
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});