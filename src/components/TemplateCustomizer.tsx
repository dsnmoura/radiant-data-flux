import React, { useState, useRef, useEffect } from 'react';
import useFonts from '@/hooks/useFonts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Download, 
  Eye, 
  Undo2,
  Save,
  Copy,
  FileImage,
  RotateCcw,
  Layers
} from "lucide-react";
import { toast } from "sonner";
import ImageCarouselBuilder from "./ImageCarouselBuilder";

interface CustomizationSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  logo: File | null;
  logoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  logoSize: number;
  logoOpacity: number;
}

interface TemplateCustomizerProps {
  templateData: any;
  onSave: (settings: CustomizationSettings) => void;
}

const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({ templateData, onSave }) => {
  const { previewFont } = useFonts();
  const [settings, setSettings] = useState<CustomizationSettings>({
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter',
    fontSize: 16,
    logo: null,
    logoPosition: 'top-right',
    logoSize: 80,
    logoOpacity: 100
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [carouselImages, setCarouselImages] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fontOptions = [
    { value: 'Inter', label: 'Inter (Moderno)' },
    { value: 'Roboto', label: 'Roboto (Limpo)' },
    { value: 'Playfair Display', label: 'Playfair Display (Elegante)' },
    { value: 'Montserrat', label: 'Montserrat (Dinâmico)' },
    { value: 'Open Sans', label: 'Open Sans (Legível)' },
    { value: 'Poppins', label: 'Poppins (Amigável)' },
    { value: 'Lato', label: 'Lato (Profissional)' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro (Neutro)' }
  ];

  const colorPresets = [
    { name: 'Azul Corporativo', primary: '#3b82f6', secondary: '#1e40af', bg: '#f8fafc', text: '#1e293b' },
    { name: 'Verde Natureza', primary: '#10b981', secondary: '#059669', bg: '#f0fdf4', text: '#064e3b' },
    { name: 'Roxo Criativo', primary: '#8b5cf6', secondary: '#7c3aed', bg: '#faf5ff', text: '#581c87' },
    { name: 'Laranja Energia', primary: '#f97316', secondary: '#ea580c', bg: '#fff7ed', text: '#9a3412' },
    { name: 'Rosa Moderno', primary: '#ec4899', secondary: '#db2777', bg: '#fdf2f8', text: '#831843' },
    { name: 'Cinza Minimalista', primary: '#6b7280', secondary: '#4b5563', bg: '#f9fafb', text: '#111827' }
  ];

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("O arquivo deve ter no máximo 5MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error("Por favor, selecione apenas arquivos de imagem");
        return;
      }

      setSettings(prev => ({ ...prev, logo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.success("Logo carregado com sucesso!");
    }
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setSettings(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      backgroundColor: preset.bg,
      textColor: preset.text
    }));
    toast.success(`Tema "${preset.name}" aplicado!`);
  };

  const resetSettings = () => {
    setSettings({
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: 'Inter',
      fontSize: 16,
      logo: null,
      logoPosition: 'top-right',
      logoSize: 80,
      logoOpacity: 100
    });
    setLogoPreview(null);
    toast.success("Configurações resetadas!");
  };

  const handleSave = () => {
    onSave(settings);
    toast.success("Personalização salva com sucesso!");
  };

  const copyHexColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Cor ${color} copiada!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Personalização do Template
          </CardTitle>
          <CardDescription>
            Customize cores, fontes, logo e outros elementos visuais
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controles de Personalização */}
        <div className="space-y-6">
          
          {/* Upload de Logo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ImageIcon className="h-4 w-4" />
                Logo da Empresa
              </CardTitle>
              <CardDescription>
                Faça upload do logo que será inserido automaticamente no template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Upload do Logo</Label>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-24 border-dashed"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-5 w-5" />
                      <span className="text-sm">Escolher Logo</span>
                    </div>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
                
                {logoPreview && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="h-24 border rounded-lg overflow-hidden bg-muted/30">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {settings.logo && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Posição do Logo</Label>
                      <Select 
                        value={settings.logoPosition} 
                        onValueChange={(value: any) => setSettings(prev => ({ ...prev, logoPosition: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top-left">Superior Esquerda</SelectItem>
                          <SelectItem value="top-right">Superior Direita</SelectItem>
                          <SelectItem value="bottom-left">Inferior Esquerda</SelectItem>
                          <SelectItem value="bottom-right">Inferior Direita</SelectItem>
                          <SelectItem value="center">Centro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Tamanho ({settings.logoSize}px)</Label>
                      <Slider
                        value={[settings.logoSize]}
                        onValueChange={([value]) => setSettings(prev => ({ ...prev, logoSize: value }))}
                        min={40}
                        max={200}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Opacidade ({settings.logoOpacity}%)</Label>
                    <Slider
                      value={[settings.logoOpacity]}
                      onValueChange={([value]) => setSettings(prev => ({ ...prev, logoOpacity: value }))}
                      min={10}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Paleta de Cores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Palette className="h-4 w-4" />
                Cores do Template
              </CardTitle>
              <CardDescription>
                Defina as cores principais e secundárias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Presets de Cores */}
              <div className="space-y-2">
                <Label>Temas Pré-definidos</Label>
                <div className="grid grid-cols-2 gap-2">
                  {colorPresets.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => applyColorPreset(preset)}
                      className="h-auto p-3 flex items-center gap-3 text-left"
                    >
                      <div className="flex gap-1">
                        <div 
                          className="w-3 h-3 rounded-full border" 
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full border" 
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <span className="text-sm">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Seletores de Cor Customizados */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10 p-1 border"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="flex-1"
                      placeholder="#3b82f6"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyHexColor(settings.primaryColor)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-16 h-10 p-1 border"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="flex-1"
                      placeholder="#8b5cf6"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyHexColor(settings.secondaryColor)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cor de Fundo</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-16 h-10 p-1 border"
                    />
                    <Input
                      value={settings.backgroundColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="flex-1"
                      placeholder="#ffffff"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyHexColor(settings.backgroundColor)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cor do Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.textColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, textColor: e.target.value }))}
                      className="w-16 h-10 p-1 border"
                    />
                    <Input
                      value={settings.textColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, textColor: e.target.value }))}
                      className="flex-1"
                      placeholder="#1f2937"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyHexColor(settings.textColor)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tipografia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Type className="h-4 w-4" />
                Tipografia
              </CardTitle>
              <CardDescription>
                Escolha a fonte e tamanho do texto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Família da Fonte</Label>
                  <Select 
                    value={settings.fontFamily} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, fontFamily: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value }}>{font.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tamanho da Fonte ({settings.fontSize}px)</Label>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([value]) => setSettings(prev => ({ ...prev, fontSize: value }))}
                    min={12}
                    max={32}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Preview da Fonte */}
              <div className="p-4 border rounded-lg bg-muted/30">
                <p 
                  style={{ 
                    fontFamily: settings.fontFamily, 
                    fontSize: `${settings.fontSize}px`,
                    color: settings.textColor 
                  }}
                >
                  Preview: Este é um exemplo de como ficará o texto no seu template
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Carrossel de Imagens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers className="h-4 w-4" />
                Carrossel de Imagens
              </CardTitle>
              <CardDescription>
                Crie um carrossel com inserção automática do logo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageCarouselBuilder
                logo={settings.logo}
                logoSettings={{
                  position: settings.logoPosition,
                  size: settings.logoSize,
                  opacity: settings.logoOpacity
                }}
                onImagesChange={setCarouselImages}
              />
            </CardContent>
          </Card>
        </div>

        {/* Preview do Template */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview do Template
              </CardTitle>
              <CardDescription>
                Visualize como ficará seu template personalizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="aspect-square rounded-lg border-2 relative overflow-hidden"
                style={{ 
                  backgroundColor: settings.backgroundColor,
                  borderColor: settings.primaryColor + '20'
                }}
              >
                {/* Background Gradient */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${settings.primaryColor}15, ${settings.secondaryColor}15)`
                  }}
                />
                
                {/* Logo */}
                {logoPreview && (
                  <div 
                    className={`absolute ${
                      settings.logoPosition === 'top-left' ? 'top-4 left-4' :
                      settings.logoPosition === 'top-right' ? 'top-4 right-4' :
                      settings.logoPosition === 'bottom-left' ? 'bottom-4 left-4' :
                      settings.logoPosition === 'bottom-right' ? 'bottom-4 right-4' :
                      'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                    }`}
                    style={{
                      opacity: settings.logoOpacity / 100
                    }}
                  >
                    <img 
                      src={logoPreview} 
                      alt="Logo" 
                      style={{ 
                        width: `${settings.logoSize}px`, 
                        height: `${settings.logoSize}px`,
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                )}

                {/* Content Example */}
                <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center">
                  <h2 
                    style={{ 
                      fontFamily: settings.fontFamily,
                      color: settings.primaryColor,
                      fontSize: `${settings.fontSize * 1.5}px`,
                      fontWeight: 'bold'
                    }}
                  >
                    Título do Post
                  </h2>
                  <p 
                    style={{ 
                      fontFamily: settings.fontFamily,
                      color: settings.textColor,
                      fontSize: `${settings.fontSize}px`,
                      marginTop: '16px'
                    }}
                  >
                    Este é um exemplo de como ficará o conteúdo do seu template com as personalizações aplicadas.
                  </p>
                  <div 
                    className="mt-6 px-6 py-3 rounded-full"
                    style={{ 
                      backgroundColor: settings.secondaryColor,
                      color: 'white'
                    }}
                  >
                    <span 
                      style={{ 
                        fontFamily: settings.fontFamily,
                        fontSize: `${settings.fontSize * 0.9}px`,
                        fontWeight: '500'
                      }}
                    >
                      Call-to-Action
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Personalização
                </Button>
                <Button variant="outline" onClick={resetSettings}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TemplateCustomizer;