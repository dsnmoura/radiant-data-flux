import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Template {
  id: string;
  title: string;
  category: string;
  platform: string;
  type: 'post' | 'carousel' | 'story' | 'article' | 'video';
  image: string;
  premium: boolean;
  likes: number;
  description: string;
  contentStructure?: {
    elements: Array<{
      type: 'text' | 'image' | 'video';
      placeholder: string;
    }>;
  };
  // Propriedades opcionais para compatibilidade com MonthlyTemplate
  releaseDate?: string;
  isNew?: boolean;
  isSeasonal?: boolean;
  seasonalPeriod?: {
    start: string;
    end: string;
  };
  trending?: boolean;
}

interface TemplateContextType {
  selectedTemplate: Template | null;
  setSelectedTemplate: (template: Template) => void;
  clearSelection: () => void;
  filteredPlatform: string;
  setFilteredPlatform: (platform: string) => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};

interface TemplateProviderProps {
  children: ReactNode;
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({ children }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [filteredPlatform, setFilteredPlatform] = useState<string>("Todos");

  const clearSelection = () => {
    setSelectedTemplate(null);
  };

  return (
    <TemplateContext.Provider
      value={{
        selectedTemplate,
        setSelectedTemplate,
        clearSelection,
        filteredPlatform,
        setFilteredPlatform,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};