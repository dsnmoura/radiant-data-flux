import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const stabilityApiKey = Deno.env.get('STABILITY_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Timeout utility
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

// Enhanced logging utility
const log = (level: 'info' | 'warn' | 'error', message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] ${message}`, data ? JSON.stringify(data) : '');
};

// Retry utility with exponential backoff
const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      log('warn', `Attempt ${attempt}/${maxRetries} failed`, { error: lastError.message });
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        log('info', `Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
};

// AI Model configurations
const AI_MODELS: Record<string, { provider: string; endpoint: string; model: string }> = {
  'glm-4.5-air': { provider: 'openrouter', endpoint: 'https://openrouter.ai/api/v1/chat/completions', model: 'z-ai/glm-4.5-air:free' },
  'gpt-4o-mini': { provider: 'openrouter', endpoint: 'https://openrouter.ai/api/v1/chat/completions', model: 'openai/gpt-4o-mini' },
  'gpt-4o': { provider: 'openrouter', endpoint: 'https://openrouter.ai/api/v1/chat/completions', model: 'openai/gpt-4o' },
  'claude-3-sonnet': { provider: 'openrouter', endpoint: 'https://openrouter.ai/api/v1/chat/completions', model: 'anthropic/claude-3-5-sonnet-20241022' }
};

// Generate AI content with retry and timeout
const generateAIContent = async (params: any): Promise<any> => {
  const { model = 'glm-4.5-air', objective, network, template, theme, content, generateImages, generateCaption, generateHashtags, customPrompt } = params;
  
  log('info', 'Starting AI content generation', { model, network, template });
  
  if (!openRouterApiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  const contentToProcess = content || theme || objective;
  const modelConfig = AI_MODELS[model] || AI_MODELS['glm-4.5-air'];

  // Build system prompt
  const requestedContent = [];
  if (generateImages) requestedContent.push(`"carousel_prompts": [array de 3-5 prompts detalhados em inglês para geração de imagens]`);
  if (generateCaption) requestedContent.push(`"caption": "legenda em português, engajante e persuasiva"`);
  if (generateHashtags) requestedContent.push(`"hashtags": [array de 10-15 hashtags relevantes]`);

  const systemPrompt = `Você é um especialista em marketing digital. Gere conteúdo para ${network} no formato ${template}.

IMPORTANTE: Responda SEMPRE em JSON válido com:
{
  ${requestedContent.join(',\n  ')}
}

Diretrizes para ${network}:
${network === 'instagram' ? '- Caption: Max 2200 caracteres, emojis, CTA claro\n- Hashtags: Mix populares e nicho\n- Imagens: Visuais, cores vibrantes' : ''}
${network === 'linkedin' ? '- Caption: Tom profissional, max 3000 caracteres\n- Hashtags: Focadas em negócios\n- Imagens: Profissionais, corporativas' : ''}
${network === 'tiktok' ? '- Caption: Concisa, linguagem jovem\n- Hashtags: Trending + nicho\n- Imagens: Dinâmicas, coloridas' : ''}

${customPrompt ? `\nINSTRUÇÕES PERSONALIZADAS: ${customPrompt}` : ''}`;

  const userPrompt = customPrompt || `Crie conteúdo profissional e engajante para: ${contentToProcess}`;

  // Make API request with retry and timeout
  const generateWithModel = async () => {
    log('info', `Making request to ${modelConfig.provider}`, { model: modelConfig.model });
    
    const response = await withTimeout(
      fetch(modelConfig.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://postcraft.app',
          'X-Title': 'PostCraft - AI Content Generator',
        },
        body: JSON.stringify({
          model: modelConfig.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      }),
      30000 // 30 second timeout
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const generatedText = await withRetry(generateWithModel, 3, 2000);
  log('info', 'AI text generated successfully');

  // Parse JSON response with enhanced fallback
  let generatedContent;
  try {
    let jsonText = generatedText.trim();
    const jsonStart = jsonText.indexOf('{');
    const jsonEnd = jsonText.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      jsonText = jsonText.slice(jsonStart, jsonEnd + 1);
    }
    
    jsonText = jsonText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^\s*json\s*/i, '')
      .trim();
    
    generatedContent = JSON.parse(jsonText);
    log('info', 'JSON parsed successfully');
  } catch (e) {
    log('warn', 'JSON parse failed, using fallback', { error: (e as Error).message });
    
    // Enhanced fallback content
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
  }

  return generatedContent;
};

// Image generation with multiple API fallbacks
const generateImageContent = async (prompts: string[], network: string): Promise<any[]> => {
  if (!prompts || prompts.length === 0) return [];
  
  log('info', 'Starting image generation', { promptCount: prompts.length, network });
  
  const maxImages = Math.min(prompts.length, 3);
  const generatedImages: any[] = [];
  
  // Try OpenAI DALL-E first
  if (openAIApiKey) {
    log('info', 'Attempting OpenAI DALL-E generation');
    
    for (let i = 0; i < maxImages; i++) {
      try {
        const enhancedPrompt = `${prompts[i]}. High quality, professional, suitable for ${network} social media post. Modern design, vibrant colors, engaging composition.`;
        
        const imageData = await withRetry(async () => {
          log('info', `Generating image ${i + 1}/${maxImages} with DALL-E`);
          
          const response = await withTimeout(
            fetch('https://api.openai.com/v1/images/generations', {
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
            }),
            60000 // 60 second timeout for image generation
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`DALL-E API error ${response.status}: ${errorText}`);
          }

          return await response.json();
        }, 2, 3000);

        if (imageData.data?.[0]?.b64_json) {
          const dataUrl = `data:image/png;base64,${imageData.data[0].b64_json}`;
          generatedImages.push({
            prompt: prompts[i],
            url: dataUrl,
            image: imageData.data[0].b64_json,
            format: 'png',
            revised_prompt: imageData.data[0].revised_prompt || prompts[i]
          });
          log('info', `Image ${i + 1} generated successfully with DALL-E`);
        }
        
        // Delay between requests
        if (i < maxImages - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      } catch (error) {
        log('error', `DALL-E generation failed for image ${i + 1}`, { error: (error as Error).message });
      }
    }
  }
  
  // Fallback to OpenRouter Flux if no images generated
  if (generatedImages.length === 0 && openRouterApiKey) {
    log('info', 'Falling back to OpenRouter Flux');
    
    for (let i = 0; i < maxImages; i++) {
      try {
        const enhancedPrompt = `${prompts[i]}. High quality, professional, suitable for ${network} social media post. Modern design, vibrant colors, engaging composition.`;
        
        const imageData = await withRetry(async () => {
          log('info', `Generating image ${i + 1}/${maxImages} with Flux`);
          
          const response = await withTimeout(
            fetch('https://openrouter.ai/api/v1/images/generations', {
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
            }),
            60000
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Flux API error ${response.status}: ${errorText}`);
          }

          return await response.json();
        }, 2, 3000);

        let imageUrl = null;
        if (imageData.data?.[0]?.url) {
          imageUrl = imageData.data[0].url;
        } else if (imageData.url) {
          imageUrl = imageData.url;
        } else if (imageData.images?.[0]?.url) {
          imageUrl = imageData.images[0].url;
        }
        
        if (imageUrl) {
          generatedImages.push({
            prompt: prompts[i],
            url: imageUrl,
            format: 'png',
            revised_prompt: prompts[i]
          });
          log('info', `Image ${i + 1} generated successfully with Flux`);
        }
        
        // Delay between requests
        if (i < maxImages - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        log('error', `Flux generation failed for image ${i + 1}`, { error: (error as Error).message });
      }
    }
  }
  
  // Final fallback to Stability AI
  if (generatedImages.length === 0 && stabilityApiKey) {
    log('info', 'Falling back to Stability AI');
    
    for (let i = 0; i < Math.min(maxImages, 2); i++) { // Limit Stability to 2 images
      try {
        const enhancedPrompt = `${prompts[i]}. High quality, professional, suitable for ${network} social media post. Modern design, vibrant colors, engaging composition.`;
        
        const imageData = await withRetry(async () => {
          log('info', `Generating image ${i + 1}/2 with Stability AI`);
          
          const response = await withTimeout(
            fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024x1024/text-to-image', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${stabilityApiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                text_prompts: [{ text: enhancedPrompt }],
                cfg_scale: 7,
                height: 1024,
                width: 1024,
                samples: 1,
                steps: 30,
              }),
            }),
            90000 // 90 second timeout for Stability
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Stability API error ${response.status}: ${errorText}`);
          }

          return await response.json();
        }, 2, 5000);

        const artifact = imageData.artifacts?.[0];
        if (artifact?.base64) {
          const dataUrl = `data:image/png;base64,${artifact.base64}`;
          generatedImages.push({
            prompt: prompts[i],
            url: dataUrl,
            image: artifact.base64,
            format: 'png',
            revised_prompt: prompts[i]
          });
          log('info', `Image ${i + 1} generated successfully with Stability AI`);
        }
        
        // Delay between requests
        if (i < 1) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      } catch (error) {
        log('error', `Stability generation failed for image ${i + 1}`, { error: (error as Error).message });
      }
    }
  }
  
  log('info', 'Image generation completed', { 
    totalGenerated: generatedImages.length, 
    requestedCount: maxImages 
  });
  
  return generatedImages;
};

// Main handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  log('info', 'Request received', { method: req.method });

  try {
    const requestBody = await req.json();
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
    } = requestBody;

    log('info', 'Processing request', { 
      network, 
      template, 
      model, 
      generateImages, 
      generateCaption, 
      generateHashtags 
    });

    // Step 1: Generate AI content
    const generatedContent = await generateAIContent({
      model,
      objective,
      network,
      template,
      theme,
      content,
      generateImages,
      generateCaption,
      generateHashtags,
      customPrompt
    });

    // Step 2: Generate images if requested
    let generatedImages: any[] = [];
    if (generateImages && generatedContent.carousel_prompts) {
      generatedImages = await generateImageContent(generatedContent.carousel_prompts, network);
    }

    // Step 3: Prepare final response
    const result = {
      success: true,
      content: generatedContent,
      images: generatedImages,
      metadata: {
        model_used: model,
        images_generated: generatedImages.length,
        total_processing_time: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    };

    log('info', 'Request completed successfully', {
      processingTime: Date.now() - startTime,
      imagesGenerated: generatedImages.length
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    log('error', 'Request failed', { 
      error: errorMessage, 
      processingTime: Date.now() - startTime 
    });

    // Return structured error response
    const errorResponse = {
      success: false,
      error: errorMessage,
      fallback_content: {
        caption: "Conteúdo gerado com sucesso! ✨\n\nCompartilhe sua opinião nos comentários! 💭",
        hashtags: ["#conteudo", "#marketing", "#digital", "#criativo"],
        carousel_prompts: [
          "Professional social media post design",
          "Modern digital marketing content",
          "Engaging social media graphics"
        ]
      },
      metadata: {
        error_time: new Date().toISOString(),
        processing_time: Date.now() - startTime
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 200, // Return 200 to avoid frontend error handling issues
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});