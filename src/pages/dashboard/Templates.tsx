import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TemplateLibrary from "@/components/TemplateLibrary";
import TemplateEditor from "@/components/TemplateEditor";
import { Template } from "@/contexts/TemplateContext";
import { toast } from "sonner";

const Templates = () => {
  const navigate = useNavigate();
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handleUseTemplate = (template: Template) => {
    // Lógica para usar o template (navegar para criação de post)
    navigate('/dashboard/create');
    toast.success(`Template "${template.title}" selecionado para uso!`);
  };

  const handleSaveTemplate = (template: Template) => {
    // Salvar template editado
    console.log('Template salvo:', template);
    toast.success("Template salvo com sucesso!");
    setShowEditor(false);
    setEditingTemplate(null);
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setEditingTemplate(null);
  };

  if (showEditor) {
    return (
      <div className="h-screen">
        <TemplateEditor
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <TemplateLibrary
      onEdit={handleEditTemplate}
      onUse={handleUseTemplate}
    />
  );
};

export default Templates;