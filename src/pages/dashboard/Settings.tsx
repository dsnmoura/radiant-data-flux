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
          theme: 'Teste de conexão com OpenRouter API',
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
            Integração com IA - OpenRouter
          </CardTitle>
          <CardDescription>
            Configure e gerencie sua integração com OpenRouter.ai para geração de conteúdo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status da Integração */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium">Status da API</p>
                <p className="text-sm text-muted-foreground">OpenRouter configurado e ativo</p>
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
                <span className="font-medium">GPT-4o Mini</span>
                <Badge variant="outline">Rápido & Eficiente</Badge>
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
              Teste a integração com OpenRouter para garantir que tudo está funcionando
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