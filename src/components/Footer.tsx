import { Button } from "@/components/ui/button";
import { Sparkles, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PostCraft
              </span>
            </div>
            <p className="text-muted-foreground">
              A maneira mais fácil de criar posts incríveis para suas redes sociais.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Produto</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-smooth">Templates</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Editor</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Recursos</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Preços</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-smooth">Sobre</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Carreiras</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Contato</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Suporte</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-smooth">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Documentação</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Comunidade</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Status</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 PostCraft. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-smooth">Privacidade</a>
            <a href="#" className="hover:text-foreground transition-smooth">Termos</a>
            <a href="#" className="hover:text-foreground transition-smooth">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;