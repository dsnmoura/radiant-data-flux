import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  X,
  Instagram,
  Linkedin,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Trash2
} from "lucide-react";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  platform: string;
  scheduledFor: Date;
  status: 'scheduled' | 'published' | 'failed';
  template_id?: string;
}

interface PostSchedulerProps {
  content?: {
    caption?: string;
    hashtags?: string[];
    images?: string[];
  };
  selectedNetwork?: string;
  selectedTemplate?: string;
}

const PostScheduler = ({ content, selectedNetwork, selectedTemplate }: PostSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [postTitle, setPostTitle] = useState<string>("");
  const [postContent, setPostContent] = useState<string>(content?.caption || "");
  const [selectedPlatform, setSelectedPlatform] = useState<string>(selectedNetwork || "");
  const [isScheduling, setIsScheduling] = useState<boolean>(false);

  const platforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-500" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-600" },
    { id: "tiktok", name: "TikTok", icon: MessageCircle, color: "text-black" }
  ];

  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ];

  const getOptimalTimes = (platform: string) => {
    const times = {
      instagram: ["09:00", "11:00", "14:00", "17:00", "19:00"],
      linkedin: ["08:00", "09:00", "12:00", "17:00", "18:00"],
      tiktok: ["06:00", "10:00", "19:00", "20:00", "21:00"]
    };
    return times[platform as keyof typeof times] || [];
  };

  const schedulePost = async () => {
    if (!selectedDate || !selectedTime || !postTitle || !postContent || !selectedPlatform) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const [hours, minutes] = selectedTime.split(':');
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    if (isBefore(scheduledDateTime, new Date())) {
      toast.error("Não é possível agendar para uma data/hora no passado");
      return;
    }

    setIsScheduling(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para agendar posts");
        return;
      }

      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: postTitle,
          content: postContent,
          platform: selectedPlatform,
          scheduled_for: scheduledDateTime.toISOString(),
          status: 'scheduled',
          template_id: selectedTemplate || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error scheduling post:', error);
        toast.error("Erro ao agendar post");
        return;
      }

      toast.success("Post agendado com sucesso!");
      
      // Reset form
      setPostTitle("");
      setPostContent("");
      setSelectedDate(undefined);
      setSelectedTime("");
      
      // Add to local state for immediate UI update
      const newPost: ScheduledPost = {
        id: data.id,
        title: data.title,
        content: data.content,
        platform: data.platform,
        scheduledFor: new Date(data.scheduled_for),
        status: data.status as 'scheduled'
      };
      
      setScheduledPosts(prev => [...prev, newPost]);

    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao agendar post");
    } finally {
      setIsScheduling(false);
    }
  };

  const deleteScheduledPost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        toast.error("Erro ao cancelar agendamento");
        return;
      }

      setScheduledPosts(prev => prev.filter(post => post.id !== postId));
      toast.success("Agendamento cancelado");
    } catch (error) {
      toast.error("Erro ao cancelar agendamento");
    }
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform ? platform.icon : MessageCircle;
  };

  const getPlatformColor = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform ? platform.color : "text-gray-500";
  };

  return (
    <div className="space-y-6">
      {/* Agendar Novo Post */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Agendar Publicação
          </CardTitle>
          <CardDescription>
            Programe seu post para ser publicado automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Título do Post */}
          <div className="space-y-2">
            <Label htmlFor="title">Título do Post</Label>
            <Input
              id="title"
              placeholder="Ex: Promoção Black Friday 2024"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />
          </div>

          {/* Plataforma */}
          <div className="space-y-2">
            <Label>Plataforma</Label>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a plataforma" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id}>
                    <div className="flex items-center gap-2">
                      <platform.icon className={`h-4 w-4 ${platform.color}`} />
                      {platform.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conteúdo */}
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo do Post</Label>
            <Textarea
              id="content"
              placeholder="Digite o conteúdo do seu post..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Seleção de Data */}
            <div className="space-y-2">
              <Label>Data de Publicação</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Seleção de Hora */}
            <div className="space-y-2">
              <Label>Horário</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar horário" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                        {selectedPlatform && getOptimalTimes(selectedPlatform).includes(time) && (
                          <Badge variant="secondary" className="text-xs">
                            Recomendado
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Horários Recomendados */}
          {selectedPlatform && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                Horários recomendados para {platforms.find(p => p.id === selectedPlatform)?.name}
              </h4>
              <div className="flex flex-wrap gap-2">
                {getOptimalTimes(selectedPlatform).map((time) => (
                  <Badge 
                    key={time} 
                    variant="secondary" 
                    className="cursor-pointer"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Botão de Agendar */}
          <Button 
            onClick={schedulePost}
            disabled={isScheduling || !selectedDate || !selectedTime || !postTitle || !postContent || !selectedPlatform}
            className="w-full"
          >
            {isScheduling ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Agendando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Agendar Post
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Posts Agendados */}
      {scheduledPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Posts Agendados
            </CardTitle>
            <CardDescription>
              {scheduledPosts.length} post{scheduledPosts.length !== 1 ? 's' : ''} agendado{scheduledPosts.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledPosts.map((post) => {
                const PlatformIcon = getPlatformIcon(post.platform);
                return (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <PlatformIcon className={`h-5 w-5 ${getPlatformColor(post.platform)}`} />
                      <div className="flex-1">
                        <h4 className="font-medium">{post.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {post.content.substring(0, 60)}...
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={post.status === 'scheduled' ? 'default' : post.status === 'published' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {post.status === 'scheduled' ? 'Agendado' : post.status === 'published' ? 'Publicado' : 'Falhou'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(post.scheduledFor, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {post.status === 'scheduled' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteScheduledPost(post.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PostScheduler;