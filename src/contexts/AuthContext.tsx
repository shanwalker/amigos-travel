import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'admin' | 'moderator' | 'user';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: AppRole[];
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);

  const fetchRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching roles:', error);
        return [];
      }
      
      return (data || []).map(r => r.role as AppRole);
    } catch (err) {
      console.error('Error fetching roles:', err);
      return [];
    }
  };

  const refreshRoles = async () => {
    if (user) {
      const userRoles = await fetchRoles(user.id);
      setRoles(userRoles);
    }
  };

  useEffect(() => {
    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer role fetching to avoid blocking auth state
          setTimeout(async () => {
            const userRoles = await fetchRoles(session.user.id);
            setRoles(userRoles);
          }, 0);
        } else {
          setRoles([]);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchRoles(session.user.id).then(setRoles);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        return { error: error as Error };
      }

      // If we got a session directly, user is auto-confirmed - great!
      if (data?.session) {
        return { error: null };
      }

      // User was created but needs confirmation
      // Try calling our edge function to auto-confirm the user
      if (data?.user) {
        const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZGJ0a2tnZXNmZ3F0a2ZlZG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTYwODgsImV4cCI6MjA4NDEzMjA4OH0.GeQsaI7LW29-FL1AIm-lMPqduKaWUyRkH_JNEWTBKms';
        
        try {
          console.log('Attempting auto-confirm via edge function after signup...');
          const response = await fetch(
            `https://whdbtkkgesfgqtkfedne.supabase.co/functions/v1/confirm-user`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`,
              },
              body: JSON.stringify({ email, password }),
            }
          );
          
          console.log('Edge function response status:', response.status);

          if (response.ok) {
            const confirmData = await response.json();
            
            if (confirmData?.session) {
              // Set the session from the edge function response
              await supabase.auth.setSession({
                access_token: confirmData.session.access_token,
                refresh_token: confirmData.session.refresh_token,
              });
              return { error: null };
            }

            if (confirmData?.confirmed) {
              // User is confirmed, try to sign in
              const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              
              if (!signInError) {
                return { error: null };
              }
            }
          }
        } catch (fnError) {
          console.log('Edge function not available, falling back to email confirmation');
        }

        // Fall back to email confirmation flow
        return { error: null, needsEmailConfirmation: true } as any;
      }
      
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error as Error | null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRoles([]);
  };

  const isAdmin = roles.includes('admin');

  const value = {
    user,
    session,
    loading,
    roles,
    isAdmin,
    signUp,
    signIn,
    signOut,
    refreshRoles,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
