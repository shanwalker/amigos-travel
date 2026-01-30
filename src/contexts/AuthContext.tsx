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

  const fetchRoles = async (user: User) => {
    try {
      // 1. Try fetching from database first
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (!error && data && data.length > 0) {
        return data.map(r => r.role as AppRole);
      }

      // 2. Fallback: Check user_metadata (Auth object)
      // This is crucial if database sync is slow or RLS fails
      const metaRole = user.user_metadata?.role;
      if (metaRole && ['admin', 'moderator', 'user'].includes(metaRole)) {
        console.log('[AuthContext] ⚠️ Using metadata role fallback:', metaRole);
        return [metaRole as AppRole];
      }

      return [];
    } catch (err) {
      console.error('Error fetching roles:', err);
      return [];
    }
  };

  const refreshRoles = async () => {
    if (user) {
      const userRoles = await fetchRoles(user);
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
            const userRoles = await fetchRoles(session.user);
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
        fetchRoles(session.user).then(setRoles);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('[AuthContext] 🚀 Starting signup process...', { email, fullName });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('[AuthContext] ❌ Signup error:', error);

        // Provide user-friendly error messages
        let userMessage = error.message;
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          userMessage = 'This email is already registered. Please try logging in instead.';
        } else if (error.message.includes('network') || error.message.includes('fetch failed')) {
          userMessage = 'Network error. Please check your internet connection and try again.';
        }

        return { error: { ...error, message: userMessage } as Error };
      }

      console.log('[AuthContext] 📊 Signup response:', {
        userId: data?.user?.id,
        userEmail: data?.user?.email,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        userConfirmed: data?.user?.confirmed_at ? true : false,
        emailConfirmedAt: data?.user?.confirmed_at
      });

      // If we got a session directly, email verification is DISABLED
      // User is auto-confirmed and logged in immediately
      if (data?.session && data?.user) {
        console.log('[AuthContext] ✅ Email verification DISABLED - User auto-logged in');

        // Set user and session immediately
        setUser(data.user);
        setSession(data.session);

        // Wait a moment for database trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify profile was created
        console.log('[AuthContext] 🔍 Verifying profile creation...');
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profileData) {
          console.warn('[AuthContext] ⚠️ Profile not found, creating manually...');

          // Create profile manually if trigger failed
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
            } as any);

          if (insertError) {
            console.error('[AuthContext] ❌ Failed to create profile:', insertError);
            // Don't fail signup, but log the error
          } else {
            console.log('[AuthContext] ✅ Profile created manually');
          }
        } else {
          console.log('[AuthContext] ✅ Profile verified:', profileData);
        }

        // Fetch and verify roles
        console.log('[AuthContext] 🎉 Fetching user roles...');
        const userRoles = await fetchRoles(data.user);
        console.log('[AuthContext] 👤 User roles:', userRoles);

        // If no roles assigned, assign default 'user' role
        if (userRoles.length === 0) {
          console.log('[AuthContext] ⚠️ No roles found, assigning default "user" role...');

          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: 'user',
            } as any);

          if (roleError) {
            console.error('[AuthContext] ❌ Failed to assign default role:', roleError);
            // Set default role in state anyway
            setRoles(['user']);
          } else {
            console.log('[AuthContext] ✅ Default role assigned');
            setRoles(['user']);
          }
        } else {
          setRoles(userRoles);
        }

        console.log('[AuthContext] ✨ Signup complete - user ready to use app');
        return { error: null };
      }

      // If we have a user but NO session, email verification is ENABLED
      // User needs to confirm their email before they can log in
      if (data?.user && !data?.session) {
        console.log('[AuthContext] ⏳ Email verification ENABLED - User needs to confirm email');
        console.log('[AuthContext] 📧 Confirmation email sent to:', data.user.email);
        return { error: null, needsEmailConfirmation: true } as any;
      }

      // Fallback - shouldn't normally reach here
      console.warn('[AuthContext] ⚠️ Unexpected signup state - no user or session');
      return { error: null };

    } catch (err) {
      console.error('[AuthContext] 💥 Signup exception:', err);

      // Check if it's a network error
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        return {
          error: {
            message: 'Network error. Please check your internet connection and try again.'
          } as Error
        };
      }

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
