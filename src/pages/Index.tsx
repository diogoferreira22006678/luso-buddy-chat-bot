
import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, User, Bot, GraduationCap, Calendar, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Bem-vindo ao assistente virtual da Universidade Lusófona. Como posso ajudá-lo hoje?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { text: "Admissões", icon: GraduationCap },
    { text: "Horários", icon: Calendar },
    { text: "Campus", icon: MapPin },
    { text: "Contactos", icon: Phone },
  ];

  const botResponses = {
    "admissões": "Para informações sobre admissões, pode visitar o nosso site oficial ou contactar o gabinete de admissões através do email: admissoes@ulusofona.pt",
    "horários": "Os horários das aulas estão disponíveis no portal do estudante. Para aceder, utilize as suas credenciais de estudante.",
    "campus": "A Universidade Lusófona tem vários campus em Lisboa, Porto e Famalicão. Qual campus pretende informações?",
    "contactos": "Contactos principais:\n📞 217 515 500\n📧 info@ulusofona.pt\n📍 Campo Grande, 376, 1749-024 Lisboa",
    "default": "Obrigado pela sua mensagem. Um dos nossos assistentes entrará em contacto consigo brevemente. Existe mais alguma coisa em que possa ajudar?",
  };

  const getBotResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    if (message.includes("admiss") || message.includes("candidatura")) {
      return botResponses.admissões;
    } else if (message.includes("horário") || message.includes("aula")) {
      return botResponses.horários;
    } else if (message.includes("campus") || message.includes("localização")) {
      return botResponses.campus;
    } else if (message.includes("contacto") || message.includes("telefone") || message.includes("email")) {
      return botResponses.contactos;
    }
    return botResponses.default;
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Universidade Lusófona</h1>
              <p className="text-sm text-gray-600">Assistente Virtual</p>
            </div>
            <Badge className="ml-auto bg-green-100 text-green-700 hover:bg-green-100">
              Online
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="h-[600px] flex flex-col shadow-lg">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%]`}>
                  {!message.isUser && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.isUser
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? "text-blue-100" : "text-gray-500"
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.isUser && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t bg-gray-50">
            <p className="text-xs text-gray-600 mb-2">Ações rápidas:</p>
            <div className="flex gap-2 flex-wrap">
              {quickActions.map((action) => (
                <Button
                  key={action.text}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.text)}
                  className="text-xs"
                >
                  <action.icon className="w-3 h-3 mr-1" />
                  {action.text}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite a sua mensagem..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button type="submit" disabled={!inputValue.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Universidade Lusófona - Assistente Virtual | Para emergências ligue: 217 515 500
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
