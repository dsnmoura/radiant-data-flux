import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';
import { Sparkles, Mail, Lock, User } from 'lucide-react';

// Validation schemas
const signInSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
});

const signUpSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string(),
  displayName: z.string().trim().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }).max(50, { message: "Nome deve ter no máximo 50 caracteres" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"]
});

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Sign in form state
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Sign up form state
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const validatedData = signInSchema.parse(signInData);
      setIsLoading(true);
      
      const { error } = await signIn(validatedData.email, validatedData.password);
      
      if (error) {
        if (error.message === 'Invalid login credentials') {
          setError('Email ou senha incorretos');
        } else if (error.message === 'Email not confirmed') {
          setError('Verifique seu email para confirmar a conta');
        } else {
          setError(error.message);
        }
      } else {
        toast.success('Login realizado com sucesso!');
        navigate('/dashboard');
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const validatedData = signUpSchema.parse(signUpData);
      setIsLoading(true);
      
      const { error } = await signUp(validatedData.email, validatedData.password, validatedData.displayName);
      
      if (error) {
        if (error.message === 'User already registered') {
          setError('Este email já está cadastrado');
        } else {
          setError(error.message);
        }
      } else {
        toast.success('Conta criada! Verifique seu email para confirmar.');
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">PostCraft</CardTitle>
            <CardDescription>
              Crie conteúdo profissional para redes sociais
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>
            
            {error && (
              <Alert className="border-destructive/50 text-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Sign In Tab */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      className="pl-10"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Sua senha"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      className="pl-10"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full gradient-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </TabsContent>
            
            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Seu nome"
                      value={signUpData.displayName}
                      onChange={(e) => setSignUpData({ ...signUpData, displayName: e.target.value })}
                      className="pl-10"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      className="pl-10"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Sua senha"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      className="pl-10"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirme sua senha"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                      className="pl-10"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full gradient-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;