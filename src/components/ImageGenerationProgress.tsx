import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, Clock, CheckCircle } from "lucide-react";

interface ImageGenerationProgressProps {
  isGenerating: boolean;
  currentStep: number;
  totalSteps: number;
  estimatedTime: string;
  currentImagePrompt?: string;
}

const ImageGenerationProgress: React.FC<ImageGenerationProgressProps> = ({
  isGenerating,
  currentStep,
  totalSteps,
  estimatedTime,
  currentImagePrompt
}) => {
  if (!isGenerating) return null;

  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <Card className="w-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">
                Gerando Imagens com IA
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Criando imagens personalizadas para seu conteúdo...
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Progresso: {currentStep} de {totalSteps} imagens
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-3 bg-blue-100 dark:bg-blue-900"
            />
          </div>

          {/* Current Step */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Gerando imagem {currentStep} de {totalSteps}
              </span>
            </div>

            {currentImagePrompt && (
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Prompt atual:
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-100 italic">
                  "{currentImagePrompt.substring(0, 80)}..."
                </p>
              </div>
            )}
          </div>

          {/* Time Estimate */}
          <div className="flex items-center gap-2 pt-2 border-t border-blue-200 dark:border-blue-800">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Tempo estimado: {estimatedTime}
            </span>
          </div>

          {/* Tips */}
          <div className="bg-blue-100/50 dark:bg-blue-900/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">💡 Dica:</p>
                <p>
                  A geração de imagens de alta qualidade pode levar alguns minutos. 
                  O processo é otimizado para criar imagens únicas e profissionais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageGenerationProgress;