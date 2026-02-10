import { supabase } from '@/integrations/supabase/client';

export interface ChatSession {
    id: string;
    user_id: string | null;
    is_authenticated: boolean;
    user_ip: string | null;
    user_agent: string | null;
    session_started_at: string;
    session_ended_at: string | null;
    total_messages: number;
    duration_seconds: number | null;
    page_url: string | null;
    referrer: string | null;
    created_at: string;
    updated_at: string;
}

export interface ChatMessage {
    id: string;
    session_id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    tokens_used: number | null;
    created_at: string;
}

/**
 * Create a new chat session
 */
export async function createChatSession(
    userId: string | null,
    userIp: string | null,
    userAgent: string | null,
    pageUrl: string
): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    try {
        const { data, error } = await (supabase
            .from('chat_sessions') as any)
            .insert({
                user_id: userId,
                is_authenticated: !!userId,
                user_ip: userIp,
                user_agent: userAgent,
                page_url: pageUrl,
                referrer: typeof window !== 'undefined' ? document.referrer : null,
                total_messages: 0
            })
            .select()
            .single();

        if (error) {
            console.error('[createChatSession] Error:', error);
            return { success: false, error: error.message };
        }

        console.log('[createChatSession] ✅ Created session:', data.id);
        return { success: true, sessionId: data.id };
    } catch (error: any) {
        console.error('[createChatSession] Exception:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Log a chat message
 */
export async function logChatMessage(
    sessionId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    tokensUsed?: number
): Promise<{ success: boolean; error?: string }> {
    try {
        // Insert message
        const { error: messageError } = await (supabase
            .from('chat_messages') as any)
            .insert({
                session_id: sessionId,
                role,
                content,
                tokens_used: tokensUsed || null
            });

        if (messageError) {
            console.error('[logChatMessage] Error inserting message:', messageError);
            return { success: false, error: messageError.message };
        }

        // Update session message count
        const { error: updateError } = await (supabase as any).rpc('increment_chat_session_messages', {
            session_id: sessionId
        });

        if (updateError) {
            console.warn('[logChatMessage] Warning: Could not update message count:', updateError);
            // Don't fail if count update fails
        }

        return { success: true };
    } catch (error: any) {
        console.error('[logChatMessage] Exception:', error);
        return { success: false, error: error.message };
    }
}

/**
 * End a chat session
 */
export async function endChatSession(sessionId: string): Promise<{ success: boolean; error?: string }> {
    try {
        // Get session start time to calculate duration
        const { data: session } = await (supabase
            .from('chat_sessions') as any)
            .select('session_started_at')
            .eq('id', sessionId)
            .single();

        if (!session) {
            return { success: false, error: 'Session not found' };
        }

        const startTime = new Date(session.session_started_at);
        const endTime = new Date();
        const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

        const { error } = await (supabase
            .from('chat_sessions') as any)
            .update({
                session_ended_at: endTime.toISOString(),
                duration_seconds: durationSeconds
            })
            .eq('id', sessionId);

        if (error) {
            console.error('[endChatSession] Error:', error);
            return { success: false, error: error.message };
        }

        console.log('[endChatSession] ✅ Ended session:', sessionId);
        return { success: true };
    } catch (error: any) {
        console.error('[endChatSession] Exception:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all chat sessions (admin only)
 */
export async function getAllChatSessions(filters?: {
    startDate?: string;
    endDate?: string;
    isAuthenticated?: boolean;
    userId?: string;
}): Promise<ChatSession[]> {
    try {
        let query = supabase
            .from('chat_sessions')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters?.startDate) {
            query = query.gte('created_at', filters.startDate);
        }

        if (filters?.endDate) {
            query = query.lte('created_at', filters.endDate);
        }

        if (filters?.isAuthenticated !== undefined) {
            query = query.eq('is_authenticated', filters.isAuthenticated);
        }

        if (filters?.userId) {
            query = query.eq('user_id', filters.userId);
        }

        const { data, error } = await query;

        if (error) throw error;

        return (data as ChatSession[]) || [];
    } catch (error) {
        console.error('[getAllChatSessions] Error:', error);
        return [];
    }
}

/**
 * Get messages for a specific session
 */
export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', sessionId)
            .order('timestamp', { ascending: true });

        if (error) throw error;

        return (data as ChatMessage[]) || [];
    } catch (error) {
        console.error('[getSessionMessages] Error:', error);
        return [];
    }
}

/**
 * Get user's IP address (client-side approximation)
 * Note: For accurate IP, you'd need a server-side endpoint
 */
export async function getUserIP(): Promise<string | null> {
    try {
        // Use a free IP detection service
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip || null;
    } catch (error) {
        console.warn('[getUserIP] Could not detect IP:', error);
        return null;
    }
}

/**
 * Delete old chat sessions (data retention)
 */
export async function deleteOldChatSessions(daysOld: number = 90): Promise<{ success: boolean; deleted?: number; error?: string }> {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const { data, error } = await supabase
            .from('chat_sessions')
            .delete()
            .lt('created_at', cutoffDate.toISOString())
            .select();

        if (error) {
            console.error('[deleteOldChatSessions] Error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, deleted: data?.length || 0 };
    } catch (error: any) {
        console.error('[deleteOldChatSessions] Exception:', error);
        return { success: false, error: error.message };
    }
}
