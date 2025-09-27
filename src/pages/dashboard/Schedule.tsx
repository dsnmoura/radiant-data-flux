import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, BarChart3, TrendingUp } from "lucide-react";
import PostScheduler from "@/components/PostScheduler";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  platform: string;
  scheduled_for: string;
  status: string;
  created_at: string;
}

const Schedule = () => {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduler, setShowScheduler] = useState(false);

  useEffect(() => {
    loadScheduledPosts();
  }, []);

  const loadScheduledPosts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'scheduled')
        .order('scheduled_for', { ascending: true });

      if (error) {
        console.error('Error loading posts:', error);
        return;
      }

      setScheduledPosts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUpcomingPosts = () => {
    const now = new Date();
    return scheduledPosts.filter(post => new Date(post.scheduled_for) > now);
  };

  const getPostsThisWeek = () => {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduled_for);
      return postDate >= now && postDate <= weekFromNow;
    });
  };

  const upcomingPosts = getUpcomingPosts();
  const postsThisWeek = getPostsThisWeek();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agendamento</h1>
          <p className="text-muted-foreground">
            Gerencie e agende seus posts para publicação automática
          </p>
        </div>
        <Button onClick={() => setShowScheduler(!showScheduler)}>
          <Plus className="h-4 w-4 mr-2" />
          {showScheduler ? 'Ver Agenda' : 'Novo Agendamento'}
        </Button>
      </div>

      {showScheduler ? (
        <PostScheduler />
      ) : (
        <>
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Agendados</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingPosts.length}</div>
                <p className="text-xs text-muted-foreground">
                  posts programados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{postsThisWeek.length}</div>
                <p className="text-xs text-muted-foreground">
                  posts nos próximos 7 dias
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plataformas</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(scheduledPosts.map(p => p.platform)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  redes sociais ativas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Posts Agendados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximos Posts Agendados
              </CardTitle>
              <CardDescription>
                {upcomingPosts.length} post{upcomingPosts.length !== 1 ? 's' : ''} programado{upcomingPosts.length !== 1 ? 's' : ''} para publicação
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : upcomingPosts.length > 0 ? (
                <div className="space-y-4">
                  {upcomingPosts.slice(0, 5).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{post.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {post.content.substring(0, 80)}...
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {post.platform}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(post.scheduled_for), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                      <Badge 
                        variant="default"
                        className="ml-4"
                      >
                        Agendado
                      </Badge>
                    </div>
                  ))}
                  
                  {upcomingPosts.length > 5 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" onClick={() => setShowScheduler(true)}>
                        Ver todos os {upcomingPosts.length} posts agendados
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum post agendado</h3>
                  <p className="text-muted-foreground mb-4">
                    Comece agendando seu primeiro post para automatizar suas publicações
                  </p>
                  <Button onClick={() => setShowScheduler(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agendar Primeiro Post
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Schedule;