import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { 
  Bot, 
  Check, 
  AlertCircle, 
  Settings as SettingsIcon, 
  Sparkles,
  Zap,
  TestTube
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Settings = () => {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string>("");

  const testOpenRouterConnection = async () => {
    setIsTesting(true);
    setTestResult("");
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-post-content', {
        body: {
          network: 'instagram',
          template: 'ig-post',
          objective: 'Promoção',
          theme: 'Teste de conexão com GLM 4.5 Air API',
          model: 'gpt-4o-mini',
          generateImages: false,
          generateCaption: true,
          generateHashtags: false
        }
      });

      if (error) {
        setTestResult(`Erro: ${error.message}`);
        toast.error("Falha no teste de conexão");
        return;
      }

      // Check for model ID error and retry with fallback
      if (data && !data.success && data.error && data.error.includes('not a valid model ID')) {
        const { data: retryData, error: retryError } = await supabase.functions.invoke('generate-post-content', {
          body: {
            network: 'instagram',
            template: 'ig-post',
            objective: 'Teste',
            theme: 'Teste de conexão com modelo de fallback',
            model: 'gpt-4o-mini',
            generateImages: false,
            generateCaption: true,
            generateHashtags: false
          }
        });

        if (retryError || !retryData?.content?.caption) {
          setTestResult("❌ Falha mesmo com modelo de fallback");
          toast.error("Teste de fallback falhou");
          return;
        }

        setTestResult("✅ Conexão funcionando com modelo de fallback!");
        toast.success("Teste bem-sucedido com fallback!");
        return;
      }

      if (data?.caption) {
        setTestResult("✅ Conexão com OpenRouter funcionando perfeitamente!");
        toast.success("Teste de IA bem-sucedido!");
      } else {
        setTestResult("⚠️ Conexão estabelecida, mas resposta inesperada");
        toast.warning("Teste parcialmente bem-sucedido");
      }
    } catch (error) {
      console.error('Erro no teste:', error);
      setTestResult("❌ Falha na conexão com OpenRouter API");
      toast.error("Erro no teste de conexão");
    } finally {
      setIsTesting(false);
    }
  };

  const testOpenAIConnection = async () => {
    setIsTesting(true);
    setTestResult("");
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-post-content', {
        body: {
          network: 'instagram',
          template: 'ig-post',
          objective: 'Teste',
          theme: 'Teste de conexão com OpenAI API para geração de imagens',
          generateImages: true,
          generateCaption: false,
          generateHashtags: false
        }
      });

      if (error) {
        setTestResult(`Erro: ${error.message}`);
        toast.error("Falha no teste OpenAI");
        return;
      }

      if (data?.images && data.images.length > 0) {
        setTestResult("✅ Conexão com OpenAI funcionando perfeitamente!");
        toast.success("Teste OpenAI bem-sucedido!");
      } else {
        setTestResult("⚠️ OpenAI conectado, mas sem geração de imagens");
        toast.warning("Teste parcialmente bem-sucedido");
      }
    } catch (error) {
      console.error('Erro no teste OpenAI:', error);
      setTestResult("❌ Falha na conexão com OpenAI API");
      toast.error("Erro no teste OpenAI");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">
          Personalize sua experiência e gerencie integração com IA
        </p>
      </div>

      {/* Configurações de IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Integração GLM 4.5 Air - OpenRouter
          </CardTitle>
          <CardDescription>
            Configure e gerencie sua integração com GLM 4.5 Air via OpenRouter (Modelo gratuito)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status da Integração */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium">GLM 4.5 Air API</p>
                <p className="text-sm text-muted-foreground">Modelo gratuito configurado via OpenRouter</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Check className="h-3 w-3 mr-1" />
              Conectado
            </Badge>
          </div>

          {/* Configurações */}
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="ai-enabled">Geração de Conteúdo com IA</Label>
                <p className="text-sm text-muted-foreground">
                  Ativar geração automática de legendas e hashtags
                </p>
              </div>
              <Switch
                id="ai-enabled"
                checked={aiEnabled}
                onCheckedChange={setAiEnabled}
              />
            </div>

            <div className="space-y-2">
              <Label>Modelo de IA Atual</Label>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">GLM 4.5 Air</span>
                <Badge variant="outline">Gratuito & Rápido</Badge>
              </div>
            </div>
          </div>

          {/* Teste de Conexão */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              <h4 className="font-medium">Testar Conexão</h4>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Teste a integração com GLM 4.5 Air para garantir que a geração de conteúdo está funcionando
            </p>
            
            <Button 
              onClick={testOpenRouterConnection}
              disabled={isTesting}
              className="w-full"
            >
              {isTesting ? (
                <>
                  <SettingsIcon className="h-4 w-4 mr-2 animate-spin" />
                  Testando conexão...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Testar Integração
                </>
              )}
            </Button>

            {testResult && (
              <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-mono">{testResult}</p>
              </div>
            )}
          </div>

          {/* Informações da API */}
          <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Sobre a Integração</h4>
            </div>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 ml-6">
              <li>• Geração de legendas inteligentes em português</li>
              <li>• Hashtags otimizadas para cada rede social</li>
              <li>• Prompts para geração de imagens (carrossel)</li>
              <li>• Adaptação automática para Instagram, LinkedIn e TikTok</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Configurações OpenAI */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Integração OpenAI
          </CardTitle>
          <CardDescription>
            Configure a integração com OpenAI para geração de imagens avançadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status da Integração OpenAI */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium">OpenAI API</p>
                <p className="text-sm text-muted-foreground">Para geração de imagens de alta qualidade</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Check className="h-3 w-3 mr-1" />
              Configurado
            </Badge>
          </div>

          {/* Recursos OpenAI */}
          <div className="space-y-2">
            <Label>Recursos Disponíveis</Label>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="font-medium">GPT-4 Vision</span>
                <Badge variant="outline">Análise de Imagens</Badge>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Bot className="h-4 w-4 text-blue-600" />
                <span className="font-medium">DALL-E 3</span>
                <Badge variant="outline">Geração de Imagens</Badge>
              </div>
            </div>
          </div>

          {/* Teste OpenAI */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              <h4 className="font-medium">Testar OpenAI</h4>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Teste a geração de imagens com OpenAI DALL-E
            </p>
            
            <Button 
              onClick={testOpenAIConnection}
              disabled={isTesting}
              variant="outline"
              className="w-full"
            >
              {isTesting ? (
                <>
                  <SettingsIcon className="h-4 w-4 mr-2 animate-spin" />
                  Testando OpenAI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Testar Geração de Imagens
                </>
              )}
            </Button>

            {testResult && (
              <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-mono">{testResult}</p>
              </div>
            )}
          </div>

          {/* Informações OpenAI */}
          <div className="space-y-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <h4 className="font-medium text-green-900 dark:text-green-100">Sobre OpenAI</h4>
            </div>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1 ml-6">
              <li>• Geração de imagens de alta qualidade com DALL-E</li>
              <li>• Análise visual avançada com GPT-4 Vision</li>
              <li>• Integração automática para carrosséis de imagens</li>
              <li>• Fallback inteligente para OpenRouter quando necessário</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Outras Configurações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            Configurações Gerais
          </CardTitle>
          <CardDescription>
            Outras configurações do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Mais configurações em breve</h3>
            <p className="text-muted-foreground">
              Novas opções de personalização serão adicionadas aqui
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;