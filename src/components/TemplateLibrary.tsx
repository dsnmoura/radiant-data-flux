import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Heart, 
  Download, 
  Eye, 
  Edit,
  Sparkles,
  TrendingUp,
  Calendar
} from "lucide-react";
import { monthlyTemplates, templateCategories, getTemplatesByCategory } from "@/data/templates";
import { useTemplate } from "@/contexts/TemplateContext";
import { toast } from "sonner";

interface TemplateLibraryProps {
  onEdit: (template: any) => void;
  onUse: (template: any) => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onEdit, onUse }) => {
  const { setSelectedTemplate, filteredPlatform, setFilteredPlatform } = useTemplate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');

  // Filtrar templates
  const filteredTemplates = monthlyTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || template.category === selectedCategory;
    const matchesPlatform = filteredPlatform === 'Todos' || template.platform === filteredPlatform;
    
    return matchesSearch && matchesCategory && matchesPlatform;
  });

  // Ordenar templates
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.likes - a.likes;
      case 'trending':
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      case 'newest':
      default:
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    }
  });

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
    toast.success("Template selecionado para preview!");
  };

  const handleDownload = (template: any) => {
    // Implementar download do template
    toast.success("Download iniciado!");
  };

  const platforms = ['Todos', 'Instagram', 'LinkedIn', 'TikTok', 'Facebook', 'Twitter'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Templates</h1>
          <p className="text-muted-foreground">
            {sortedTemplates.length} templates disponíveis
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Busca */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Plataforma */}
            <div className="flex gap-1">
              {platforms.map((platform) => (
                <Button
                  key={platform}
                  variant={platform === filteredPlatform ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilteredPlatform(platform)}
                >
                  {platform}
                </Button>
              ))}
            </div>

            {/* Categoria */}
            <div className="flex gap-1 flex-wrap">
              <Button
                variant={selectedCategory === 'todos' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('todos')}
              >
                Todos
              </Button>
              {templateCategories.slice(0, 4).map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.icon} {category.name}
                </Button>
              ))}
            </div>

            {/* Ordenação */}
            <div className="flex gap-1">
              <Button
                variant={sortBy === 'newest' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('newest')}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Novos
              </Button>
              <Button
                variant={sortBy === 'popular' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('popular')}
              >
                <Heart className="h-4 w-4 mr-1" />
                Popular
              </Button>
              <Button
                variant={sortBy === 'trending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('trending')}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Trending
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedTemplates.map((template) => {
            const category = templateCategories.find(cat => cat.id === template.category);
            
            return (
              <Card key={template.id} className="group overflow-hidden hover:shadow-lg transition-all">
                <div className="relative aspect-square">
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handlePreview(template)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => onEdit(template)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => onUse(template)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {template.isNew && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        NOVO
                      </Badge>
                    )}
                    {template.trending && (
                      <Badge variant="destructive" className="text-xs">
                        🔥 TREND
                      </Badge>
                    )}
                  </div>

                  {template.premium && (
                    <Badge className="absolute top-2 right-2 gradient-accent text-white border-0 text-xs">
                      PRO
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm line-clamp-1">{template.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Heart className="h-3 w-3" />
                      <span>{template.likes}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">{template.platform}</Badge>
                      <Badge variant="secondary" className="text-xs">{category?.icon}</Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">{template.type}</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTemplates.map((template) => {
            const category = templateCategories.find(cat => cat.id === template.category);
            
            return (
              <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={template.image}
                      alt={template.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold">{template.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Heart className="h-4 w-4" />
                          <span>{template.likes}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                        {template.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">{template.platform}</Badge>
                          <Badge variant="secondary" className="text-xs">{category?.name}</Badge>
                          <Badge variant="outline" className="text-xs">{template.type}</Badge>
                          {template.premium && (
                            <Badge className="gradient-accent text-white border-0 text-xs">PRO</Badge>
                          )}
                          {template.isNew && (
                            <Badge variant="secondary" className="text-xs">NOVO</Badge>
                          )}
                          {template.trending && (
                            <Badge variant="destructive" className="text-xs">🔥</Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handlePreview(template)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => onEdit(template)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => onUse(template)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {sortedTemplates.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum template encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou termos de busca
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TemplateLibrary;