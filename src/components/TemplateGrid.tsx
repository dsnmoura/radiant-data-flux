import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Download, Eye, Palette, Check } from "lucide-react";
import { templates, platforms } from "@/data/templates";
import { useTemplate } from "@/contexts/TemplateContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const TemplateGrid = () => {
  const { selectedTemplate, setSelectedTemplate, filteredPlatform, setFilteredPlatform } = useTemplate();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Filter templates based on platform and category
  const filteredTemplates = templates.filter(template => {
    const matchesPlatform = filteredPlatform === "Todos" || template.platform === filteredPlatform;
    const matchesCategory = selectedCategory === "Todos" || template.category === selectedCategory;
    return matchesPlatform && matchesCategory;
  });

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    toast({
      title: "Template selecionado!",
      description: `${template.title} está pronto para personalização.`,
    });
  };

  const handleCustomize = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    navigate('/dashboard/create');
  };

  return (
    <section id="templates" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Templates Profissionais
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Escolha entre centenas de templates criados por designers para cada tipo de rede social
          </p>
        </div>

        {/* Platform Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {platforms.map((platform) => (
            <Button
              key={platform}
              variant={platform === filteredPlatform ? "default" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => setFilteredPlatform(platform)}
            >
              {platform}
            </Button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {["Todos", "Inspiração", "Marketing", "Empresa", "Educativo", "Entretenimento", "Promoção", "Eventos"].map((category) => (
            <Button
              key={category}
              variant={category === selectedCategory ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplate?.id === template.id;
            
            return (
              <Card 
                key={template.id} 
                className={`group overflow-hidden border-0 shadow-card hover:shadow-elegant transition-smooth bg-card/50 backdrop-blur-sm cursor-pointer ${
                  isSelected ? 'ring-2 ring-primary shadow-glow' : ''
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="relative">
                  {/* Template Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={template.image}
                      alt={template.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="bg-background/80 backdrop-blur"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Add preview modal
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        variant="default"
                        className="gradient-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCustomize(template);
                        }}
                      >
                        <Palette className="w-4 h-4 mr-2" />
                        Personalizar
                      </Button>
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-3 left-3 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}

                  {/* Premium Badge */}
                  {template.premium && (
                    <Badge className="absolute top-3 right-3 gradient-accent text-white border-0">
                      PRO
                    </Badge>
                  )}

                  {/* Platform Badge */}
                  <Badge variant="outline" className="absolute bottom-3 left-3 bg-background/80 backdrop-blur text-xs">
                    {template.platform}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground truncate">{template.title}</h3>
                    <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                      {template.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{template.likes}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Add download functionality
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Carregar Mais Templates
          </Button>
        </div>

        {/* Selected Template Info */}
        {selectedTemplate && (
          <div className="mt-8 p-6 bg-card rounded-lg border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Template Selecionado</h3>
              <Button 
                variant="default" 
                onClick={() => handleCustomize(selectedTemplate as any)}
                className="gradient-primary"
              >
                Começar a Personalizar
              </Button>
            </div>
            <div className="flex items-start gap-4">
              <img 
                src={selectedTemplate.image} 
                alt={selectedTemplate.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium">{selectedTemplate.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{selectedTemplate.description}</p>
                <div className="flex gap-2">
                  <Badge variant="outline">{selectedTemplate.platform}</Badge>
                  <Badge variant="secondary">{selectedTemplate.type}</Badge>
                  {selectedTemplate.premium && (
                    <Badge className="gradient-accent text-white border-0">PRO</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TemplateGrid;