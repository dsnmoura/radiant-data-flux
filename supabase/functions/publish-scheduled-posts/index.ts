import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Esta função será chamada via cron job para verificar e publicar posts agendados
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar posts que devem ser publicados (data/hora <= agora e status = 'scheduled')
    const now = new Date().toISOString();
    
    const { data: postsToPublish, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_for', now)
      .order('scheduled_for', { ascending: true });

    if (fetchError) {
      console.error('Error fetching scheduled posts:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch scheduled posts' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Found ${postsToPublish?.length || 0} posts to publish`);

    if (!postsToPublish || postsToPublish.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No posts to publish',
          processed: 0
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const results = [];

    // Processar cada post agendado
    for (const post of postsToPublish) {
      try {
        // Aqui você pode adicionar a lógica específica para cada plataforma
        let published = false;
        let error_message = null;

        switch (post.platform) {
          case 'instagram':
            // Implementar lógica para Instagram
            console.log(`Would publish to Instagram: ${post.title}`);
            published = true; // Simular sucesso por enquanto
            break;
            
          case 'linkedin':
            // Implementar lógica para LinkedIn
            console.log(`Would publish to LinkedIn: ${post.title}`);
            published = true; // Simular sucesso por enquanto
            break;
            
          case 'tiktok':
            // Implementar lógica para TikTok
            console.log(`Would publish to TikTok: ${post.title}`);
            published = true; // Simular sucesso por enquanto
            break;
            
          default:
            error_message = `Unsupported platform: ${post.platform}`;
            console.error(error_message);
        }

        // Atualizar status do post
        const newStatus = published ? 'published' : 'failed';
        const updateData: any = {
          status: newStatus,
          updated_at: new Date().toISOString()
        };

        if (error_message) {
          updateData.error_message = error_message;
        }

        const { error: updateError } = await supabase
          .from('posts')
          .update(updateData)
          .eq('id', post.id);

        if (updateError) {
          console.error(`Error updating post ${post.id}:`, updateError);
          results.push({
            post_id: post.id,
            success: false,
            error: updateError.message
          });
        } else {
          results.push({
            post_id: post.id,
            success: published,
            status: newStatus,
            platform: post.platform,
            title: post.title
          });
        }

      } catch (error) {
        console.error(`Error processing post ${post.id}:`, error);
        
        // Marcar como falhou
        await supabase
          .from('posts')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            updated_at: new Date().toISOString()
          })
          .eq('id', post.id);

        results.push({
          post_id: post.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`Processed ${results.length} posts: ${successCount} successful, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        message: 'Posts processed',
        total: results.length,
        successful: successCount,
        failed: failCount,
        results: results
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});