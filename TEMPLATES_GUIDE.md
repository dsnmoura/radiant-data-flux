# Como Adicionar Templates Editáveis

Este sistema permite criar e editar templates de forma visual e intuitiva. Aqui está como usar:

## 🎨 Editor Visual de Templates (TemplateEditor)

### Funcionalidades Principais:
- **Canvas Visual**: Interface de arrastar e soltar para posicionar elementos
- **Elementos Editáveis**: Texto, imagem e vídeo
- **Propriedades Customizáveis**: Cores, fontes, tamanhos, posições
- **Preview em Tempo Real**: Visualização instantânea das mudanças

### Como Usar:

1. **Acessar o Editor**:
   - No Dashboard → Templates → Botão "Editor Visual"
   - Ou ao clicar em "Editar" em qualquer template existente

2. **Adicionar Elementos**:
   - Use o painel lateral esquerdo para adicionar:
     - **Texto**: Para títulos, descrições, CTAs
     - **Imagem**: Para logos, fotos, ilustrações  
     - **Vídeo**: Para conteúdo multimídia

3. **Editar Propriedades**:
   - Selecione qualquer elemento no canvas
   - Use o painel direito para ajustar:
     - Cores (texto, fundo)
     - Fontes e tamanhos
     - Alinhamento
     - Posição e dimensões
     - Padding e border radius

4. **Salvar Template**:
   - Clique em "Salvar Template" no toolbar
   - O template ficará disponível na biblioteca

## 📚 Biblioteca de Templates (TemplateLibrary)

### Funcionalidades:
- **Busca e Filtros**: Por categoria, plataforma, popularidade
- **Visualizações**: Grid ou lista
- **Ações Rápidas**: Editar, usar, preview

### Como Usar:

1. **Navegar Templates**:
   - Use os filtros de plataforma (Instagram, LinkedIn, etc.)
   - Filtre por categoria (Promoções, Dicas, etc.)
   - Ordene por novos, populares ou trending

2. **Usar Template**:
   - Clique no botão "Download" para usar diretamente
   - Ou clique em "Editar" para personalizar primeiro

## 🔧 Gerenciador de Templates (TemplateManager)

### Para Administradores:
- **Criar Templates**: Via formulário tradicional ou editor visual
- **Estatísticas**: Visualizar métricas de uso
- **Organização**: Gerenciar categorias e coleções

### Como Criar Novo Template:

1. **Via Editor Visual**:
   - Clique em "Editor Visual" 
   - Crie do zero com elementos visuais
   - Salve com título e descrição

2. **Via Formulário**:
   - Clique em "Novo Template"
   - Preencha informações básicas
   - Configure estrutura de conteúdo

## 🎯 Estrutura de Template

Cada template contém:

```typescript
{
  id: string;
  title: string;          // Nome do template
  description: string;    // Descrição de uso
  category: string;       // Categoria (promocoes, dicas, etc.)
  platform: string;      // Rede social alvo
  type: string;          // Tipo (post, story, carousel)
  image: string;         // Imagem de preview
  premium: boolean;      // Se é premium ou gratuito
  contentStructure: {    // Estrutura editável
    elements: [
      {
        type: 'text' | 'image' | 'video';
        placeholder: string; // Texto de exemplo
      }
    ]
  }
}
```

## 🚀 Fluxo de Trabalho Recomendado

1. **Para Usuários**:
   - Navegar biblioteca → Escolher template → Personalizar → Usar

2. **Para Criadores de Conteúdo**:
   - Criar template base → Salvar como reutilizável → Compartilhar

3. **Para Administradores**:
   - Analisar métricas → Criar templates populares → Organizar biblioteca

## 📱 Tipos de Template Suportados

### Por Plataforma:
- **Instagram**: Posts, Stories, Reels, Carrosséis
- **LinkedIn**: Posts profissionais, Artigos
- **TikTok**: Vídeos verticais
- **Facebook**: Posts, Stories
- **Twitter**: Tweets, Threads

### Por Categoria:
- **Promoções**: Ofertas, descontos, Black Friday
- **Dicas**: Tutoriais, dicas rápidas
- **Novidades**: Lançamentos, anúncios
- **Depoimentos**: Reviews, testemunhos
- **Datas Comemorativas**: Natal, Ano Novo
- **Empresarial**: Comunicados corporativos
- **Entretenimento**: Memes, conteúdo viral
- **Eventos**: Convites, divulgação
- **Motivacional**: Frases inspiradoras
- **Saúde e Bem-estar**: Dicas de saúde

## 🔄 Integração com Sistema

Os templates são automaticamente:
- **Salvos no Supabase**: Banco de dados cloud
- **Indexados por IA**: Para melhor busca
- **Otimizados**: Para cada plataforma
- **Versionados**: Histórico de mudanças

---

**Dica**: Para melhores resultados, sempre teste seus templates em diferentes dispositivos e tamanhos de tela!