import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Instagram, 
  Linkedin, 
  MessageCircle, 
  Download, 
  Share, 
  Calendar,
  Clock,
  Image as ImageIcon,
  Video,
  FileText,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface SocialExportProps {
  content: {
    caption?: string;
    hashtags?: string[];
    images?: string[];
    videos?: string[];
  };
  selectedNetwork: string;
  selectedTemplate: string;
}

const SocialExport = ({ content, selectedNetwork, selectedTemplate }: SocialExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<string>("");
  const [customDimensions, setCustomDimensions] = useState({ width: "", height: "" });

  const networkSpecs = {
    instagram: {
      name: "Instagram",
      icon: Instagram,
      formats: [
        { id: "feed", name: "Feed Post", dimensions: "1080x1080", ratio: "1:1" },
        { id: "stories", name: "Stories", dimensions: "1080x1920", ratio: "9:16" },
        { id: "reels", name: "Reels", dimensions: "1080x1920", ratio: "9:16" },
        { id: "carousel", name: "Carrossel", dimensions: "1080x1080", ratio: "1:1" }
      ],
      color: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    linkedin: {
      name: "LinkedIn",
      icon: Linkedin,
      formats: [
        { id: "post", name: "Post", dimensions: "1200x627", ratio: "1.91:1" },
        { id: "article", name: "Artigo", dimensions: "1200x627", ratio: "1.91:1" },
        { id: "carousel", name: "Carrossel", dimensions: "1080x1080", ratio: "1:1" },
        { id: "company", name: "Página Empresa", dimensions: "1128x191", ratio: "5.9:1" }
      ],
      color: "bg-blue-600"
    },
    tiktok: {
      name: "TikTok",
      icon: MessageCircle,
      formats: [
        { id: "video", name: "Vídeo", dimensions: "1080x1920", ratio: "9:16" },
        { id: "square", name: "Quadrado", dimensions: "1080x1080", ratio: "1:1" },
        { id: "landscape", name: "Paisagem", dimensions: "1920x1080", ratio: "16:9" }
      ],
      color: "bg-black"
    }
  };

  const getNetworkConfig = () => {
    return networkSpecs[selectedNetwork as keyof typeof networkSpecs];
  };

  const handleExport = async (format: string, directExport: boolean = false) => {
    if (!format && !directExport) {
      toast.error("Selecione um formato para exportar");
      return;
    }

    setIsExporting(true);
    
    try {
      // Simular processo de exportação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (directExport) {
        // Abrir URL da rede social específica
        const urls = {
          instagram: "https://www.instagram.com/create/select/",
          linkedin: "https://www.linkedin.com/feed/",
          tiktok: "https://www.tiktok.com/upload/"
        };
        
        const url = urls[selectedNetwork as keyof typeof urls];
        if (url) {
          window.open(url, '_blank');
          toast.success(`Redirecionando para ${getNetworkConfig()?.name}...`);
        }
      } else {
        // Download do arquivo
        toast.success("Conteúdo exportado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao exportar conteúdo");
    } finally {
      setIsExporting(false);
    }
  };

  const networkConfig = getNetworkConfig();

  if (!networkConfig) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share className="h-5 w-5" />
          Exportar para {networkConfig.name}
        </CardTitle>
        <CardDescription>
          Exporte seu conteúdo otimizado para a plataforma selecionada
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formatos Disponíveis */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Formatos disponíveis:</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {networkConfig.formats.map((format) => (
              <div
                key={format.id}
                onClick={() => setExportFormat(format.id)}
                className={`
                  p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md
                  ${exportFormat === format.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{format.name}</h4>
                    <p className="text-sm text-muted-foreground">{format.dimensions}px</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {format.ratio}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opções de Exportação */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Download */}
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => handleExport(exportFormat)}
              disabled={!exportFormat || isExporting}
            >
              <Download className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Download</div>
                <div className="text-xs text-muted-foreground">Baixar arquivo</div>
              </div>
            </Button>

            {/* Exportação Direta */}
            <Button
              className={`h-auto p-4 flex flex-col gap-2 text-white ${networkConfig.color}`}
              onClick={() => handleExport("", true)}
              disabled={isExporting}
            >
              <networkConfig.icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Publicar Diretamente</div>
                <div className="text-xs opacity-90">Abrir no {networkConfig.name}</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Dimensões Personalizadas */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full">
              <ImageIcon className="h-4 w-4 mr-2" />
              Dimensões Personalizadas
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dimensões Personalizadas</DialogTitle>
              <DialogDescription>
                Configure dimensões específicas para sua exportação
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Largura (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="1080"
                    value={customDimensions.width}
                    onChange={(e) => setCustomDimensions(prev => ({ ...prev, width: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="1080"
                    value={customDimensions.height}
                    onChange={(e) => setCustomDimensions(prev => ({ ...prev, height: e.target.value }))}
                  />
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={() => {
                  toast.success("Dimensões personalizadas aplicadas!");
                }}
              >
                Aplicar Dimensões
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Informações do Conteúdo */}
        <div className="p-4 bg-muted/30 rounded-lg space-y-2">
          <h4 className="font-medium text-sm">Conteúdo a ser exportado:</h4>
          <div className="flex flex-wrap gap-2">
            {content.caption && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Legenda
              </Badge>
            )}
            {content.hashtags && content.hashtags.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {content.hashtags.length} Hashtags
              </Badge>
            )}
            {content.images && content.images.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                {content.images.length} Imagem(ns)
              </Badge>
            )}
            {content.videos && content.videos.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Video className="h-3 w-3" />
                {content.videos.length} Vídeo(s)
              </Badge>
            )}
          </div>
        </div>

        {isExporting && (
          <div className="flex items-center justify-center p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2 text-primary">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm font-medium">Processando exportação...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialExport;