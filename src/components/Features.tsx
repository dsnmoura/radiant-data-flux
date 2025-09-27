import { Card, CardContent } from "@/components/ui/card";
import { 
  Palette, 
  Zap, 
  Download, 
  Share2, 
  Layers, 
  Smartphone,
  Users,
  Clock,
  Sparkles 
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Editor Intuitivo",
    description: "Personalize cores, fontes e textos com nosso editor visual fácil de usar.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Zap,
    title: "Criação Rápida",
    description: "Crie posts profissionais em segundos com templates otimizados.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Layers,
    title: "Templates Variados",
    description: "Centenas de designs para todos os tipos de conteúdo e redes sociais.",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    icon: Smartphone,
    title: "Responsivo",
    description: "Todos os templates são otimizados para desktop e mobile.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Download,
    title: "Download HD",
    description: "Baixe seus posts em alta qualidade nos formatos PNG, JPG ou PDF.",
    gradient: "from-violet-500 to-purple-500"
  },
  {
    icon: Share2,
    title: "Compartilhamento Direto",
    description: "Publique diretamente nas suas redes sociais favoritas.",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: Users,
    title: "Colaboração",
    description: "Trabalhe em equipe e compartilhe templates com sua equipe.",
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    icon: Clock,
    title: "Agendamento",
    description: "Agende seus posts para serem publicados no melhor horário.",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    icon: Sparkles,
    title: "IA Integrada",
    description: "Use inteligência artificial para gerar textos e sugestões de conteúdo.",
    gradient: "from-yellow-500 to-orange-500"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Recursos Poderosos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tudo que você precisa para criar conteúdo incrível para suas redes sociais
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group border-0 shadow-card hover:shadow-elegant transition-smooth bg-card/50 backdrop-blur-sm hover:bg-card/80">
                <CardContent className="p-6">
                  {/* Icon */}
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${feature.gradient} mb-4 shadow-card group-hover:shadow-glow transition-smooth`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;