import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Plus, 
  Trash2, 
  Move, 
  Type, 
  Image as ImageIcon, 
  Video,
  Save,
  Eye,
  Upload,
  GripVertical,
  Edit3
} from "lucide-react";
import { toast } from "sonner";
import { Template } from '@/contexts/TemplateContext';

interface TemplateElement {
  id: string;
  type: 'text' | 'image' | 'video';
  placeholder: string;
  content?: string;
  styles?: {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    padding?: number;
    borderRadius?: number;
  };
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface TemplateEditorProps {
  template?: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, onSave, onCancel }) => {
  const [editableTemplate, setEditableTemplate] = useState<Template>({
    id: template?.id || `template_${Date.now()}`,
    title: template?.title || '',
    category: template?.category || '',
    platform: template?.platform || 'Instagram',
    type: template?.type || 'post',
    image: template?.image || '',
    premium: template?.premium || false,
    likes: template?.likes || 0,
    description: template?.description || '',
    contentStructure: template?.contentStructure || {
      elements: []
    }
  });

  const [elements, setElements] = useState<TemplateElement[]>(
    template?.contentStructure?.elements?.map((el, index) => ({
      id: `element_${index}`,
      type: el.type,
      placeholder: el.placeholder,
      content: '',
      styles: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left',
        backgroundColor: 'transparent',
        padding: 8,
        borderRadius: 0
      },
      position: {
        x: 0,
        y: index * 80,
        width: 300,
        height: 60
      }
    })) || []
  );

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addElement = (type: 'text' | 'image' | 'video') => {
    const newElement: TemplateElement = {
      id: `element_${Date.now()}`,
      type,
      placeholder: type === 'text' ? 'Digite seu texto...' : 
                   type === 'image' ? 'Adicionar imagem' : 'Adicionar vídeo',
      content: '',
      styles: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left',
        backgroundColor: 'transparent',
        padding: 8,
        borderRadius: 0
      },
      position: {
        x: 50,
        y: elements.length * 80,
        width: type === 'text' ? 250 : 200,
        height: type === 'text' ? 40 : 120
      }
    };

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
    toast.success(`Elemento ${type} adicionado!`);
  };

  const removeElement = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElement === elementId) {
      setSelectedElement(null);
    }
    toast.success("Elemento removido!");
  };

  const updateElement = (elementId: string, updates: Partial<TemplateElement>) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
  };

  const updateElementStyle = (elementId: string, styleUpdates: Partial<TemplateElement['styles']>) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { 
        ...el, 
        styles: { ...el.styles, ...styleUpdates } 
      } : el
    ));
  };

  const updateElementPosition = (elementId: string, position: Partial<TemplateElement['position']>) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { 
        ...el, 
        position: { ...el.position!, ...position } 
      } : el
    ));
  };

  const handleSave = () => {
    if (!editableTemplate.title || !editableTemplate.description) {
      toast.error("Preencha o título e descrição do template");
      return;
    }

    const updatedTemplate: Template = {
      ...editableTemplate,
      contentStructure: {
        elements: elements.map(el => ({
          type: el.type,
          placeholder: el.placeholder
        }))
      }
    };

    onSave(updatedTemplate);
    toast.success("Template salvo com sucesso!");
  };

  const selectedElementData = elements.find(el => el.id === selectedElement);

  return (
    <div className="h-screen flex">
      {/* Painel Lateral Esquerdo */}
      <div className="w-80 border-r bg-background/50 backdrop-blur-sm overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Informações do Template */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalhes do Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={editableTemplate.title}
                  onChange={(e) => setEditableTemplate(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nome do template"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={editableTemplate.description}
                  onChange={(e) => setEditableTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o template..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Plataforma</Label>
                  <Badge variant="outline">{editableTemplate.platform}</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Badge variant="secondary">{editableTemplate.type}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adicionar Elementos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Adicionar Elementos</CardTitle>
              <CardDescription>
                Clique para adicionar elementos ao template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                onClick={() => addElement('text')}
                className="w-full justify-start"
              >
                <Type className="mr-2 h-4 w-4" />
                Texto
              </Button>
              
              <Button
                variant="outline"
                onClick={() => addElement('image')}
                className="w-full justify-start"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Imagem
              </Button>
              
              <Button
                variant="outline"
                onClick={() => addElement('video')}
                className="w-full justify-start"
              >
                <Video className="mr-2 h-4 w-4" />
                Vídeo
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Elementos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Elementos ({elements.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {elements.map((element, index) => (
                <div
                  key={element.id}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                    selectedElement === element.id 
                      ? 'bg-primary/10 border-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedElement(element.id)}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  
                  {element.type === 'text' && <Type className="h-4 w-4" />}
                  {element.type === 'image' && <ImageIcon className="h-4 w-4" />}
                  {element.type === 'video' && <Video className="h-4 w-4" />}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {element.placeholder}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {element.type}
                    </p>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeElement(element.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              {elements.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Edit3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum elemento adicionado</p>
                  <p className="text-xs">Clique nos botões acima para começar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Canvas Central */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b p-4 flex items-center justify-between bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Editor de Template</h2>
            <Badge variant="outline">{editableTemplate.platform}</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Template
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-8 bg-muted/20 overflow-auto">
          <div 
            ref={canvasRef}
            className="relative mx-auto bg-white rounded-lg shadow-lg"
            style={{
              width: editableTemplate.type === 'story' ? '300px' : '500px',
              height: editableTemplate.type === 'story' ? '533px' : '500px',
              minHeight: '400px'
            }}
          >
            {elements.map((element) => (
              <div
                key={element.id}
                className={`absolute cursor-move border-2 transition-all ${
                  selectedElement === element.id 
                    ? 'border-primary border-dashed' 
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={{
                  left: element.position?.x || 0,
                  top: element.position?.y || 0,
                  width: element.position?.width || 200,
                  height: element.position?.height || 60,
                  backgroundColor: element.styles?.backgroundColor || 'transparent',
                  padding: element.styles?.padding || 8,
                  borderRadius: element.styles?.borderRadius || 0
                }}
                onClick={() => setSelectedElement(element.id)}
              >
                {element.type === 'text' && (
                  <div
                    className="w-full h-full flex items-center"
                    style={{
                      fontSize: element.styles?.fontSize || 16,
                      fontWeight: element.styles?.fontWeight || 'normal',
                      color: element.styles?.color || '#000000',
                      textAlign: element.styles?.textAlign || 'left'
                    }}
                  >
                    {element.content || element.placeholder}
                  </div>
                )}
                
                {element.type === 'image' && (
                  <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">{element.placeholder}</span>
                  </div>
                )}
                
                {element.type === 'video' && (
                  <div className="w-full h-full bg-gray-900 rounded flex items-center justify-center">
                    <Video className="h-8 w-8 text-white" />
                    <span className="ml-2 text-sm text-white">{element.placeholder}</span>
                  </div>
                )}
              </div>
            ))}
            
            {elements.length === 0 && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Edit3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Canvas Vazio</p>
                  <p className="text-sm">Adicione elementos usando o painel lateral</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Painel Lateral Direito - Propriedades */}
      <div className="w-80 border-l bg-background/50 backdrop-blur-sm overflow-y-auto">
        <div className="p-4">
          {selectedElementData ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Propriedades do Elemento</CardTitle>
                <CardDescription>
                  {selectedElementData.type} selecionado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Placeholder/Conteúdo</Label>
                  <Input
                    value={selectedElementData.placeholder}
                    onChange={(e) => updateElement(selectedElementData.id, { placeholder: e.target.value })}
                    placeholder="Texto do elemento"
                  />
                </div>

                {selectedElementData.type === 'text' && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Tamanho da Fonte</Label>
                        <Input
                          type="number"
                          value={selectedElementData.styles?.fontSize || 16}
                          onChange={(e) => updateElementStyle(selectedElementData.id, { fontSize: parseInt(e.target.value) })}
                          min="8"
                          max="72"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Cor do Texto</Label>
                        <Input
                          type="color"
                          value={selectedElementData.styles?.color || '#000000'}
                          onChange={(e) => updateElementStyle(selectedElementData.id, { color: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Alinhamento</Label>
                      <div className="flex gap-1">
                        {['left', 'center', 'right'].map((align) => (
                          <Button
                            key={align}
                            size="sm"
                            variant={selectedElementData.styles?.textAlign === align ? 'default' : 'outline'}
                            onClick={() => updateElementStyle(selectedElementData.id, { textAlign: align as any })}
                            className="flex-1"
                          >
                            {align === 'left' && '⇤'}
                            {align === 'center' && '⇔'}
                            {align === 'right' && '⇥'}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label>Cor de Fundo</Label>
                  <Input
                    type="color"
                    value={selectedElementData.styles?.backgroundColor || '#ffffff'}
                    onChange={(e) => updateElementStyle(selectedElementData.id, { backgroundColor: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Padding</Label>
                    <Input
                      type="number"
                      value={selectedElementData.styles?.padding || 8}
                      onChange={(e) => updateElementStyle(selectedElementData.id, { padding: parseInt(e.target.value) })}
                      min="0"
                      max="50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Border Radius</Label>
                    <Input
                      type="number"
                      value={selectedElementData.styles?.borderRadius || 0}
                      onChange={(e) => updateElementStyle(selectedElementData.id, { borderRadius: parseInt(e.target.value) })}
                      min="0"
                      max="50"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Label className="text-sm font-medium">Posição & Tamanho</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="space-y-1">
                      <Label className="text-xs">X</Label>
                      <Input
                        type="number"
                        value={selectedElementData.position?.x || 0}
                        onChange={(e) => updateElementPosition(selectedElementData.id, { x: parseInt(e.target.value) })}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Y</Label>
                      <Input
                        type="number"
                        value={selectedElementData.position?.y || 0}
                        onChange={(e) => updateElementPosition(selectedElementData.id, { y: parseInt(e.target.value) })}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Largura</Label>
                      <Input
                        type="number"
                        value={selectedElementData.position?.width || 200}
                        onChange={(e) => updateElementPosition(selectedElementData.id, { width: parseInt(e.target.value) })}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Altura</Label>
                      <Input
                        type="number"
                        value={selectedElementData.position?.height || 60}
                        onChange={(e) => updateElementPosition(selectedElementData.id, { height: parseInt(e.target.value) })}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Edit3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Selecione um elemento</p>
              <p className="text-xs">para editar suas propriedades</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview do Template</DialogTitle>
            <DialogDescription>
              Assim ficará o template final
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center p-4 bg-muted/20 rounded-lg">
            <div 
              className="relative bg-white rounded-lg shadow-lg"
              style={{
                width: editableTemplate.type === 'story' ? '300px' : '500px',
                height: editableTemplate.type === 'story' ? '533px' : '500px',
              }}
            >
              {elements.map((element) => (
                <div
                  key={element.id}
                  className="absolute"
                  style={{
                    left: element.position?.x || 0,
                    top: element.position?.y || 0,
                    width: element.position?.width || 200,
                    height: element.position?.height || 60,
                    backgroundColor: element.styles?.backgroundColor || 'transparent',
                    padding: element.styles?.padding || 8,
                    borderRadius: element.styles?.borderRadius || 0
                  }}
                >
                  {element.type === 'text' && (
                    <div
                      className="w-full h-full flex items-center"
                      style={{
                        fontSize: element.styles?.fontSize || 16,
                        fontWeight: element.styles?.fontWeight || 'normal',
                        color: element.styles?.color || '#000000',
                        textAlign: element.styles?.textAlign || 'left'
                      }}
                    >
                      {element.placeholder}
                    </div>
                  )}
                  
                  {element.type === 'image' && (
                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  
                  {element.type === 'video' && (
                    <div className="w-full h-full bg-gray-900 rounded flex items-center justify-center">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateEditor;