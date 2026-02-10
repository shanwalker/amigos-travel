import { format } from 'date-fns';
import { User, Bot, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

interface MessageThreadProps {
    messages: Message[];
}

export function MessageThread({ messages }: MessageThreadProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyMessage = (message: Message) => {
        navigator.clipboard.writeText(message.content);
        setCopiedId(message.id);
        toast.success('Message copied');
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-4">
            {messages.map((message) => {
                const isUser = message.role === 'user';
                const isSystem = message.role === 'system';

                return (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser
                                ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                                : isSystem
                                    ? 'bg-gray-600'
                                    : 'bg-gradient-to-br from-primary to-orange-500'
                            }`}>
                            {isUser ? (
                                <User className="w-4 h-4 text-white" />
                            ) : (
                                <Bot className="w-4 h-4 text-white" />
                            )}
                        </div>

                        {/* Message Bubble */}
                        <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                            <div className={`group relative rounded-2xl px-4 py-3 ${isUser
                                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                                    : isSystem
                                        ? 'bg-gray-700/50 text-gray-300'
                                        : 'bg-white/5 text-gray-100 border border-white/10'
                                }`}>
                                <p className="text-sm whitespace-pre-wrap break-words">
                                    {message.content}
                                </p>

                                {/* Copy Button */}
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                                    onClick={() => copyMessage(message)}
                                >
                                    {copiedId === message.id ? (
                                        <Check className="w-3 h-3" />
                                    ) : (
                                        <Copy className="w-3 h-3" />
                                    )}
                                </Button>
                            </div>

                            {/* Timestamp */}
                            <span className="text-xs text-gray-500 mt-1 px-2">
                                {format(new Date(message.timestamp), 'h:mm a')}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
