import { Template } from '@/contexts/TemplateContext';

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface MonthlyTemplate extends Template {
  releaseDate: string;
  isNew: boolean;
  isSeasonal: boolean;
  seasonalPeriod?: {
    start: string;
    end: string;
  };
  trending?: boolean;
}

export const templateCategories: TemplateCategory[] = [
  {
    id: "promocoes",
    name: "Promoções",
    description: "Templates para ofertas, descontos e vendas",
    icon: "🏷️",
    color: "bg-red-500"
  },
  {
    id: "dicas",
    name: "Dicas e Tutoriais",
    description: "Conteúdo educativo e informativo",
    icon: "💡",
    color: "bg-blue-500"
  },
  {
    id: "novidades",
    name: "Novidades",
    description: "Anúncios e lançamentos",
    icon: "✨",
    color: "bg-green-500"
  },
  {
    id: "depoimentos",
    name: "Depoimentos",
    description: "Avaliações e testemunhos de clientes",
    icon: "⭐",
    color: "bg-yellow-500"
  },
  {
    id: "datas-comemorativas",
    name: "Datas Comemorativas",
    description: "Templates sazonais e feriados",
    icon: "🎉",
    color: "bg-purple-500"
  },
  {
    id: "empresarial",
    name: "Empresarial",
    description: "Comunicação corporativa profissional",
    icon: "🏢",
    color: "bg-gray-600"
  },
  {
    id: "entretenimento",
    name: "Entretenimento",
    description: "Conteúdo divertido e viral",
    icon: "🎬",
    color: "bg-pink-500"
  },
  {
    id: "eventos",
    name: "Eventos",
    description: "Divulgação de eventos e convites",
    icon: "📅",
    color: "bg-indigo-500"
  },
  {
    id: "motivacional",
    name: "Motivacional",
    description: "Frases inspiradoras e motivação",
    icon: "🚀",
    color: "bg-orange-500"
  },
  {
    id: "saude-bem-estar",
    name: "Saúde e Bem-estar",
    description: "Conteúdo sobre saúde e qualidade de vida",
    icon: "🌱",
    color: "bg-emerald-500"
  }
];

export const monthlyTemplates: MonthlyTemplate[] = [
  // Templates de Promoções
  {
    id: "promo-001",
    title: "Black Friday Explosiva",
    category: "promocoes",
    platform: "Instagram",
    type: "post",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=400&fit=crop",
    premium: false,
    likes: 1423,
    description: "Template impactante para Black Friday com fundo escuro e elementos dourados",
    releaseDate: "2024-11-01",
    isNew: true,
    isSeasonal: true,
    seasonalPeriod: {
      start: "2024-11-01",
      end: "2024-11-30"
    },
    trending: true,
    contentStructure: {
      elements: [
        { type: 'text', placeholder: 'BLACK FRIDAY' },
        { type: 'text', placeholder: 'ATÉ 70% OFF' },
        { type: 'text', placeholder: 'Só hoje!' },
        { type: 'image', placeholder: 'Logo da marca' }
      ]
    }
  },
  {
    id: "promo-002",
    title: "Cyber Monday Tech",
    category: "promocoes",
    platform: "LinkedIn",
    type: "post",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    premium: true,
    likes: 892,
    description: "Template tecnológico para Cyber Monday com elementos futuristas",
    releaseDate: "2024-11-01",
    isNew: true,
    isSeasonal: true,
    seasonalPeriod: {
      start: "2024-11-25",
      end: "2024-11-28"
    },
    contentStructure: {
      elements: [
        { type: 'text', placeholder: 'CYBER MONDAY' },
        { type: 'text', placeholder: 'Ofertas Tecnológicas' },
        { type: 'image', placeholder: 'Produto tech' }
      ]
    }
  },

  // Templates de Dicas
  {
    id: "dicas-001",
    title: "Tutorial Step-by-Step",
    category: "dicas",
    platform: "Instagram",
    type: "carousel",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop",
    premium: false,
    likes: 654,
    description: "Carrossel educativo com design clean para tutoriais",
    releaseDate: "2024-12-01",
    isNew: true,
    isSeasonal: false,
    contentStructure: {
      elements: [
        { type: 'text', placeholder: 'Como fazer?' },
        { type: 'text', placeholder: 'Passo 1' },
        { type: 'text', placeholder: 'Passo 2' },
        { type: 'text', placeholder: 'Passo 3' },
        { type: 'text', placeholder: 'Resultado final' }
      ]
    }
  },
  {
    id: "dicas-002",
    title: "Dica Rápida Stories",
    category: "dicas",
    platform: "Instagram",
    type: "story",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop",
    premium: false,
    likes: 432,
    description: "Stories vertical com dica rápida e design minimalista",
    releaseDate: "2024-12-01",
    isNew: true,
    isSeasonal: false,
    contentStructure: {
      elements: [
        { type: 'text', placeholder: 'DICA RÁPIDA' },
        { type: 'text', placeholder: 'Sua dica aqui...' },
        { type: 'image', placeholder: 'Ícone ou ilustração' }
      ]
    }
  },

  // Templates de Novidades
  {
    id: "novidades-001",
    title: "Lançamento de Produto",
    category: "novidades",
    platform: "Instagram",
    type: "post",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop",
    premium: true,
    likes: 987,
    description: "Template elegante para anunciar novos produtos",
    releaseDate: "2024-12-01",
    isNew: true,
    isSeasonal: false,
    trending: true,
    contentStructure: {
      elements: [
        { type: 'text', placeholder: 'NOVIDADE!' },
        { type: 'text', placeholder: 'Nome do produto' },
        { type: 'image', placeholder: 'Foto do produto' },
        { type: 'text', placeholder: 'Disponível agora' }
      ]
    }
  },

  // Templates de Depoimentos
  {
    id: "depoimentos-001",
    title: "Testemunho Cliente",
    category: "depoimentos",
    platform: "Instagram",
    type: "post",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    premium: false,
    likes: 756,
    description: "Template profissional para depoimentos de clientes",
    releaseDate: "2024-12-01",
    isNew: true,
    isSeasonal: false,
    contentStructure: {
      elements: [
        { type: 'text', placeholder: '"Depoimento do cliente..."' },
        { type: 'text', placeholder: 'Nome do Cliente' },
        { type: 'image', placeholder: 'Foto do cliente' },
        { type: 'text', placeholder: '⭐⭐⭐⭐⭐' }
      ]
    }
  },

  // Templates de Datas Comemorativas
  {
    id: "natal-001",
    title: "Natal Mágico",
    category: "datas-comemorativas",
    platform: "Instagram",
    type: "post",
    image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=400&fit=crop",
    premium: true,
    likes: 1234,
    description: "Template festivo para o Natal com elementos tradicionais",
    releaseDate: "2024-12-01",
    isNew: true,
    isSeasonal: true,
    seasonalPeriod: {
      start: "2024-12-01",
      end: "2024-12-25"
    },
    trending: true,
    contentStructure: {
      elements: [
        { type: 'text', placeholder: 'Feliz Natal!' },
        { type: 'text', placeholder: 'Mensagem natalina' },
        { type: 'image', placeholder: 'Elementos natalinos' }
      ]
    }
  },
  {
    id: "ano-novo-001",
    title: "Réveillon Dourado",
    category: "datas-comemorativas",
    platform: "Instagram",
    type: "post",
    image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&h=400&fit=crop",
    premium: true,
    likes: 1567,
    description: "Template elegante para Ano Novo com tons dourados",
    releaseDate: "2024-12-15",
    isNew: true,
    isSeasonal: true,
    seasonalPeriod: {
      start: "2024-12-26",
      end: "2025-01-02"
    },
    contentStructure: {
      elements: [
        { type: 'text', placeholder: 'Feliz 2025!' },
        { type: 'text', placeholder: 'Que venham novos sonhos' },
        { type: 'image', placeholder: 'Fogos de artifício' }
      ]
    }
  },

  // Templates Empresariais
  {
    id: "empresarial-001",
    title: "Comunicado Corporativo",
    category: "empresarial",
    platform: "LinkedIn",
    type: "post",
    image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=400&fit=crop",
    premium: false,
    likes: 445,
    description: "Template profissional para comunicados internos",
    releaseDate: "2024-12-01",
    isNew: true,
    isSeasonal: false,
    contentStructure: {
      elements: [
        { type: 'text', placeholder: 'COMUNICADO' },
        { type: 'text', placeholder: 'Título do comunicado' },
        { type: 'text', placeholder: 'Conteúdo principal' },
        { type: 'image', placeholder: 'Logo da empresa' }
      ]
    }
  },

  // Templates de Entretenimento
  {
    id: "entretenimento-001",
    title: "Meme Viral",
    category: "entretenimento",
    platform: "TikTok",
    type: "video",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop",
    premium: false,
    likes: 2456,
    description: "Template divertido para conteúdo viral",
    releaseDate: "2024-12-01",
    isNew: true,
    isSeasonal: false,
    trending: true,
    contentStructure: {
      elements: [
        { type: 'video', placeholder: 'Vídeo base' },
        { type: 'text', placeholder: 'Texto engraçado' },
        { type: 'text', placeholder: 'Hashtags virais' }
      ]
    }
  },

  // Templates de Eventos
  {
    id: "eventos-001",
    title: "Convite Elegante",
    category: "eventos",
    platform: "Instagram",
    type: "post",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop",
    premium: true,
    likes: 567,
    description: "Template sofisticado para convites de eventos",
    releaseDate: "2024-12-01",
    isNew: true,
    isSeasonal: false,
    contentStructure: {
      elements: [
        { type: 'text', placeholder: 'Você está convidado!' },
        { type: 'text', placeholder: 'Nome do evento' },
        { type: 'text', placeholder: 'Data e horário' },
        { type: 'text', placeholder: 'Local' }
      ]
    }
  },

  // Templates Motivacionais
  {
    id: "motivacional-001",
    title: "Frase Inspiradora",
    category: "motivacional",
    platform: "Instagram",
    type: "post",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop",
    premium: false,
    likes: 1789,
    description: "Template minimalista para frases motivacionais",
    releaseDate: "2024-12-01",
    isNew: true,
    isSeasonal: false,
    contentStructure: {
      elements: [
        { type: 'text', placeholder: 'Frase inspiradora aqui...' },
        { type: 'text', placeholder: 'Autor (opcional)' },
        { type: 'image', placeholder: 'Fundo inspirador' }
      ]
    }
  },

  // Templates de Saúde e Bem-estar
  {
    id: "saude-001",
    title: "Dica de Bem-estar",
    category: "saude-bem-estar",
    platform: "Instagram",
    type: "post",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    premium: false,
    likes: 892,
    description: "Template calmo para dicas de saúde e bem-estar",
    releaseDate: "2024-12-01",
    isNew: true,
    isSeasonal: false,
    contentStructure: {
      elements: [
        { type: 'text', placeholder: 'Cuide-se!' },
        { type: 'text', placeholder: 'Dica de bem-estar' },
        { type: 'image', placeholder: 'Imagem relaxante' }
      ]
    }
  }
];

// Função para obter templates por categoria
export const getTemplatesByCategory = (categoryId: string): MonthlyTemplate[] => {
  if (categoryId === "todos") {
    return monthlyTemplates;
  }
  return monthlyTemplates.filter(template => template.category === categoryId);
};

// Função para obter templates novos (últimos 30 dias)
export const getNewTemplates = (): MonthlyTemplate[] => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return monthlyTemplates.filter(template => {
    const releaseDate = new Date(template.releaseDate);
    return releaseDate >= thirtyDaysAgo || template.isNew;
  });
};

// Função para obter templates sazonais ativos
export const getSeasonalTemplates = (): MonthlyTemplate[] => {
  const now = new Date();
  
  return monthlyTemplates.filter(template => {
    if (!template.isSeasonal || !template.seasonalPeriod) return false;
    
    const startDate = new Date(template.seasonalPeriod.start);
    const endDate = new Date(template.seasonalPeriod.end);
    
    return now >= startDate && now <= endDate;
  });
};

// Função para obter templates em alta
export const getTrendingTemplates = (): MonthlyTemplate[] => {
  return monthlyTemplates
    .filter(template => template.trending)
    .sort((a, b) => b.likes - a.likes);
};

// Função para obter estatísticas do banco de templates
export const getTemplateStats = () => {
  const total = monthlyTemplates.length;
  const newCount = getNewTemplates().length;
  const seasonalCount = getSeasonalTemplates().length;
  const trendingCount = getTrendingTemplates().length;
  const categoriesWithTemplates = templateCategories.filter(category => 
    getTemplatesByCategory(category.id).length > 0
  ).length;

  return {
    total,
    newCount,
    seasonalCount,
    trendingCount,
    categoriesWithTemplates
  };
};

// Exportações legadas para compatibilidade
export const templates = monthlyTemplates;
export const categories = ["Todos", ...templateCategories.map(cat => cat.name)];
export const platforms = ["Todos", "Instagram", "LinkedIn", "TikTok", "Facebook", "Twitter", "YouTube"];