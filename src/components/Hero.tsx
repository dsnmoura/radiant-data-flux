import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap, Palette, Share2 } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <Zap className="mr-2 h-4 w-4" />
              Mais de 1000+ templates disponíveis
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
              Crie posts incríveis para{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
                redes sociais
              </span>{" "}
              em segundos
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Transforme suas ideias em posts profissionais com nossa biblioteca de templates prontos. 
              Personalize cores, textos e imagens com facilidade.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button variant="default" size="lg" className="group gradient-primary">
                <a href="/choose-template" className="flex items-center">
                  Escolher Template
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="group">
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-primary" />
                <span>500+ templates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Share2 className="h-5 w-5 text-accent" />
                <span>Todas as redes</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:order-first">
            <div className="relative">
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 gradient-primary rounded-full opacity-60 animate-float" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 gradient-accent rounded-full opacity-40 animate-float" style={{ animationDelay: "1s" }} />
              
              {/* Main image */}
              <div className="relative overflow-hidden rounded-2xl shadow-glow bg-gradient-to-br from-background to-muted">
                <img
                  src={heroImage}
                  alt="Interface do PostCraft mostrando templates de posts para redes sociais"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;