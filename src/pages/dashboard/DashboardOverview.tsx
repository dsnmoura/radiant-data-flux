import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Heart, 
  Share2, 
  Eye,
  Calendar,
  Zap,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardOverview = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Olá, Maria! 👋
          </h1>
          <p className="text-muted-foreground">
            Aqui está um resumo da sua atividade hoje
          </p>
        </div>
        <Button variant="gradient" className="group" onClick={() => navigate('/dashboard/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Novo Post
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-card bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Posts Criados
            </CardTitle>
            <div className="p-2 rounded-lg gradient-primary">
              <Zap className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +20.1%
              </span>
              desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Engajamento Total
            </CardTitle>
            <div className="p-2 rounded-lg gradient-accent">
              <Heart className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +15.3%
              </span>
              desde a semana passada
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alcance
            </CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
              <Eye className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.4K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +8.2%
              </span>
              impressões este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Posts Agendados
            </CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
              <Calendar className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              para os próximos 7 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <Card className="border-0 shadow-card bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Posts Recentes
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                title: "Promoção Black Friday",
                platform: "Instagram",
                engagement: "2.4K",
                time: "2h atrás"
              },
              {
                title: "Dicas de Marketing",
                platform: "LinkedIn",
                engagement: "891",
                time: "1 dia atrás"
              },
              {
                title: "Produto em Destaque",
                platform: "Facebook",
                engagement: "1.2K",
                time: "2 dias atrás"
              }
            ].map((post, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Share2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{post.title}</p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {post.platform}
                    </Badge>
                    <span>•</span>
                    <span>{post.engagement} interações</span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{post.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-card bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start h-auto p-4" onClick={() => navigate('/dashboard/create')}>
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg gradient-primary">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Criar Post com IA</p>
                  <p className="text-sm text-muted-foreground">
                    Gere conteúdo automaticamente
                  </p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg gradient-accent">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Agendar Campanha</p>
                  <p className="text-sm text-muted-foreground">
                    Planeje posts da semana
                  </p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Análise de Audiência</p>
                  <p className="text-sm text-muted-foreground">
                    Veja insights detalhados
                  </p>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Templates em Destaque */}
      <Card className="border-0 shadow-card bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Templates em Destaque
            <Button variant="ghost" size="sm">
              Ver biblioteca
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Black Friday", category: "Promoção" },
              { name: "Quote Motivacional", category: "Inspiração" },
              { name: "Produto Showcase", category: "E-commerce" },
              { name: "Story Announcement", category: "Novidades" }
            ].map((template, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4 flex items-center justify-center mb-3 group-hover:shadow-card transition-smooth">
                  <div className="w-16 h-16 rounded-lg gradient-primary opacity-60 group-hover:opacity-100 transition-smooth"></div>
                </div>
                <h4 className="font-medium text-sm text-foreground">{template.name}</h4>
                <p className="text-xs text-muted-foreground">{template.category}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;