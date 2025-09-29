import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
const zaiApiKey = Deno.env.get('ZAI_API_KEY');
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
      model = 'gpt-4o-mini',
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
    
    if (!openAIApiKey) {
      console.warn('OpenAI API key not configured - image generation will be skipped');
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

    // Use specified model, prioritizing GLM 4.5 Air
    let workingModel = model;
    
    // Map models to their correct OpenRouter identifiers
    const fullModelName = workingModel === 'glm-4.5-air' ? 'zhipuai/glm-4-airx' : // Correct GLM 4.5 Air model
      workingModel === 'glm-4-9b' ? 'zhipuai/glm-4-9b-chat' :
      workingModel === 'glm-4-32b' ? 'zhipuai/glm-4-plus' :
      workingModel === 'gpt-4o-mini' ? 'openai/gpt-4o-mini' :
      workingModel === 'gpt-4o' ? 'openai/gpt-4o' :
      workingModel === 'claude-3-sonnet-20240229' ? 'anthropic/claude-3-sonnet-20240229' :
      `openai/${workingModel}`;
      
    console.log(`Using model: ${model} -> ${fullModelName}`);
      
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

    // Generate images using OpenAI API if requested and prompts exist
    let generatedImages = [];
    if (generateImages && generatedContent.carousel_prompts && Array.isArray(generatedContent.carousel_prompts)) {
      console.log('Generating images for carousel using OpenAI...');
      console.log('This may take 30-60 seconds, please wait...');
      
      if (!openAIApiKey) {
        console.log('OpenAI API key not configured, using OpenRouter Flux model as fallback');
        
        // Fallback to OpenRouter Flux model (keep existing code)
        for (const prompt of generatedContent.carousel_prompts.slice(0, 3)) {
          try {
            const enhancedPrompt = `${prompt}. High quality, professional, suitable for ${network} social media post. Modern design, vibrant colors, engaging composition.`;
            
            console.log(`Generating image via OpenRouter for: ${prompt.substring(0, 50)}...`);
            
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
                prompt: enhancedPrompt,
                width: 1024,
                height: 1024,
                steps: 4,
                response_format: 'url'
              }),
            });

            console.log(`OpenRouter API response status: ${imageResponse.status}`);

            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              console.log('OpenRouter Image generation success');
              
              // Handle different response formats from OpenRouter
              let imageUrl = null;
              if (imageData.data && imageData.data[0] && imageData.data[0].url) {
                imageUrl = imageData.data[0].url;
              } else if (imageData.url) {
                imageUrl = imageData.url;
              } else if (imageData.images && imageData.images[0] && imageData.images[0].url) {
                imageUrl = imageData.images[0].url;
              }
              
              if (imageUrl) {
                generatedImages.push({
                  prompt: prompt,
                  url: imageUrl,
                  format: 'png',
                  revised_prompt: prompt
                });
                console.log(`Successfully generated image ${generatedImages.length} for carousel`);
              } else {
                console.error('No image URL found in response:', imageData);
              }
            } else {
              const errorText = await imageResponse.text();
              console.error('OpenRouter API Error:', {
                status: imageResponse.status,
                statusText: imageResponse.statusText,
                error: errorText,
                prompt: prompt.substring(0, 50) + '...'
              });
            }
          } catch (error) {
            console.error('Error generating image via OpenRouter:', prompt.substring(0, 50) + '...', 'Error:', error instanceof Error ? error.message : 'Unknown error');
          }
        }
      } else {
        console.log('Starting image generation with OpenAI DALL-E 3...');
        console.log('OpenAI API Key configured, generating high-quality images...');
        
        // Generate images sequentially to avoid rate limits
        for (let i = 0; i < Math.min(generatedContent.carousel_prompts.length, 3); i++) {
          const prompt = generatedContent.carousel_prompts[i];
          
          try {
            const enhancedPrompt = `${prompt}. High quality, professional, suitable for ${network} social media post. Modern design, vibrant colors, engaging composition.`;
            
            console.log(`[${i + 1}/3] Generating image with DALL-E 3 for: ${prompt.substring(0, 50)}...`);
            
            const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openAIApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'dall-e-3',
                prompt: enhancedPrompt,
                n: 1,
                size: '1024x1024',
                quality: 'standard',
                response_format: 'b64_json'
              }),
            });

            console.log(`[${i + 1}/3] OpenAI API response status: ${imageResponse.status}`);

            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              console.log(`[${i + 1}/3] DALL-E 3 generation success!`);
              
              if (imageData.data && imageData.data[0] && imageData.data[0].b64_json) {
                // Convert base64 to data URL for immediate use
                const dataUrl = `data:image/png;base64,${imageData.data[0].b64_json}`;
                
                generatedImages.push({
                  prompt: prompt,
                  url: dataUrl, // Frontend expects 'url' property
                  image: imageData.data[0].b64_json, // Keep base64 for download
                  format: 'png',
                  revised_prompt: imageData.data[0].revised_prompt || prompt
                });
                
                console.log(`[${i + 1}/3] Successfully generated and converted image to data URL`);
              } else {
                console.error(`[${i + 1}/3] Unexpected DALL-E response structure:`, imageData);
              }
            } else {
              const errorText = await imageResponse.text();
              console.error(`[${i + 1}/3] DALL-E 3 API Error:`, {
                status: imageResponse.status,
                statusText: imageResponse.statusText,
                error: errorText,
                prompt: prompt.substring(0, 50) + '...'
              });
            }
            
            // Add delay between requests to avoid rate limits
            if (i < 2) {
              console.log(`Waiting 2 seconds before next image generation...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
          } catch (error) {
            console.error(`[${i + 1}/3] Error generating image:`, error instanceof Error ? error.message : 'Unknown error');
          }
        }
      }
      
      console.log(`Image generation complete: ${generatedImages.length} images generated out of ${Math.min(generatedContent.carousel_prompts.length, 3)} requested`);
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