import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  Upload,
  Save,
  Trash2,
  Settings,
  Image,
  FileText,
  Eye,
  Edit
} from "lucide-react";
import TemplateEditor from "@/components/TemplateEditor";
import { Template } from "@/contexts/TemplateContext";
import { 
  monthlyTemplates, 
  templateCategories, 
  getTemplateStats,
  MonthlyTemplate
} from "@/data/templates";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NewTemplateData {
  title: string;
  description: string;
  category: string;
  platform: string;
  type: string;
  image: string;
  premium: boolean;
  isSeasonal: boolean;
  seasonalStart: string;
  seasonalEnd: string;
}

const TemplateManager = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [newTemplate, setNewTemplate] = useState<NewTemplateData>({
    title: "",
    description: "",
    category: "",
    platform: "Instagram",
    type: "post",
    image: "",
    premium: false,
    isSeasonal: false,
    seasonalStart: "",
    seasonalEnd: ""
  });
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MonthlyTemplate | null>(null);

  const stats = getTemplateStats();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    // Verificar se o usuário é admin (por enquanto, simular como true para demonstração)
    // Em produção, isso seria verificado via Supabase auth ou role-based access
    setIsAdmin(true);
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.title || !newTemplate.description || !newTemplate.category) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsCreating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado");
        return;
      }

      // Criar template no banco de dados
      const templateData = {
        name: newTemplate.title,
        description: newTemplate.description,
        platform: newTemplate.platform,
        type: newTemplate.type,
        is_public: true,
        content_structure: {
          elements: [
            { type: 'text', placeholder: 'Título principal' },
            { type: 'text', placeholder: 'Conteúdo do post' },
            { type: 'image', placeholder: 'Imagem principal' }
          ]
        }
      };

      const { data, error } = await supabase
        .from('templates')
        .insert(templateData)
        .select()
        .single();

      if (error) {
        console.error('Error creating template:', error);
        toast.error("Erro ao criar template");
        return;
      }

      toast.success("Template criado com sucesso!");
      setShowCreateDialog(false);
      setNewTemplate({
        title: "",
        description: "",
        category: "",
        platform: "Instagram",
        type: "post",
        image: "",
        premium: false,
        isSeasonal: false,
        seasonalStart: "",
        seasonalEnd: ""
      });

    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao criar template");
    } finally {
      setIsCreating(false);
    }
  };

  const scheduleMonthlyUpdate = async () => {
    try {
      // Chamar edge function para agendar atualizações mensais
      const { data, error } = await supabase.functions.invoke('publish-scheduled-posts', {
        body: { action: 'schedule_monthly_templates' }
      });

      if (error) {
        toast.error("Erro ao agendar atualizações");
        return;
      }

      toast.success("Atualizações mensais agendadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao agendar atualizações");
    }
  };

  const handleEditTemplate = (template: MonthlyTemplate) => {
    setEditingTemplate(template);
    setShowTemplateEditor(true);
  };

  const handleSaveEditedTemplate = (template: Template) => {
    // Aqui você salvaria o template editado no banco de dados
    console.log('Template editado:', template);
    toast.success("Template editado com sucesso!");
    setShowTemplateEditor(false);
    setEditingTemplate(null);
  };

  const handleCreateNewTemplate = () => {
    setEditingTemplate(null);
    setShowTemplateEditor(true);
  };

  const getCurrentMonthTemplates = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return monthlyTemplates.filter(template => {
      const releaseDate = new Date(template.releaseDate);
      return releaseDate.getMonth() === currentMonth && releaseDate.getFullYear() === currentYear;
    });
  };

  const currentMonthTemplates = getCurrentMonthTemplates();

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Acesso Restrito</h3>
            <p className="text-muted-foreground">
              Esta página é restrita para administradores do sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Templates</h1>
          <p className="text-muted-foreground">
            Administre o banco de templates e atualizações mensais
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={scheduleMonthlyUpdate} variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Agendar Atualizações
          </Button>
          <Button onClick={handleCreateNewTemplate} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editor Visual
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Template</DialogTitle>
                <DialogDescription>
                  Adicione um novo template ao banco de dados
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={newTemplate.title}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Nome do template"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select 
                      value={newTemplate.category} 
                      onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {templateCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva o template e seu uso..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Plataforma</Label>
                    <Select 
                      value={newTemplate.platform} 
                      onValueChange={(value) => setNewTemplate(prev => ({ ...prev, platform: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="TikTok">TikTok</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select 
                      value={newTemplate.type} 
                      onValueChange={(value) => setNewTemplate(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="post">Post</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                        <SelectItem value="carousel">Carrossel</SelectItem>
                        <SelectItem value="video">Vídeo</SelectItem>
                        <SelectItem value="article">Artigo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">URL da Imagem</Label>
                  <Input
                    id="image"
                    value={newTemplate.image}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                {newTemplate.isSeasonal && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seasonalStart">Início da Temporada</Label>
                      <Input
                        id="seasonalStart"
                        type="date"
                        value={newTemplate.seasonalStart}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, seasonalStart: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="seasonalEnd">Fim da Temporada</Label>
                      <Input
                        id="seasonalEnd"
                        type="date"
                        value={newTemplate.seasonalEnd}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, seasonalEnd: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newTemplate.premium}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, premium: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Template Premium</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newTemplate.isSeasonal}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, isSeasonal: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Template Sazonal</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateTemplate} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Save className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Criar Template
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Em {stats.categoriesWithTemplates} categorias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Este Mês</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthTemplates.length}</div>
            <p className="text-xs text-muted-foreground">
              Adicionados em {new Date().toLocaleDateString('pt-BR', { month: 'long' })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Alta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Templates populares
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sazonais Ativos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.seasonalCount}</div>
            <p className="text-xs text-muted-foreground">
              Para esta época
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Templates Deste Mês */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Templates de {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </CardTitle>
          <CardDescription>
            {currentMonthTemplates.length} templates adicionados neste mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentMonthTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentMonthTemplates.map((template) => {
                const category = templateCategories.find(cat => cat.id === template.category);
                return (
                  <Card key={template.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={template.image}
                        alt={template.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        {template.isNew && (
                          <Badge variant="secondary" className="text-xs">NOVO</Badge>
                        )}
                        {template.trending && (
                          <Badge variant="destructive" className="text-xs">🔥</Badge>
                        )}
                        {template.premium && (
                          <Badge className="gradient-accent text-white border-0 text-xs">PRO</Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{template.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">{template.platform}</Badge>
                          <Badge variant="secondary" className="text-xs">{category?.name}</Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum template este mês</h3>
              <p className="text-muted-foreground mb-4">
                Adicione novos templates para manter o banco atualizado
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Template do Mês
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categorias */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Categorias</CardTitle>
          <CardDescription>
            Visão geral dos templates por categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {templateCategories.map((category) => {
              const templateCount = monthlyTemplates.filter(t => t.category === category.id).length;
              return (
                <div key={category.id} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-medium text-sm mb-1">{category.name}</h3>
                  <p className="text-2xl font-bold text-primary">{templateCount}</p>
                  <p className="text-xs text-muted-foreground">templates</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Template Editor Modal */}
      {showTemplateEditor && (
        <div className="fixed inset-0 z-50 bg-background">
          <TemplateEditor
            template={editingTemplate}
            onSave={handleSaveEditedTemplate}
            onCancel={() => {
              setShowTemplateEditor(false);
              setEditingTemplate(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TemplateManager;