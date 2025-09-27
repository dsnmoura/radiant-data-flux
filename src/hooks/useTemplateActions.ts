import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Template } from '@/contexts/TemplateContext';

export const useTemplateActions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const saveTemplate = async (template: Template) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado");
        return false;
      }

      const templateData = {
        name: template.title,
        description: template.description,
        platform: template.platform,
        type: template.type,
        is_public: true,
        content_structure: template.contentStructure || {
          elements: []
        },
        preview_image: template.image
      };

      let result;
      
      if (template.id && template.id.startsWith('template_')) {
        // Novo template
        const { data, error } = await supabase
          .from('templates')
          .insert(templateData)
          .select()
          .single();
        
        result = { data, error };
      } else {
        // Atualizar template existente
        const { data, error } = await supabase
          .from('templates')
          .update(templateData)
          .eq('id', template.id)
          .select()
          .single();
          
        result = { data, error };
      }

      if (result.error) {
        console.error('Error saving template:', result.error);
        toast.error("Erro ao salvar template");
        return false;
      }

      toast.success("Template salvo com sucesso!");
      return true;

    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao salvar template");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTemplate = async (templateId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', templateId);

      if (error) {
        console.error('Error deleting template:', error);
        toast.error("Erro ao excluir template");
        return false;
      }

      toast.success("Template excluído com sucesso!");
      return true;

    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao excluir template");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const duplicateTemplate = async (template: Template) => {
    const duplicatedTemplate: Template = {
      ...template,
      id: `template_${Date.now()}`,
      title: `${template.title} (Cópia)`,
      likes: 0
    };

    return await saveTemplate(duplicatedTemplate);
  };

  const exportTemplate = (template: Template) => {
    const templateData = {
      ...template,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(templateData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `template_${template.title.toLowerCase().replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Template exportado com sucesso!");
  };

  const importTemplate = async (file: File): Promise<Template | null> => {
    try {
      const text = await file.text();
      const templateData = JSON.parse(text);
      
      // Validar estrutura básica
      if (!templateData.title || !templateData.description) {
        toast.error("Arquivo de template inválido");
        return null;
      }

      const importedTemplate: Template = {
        ...templateData,
        id: `template_${Date.now()}`,
        title: `${templateData.title} (Importado)`,
        likes: 0
      };

      toast.success("Template importado com sucesso!");
      return importedTemplate;

    } catch (error) {
      console.error('Error importing template:', error);
      toast.error("Erro ao importar template");
      return null;
    }
  };

  return {
    saveTemplate,
    deleteTemplate,
    duplicateTemplate,
    exportTemplate,
    importTemplate,
    isLoading
  };
};

export default useTemplateActions;