import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, Search, Filter, ArrowLeft } from "lucide-react";
import { templates, platforms } from "@/data/templates";
import { useTemplate } from "@/contexts/TemplateContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ChooseTemplate = () => {
  const { selectedTemplate, setSelectedTemplate, filteredPlatform, setFilteredPlatform } = useTemplate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter templates based on search, platform and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filteredPlatform === "Todos" || template.platform === filteredPlatform;
    const matchesCategory = selectedCategory === "Todos" || template.category === selectedCategory;
    return matchesSearch && matchesPlatform && matchesCategory;
  });

  const categories = ["Todos", "Inspiração", "Marketing", "Empresa", "Educativo", "Entretenimento", "Promoção", "Eventos"];

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    toast({
      title: "Template selecionado!",
      description: `${template.title} está pronto para personalização.`,
    });
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      navigate('/dashboard/create');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Escolher Template</h1>
                <p className="text-muted-foreground">Selecione o template perfeito para sua necessidade</p>
              </div>
            </div>
            
            {selectedTemplate && (
              <Button onClick={handleContinue} className="gradient-primary">
                Continuar com Template
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Platform Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Plataforma:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <Button
                  key={platform}
                  variant={platform === filteredPlatform ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilteredPlatform(platform)}
                  className="h-8"
                >
                  {platform}
                </Button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium">Categoria:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === selectedCategory ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="h-8"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} encontrado{filteredTemplates.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplate?.id === template.id;
            
            return (
              <Card 
                key={template.id} 
                className={`group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-elegant ${
                  isSelected ? 'ring-2 ring-primary shadow-glow scale-105' : ''
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="relative">
                  {/* Template Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={template.image}
                      alt={template.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="bg-primary text-primary-foreground rounded-full p-3">
                        <Check className="w-6 h-6" />
                      </div>
                    </div>
                  )}

                  {/* Premium Badge */}
                  {template.premium && (
                    <Badge className="absolute top-2 right-2 gradient-accent text-white border-0 text-xs">
                      PRO
                    </Badge>
                  )}

                  {/* Platform Badge */}
                  <Badge variant="outline" className="absolute top-2 left-2 bg-background/90 backdrop-blur text-xs">
                    {template.platform}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-sm leading-tight">{template.title}</h3>
                      <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                        {template.type}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{template.likes} likes</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nenhum template encontrado</h3>
              <p>Tente ajustar seus filtros ou termo de busca.</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilteredPlatform("Todos");
                setSelectedCategory("Todos");
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* Selected Template Summary */}
        {selectedTemplate && (
          <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-card border rounded-lg shadow-elegant p-4 z-50">
            <div className="flex items-center gap-3">
              <img 
                src={selectedTemplate.image} 
                alt={selectedTemplate.title}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{selectedTemplate.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedTemplate.platform}</p>
              </div>
              <Button size="sm" onClick={handleContinue} className="gradient-primary shrink-0">
                Personalizar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChooseTemplate;