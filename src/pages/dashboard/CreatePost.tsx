import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { 
  Instagram, 
  Linkedin,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Settings,
  Check,
  Play,
  Image,
  MessageCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CreatePost = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [postContent, setPostContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPost, setGeneratedPost] = useState<any>(null);

  const totalSteps = 4;

  const networks = [
    { 
      id: "instagram", 
      name: "Instagram", 
      icon: Instagram, 
      description: "Posts, Stories e Reels",
      color: "from-pink-500 to-purple-600"
    },
    { 
      id: "linkedin", 
      name: "LinkedIn", 
      icon: Linkedin, 
      description: "Posts profissionais",
      color: "from-blue-600 to-blue-800"
    },
    { 
      id: "tiktok", 
      name: "TikTok", 
      icon: MessageCircle, 
      description: "Vídeos curtos",
      color: "from-gray-800 to-black"
    },
  ];

  const templates = {
    instagram: [
      { 
        id: "ig-post", 
        name: "Post Feed", 
        icon: Image, 
        description: "Post clássico do Instagram"
      },
      { 
        id: "ig-stories", 
        name: "Stories", 
        icon: Play, 
        description: "Stories verticais interativos"
      }
    ],
    linkedin: [
      { 
        id: "li-post", 
        name: "Post Profissional", 
        icon: Image, 
        description: "Post empresarial otimizado"
      }
    ],
    tiktok: [
      { 
        id: "tt-video", 
        name: "Vídeo Viral", 
        icon: Play, 
        description: "Vídeo curto e envolvente"
      }
    ]
  };

  const getTemplatesForNetwork = (networkId: string) => {
    return templates[networkId as keyof typeof templates] || [];
  };

  const contentExamples = [
    "Lançamento do novo produto revolucionário da nossa empresa",
    "Dica rápida para aumentar sua produtividade no trabalho",
    "Promoção especial de final de ano - descontos imperdíveis",
    "Por trás das cenas: como criamos nossos produtos"
  ];

  const generateContent = async () => {
    if (!selectedNetwork || !selectedTemplate || !postContent) {
      toast.error("Preencha todas as informações antes de gerar o conteúdo");
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Calling generate-post-content with:', {
        network: selectedNetwork,
        template: selectedTemplate,
        content: postContent,
        objective: "Criar conteúdo engajante"
      });

      const { data, error } = await supabase.functions.invoke('generate-post-content', {
        body: {
          network: selectedNetwork,
          template: selectedTemplate,
          content: postContent,
          objective: "Criar conteúdo engajante",
          theme: postContent,
          model: 'gpt-4o-mini',
          generateImages: true,
          generateCaption: true,
          generateHashtags: true
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        toast.error(`Erro na função: ${error.message || 'Erro desconhecido'}`);
        return;
      }

      if (!data) {
        console.error('No data returned from function');
        toast.error("Nenhum dado retornado pela função");
        return;
      }

      if (!data.success) {
        console.error('AI generation failed:', data);
        toast.error(`Erro na IA: ${data.error || "Falha na geração de conteúdo"}`);
        return;
      }

      setGeneratedPost(data);
      setCurrentStep(4);
      toast.success("Conteúdo gerado com sucesso!");
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error(`Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedStep1 = selectedNetwork;
  const canProceedStep2 = selectedTemplate;
  const canProceedStep3 = postContent.length >= 10;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header com Progresso */}
      <div className="text-center space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Criar Post</h1>
          <p className="text-muted-foreground">
            Crie conteúdo profissional em 4 passos simples
          </p>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Passo {currentStep}</span>
            <span>{totalSteps} passos</span>
          </div>
        </div>
      </div>

      {/* Passo 1: Escolha da Rede Social */}
      {currentStep === 1 && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Escolha a rede social</CardTitle>
            <CardDescription>
              Onde você quer publicar seu conteúdo?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {networks.map((network) => (
                <div
                  key={network.id}
                  onClick={() => setSelectedNetwork(network.id)}
                  className={`
                    group p-6 rounded-xl border-2 cursor-pointer transition-smooth hover:scale-105
                    ${selectedNetwork === network.id 
                      ? 'border-primary bg-primary/5 shadow-card' 
                      : 'border-border hover:border-primary/30'
                    }
                  `}
                >
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${network.color} flex items-center justify-center mx-auto`}>
                      <network.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{network.name}</h3>
                      <p className="text-sm text-muted-foreground">{network.description}</p>
                    </div>
                    {selectedNetwork === network.id && (
                      <div className="flex justify-center">
                        <Badge className="bg-primary">Selecionado</Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {canProceedStep1 && (
              <div className="flex justify-center mt-6">
                <Button onClick={nextStep} size="lg" className="px-8">
                  Continuar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Passo 2: Escolha do Template */}
      {currentStep === 2 && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Escolha o formato</CardTitle>
            <CardDescription>
              Que tipo de conteúdo você quer criar para o {networks.find(n => n.id === selectedNetwork)?.name}?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getTemplatesForNetwork(selectedNetwork).map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`
                    group p-6 rounded-xl border-2 cursor-pointer transition-smooth hover:scale-105
                    ${selectedTemplate === template.id 
                      ? 'border-primary bg-primary/5 shadow-card' 
                      : 'border-border hover:border-primary/30'
                    }
                  `}
                >
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto">
                      <template.icon className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="flex justify-center">
                        <Badge className="bg-primary">Selecionado</Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-6">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              {canProceedStep2 && (
                <Button onClick={nextStep} size="lg">
                  Continuar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Passo 3: Conteúdo */}
      {currentStep === 3 && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Conte-nos sobre seu post</CardTitle>
            <CardDescription>
              Descreva o que você quer comunicar. Nossa IA criará o conteúdo perfeito!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Textarea
                placeholder="Ex: Quero promover o lançamento do nosso novo produto..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="min-h-[120px] resize-none text-base"
              />
              <p className="text-sm text-muted-foreground">
                Seja específico para obter melhores resultados (mín. 10 caracteres)
              </p>
            </div>

            {/* Exemplos */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Precisa de inspiração?</p>
              <div className="grid gap-2">
                {contentExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPostContent(example)}
                    className="text-left p-3 rounded-lg bg-muted/30 hover:bg-muted transition-smooth text-sm border border-transparent hover:border-border"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              {canProceedStep3 && (
                <Button 
                  onClick={generateContent}
                  disabled={isGenerating}
                  size="lg"
                  className="gradient-primary"
                >
                  {isGenerating ? (
                    <>
                      <Settings className="h-4 w-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Gerar Post
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Passo 4: Post Gerado */}
      {currentStep === 4 && generatedPost && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Check className="h-6 w-6 text-green-500" />
              Post Criado com Sucesso!
            </CardTitle>
            <CardDescription>
              Seu conteúdo foi gerado e está pronto para uso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preview do Post Gerado */}
            <div className="bg-muted/30 rounded-lg p-6 space-y-4">
              <div className="text-center">
                <Badge className="mb-4">{networks.find(n => n.id === selectedNetwork)?.name}</Badge>
                <div className="aspect-square max-w-sm mx-auto bg-white rounded-lg shadow-card p-4 flex items-center justify-center">
                  {generatedPost?.generated_images?.length > 0 ? (
                    <img 
                      src={generatedPost.generated_images[0].url} 
                      alt="Post gerado"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center space-y-2">
                      <Image className="h-12 w-12 text-primary mx-auto" />
                      <p className="text-sm font-medium">Post Visual</p>
                      <p className="text-xs text-muted-foreground">
                        {isGenerating ? "Gerando imagem..." : "Imagem não gerada pela IA"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {generatedPost.caption && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Legenda:</h4>
                  <div className="bg-background rounded-lg p-3 text-sm">
                    {generatedPost.caption}
                  </div>
                </div>
              )}
              
              {generatedPost.hashtags && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Hashtags:</h4>
                  <div className="bg-background rounded-lg p-3 text-sm text-primary break-words overflow-wrap-anywhere">
                    {Array.isArray(generatedPost.hashtags) 
                      ? generatedPost.hashtags.join(' ')
                      : generatedPost.hashtags
                    }
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between gap-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Editar Post
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="secondary"
                  onClick={() => {
                    if (generatedPost?.generated_images?.length > 0) {
                      // Baixar todas as imagens geradas
                      generatedPost.generated_images.forEach((image, index) => {
                        const link = document.createElement('a');
                        link.href = image.url;
                        link.download = `post-image-${index + 1}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      });
                      toast.success(`${generatedPost.generated_images.length} imagem(ns) baixada(s) com sucesso!`);
                    } else {
                      toast.error("Nenhuma imagem foi gerada pela IA");
                    }
                  }}
                >
                  Baixar Imagem{generatedPost?.generated_images?.length > 1 ? 's' : ''}
                </Button>
                <Button 
                  className="gradient-primary"
                  onClick={async () => {
                    if (!generatedPost) {
                      toast.error("Nenhum post gerado para salvar");
                      return;
                    }

                    try {
                      // Criar um objeto com os dados do post
                      const postData = {
                        network: selectedNetwork,
                        template: selectedTemplate,
                        caption: generatedPost.caption,
                        hashtags: Array.isArray(generatedPost.hashtags) 
                          ? generatedPost.hashtags.join(' ')
                          : generatedPost.hashtags,
                        images: generatedPost.generated_images || [],
                        model_used: generatedPost.model_used || 'glm-4.5-air',
                        created_at: new Date().toISOString()
                      };

                      // Copiar dados para a área de transferência
                      const postText = `${generatedPost.caption}\n\n${Array.isArray(generatedPost.hashtags) ? generatedPost.hashtags.join(' ') : generatedPost.hashtags}`;
                      
                      await navigator.clipboard.writeText(postText);
                      toast.success("Post copiado para a área de transferência!");
                      
                    } catch (error) {
                      console.error('Erro ao copiar post:', error);
                      toast.error("Erro ao copiar o post");
                    }
                  }}
                >
                  Copiar Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreatePost;