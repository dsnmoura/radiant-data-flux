import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Plus, 
  Download, 
  Eye, 
  ArrowLeft, 
  ArrowRight,
  RotateCw,
  Crop,
  Filter,
  Layers
} from "lucide-react";
import { toast } from "sonner";

interface CarouselImage {
  id: string;
  file: File;
  preview: string;
  hasLogo: boolean;
  logoPosition: string;
}

interface ImageCarouselBuilderProps {
  logo?: File | null;
  logoSettings?: {
    position: string;
    size: number;
    opacity: number;
  };
  onImagesChange: (images: CarouselImage[]) => void;
}

const ImageCarouselBuilder: React.FC<ImageCarouselBuilderProps> = ({ 
  logo, 
  logoSettings = { position: 'top-right', size: 80, opacity: 100 },
  onImagesChange 
}) => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`Arquivo ${file.name} muito grande. Máximo 10MB.`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} não é um arquivo de imagem válido.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: CarouselImage = {
          id: crypto.randomUUID(),
          file,
          preview: e.target?.result as string,
          hasLogo: true, // Automatically insert logo
          logoPosition: logoSettings.position
        };

        setImages(prev => {
          const updated = [...prev, newImage];
          onImagesChange(updated);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    toast.success(`${files.length} imagem(ns) adicionada(s) com logo inserido automaticamente!`);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      onImagesChange(updated);
      if (currentImageIndex >= updated.length && updated.length > 0) {
        setCurrentImageIndex(updated.length - 1);
      }
      return updated;
    });
    toast.success("Imagem removida!");
  };

  const toggleLogo = (id: string) => {
    setImages(prev => {
      const updated = prev.map(img => 
        img.id === id ? { ...img, hasLogo: !img.hasLogo } : img
      );
      onImagesChange(updated);
      return updated;
    });
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
    } else {
      setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
    }
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    setImages(prev => {
      const updated = [...prev];
      const [removed] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, removed);
      onImagesChange(updated);
      return updated;
    });
  };

  const currentImage = images[currentImageIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Carrossel de Imagens
            {images.length > 0 && (
              <Badge variant="secondary">{images.length} imagens</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Crie um carrossel de imagens com inserção automática do logo da empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Upload Area */}
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-dashed border-2 hover:border-primary/50"
            >
              <div className="flex flex-col items-center gap-3">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium">Carregar Imagens</p>
                  <p className="text-sm text-muted-foreground">
                    Arrastar e soltar ou clique para selecionar
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, WEBP (máx. 10MB cada)
                  </p>
                </div>
              </div>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Image Preview & Editor */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigateImage('prev')}
                    disabled={images.length <= 1}
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </Button>
                  <Badge variant="secondary">
                    {currentImageIndex + 1} de {images.length}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigateImage('next')}
                    disabled={images.length <= 1}
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentImage && (
                <div className="space-y-4">
                  {/* Image Preview with Logo */}
                  <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                    <img 
                      src={currentImage.preview} 
                      alt={`Imagem ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Logo Overlay */}
                    {currentImage.hasLogo && logo && (
                      <div 
                        className={`absolute ${
                          logoSettings.position === 'top-left' ? 'top-4 left-4' :
                          logoSettings.position === 'top-right' ? 'top-4 right-4' :
                          logoSettings.position === 'bottom-left' ? 'bottom-4 left-4' :
                          logoSettings.position === 'bottom-right' ? 'bottom-4 right-4' :
                          'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                        }`}
                        style={{
                          opacity: logoSettings.opacity / 100
                        }}
                      >
                        <img 
                          src={URL.createObjectURL(logo)} 
                          alt="Logo" 
                          style={{ 
                            width: `${logoSettings.size}px`, 
                            height: `${logoSettings.size}px`,
                            objectFit: 'contain'
                          }}
                          className="drop-shadow-lg"
                        />
                      </div>
                    )}
                  </div>

                  {/* Image Controls */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={currentImage.hasLogo ? "default" : "outline"}
                      onClick={() => toggleLogo(currentImage.id)}
                      className="flex-1"
                    >
                      <ImageIcon className="h-3 w-3 mr-2" />
                      {currentImage.hasLogo ? 'Logo Ativo' : 'Inserir Logo'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeImage(currentImage.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Image List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Ordem das Imagens
              </CardTitle>
              <CardDescription>
                Arraste para reordenar as imagens do carrossel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {images.map((image, index) => (
                  <div 
                    key={image.id}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-smooth
                      ${index === currentImageIndex 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border">
                      <img 
                        src={image.preview} 
                        alt={`Thumb ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        Imagem {index + 1}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={image.hasLogo ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {image.hasLogo ? 'Com Logo' : 'Sem Logo'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {(image.file.size / 1024 / 1024).toFixed(1)}MB
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">Nenhuma imagem adicionada</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Faça upload de imagens para criar seu carrossel. O logo será inserido automaticamente em cada imagem.
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-4"
              >
                <Upload className="h-4 w-4 mr-2" />
                Carregar Primeira Imagem
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {images.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">
                  {images.length} imagem{images.length !== 1 ? 's' : ''} no carrossel
                </p>
                <p className="text-sm text-muted-foreground">
                  {images.filter(img => img.hasLogo).length} com logo inserido
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-2" />
                  Baixar Carrossel
                </Button>
                <Button size="sm">
                  <Eye className="h-3 w-3 mr-2" />
                  Visualizar Todos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageCarouselBuilder;